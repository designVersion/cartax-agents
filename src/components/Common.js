import React from 'react';

export function Badge({ status }) {
  const map = {
    stable: { label: 'stable', bg: 'var(--green-light)', color: 'var(--green)' },
    beta:   { label: 'beta',   bg: 'var(--amber-light)', color: 'var(--amber)' },
    dev:    { label: '개발중',  bg: '#f0f0ee',            color: '#888' },
  };
  const s = map[status] || map.dev;
  return (
    <span style={{
      fontSize: 10, padding: '3px 8px', borderRadius: 10,
      fontWeight: 500, background: s.bg, color: s.color,
    }}>{s.label}</span>
  );
}

export function Card({ children, style }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '0.5px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px',
      ...style,
    }}>{children}</div>
  );
}

export function StatCard({ label, value, delta, deltaColor }) {
  return (
    <div style={{
      background: '#f0f0ee', borderRadius: 'var(--radius-md)', padding: 16,
    }}>
      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 500 }}>{value}</div>
      {delta && (
        <div style={{ fontSize: 11, color: deltaColor || 'var(--green)', marginTop: 4 }}>{delta}</div>
      )}
    </div>
  );
}

export function Spinner() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
      <div style={{
        width: 20, height: 20, borderRadius: '50%',
        border: '2px solid var(--border-md)',
        borderTopColor: 'var(--blue)',
        animation: 'spin 0.7s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export function EmptyState({ message }) {
  return (
    <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text-tertiary)', fontSize: 13 }}>
      {message || '데이터가 없습니다'}
    </div>
  );
}
