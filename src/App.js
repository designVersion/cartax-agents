import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AgentOffice from './pages/AgentOffice';
import Usage from './pages/Usage';
import Admin from './pages/Admin';
import { useGitHubAgents } from './hooks/useData';
import { Spinner } from './components/Common';

const PAGE_TITLES = {
  dashboard: '대시보드',
  office: '에이전트 오피스',
  usage: '사용량',
  admin: '페이지 관리',
};

function AppInner() {
  const { user, profile, loading } = useAuth();
  const [page, setPage] = useState('dashboard');
  const { agents, loading: agentsLoading } = useGitHubAgents();

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spinner />
      </div>
    );
  }

  if (!user || !profile) {
    return <Login />;
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar page={page} setPage={setPage} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <header style={{ background: 'var(--surface)', borderBottom: '0.5px solid var(--border)', padding: '0 28px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <span style={{ fontSize: 15, fontWeight: 500 }}>{PAGE_TITLES[page]}</span>
          <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
            {new Date().toLocaleDateString('ko-KR')}
          </span>
        </header>
        <main style={{ flex: 1, overflow: 'auto', padding: 28 }}>
          {page === 'dashboard' && <Dashboard agents={agents} />}
          {page === 'office'    && <AgentOffice agents={agents} loading={agentsLoading} />}
          {page === 'usage'     && <Usage />}
          {page === 'admin'     && profile.role >= 4 && <Admin />}
          {page === 'admin'     && profile.role < 4 && <div style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>접근 권한이 없습니다</div>}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
