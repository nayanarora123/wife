import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';
import { type FullPageData } from '@/types';
import { MOCK_PAGE_DATA } from '@/lib/mock-data';

export interface PageStoreData {
  draft: FullPageData;
  published: FullPageData;
  published_at?: string;
  updated_at?: string;
}

// ============================================================
// Supabase helpers
// ============================================================

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return !!(url && key && !url.includes('your-project'));
}

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

async function getFromSupabase(): Promise<PageStoreData | null> {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('page_store')
      .select('data')
      .eq('id', 'default')
      .single();

    if (error || !data) return null;
    return data.data as PageStoreData;
  } catch (err) {
    console.error('Supabase read error:', err);
    return null;
  }
}

async function saveToSupabase(store: PageStoreData): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from('page_store')
    .upsert({
      id: 'default',
      data: store,
      updated_at: new Date().toISOString(),
    });

  if (error) {
    console.error('Supabase save error:', error);
    throw new Error(`Failed to save to Supabase: ${error.message}`);
  }
}

// ============================================================
// Filesystem fallback (local dev without Supabase)
// ============================================================

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'page-data.json');

function getDefaultData(): PageStoreData {
  return {
    draft: JSON.parse(JSON.stringify(MOCK_PAGE_DATA)),
    published: JSON.parse(JSON.stringify(MOCK_PAGE_DATA)),
    published_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

async function getFromFilesystem(): Promise<PageStoreData> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const content = await fs.readFile(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(content) as PageStoreData;
    if (parsed.draft && parsed.published) {
      return parsed;
    }
  } catch {
    // File doesn't exist or is invalid — initialize with defaults
  }

  const initialData = getDefaultData();
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Filesystem read-only; using in-memory fallback:', err);
  }
  return initialData;
}

async function saveToFilesystem(store: PageStoreData): Promise<void> {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Filesystem read-only (e.g. Vercel deployment).', err);
  }
}

// ============================================================
// Public API — unchanged interface, Supabase-backed
// ============================================================

export async function getPageStore(): Promise<PageStoreData> {
  if (isSupabaseConfigured()) {
    const data = await getFromSupabase();
    if (data) return data;
    // No data in Supabase yet — fall through to filesystem/defaults
  }
  return await getFromFilesystem();
}

export async function saveDraft(data: FullPageData): Promise<PageStoreData> {
  const store = await getPageStore();
  const now = new Date().toISOString();
  data.page.updated_at = now;
  store.draft = data;
  store.updated_at = now;

  if (isSupabaseConfigured()) {
    await saveToSupabase(store);
  } else {
    await saveToFilesystem(store);
  }
  return store;
}

export async function publishDraft(): Promise<PageStoreData> {
  const store = await getPageStore();
  const now = new Date().toISOString();
  store.draft.page.status = 'published';
  store.draft.page.updated_at = now;
  store.published = JSON.parse(JSON.stringify(store.draft));
  store.published_at = now;
  store.updated_at = now;

  if (isSupabaseConfigured()) {
    await saveToSupabase(store);
  } else {
    await saveToFilesystem(store);
  }
  return store;
}

export async function resetToDefault(): Promise<PageStoreData> {
  const initialData = getDefaultData();

  if (isSupabaseConfigured()) {
    await saveToSupabase(initialData);
  } else {
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
      await saveToFilesystem(initialData);
    } catch (err) {
      console.warn('Filesystem read-only.', err);
    }
  }
  return initialData;
}

export async function getPublicPageData(
  slug: string,
  isPreview: boolean = false
): Promise<FullPageData | null> {
  const store = await getPageStore();
  const data = isPreview ? store.draft : store.published;

  // Allow matching configured slug or default 'nayan-charan'
  if (
    data.page.slug === slug ||
    slug === 'nayan-charan' ||
    slug === 'default'
  ) {
    return data;
  }

  // Also check if preview request matches draft slug even if published slug differs
  if (store.draft.page.slug === slug) {
    return store.draft;
  }

  return null;
}
