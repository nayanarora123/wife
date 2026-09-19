'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Demo auth: hardcoded for now
    // In production, this calls Supabase Auth
    if (email === 'admin@love.local' && password === 'love1234') {
      // Set a simple session cookie (demo mode)
      document.cookie = 'admin_session=demo; path=/; max-age=86400';
      router.push('/admin');
    } else {
      setError('Invalid credentials. Try admin@love.local / love1234');
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: '#1a0a0f' }}
    >
      {/* Background hearts */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            className="absolute text-2xl opacity-10"
            style={{
              left: `${15 + i * 14}%`,
              bottom: 0,
              animation: `floatUp ${4 + i}s ${i * 0.5}s linear infinite`,
            }}
          >
            ❤️
          </div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-sm relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-5xl mb-4"
          >
            💗
          </motion.div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
            Love Story Admin
          </h1>
          <p className="text-sm mt-1" style={{ color: '#c7889a' }}>
            Sign in to manage your page
          </p>
        </div>

        {/* Login card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: '#2d1520',
            border: '1px solid #3d2030',
          }}
        >
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: '#c7889a' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@love.local"
                required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: '#1a0a0f',
                  border: '1px solid #3d2030',
                  color: '#f9d8e1',
                }}
                onFocus={e => { e.target.style.borderColor = '#D94F73'; }}
                onBlur={e => { e.target.style.borderColor = '#3d2030'; }}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: '#c7889a' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: '#1a0a0f',
                  border: '1px solid #3d2030',
                  color: '#f9d8e1',
                }}
                onFocus={e => { e.target.style.borderColor = '#D94F73'; }}
                onBlur={e => { e.target.style.borderColor = '#3d2030'; }}
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-center px-3 py-2 rounded-lg"
                style={{ color: '#fca5a5', background: 'rgba(254, 202, 202, 0.1)' }}
              >
                {error}
              </motion.p>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all"
              style={{
                background: loading ? '#9E2F50' : '#D94F73',
                color: 'white',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Signing in...' : 'Sign In ❤️'}
            </motion.button>
          </form>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: '#5d2030' }}>
          Demo: admin@love.local / love1234
        </p>
      </motion.div>
    </div>
  );
}
