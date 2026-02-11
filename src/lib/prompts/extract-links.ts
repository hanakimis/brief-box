import { LINK_TAGS } from '../tags';

const PROMPT_VERSION = 'v1';

export { PROMPT_VERSION };

export function buildPrompt(content: string, sourceName: string): string {
  return `You are a newsletter analyst. Analyze the following newsletter issue and extract:

1. A summary with 2-5 bullet points capturing the key topics.
2. A "change_note" — one sentence about what's most notable or surprising.
3. All meaningful links mentioned in the newsletter.

## Link extraction rules
- SKIP: unsubscribe links, social media profile links (twitter.com/user, linkedin.com/in/user), mailto: links, newsletter platform links (mailchimp, substack account pages, beehiiv dashboards).
- INCLUDE: articles, tools, products, repos, tutorials, design showcases, and any link the newsletter is actively recommending or discussing.
- For each link, provide:
  - url: the full URL as it appears
  - title: a concise title (use the anchor text or infer from context)
  - description: 1-2 sentences describing what the link points to
  - anchor_text: the exact link text from the newsletter
  - context: the surrounding sentence or phrase where this link appeared
  - tags: assign 1-3 tags from this fixed list: ${JSON.stringify(LINK_TAGS)}
  - is_primary: true only if the newsletter features/discusses this link prominently (not just mentioned in passing)
- For links tagged "design-inspiration", describe what's visually interesting.

## Output format
Respond with ONLY valid JSON matching this exact structure (no markdown, no explanation):
{
  "summary": {
    "bullets": ["...", "..."],
    "change_note": "..."
  },
  "links": [
    {
      "url": "https://...",
      "title": "...",
      "description": "...",
      "anchor_text": "...",
      "context": "...",
      "tags": ["..."],
      "is_primary": true
    }
  ]
}

## Newsletter source
Name: ${sourceName}

## Newsletter content
${content}`;
}
