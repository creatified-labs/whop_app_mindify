import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getAuthUser } from '@/lib/auth/getAuthUser';
import {
  getMediaItems,
  createMediaItem,
  createMediaItems,
  deleteMediaItem,
  updateMediaItemTags,
} from '@/lib/database/mediaLibraryService';
import { createSignedUploadUrl, validateMediaFile } from '@/lib/storage/audioStorage';

export async function GET(request: Request) {
  try {
    await getAuthUser(await headers());
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as 'audio' | 'video' | 'link' | null;
    const filter = type === 'audio' || type === 'video' || type === 'link' ? type : undefined;

    const { data, error } = await getMediaItems(filter);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ items: data, total: data.length });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    await getAuthUser(await headers());
    const body = await request.json();

    if (body.action === 'upload') {
      const { fileName, contentType, fileSize } = body;
      const validation = validateMediaFile(fileName, contentType, fileSize);
      if (!validation.valid) {
        return NextResponse.json({ error: validation.error }, { status: 400 });
      }
      const { data, error } = await createSignedUploadUrl(fileName, contentType, 'general');
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json(data);
    }

    if (body.action === 'register') {
      const { items } = body;
      if (!items || !Array.isArray(items) || items.length === 0) {
        return NextResponse.json({ error: 'Items array is required' }, { status: 400 });
      }

      if (items.length === 1) {
        const { data, error } = await createMediaItem(items[0]);
        if (error) return NextResponse.json({ error: error.message }, { status: 400 });
        return NextResponse.json({ items: [data] }, { status: 201 });
      }

      const { data, error } = await createMediaItems(items);
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json({ items: data }, { status: 201 });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function DELETE(request: Request) {
  try {
    await getAuthUser(await headers());
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });

    const { success, error } = await deleteMediaItem(id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!success) return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function PATCH(request: Request) {
  try {
    await getAuthUser(await headers());
    const { id, tags } = await request.json();
    if (!id || !Array.isArray(tags)) {
      return NextResponse.json({ error: 'id and tags[] are required' }, { status: 400 });
    }

    const { data, error } = await updateMediaItemTags(id, tags);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
