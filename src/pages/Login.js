import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useIPCheck } from '../hooks/useData';

export default function Login() {
  const { login } = useAuth();
  const { allowed, loading: ipLoading } = useIPCheck();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (ipLoading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>접속 확인 중...</div>
      </div>
    );
  }

  if (!allowed) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 8 }}>접근이 제한된 네트워크입니다</div>
          <div style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>허용된 IP에서만 접속할 수 있습니다. 관리자에게 문의하세요.</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div style={{ width: 360 }}>
        <div style={{ marginBottom: 32, textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 500, marginBottom: 6 }}>Cartax Agents</div>
          <div style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>에이전트 관리 플랫폼</div>
        </div>

        <div style={{ background: 'var(--surface)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 28 }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>이메일</div>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="이메일 입력" required
                style={{ width: '100%', padding: '9px 12px', fontSize: 13, border: '0.5px solid var(--border-md)', borderRadius: 'var(--radius-md)', outline: 'none', background: 'var(--surface)' }}
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>비밀번호</div>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="비밀번호 입력" required
                style={{ width: '100%', padding: '9px 12px', fontSize: 13, border: '0.5px solid var(--border-md)', borderRadius: 'var(--radius-md)', outline: 'none', background: 'var(--surface)' }}
              />
            </div>

            {error && (
              <div style={{ fontSize: 12, color: 'var(--red)', background: 'var(--red-light)', padding: '8px 12px', borderRadius: 'var(--radius-md)', marginBottom: 14 }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '10px', fontSize: 13, fontWeight: 500,
              background: 'var(--blue)', color: 'white', border: 'none',
              borderRadius: 'var(--radius-md)', cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}>
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: 16, fontSize: 11, color: 'var(--text-tertiary)' }}>
          계정 문의는 관리자에게 연락하세요
        </div>
      </div>
    </div>
  );
}
