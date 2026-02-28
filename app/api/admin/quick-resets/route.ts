import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getAuthUser } from '@/lib/auth/getAuthUser';
import { getQuickResets, createQuickReset } from '@/lib/database/contentService';
import { QUICK_RESETS } from '@/lib/mockData/quickResets';

export async function GET() {
  try {
    await getAuthUser(await headers());
    const { data, error } = await getQuickResets();
    if (!error && data && data.length > 0) {
      return NextResponse.json({ items: data, total: data.length });
    }
    // Fallback to mock data
    const items = QUICK_RESETS.slice(0, 3);
    return NextResponse.json({ items, total: items.length });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    await getAuthUser(await headers());
    const body = await request.json();
    const { data, error } = await createQuickReset(body);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
