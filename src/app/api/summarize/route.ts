import { NextResponse } from 'next/server';
import { processBatch } from '../../../lib/process-batch';

export async function POST() {
  try {
    const result = await processBatch();
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
