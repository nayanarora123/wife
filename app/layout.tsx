import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Love Story',
  description: 'A personal love story',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
