import { NextResponse } from 'next/server';
import { publishDraft } from '@/lib/server/store';

export async function POST() {
  try {
    const updatedStore = await publishDraft();
    return NextResponse.json({
      success: true,
      message: 'Page published successfully! Changes are now live.',
      store: updatedStore,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to publish page', details: String(error) },
      { status: 500 }
    );
  }
}
