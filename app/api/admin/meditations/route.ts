import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getAuthUser } from '@/lib/auth/getAuthUser';
import { getMeditations, createMeditation } from '@/lib/database/contentService';
import { MEDITATION_LIBRARY } from '@/lib/mockData/meditations';

export async function GET() {
  try {
    await getAuthUser(await headers());
    const { data, error } = await getMeditations();
    if (!error && data && data.length > 0) {
      return NextResponse.json({ items: data, total: data.length });
    }
    // Fallback to mock data
    const items = MEDITATION_LIBRARY.slice(0, 3);
    return NextResponse.json({ items, total: items.length });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    await getAuthUser(await headers());
    const body = await request.json();
    const { data, error } = await createMeditation(body);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
