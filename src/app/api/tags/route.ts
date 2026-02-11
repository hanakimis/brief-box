import { NextResponse } from 'next/server';
import { db } from '../../../db';
import { link } from '../../../db/schema';
import { LINK_TAGS } from '../../../lib/tags';

export async function GET() {
  // Get all links and count tags
  const rows = await db.select({ tags: link.tags }).from(link);

  const counts: Record<string, number> = {};
  for (const tag of LINK_TAGS) {
    counts[tag] = 0;
  }

  for (const row of rows) {
    const tags = JSON.parse(row.tags) as string[];
    for (const tag of tags) {
      if (tag in counts) {
        counts[tag]++;
      }
    }
  }

  const result = LINK_TAGS.map((tag) => ({ tag, count: counts[tag] }));

  return NextResponse.json({ tags: result });
}
