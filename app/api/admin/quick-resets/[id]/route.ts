import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getAuthUser, extractCompanyId } from '@/lib/auth/getAuthUser';
import { updateQuickReset, deleteQuickReset } from '@/lib/database/contentService';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const companyId = extractCompanyId(request);
    await getAuthUser(await headers());
    const { id } = await params;
    const body = await request.json();
    const { data, error } = await updateQuickReset(companyId, id, body);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const companyId = extractCompanyId(request);
    await getAuthUser(await headers());
    const { id } = await params;
    const { success, error } = await deleteQuickReset(companyId, id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
