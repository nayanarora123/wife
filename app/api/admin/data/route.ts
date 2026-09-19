import { NextResponse } from 'next/server';
import { getPageStore, saveDraft, resetToDefault } from '@/lib/server/store';
import { type FullPageData } from '@/types';

export async function GET() {
  try {
    const store = await getPageStore();
    return NextResponse.json(store);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load page data', details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.action === 'reset') {
      const resetStore = await resetToDefault();
      return NextResponse.json({ success: true, store: resetStore });
    }

    const data = body.data as FullPageData;
    if (!data || !data.page) {
      return NextResponse.json(
        { error: 'Invalid data format provided' },
        { status: 400 }
      );
    }

    const updatedStore = await saveDraft(data);
    return NextResponse.json({ success: true, store: updatedStore });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save page data', details: String(error) },
      { status: 500 }
    );
  }
}
