'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminDataProvider, useAdminData } from './AdminDataContext';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: '🏠', exact: true },
  { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
  { href: '/admin/theme', label: 'Theme', icon: '🎨' },
  { href: '/admin/sections', label: 'Sections', icon: '☰' },
  { href: '/admin/timeline', label: 'Timeline', icon: '📅' },
  { href: '/admin/reasons', label: 'Reasons', icon: '💗' },
  { href: '/admin/gallery', label: 'Gallery', icon: '📸' },
  { href: '/admin/songs', label: 'Songs', icon: '🎵' },
  { href: '/admin/game', label: 'Quiz & Game', icon: '🎮' },
  { href: '/admin/wheel', label: 'Spin Wheel', icon: '🎡' },
  { href: '/admin/compatibility', label: 'Compatibility', icon: '❤️' },
  { href: '/admin/media', label: 'Media Library', icon: '🖼️' },
];

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <AdminDataProvider>
      <AdminInnerLayout>{children}</AdminInnerLayout>
    </AdminDataProvider>
  );
}

function AdminInnerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authenticated, setAuthenticated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    data,
    isLoading,
    isSaving,
    isPublishing,
    isDirty,
    statusMessage,
    saveChanges,
    publishChanges,
  } = useAdminData();

  useEffect(() => {
    // Check for demo session cookie
    const hasSession = document.cookie.includes('admin_session=');
    if (!hasSession && pathname !== '/admin/login') {
      router.push('/admin/login');
    } else {
      setAuthenticated(true);
    }
  }, [pathname, router]);

  if (!authenticated) return null;

  const handleLogout = () => {
    document.cookie = 'admin_session=; path=/; max-age=0';
    router.push('/admin/login');
  };

  const currentSlug = data?.page?.slug || 'nayan-charan';

  return (
    <div
      className="flex min-h-screen"
      style={{ background: '#120508', fontFamily: 'Inter, sans-serif' }}
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {statusMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-6 left-1/2 z-50 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-medium"
            style={{
              background:
                statusMessage.type === 'success'
                  ? 'linear-gradient(135deg, #10b981, #059669)'
                  : statusMessage.type === 'error'
                  ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                  : 'linear-gradient(135deg, #3b82f6, #2563eb)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            <span>{statusMessage.type === 'success' ? '✓' : statusMessage.type === 'error' ? '⚠️' : 'ℹ️'}</span>
            <span>{statusMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-30 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:flex
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{
          width: 240,
          background: '#1a0a0f',
          borderRight: '1px solid #2d1520',
          flexShrink: 0,
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-3 px-5 py-5"
          style={{ borderBottom: '1px solid #2d1520' }}
        >
          <span className="text-2xl">💗</span>
          <div>
            <p className="text-sm font-bold" style={{ color: '#f9d8e1' }}>Love Story</p>
            <p className="text-xs" style={{ color: '#5d3040' }}>Admin Panel</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(item => {
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`admin-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="p-3 space-y-1" style={{ borderTop: '1px solid #2d1520' }}>
          <a
            href={`/love/${currentSlug}?preview=true`}
            target="_blank"
            rel="noopener noreferrer"
            className="admin-nav-item"
          >
            <span>👁️</span>
            <span>Live Preview</span>
          </a>
          <a
            href={`/love/${currentSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="admin-nav-item"
          >
            <span>🔗</span>
            <span>Public Page</span>
          </a>
          <button
            onClick={handleLogout}
            className="admin-nav-item w-full text-left"
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header
          className="flex items-center gap-3 px-5 py-3.5 sticky top-0 z-10"
          style={{
            background: '#1a0a0f',
            borderBottom: '1px solid #2d1520',
          }}
        >
          {/* Mobile menu button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg"
            style={{ color: '#c7889a', background: '#2d1520' }}
          >
            ☰
          </button>

          {/* Page title */}
          <div className="flex-1 min-w-0">
            <h1
              className="text-base font-semibold truncate"
              style={{ color: '#f9d8e1' }}
            >
              {NAV_ITEMS.find(i => i.exact ? pathname === i.href : pathname.startsWith(i.href))?.label || 'Admin'}
            </h1>
          </div>

          {/* Status badge */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
            style={{
              background: isDirty
                ? 'rgba(234, 179, 8, 0.15)'
                : data?.page?.status === 'published'
                ? 'rgba(34, 197, 94, 0.15)'
                : 'rgba(217, 79, 115, 0.15)',
              color: isDirty
                ? '#eab308'
                : data?.page?.status === 'published'
                ? '#22c55e'
                : '#D94F73',
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: isDirty
                  ? '#eab308'
                  : data?.page?.status === 'published'
                  ? '#22c55e'
                  : '#D94F73',
              }}
            />
            {isDirty ? 'Unsaved Draft' : data?.page?.status === 'published' ? 'Published' : 'Draft'}
          </div>

          {/* Save Draft button */}
          <motion.button
            onClick={() => saveChanges()}
            disabled={isSaving}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-50"
            style={{
              background: isDirty ? '#2d1520' : '#1f0d15',
              border: isDirty ? '1px solid #D94F73' : '1px solid #3d2030',
              color: '#f9d8e1',
            }}
          >
            <span>💾</span>
            <span>{isSaving ? 'Saving...' : isDirty ? 'Save Draft' : 'Saved'}</span>
          </motion.button>

          {/* Publish button */}
          <motion.button
            onClick={() => publishChanges()}
            disabled={isPublishing}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #D94F73, #be185d)',
              color: 'white',
              boxShadow: '0 4px 14px rgba(217, 79, 115, 0.4)',
            }}
          >
            <span>{isPublishing ? '⏳' : '✨'}</span>
            <span>{isPublishing ? 'Publishing...' : 'Publish Live'}</span>
          </motion.button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 sm:p-7">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center space-y-3">
                <div className="text-3xl animate-bounce">💗</div>
                <p className="text-xs" style={{ color: '#c7889a' }}>Loading settings...</p>
              </div>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
