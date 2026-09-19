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

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'page-data.json');

async function ensureDataFile(): Promise<PageStoreData> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const content = await fs.readFile(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(content) as PageStoreData;
    if (parsed.draft && parsed.published) {
      return parsed;
    }
  } catch {
    // File doesn't exist or is invalid, initialize with mock data
  }

  const initialData: PageStoreData = {
    draft: JSON.parse(JSON.stringify(MOCK_PAGE_DATA)),
    published: JSON.parse(JSON.stringify(MOCK_PAGE_DATA)),
    published_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Filesystem read-only; using in-memory fallback:', err);
  }
  return initialData;
}

export async function getPageStore(): Promise<PageStoreData> {
  return await ensureDataFile();
}

export async function saveDraft(data: FullPageData): Promise<PageStoreData> {
  const store = await ensureDataFile();
  const now = new Date().toISOString();
  data.page.updated_at = now;
  store.draft = data;
  store.updated_at = now;

  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Filesystem read-only (e.g. Vercel deployment). Cannot save to local disk.', err);
  }
  return store;
}

export async function publishDraft(): Promise<PageStoreData> {
  const store = await ensureDataFile();
  const now = new Date().toISOString();
  store.draft.page.status = 'published';
  store.draft.page.updated_at = now;
  store.published = JSON.parse(JSON.stringify(store.draft));
  store.published_at = now;
  store.updated_at = now;

  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Filesystem read-only (e.g. Vercel deployment). Cannot save to local disk.', err);
  }
  return store;
}

export async function resetToDefault(): Promise<PageStoreData> {
  const initialData: PageStoreData = {
    draft: JSON.parse(JSON.stringify(MOCK_PAGE_DATA)),
    published: JSON.parse(JSON.stringify(MOCK_PAGE_DATA)),
    published_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Filesystem read-only.', err);
  }
  return initialData;
}

export async function getPublicPageData(
  slug: string,
  isPreview: boolean = false
): Promise<FullPageData | null> {
  const store = await ensureDataFile();
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
