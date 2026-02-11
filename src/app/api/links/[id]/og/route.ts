import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '../../../../../db';
import { link } from '../../../../../db/schema';

export async function POST(
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

  // If we already have an og:image, return it
  if (row.ogImage) {
    return NextResponse.json({ ogImage: row.ogImage });
  }

  // Fetch the page and extract og:image
  try {
    const response = await fetch(row.url, {
      headers: { 'User-Agent': 'BriefBox/1.0 (og-fetch)' },
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      return NextResponse.json({ ogImage: null, error: `HTTP ${response.status}` });
    }

    const html = await response.text();

    // Extract og:image from meta tags
    const ogMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
      ?? html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);

    const ogImage = ogMatch?.[1] ?? null;

    if (ogImage) {
      await db.update(link).set({ ogImage }).where(eq(link.id, id));
    }

    return NextResponse.json({ ogImage });
  } catch (err) {
    return NextResponse.json({
      ogImage: null,
      error: err instanceof Error ? err.message : 'Fetch failed',
    });
  }
}
