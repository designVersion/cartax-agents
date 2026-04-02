import React from 'react';

export function Badge({ status }) {
  const map = {
    stable: { label: 'stable', bg: 'var(--green-light)', color: 'var(--green)' },
    beta:   { label: 'beta',   bg: 'var(--amber-light)', color: 'var(--amber)' },
    dev:    { label: '개발중',  bg: '#f0f0ee',            color: '#888' },
  };
  const s = map[status] || map.dev;
  return <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 10, fontWeight: 500, background: s.bg, color: s.color }}>{s.label}</span>;
}

export function RoleBadge({ role }) {
  const map = {
    4: { label: '최고관리자', color: '#E24B4A', bg: '#FCEBEB' },
    3: { label: '편집자',    color: 'var(--blue)', bg: 'var(--blue-light)' },
    2: { label: '사용자',    color: 'var(--green)', bg: 'var(--green-light)' },
    1: { label: '뷰어',     color: '#888', bg: '#f0f0ee' },
  };
  const s = map[role] || map[1];
  return <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 10, fontWeight: 500, background: s.bg, color: s.color }}>{s.label}</span>;
}

export function Card({ children, style }) {
  return (
    <div style={{ background: 'var(--surface)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 20, ...style }}>
      {children}
    </div>
  );
}

export function StatCard({ label, value, delta, deltaColor }) {
  return (
    <div style={{ background: '#f0f0ee', borderRadius: 'var(--radius-md)', padding: 16 }}>
      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 500 }}>{value}</div>
      {delta && <div style={{ fontSize: 11, color: deltaColor || 'var(--green)', marginTop: 4 }}>{delta}</div>}
    </div>
  );
}

export function Spinner() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
      <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid var(--border-md)', borderTopColor: 'var(--blue)', animation: 'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export function Input({ label, required, ...props }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>{label}{required && <span style={{ color: 'var(--red)' }}> *</span>}</div>}
      <input style={{
        width: '100%', padding: '8px 12px', fontSize: 13,
        border: '0.5px solid var(--border-md)', borderRadius: 'var(--radius-md)',
        background: 'var(--surface)', color: 'var(--text-primary)', outline: 'none',
      }} {...props} />
    </div>
  );
}

export function Select({ label, required, children, ...props }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>{label}{required && <span style={{ color: 'var(--red)' }}> *</span>}</div>}
      <select style={{
        width: '100%', padding: '8px 12px', fontSize: 13,
        border: '0.5px solid var(--border-md)', borderRadius: 'var(--radius-md)',
        background: 'var(--surface)', color: 'var(--text-primary)', outline: 'none',
      }} {...props}>{children}</select>
    </div>
  );
}

export function Btn({ variant = 'ghost', children, style, ...props }) {
  const styles = {
    ghost:   { background: 'transparent', border: '0.5px solid var(--border-md)', color: 'var(--text-secondary)' },
    primary: { background: 'var(--blue)', border: 'none', color: 'white' },
    danger:  { background: 'transparent', border: '0.5px solid var(--red)', color: 'var(--red)' },
  };
  return (
    <button style={{ padding: '7px 14px', fontSize: 12, borderRadius: 'var(--radius-md)', cursor: 'pointer', ...styles[variant], ...style }} {...props}>
      {children}
    </button>
  );
}
