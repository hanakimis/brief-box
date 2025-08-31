import { NextResponse } from 'next/server';
import { pool } from '../../db';

export async function GET() {
  try {
    await pool.query('select 1');
    return NextResponse.json({ ok: true, db: 'up' });
  } catch {
    return NextResponse.json({ ok: false, db: 'down' }, { status: 503 });
  }
}

