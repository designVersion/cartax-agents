import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../firebase/config';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { writeLog } from '../firebase/firestore';
import { Card } from '../components/Common';

const ROLES = { 1: '뷰어', 2: '사용자', 3: '편집자', 4: '최고관리자' };
const ROLE_COLORS = { 1: '#888', 2: '#0F6E56', 3: '#854F0B', 4: '#185FA5' };

export default function MyAccount() {
  const { userProfile } = useAuth();
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleChange(e) {
    e.preventDefault();
    setError(''); setSuccess('');
    if (newPw.length < 8) { setError('비밀번호는 8자 이상이어야 합니다.'); return; }
    if (newPw !== confirmPw) { setError('새 비밀번호가 일치하지 않습니다.'); return; }
    setSaving(true);
    try {
      const cred = EmailAuthProvider.credential(auth.currentUser.email, currentPw);
      await reauthenticateWithCredential(auth.currentUser, cred);
      await updatePassword(auth.currentUser, newPw);
      await writeLog(userProfile.id, 'CHANGE_PASSWORD', userProfile.email, '본인 변경');
      setSuccess('비밀번호가 변경되었습니다.');
      setCurrentPw(''); setNewPw(''); setConfirmPw('');
    } catch (e) {
      if (e.code === 'auth/wrong-password') setError('현재 비밀번호가 올바르지 않습니다.');
      else setError('비밀번호 변경 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  }

  const inputStyle = {
    width: '100%', padding: '8px 12px', fontSize: 13,
    border: '0.5px solid rgba(0,0,0,0.14)', borderRadius: 8,
    outline: 'none', background: 'white', color: '#111', fontFamily: 'inherit',
  };

  return (
    <div style={{ maxWidth: 560 }}>
      <Card style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 16 }}>내 정보</div>
        {[
          ['아이디', userProfile?.username],
          ['이름', userProfile?.name],
          ['이메일', userProfile?.email],
          ['부서', userProfile?.dept],
          ['권한', ROLES[userProfile?.role]],
        ].map(([k, v]) => (
          <div key={k} style={{
            display: 'flex', justifyContent: 'space-between',
            padding: '8px 0', borderBottom: '0.5px solid rgba(0,0,0,0.06)',
            fontSize: 12,
          }}>
            <span style={{ color: '#999' }}>{k}</span>
            <span style={{
              fontWeight: k === '권한' ? 500 : 400,
              color: k === '권한' ? ROLE_COLORS[userProfile?.role] : '#111',
            }}>{v || '-'}</span>
          </div>
        ))}
      </Card>

      <Card>
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 16 }}>비밀번호 변경</div>
        <form onSubmit={handleChange}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, color: '#555', display: 'block', marginBottom: 6 }}>현재 비밀번호</label>
            <input type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)} required style={inputStyle} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, color: '#555', display: 'block', marginBottom: 6 }}>새 비밀번호 (8자 이상)</label>
            <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} required style={inputStyle} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, color: '#555', display: 'block', marginBottom: 6 }}>새 비밀번호 확인</label>
            <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} required style={inputStyle} />
          </div>
          {error && <div style={{ fontSize: 12, color: '#A32D2D', background: '#FCEBEB', padding: '8px 12px', borderRadius: 8, marginBottom: 12 }}>{error}</div>}
          {success && <div style={{ fontSize: 12, color: '#0F6E56', background: '#EAF3DE', padding: '8px 12px', borderRadius: 8, marginBottom: 12 }}>{success}</div>}
          <button type="submit" disabled={saving} style={{
            padding: '8px 20px', fontSize: 13, fontWeight: 500,
            background: saving ? '#aaa' : '#185FA5', color: 'white',
            border: 'none', borderRadius: 8, cursor: 'pointer',
          }}>{saving ? '변경 중...' : '변경하기'}</button>
        </form>
      </Card>
    </div>
  );
}
