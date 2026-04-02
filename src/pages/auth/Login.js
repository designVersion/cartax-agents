import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const errorMessages = {
    IP_NOT_ALLOWED: '허용되지 않은 IP에서의 접근입니다.',
    ACCOUNT_LOCKED: '비밀번호 5회 오류로 계정이 잠겼습니다. 관리자에게 문의하세요.',
    ACCOUNT_INACTIVE: '비활성화된 계정입니다. 관리자에게 문의하세요.',
    USER_NOT_FOUND: '등록되지 않은 계정입니다.',
    'auth/invalid-credential': '이메일 또는 비밀번호가 올바르지 않습니다.',
    'auth/too-many-requests': '로그인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요.',
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      const msg = errorMessages[err.message] || errorMessages[err.code] || '로그인 중 오류가 발생했습니다.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#f7f7f5',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: 'white', borderRadius: 14,
        border: '0.5px solid rgba(0,0,0,0.08)',
        padding: '40px 36px', width: 380,
      }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 4 }}>Cartax Agents</div>
          <div style={{ fontSize: 13, color: '#999' }}>에이전트 관리 플랫폼</div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, color: '#555', display: 'block', marginBottom: 6 }}>이메일</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              required placeholder="이메일 입력"
              style={{
                width: '100%', padding: '9px 12px', fontSize: 13,
                border: '0.5px solid rgba(0,0,0,0.14)', borderRadius: 8,
                outline: 'none', background: 'white', color: '#111',
              }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, color: '#555', display: 'block', marginBottom: 6 }}>비밀번호</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              required placeholder="비밀번호 입력"
              style={{
                width: '100%', padding: '9px 12px', fontSize: 13,
                border: '0.5px solid rgba(0,0,0,0.14)', borderRadius: 8,
                outline: 'none', background: 'white', color: '#111',
              }}
            />
          </div>

          {error && (
            <div style={{
              fontSize: 12, color: '#A32D2D', background: '#FCEBEB',
              border: '0.5px solid #F09595', borderRadius: 8,
              padding: '8px 12px', marginBottom: 16,
            }}>{error}</div>
          )}

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '10px', fontSize: 13, fontWeight: 500,
            background: loading ? '#aaa' : '#185FA5', color: 'white',
            border: 'none', borderRadius: 8, cursor: loading ? 'not-allowed' : 'pointer',
          }}>
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <div style={{ marginTop: 20, fontSize: 11, color: '#bbb', textAlign: 'center' }}>
          계정 문의는 관리자에게 연락해주세요
        </div>
      </div>
    </div>
  );
}
