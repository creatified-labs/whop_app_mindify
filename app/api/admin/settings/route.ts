import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getAuthUser } from '@/lib/auth/getAuthUser';
import { getSettings, updateSettings } from '@/lib/database/settingsService';

export async function GET() {
  try {
    await getAuthUser(await headers());
    const { data, error } = await getSettings();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function PATCH(request: Request) {
  try {
    await getAuthUser(await headers());
    const body = await request.json();
    const { data, error } = await updateSettings(body);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
