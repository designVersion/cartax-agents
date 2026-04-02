import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { db, auth } from '../../firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import { writeLog } from '../../firebase/firestore';
import { Card } from '../../components/Common';

export function IPAdmin() {
  const { userProfile } = useAuth();
  const [ips, setIps] = useState([]);
  const [newIp, setNewIp] = useState('');
  const [memo, setMemo] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => { loadIPs(); }, []);

  async function loadIPs() {
    const snap = await getDocs(collection(db, 'allowedIPs'));
    setIps(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  }

  async function addIP() {
    if (!newIp.trim()) return;
    await addDoc(collection(db, 'allowedIPs'), {
      ip: newIp.trim(), memo: memo.trim(), createdAt: serverTimestamp(),
    });
    await writeLog(userProfile.id, 'ADD_IP', newIp);
    setNewIp(''); setMemo('');
    loadIPs();
    setMsg('IP가 추가되었습니다.');
  }

  async function removeIP(ip) {
    await deleteDoc(doc(db, 'allowedIPs', ip.id));
    await writeLog(userProfile.id, 'REMOVE_IP', ip.ip);
    loadIPs();
    setMsg('IP가 삭제되었습니다.');
  }

  const inputStyle = {
    padding: '7px 11px', fontSize: 13,
    border: '0.5px solid rgba(0,0,0,0.14)', borderRadius: 7,
    outline: 'none', background: 'white', color: '#111',
  };

  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 16 }}>허용 IP 관리</div>

      <div style={{ fontSize: 12, color: '#854F0B', background: '#FAEEDA', border: '0.5px solid #FAC775', borderRadius: 8, padding: '8px 12px', marginBottom: 16 }}>
        허용 IP가 없으면 모든 IP에서 접속 가능합니다. IP를 추가하면 해당 IP에서만 접속 가능합니다.
      </div>

      {msg && <div style={{ fontSize: 12, padding: '8px 14px', borderRadius: 8, marginBottom: 16, background: '#EAF3DE', color: '#0F6E56' }}>{msg}</div>}

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input style={{ ...inputStyle, width: 160 }} placeholder="IP 주소" value={newIp} onChange={e => setNewIp(e.target.value)} />
        <input style={{ ...inputStyle, flex: 1 }} placeholder="메모 (선택)" value={memo} onChange={e => setMemo(e.target.value)} />
        <button onClick={addIP} style={{ fontSize: 12, padding: '7px 14px', background: '#185FA5', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}>추가</button>
      </div>

      <Card>
        {ips.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 32, fontSize: 13, color: '#999' }}>허용 IP 없음 (전체 허용 상태)</div>
        ) : ips.map((ip, i) => (
          <div key={ip.id} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 0', borderBottom: i < ips.length - 1 ? '0.5px solid rgba(0,0,0,0.06)' : 'none',
          }}>
            <div>
              <div style={{ fontSize: 13, fontFamily: 'monospace' }}>{ip.ip}</div>
              {ip.memo && <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>{ip.memo}</div>}
            </div>
            <button onClick={() => removeIP(ip)} style={{ fontSize: 11, padding: '3px 8px', border: '0.5px solid #F09595', borderRadius: 6, color: '#A32D2D', background: 'transparent', cursor: 'pointer' }}>삭제</button>
          </div>
        ))}
      </Card>
    </div>
  );
}

export function ChangePassword() {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    setMsg(''); setError('');
    if (next !== confirm) { setError('새 비밀번호가 일치하지 않습니다.'); return; }
    if (next.length < 8) { setError('비밀번호는 8자 이상이어야 합니다.'); return; }
    try {
      const user = auth.currentUser;
      const cred = EmailAuthProvider.credential(user.email, current);
      await reauthenticateWithCredential(user, cred);
      await updatePassword(user, next);
      setCurrent(''); setNext(''); setConfirm('');
      setMsg('비밀번호가 변경되었습니다.');
    } catch (e) {
      setError(e.code === 'auth/wrong-password' ? '현재 비밀번호가 올바르지 않습니다.' : '오류가 발생했습니다.');
    }
  }

  const inputStyle = {
    width: '100%', padding: '8px 12px', fontSize: 13,
    border: '0.5px solid rgba(0,0,0,0.14)', borderRadius: 8,
    outline: 'none', background: 'white', color: '#111',
  };

  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 20 }}>비밀번호 변경</div>
      <Card style={{ maxWidth: 400 }}>
        <form onSubmit={submit}>
          {[
            ['현재 비밀번호', current, setCurrent],
            ['새 비밀번호', next, setNext],
            ['새 비밀번호 확인', confirm, setConfirm],
          ].map(([label, val, set]) => (
            <div key={label} style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, color: '#555', display: 'block', marginBottom: 5 }}>{label}</label>
              <input style={inputStyle} type="password" value={val} onChange={e => set(e.target.value)} required />
            </div>
          ))}
          {error && <div style={{ fontSize: 12, color: '#A32D2D', background: '#FCEBEB', borderRadius: 8, padding: '8px 12px', marginBottom: 12 }}>{error}</div>}
          {msg && <div style={{ fontSize: 12, color: '#0F6E56', background: '#EAF3DE', borderRadius: 8, padding: '8px 12px', marginBottom: 12 }}>{msg}</div>}
          <button type="submit" style={{ width: '100%', padding: '9px', fontSize: 13, fontWeight: 500, background: '#185FA5', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}>변경하기</button>
        </form>
      </Card>
    </div>
  );
}
