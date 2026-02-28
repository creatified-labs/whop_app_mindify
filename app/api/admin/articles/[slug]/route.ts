import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getAuthUser } from '@/lib/auth/getAuthUser';
import { updateArticle, deleteArticle } from '@/lib/database/contentService';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await getAuthUser(await headers());
    const { slug } = await params;
    const body = await request.json();
    const { data, error } = await updateArticle(slug, body);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await getAuthUser(await headers());
    const { slug } = await params;
    const { success, error } = await deleteArticle(slug);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
