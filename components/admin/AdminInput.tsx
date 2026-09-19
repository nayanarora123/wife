'use client';

interface Props {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  prefix?: string;
}

export default function AdminInput({ label, value, onChange, placeholder, type = 'text', prefix }: Props) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: '#c7889a' }}>
        {label}
      </label>
      <div className="flex">
        {prefix && (
          <span
            className="flex items-center px-3 text-xs rounded-l-xl"
            style={{ background: '#120508', border: '1px solid #3d2030', borderRight: 'none', color: '#5d3040' }}
          >
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-3 py-2.5 text-sm outline-none transition-all"
          style={{
            background: '#120508',
            border: '1px solid #3d2030',
            borderRadius: prefix ? '0 12px 12px 0' : '12px',
            color: '#f9d8e1',
          }}
          onFocus={e => { e.target.style.borderColor = '#D94F73'; }}
          onBlur={e => { e.target.style.borderColor = '#3d2030'; }}
        />
      </div>
    </div>
  );
}
