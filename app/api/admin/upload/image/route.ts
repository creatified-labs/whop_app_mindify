import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getAuthUser, extractCompanyId } from '@/lib/auth/getAuthUser';
import {
  validateImageFile,
  createSignedImageUploadUrl,
  deleteImage,
  type ImageContentType,
} from '@/lib/storage/imageStorage';

const VALID_CONTENT_TYPES: ImageContentType[] = [
  'meditations',
  'hypnosis',
  'programs',
  'articles',
  'general',
];

/**
 * POST - Get a signed upload URL for direct browser upload of images to Supabase Storage
 */
export async function POST(request: Request) {
  try {
    extractCompanyId(request);
    await getAuthUser(await headers());

    const body = await request.json();
    const { fileName, contentType, folder } = body as {
      fileName: string;
      contentType: string;
      folder?: ImageContentType;
    };

    if (!fileName || !contentType) {
      return NextResponse.json(
        { error: 'fileName and contentType are required' },
        { status: 400 }
      );
    }

    const validation = validateImageFile(fileName, contentType);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const imageFolder = folder && VALID_CONTENT_TYPES.includes(folder) ? folder : 'general';

    const { data, error } = await createSignedImageUploadUrl(fileName, contentType, imageFolder);
    if (error || !data) {
      return NextResponse.json(
        { error: error?.message || 'Failed to create upload URL' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

/**
 * DELETE - Delete an uploaded image file
 * Query param: path (storage path)
 */
export async function DELETE(request: Request) {
  try {
    extractCompanyId(request);
    await getAuthUser(await headers());

    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');

    if (!path) {
      return NextResponse.json({ error: 'path query parameter is required' }, { status: 400 });
    }

    const { success, error } = await deleteImage(path);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
