'use client';

import { motion } from 'framer-motion';

interface Props {
  title: string;
  icon?: string;
  children: React.ReactNode;
  className?: string;
}

export default function AdminFormCard({ title, icon, children, className = '' }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`rounded-2xl p-5 sm:p-6 space-y-4 ${className}`}
      style={{ background: '#1a0a0f', border: '1px solid #2d1520' }}
    >
      <div className="flex items-center gap-2 pb-3" style={{ borderBottom: '1px solid #2d1520' }}>
        {icon && <span className="text-lg">{icon}</span>}
        <h3 className="font-semibold text-sm" style={{ color: '#f9d8e1' }}>{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}
