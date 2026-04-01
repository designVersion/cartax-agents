import React from 'react';

const nav = [
  { id: 'dashboard', label: '대시보드', icon: Grid },
  { id: 'office',    label: '에이전트 오피스', icon: Users },
  { id: 'usage',     label: '사용량', icon: Chart },
  { id: 'admin',     label: '페이지 관리', icon: Settings, muted: true },
];

function Grid() {
  return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3"/></svg>;
}
function Users() {
  return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.3"/><path d="M2 14c0-3 2.7-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>;
}
function Chart() {
  return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><polyline points="2,12 5,7 8,9 11,4 14,6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function Settings() {
  return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.3"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.42 1.42M11.53 11.53l1.42 1.42M11.53 4.47l1.42-1.42M3.05 12.95l1.42-1.42" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>;
}

export default function Sidebar({ page, setPage }) {
  return (
    <aside style={{
      width: 'var(--sidebar-w)', minWidth: 'var(--sidebar-w)',
      background: 'var(--surface)', borderRight: '0.5px solid var(--border)',
      display: 'flex', flexDirection: 'column', height: '100vh',
    }}>
      <div style={{ padding: '20px 20px 16px', borderBottom: '0.5px solid var(--border)' }}>
        <div style={{ fontSize: 14, fontWeight: 500 }}>Cartax Agents</div>
        <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>에이전트 관리 플랫폼</div>
      </div>

      <nav style={{ padding: '10px 0', flex: 1 }}>
        {nav.map(n => {
          const active = page === n.id;
          return (
            <button key={n.id} onClick={() => setPage(n.id)} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              width: '100%', padding: '8px 16px',
              fontSize: 13, fontWeight: active ? 500 : 400,
              color: active ? 'var(--blue)' : n.muted ? 'var(--text-tertiary)' : 'var(--text-secondary)',
              background: active ? 'var(--blue-light)' : 'transparent',
              borderLeft: `2px solid ${active ? 'var(--blue)' : 'transparent'}`,
              transition: 'all 0.1s',
            }}>
              <n.icon />
              {n.label}
            </button>
          );
        })}
      </nav>

      <div style={{ padding: '14px 16px', borderTop: '0.5px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 30, height: 30, borderRadius: '50%',
          background: '#B5D4F4', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 11, fontWeight: 500, color: '#0C447C',
        }}>유</div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 500 }}>유세호</div>
          <div style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>관리자</div>
        </div>
      </div>
    </aside>
  );
}
