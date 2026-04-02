import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const navItems = [
  { id: 'dashboard', label: '대시보드',       minRole: 1 },
  { id: 'office',    label: '에이전트 오피스', minRole: 1 },
  { id: 'usage',     label: '사용량',         minRole: 1 },
  { id: 'admin',     label: '페이지 관리',    minRole: 4 },
];

function GridIcon() {
  return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3"/></svg>;
}
function UsersIcon() {
  return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.3"/><path d="M2 14c0-3 2.7-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>;
}
function ChartIcon() {
  return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><polyline points="2,12 5,7 8,9 11,4 14,6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function SettingsIcon() {
  return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.3"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.42 1.42M11.53 11.53l1.42 1.42M11.53 4.47l1.42-1.42M3.05 12.95l1.42-1.42" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>;
}

const icons = { dashboard: GridIcon, office: UsersIcon, usage: ChartIcon, admin: SettingsIcon };

export default function Sidebar({ page, setPage }) {
  const { profile, logout } = useAuth();
  const role = profile?.role || 1;

  return (
    <aside style={{ width: 'var(--sidebar-w)', minWidth: 'var(--sidebar-w)', background: 'var(--surface)', borderRight: '0.5px solid var(--border)', display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ padding: '20px 20px 16px', borderBottom: '0.5px solid var(--border)' }}>
        <div style={{ fontSize: 14, fontWeight: 500 }}>Cartax Agents</div>
        <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>에이전트 관리 플랫폼</div>
      </div>

      <nav style={{ padding: '10px 0', flex: 1 }}>
        {navItems.filter(n => role >= n.minRole).map(n => {
          const Icon = icons[n.id];
          const active = page === n.id;
          return (
            <button key={n.id} onClick={() => setPage(n.id)} style={{
              display: 'flex', alignItems: 'center', gap: 10, width: '100%',
              padding: '8px 16px', fontSize: 13, fontWeight: active ? 500 : 400,
              color: active ? 'var(--blue)' : 'var(--text-secondary)',
              background: active ? 'var(--blue-light)' : 'transparent',
              borderLeft: `2px solid ${active ? 'var(--blue)' : 'transparent'}`,
            }}>
              <Icon />{n.label}
            </button>
          );
        })}
      </nav>

      <div style={{ padding: '14px 16px', borderTop: '0.5px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#B5D4F4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 500, color: '#0C447C' }}>
            {profile?.name?.[0] || '?'}
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 500 }}>{profile?.name || '-'}</div>
            <div style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>{profile?.dept || '-'}</div>
          </div>
        </div>
        <button onClick={logout} style={{ fontSize: 11, color: 'var(--text-tertiary)', width: '100%', textAlign: 'left', padding: '4px 0' }}>
          로그아웃
        </button>
      </div>
    </aside>
  );
}
