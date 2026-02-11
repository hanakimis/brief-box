import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '../../../../db';
import { link, itemLink, item, source } from '../../../../db/schema';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: raw } = await params;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }

  const [row] = await db.select().from(link).where(eq(link.id, id)).limit(1);
  if (!row) {
    return NextResponse.json({ error: 'Link not found' }, { status: 404 });
  }

  // Get all items that reference this link
  const sources = await db
    .select({
      itemId: itemLink.itemId,
      anchorText: itemLink.anchorText,
      context: itemLink.context,
      position: itemLink.position,
      itemSubject: item.subject,
      itemReceivedAt: item.receivedAt,
      sourceName: source.name,
    })
    .from(itemLink)
    .innerJoin(item, eq(itemLink.itemId, item.id))
    .innerJoin(source, eq(item.sourceId, source.id))
    .where(eq(itemLink.linkId, id));

  return NextResponse.json({
    ...row,
    tags: JSON.parse(row.tags) as string[],
    sources,
  });
}
