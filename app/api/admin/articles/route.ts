import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getAuthUser, extractCompanyId } from '@/lib/auth/getAuthUser';
import { getArticles, createArticle } from '@/lib/database/contentService';

export async function GET(request: Request) {
  try {
    const companyId = extractCompanyId(request);
    await getAuthUser(await headers());
    const { data, error } = await getArticles(companyId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ items: data, total: data.length });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const companyId = extractCompanyId(request);
    await getAuthUser(await headers());
    const body = await request.json();
    const { data, error } = await createArticle(companyId, body);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
