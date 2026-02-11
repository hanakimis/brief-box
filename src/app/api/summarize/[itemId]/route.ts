import { NextResponse } from 'next/server';
import { processItem } from '../../../../lib/process-item';

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ itemId: string }> }
) {
  const { itemId: raw } = await params;
  const itemId = parseInt(raw, 10);
  if (isNaN(itemId)) {
    return NextResponse.json({ error: 'Invalid itemId' }, { status: 400 });
  }

  try {
    const result = await processItem(itemId);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    const status = message.includes('not found') ? 404 : message.includes('already') ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
