import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPublicPageData } from '@/lib/server/store';
import { generateThemeCSS } from '@/lib/theme-utils';
import LovePageClient from '@/components/love-page/LovePageClient';

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { preview } = await searchParams;
  const isPreview = preview === 'true';

  const data = await getPublicPageData(slug, isPreview);

  if (!data) {
    return { title: 'Page Not Found' };
  }

  const page = data.page;

  return {
    title: page.browser_title || page.title,
    description: page.og_description || page.subtitle,
    openGraph: {
      title: page.og_title || page.title,
      description: page.og_description || page.subtitle,
      images: page.og_image_url ? [page.og_image_url] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: page.og_title || page.title,
      description: page.og_description || page.subtitle,
    },
  };
}

export default async function LovePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { preview } = await searchParams;
  const isPreview = preview === 'true';

  const data = await getPublicPageData(slug, isPreview);

  if (!data) {
    notFound();
  }

  const themeCSS = generateThemeCSS(data.theme);

  return (
    <>
      {/* Inject dynamic theme CSS variables */}
      <style dangerouslySetInnerHTML={{ __html: `:root { ${themeCSS} }` }} />
      <LovePageClient data={data} isPreview={isPreview} />
    </>
  );
}
