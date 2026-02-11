import { eq, sql } from 'drizzle-orm';
import { db } from '../db';
import { item, source, summary, link, itemLink } from '../db/schema';
import { getOpenRouterClient, MODEL } from './openrouter';
import { buildPrompt, PROMPT_VERSION } from './prompts/extract-links';
import { llmResponseSchema, type LLMResponse } from './prompts/schema';
import { stripHtml } from './strip-html';
import { normalizeUrl } from './normalize-url';

const MAX_CONTENT_CHARS = 12_000;
const MAX_RETRIES = 2;

export async function processItem(itemId: number): Promise<{ summary: LLMResponse; linkCount: number }> {
  // 1. Fetch item + source
  const [row] = await db
    .select({
      id: item.id,
      text: item.text,
      html: item.html,
      subject: item.subject,
      sourceName: source.name,
    })
    .from(item)
    .innerJoin(source, eq(item.sourceId, source.id))
    .where(eq(item.id, itemId))
    .limit(1);

  if (!row) throw new Error(`Item ${itemId} not found`);

  // 2. Skip if already summarized
  const [existing] = await db
    .select({ id: summary.id })
    .from(summary)
    .where(eq(summary.itemId, itemId))
    .limit(1);

  if (existing) throw new Error(`Item ${itemId} already has a summary`);

  // 3. Prepare content
  let content = row.text ?? '';
  if (!content && row.html) {
    content = stripHtml(row.html);
  }
  if (row.subject) {
    content = `Subject: ${row.subject}\n\n${content}`;
  }
  content = content.slice(0, MAX_CONTENT_CHARS);

  if (!content.trim()) throw new Error(`Item ${itemId} has no content`);

  // 4. Call OpenRouter with retry
  const prompt = buildPrompt(content, row.sourceName);
  const client = getOpenRouterClient();
  let parsed: LLMResponse | undefined;
  let tokenCount = 0;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const response = await client.chat.completions.create({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
    });

    const raw = response.choices[0]?.message?.content ?? '';
    tokenCount = response.usage?.total_tokens ?? 0;

    // Try to extract JSON from the response (handle markdown fences)
    let jsonStr = raw.trim();
    const fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch) jsonStr = fenceMatch[1].trim();

    try {
      const json = JSON.parse(jsonStr);
      parsed = llmResponseSchema.parse(json);
      break;
    } catch (err) {
      if (attempt === MAX_RETRIES) {
        throw new Error(`Failed to parse LLM response after ${MAX_RETRIES + 1} attempts: ${err}`);
      }
    }
  }

  if (!parsed) throw new Error('Unreachable: no parsed response');

  // 5. Insert summary
  await db.insert(summary).values({
    itemId,
    bullets: JSON.stringify(parsed.summary.bullets),
    changeNote: parsed.summary.change_note,
    model: MODEL,
    promptVersion: PROMPT_VERSION,
    tokenCount,
  });

  // 6. Upsert links and create item_link rows
  let linkCount = 0;
  for (let i = 0; i < parsed.links.length; i++) {
    const extractedLink = parsed.links[i];

    let normalized: ReturnType<typeof normalizeUrl>;
    try {
      normalized = normalizeUrl(extractedLink.url);
    } catch {
      continue; // skip malformed URLs
    }

    // Try to find existing link by hash
    const [existingLink] = await db
      .select({ id: link.id })
      .from(link)
      .where(eq(link.urlHash, normalized.hash))
      .limit(1);

    let linkId: number;

    if (existingLink) {
      linkId = existingLink.id;
      // Increment sourceCount
      await db
        .update(link)
        .set({ sourceCount: sql`${link.sourceCount} + 1` })
        .where(eq(link.id, linkId));
    } else {
      const [newLink] = await db
        .insert(link)
        .values({
          url: normalized.url,
          urlHash: normalized.hash,
          title: extractedLink.title,
          description: extractedLink.description,
          domain: normalized.domain,
          tags: JSON.stringify(extractedLink.tags),
        })
        .returning({ id: link.id });
      linkId = newLink.id;
    }

    // Insert item_link (ignore conflict for idempotency)
    await db
      .insert(itemLink)
      .values({
        itemId,
        linkId,
        anchorText: extractedLink.anchor_text,
        context: extractedLink.context,
        position: i,
      })
      .onConflictDoNothing({ target: [itemLink.itemId, itemLink.linkId] });

    linkCount++;
  }

  return { summary: parsed, linkCount };
}
