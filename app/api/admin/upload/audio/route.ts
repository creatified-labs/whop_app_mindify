import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getAuthUser } from '@/lib/auth/getAuthUser';
import {
  validateAudioFile,
  createSignedUploadUrl,
  deleteAudio,
  listAudioFiles,
  type AudioContentType,
} from '@/lib/storage/audioStorage';

const VALID_CONTENT_TYPES: AudioContentType[] = [
  'meditations',
  'hypnosis',
  'programs',
  'quick-resets',
  'general',
];

/**
 * POST - Get a signed upload URL for direct browser upload to Supabase Storage
 */
export async function POST(request: Request) {
  try {
    await getAuthUser(await headers());

    const body = await request.json();
    const { fileName, contentType, folder } = body as {
      fileName: string;
      contentType: string;
      folder?: AudioContentType;
    };

    if (!fileName || !contentType) {
      return NextResponse.json(
        { error: 'fileName and contentType are required' },
        { status: 400 }
      );
    }

    const validation = validateAudioFile(fileName, contentType);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const audioFolder = folder && VALID_CONTENT_TYPES.includes(folder) ? folder : 'general';

    const { data, error } = await createSignedUploadUrl(fileName, contentType, audioFolder);
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
 * GET - List uploaded audio files
 * Query params: contentType (folder), limit
 */
export async function GET(request: Request) {
  try {
    await getAuthUser(await headers());

    const { searchParams } = new URL(request.url);
    const contentType = searchParams.get('contentType') as AudioContentType | null;
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const folder = contentType && VALID_CONTENT_TYPES.includes(contentType) ? contentType : 'general';

    const { data, error } = await listAudioFiles(folder, limit);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ files: data });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

/**
 * DELETE - Delete an uploaded audio file
 * Query param: path (storage path)
 */
export async function DELETE(request: Request) {
  try {
    await getAuthUser(await headers());

    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');

    if (!path) {
      return NextResponse.json({ error: 'path query parameter is required' }, { status: 400 });
    }

    const { success, error } = await deleteAudio(path);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
