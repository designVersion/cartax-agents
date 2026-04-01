import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import AgentOffice from './pages/AgentOffice';
import { Usage, Admin } from './pages/UsageAdmin';
import { useAgents } from './hooks/useGitHub';

const PAGE_TITLES = {
  dashboard: '대시보드',
  office: '에이전트 오피스',
  usage: '사용량',
  admin: '페이지 관리',
};

export default function App() {
  const [page, setPage] = useState('dashboard');
  const { agents, loading, error } = useAgents();

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar page={page} setPage={setPage} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <header style={{
          background: 'var(--surface)', borderBottom: '0.5px solid var(--border)',
          padding: '0 28px', height: 52, display: 'flex',
          alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
        }}>
          <span style={{ fontSize: 15, fontWeight: 500 }}>{PAGE_TITLES[page]}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {error && (
              <span style={{ fontSize: 11, color: '#E24B4A', background: '#FCEBEB', padding: '3px 8px', borderRadius: 6 }}>
                GitHub 연결 오류
              </span>
            )}
            <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
              {new Date().toLocaleDateString('ko-KR')}
            </span>
            <div style={{
              width: 30, height: 30, borderRadius: '50%',
              background: '#B5D4F4', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 11, fontWeight: 500, color: '#0C447C',
            }}>유</div>
          </div>
        </header>

        <main style={{ flex: 1, overflow: 'auto', padding: 28 }}>
          {page === 'dashboard' && <Dashboard agents={agents} />}
          {page === 'office'    && <AgentOffice agents={agents} loading={loading} />}
          {page === 'usage'     && <Usage />}
          {page === 'admin'     && <Admin />}
        </main>
      </div>
    </div>
  );
}
