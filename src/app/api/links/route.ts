import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../db';
import { link } from '../../../db/schema';
import { eq, gte, desc, sql, like } from 'drizzle-orm';

const PAGE_SIZE = 50;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const tag = searchParams.get('tag');
  const domain = searchParams.get('domain');
  const minSources = parseInt(searchParams.get('minSources') ?? '0', 10);
  const sort = searchParams.get('sort') ?? 'recent'; // recent | popular
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));

  const conditions = [];

  if (tag) {
    // Search within JSON text array for the tag
    conditions.push(like(link.tags, `%"${tag}"%`));
  }
  if (domain) {
    conditions.push(eq(link.domain, domain));
  }
  if (minSources > 0) {
    conditions.push(gte(link.sourceCount, minSources));
  }

  const where = conditions.length > 0
    ? sql`${sql.join(conditions.map(c => sql`(${c})`), sql` AND `)}`
    : undefined;

  const orderBy = sort === 'popular'
    ? desc(link.sourceCount)
    : desc(link.firstSeenAt);

  const offset = (page - 1) * PAGE_SIZE;

  const rows = await db
    .select()
    .from(link)
    .where(where)
    .orderBy(orderBy)
    .limit(PAGE_SIZE)
    .offset(offset);

  // Parse tags from JSON string for the response
  const results = rows.map((row) => ({
    ...row,
    tags: JSON.parse(row.tags) as string[],
  }));

  return NextResponse.json({ links: results, page, pageSize: PAGE_SIZE });
}
