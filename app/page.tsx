import { redirect } from 'next/navigation';
import { getPageStore } from '@/lib/server/store';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const store = await getPageStore();
  const slug = store.published.page.slug || store.draft.page.slug || 'nayan-charan';
  redirect(`/love/${slug}`);
}
