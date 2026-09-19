'use client';

interface Props {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}

export default function AdminTextarea({ label, value, onChange, placeholder, rows = 3 }: Props) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: '#c7889a' }}>
        {label}
      </label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-3 py-2.5 text-sm rounded-xl outline-none transition-all resize-none"
        style={{
          background: '#120508',
          border: '1px solid #3d2030',
          color: '#f9d8e1',
          lineHeight: 1.6,
        }}
        onFocus={e => { e.target.style.borderColor = '#D94F73'; }}
        onBlur={e => { e.target.style.borderColor = '#3d2030'; }}
      />
    </div>
  );
}
