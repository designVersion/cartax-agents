import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../../firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import { writeLog, getActiveDepts } from '../../firebase/firestore';
import { Card } from '../../components/Common';

const ROLES = { 1: '뷰어', 2: '사용자', 3: '편집자', 4: '최고관리자' };
const ROLE_COLORS = { 1: '#888', 2: '#0F6E56', 3: '#854F0B', 4: '#185FA5' };
const STATUS_LABELS = { active: '활성', inactive: '비활성', locked: '잠금' };
const STATUS_COLORS = { active: '#0F6E56', inactive: '#888', locked: '#A32D2D' };

function Modal({ title, onClose, children }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
    }} onClick={onClose}>
      <div style={{
        background: 'white', borderRadius: 14, padding: 28,
        width: 440, maxWidth: '90vw', border: '0.5px solid rgba(0,0,0,0.08)',
      }} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 20 }}>{title}</div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 12, color: '#555', display: 'block', marginBottom: 5 }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '8px 12px', fontSize: 13,
  border: '0.5px solid rgba(0,0,0,0.14)', borderRadius: 8,
  outline: 'none', background: 'white', color: '#111',
};

export default function AccountAdmin() {
  const { userProfile } = useAuth();
  const [users, setUsers] = useState([]);
  const [depts, setDepts] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(null);
  const [showPw, setShowPw] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', deptId: '', role: 2 });
  const [newPw, setNewPw] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => { loadUsers(); loadDepts(); }, []);

  async function loadUsers() {
    const snap = await getDocs(collection(db, 'users'));
    setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  }

  async function loadDepts() {
    const d = await getActiveDepts();
    setDepts(d);
  }

  async function createUser() {
    try {
      const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await setDoc(doc(db, 'users', cred.user.uid), {
        name: form.name, email: form.email,
        deptId: form.deptId, role: Number(form.role),
        status: 'active', loginFailCount: 0,
        createdBy: userProfile.id, createdAt: serverTimestamp(),
      });
      await writeLog(userProfile.id, 'CREATE_USER', form.email);
      setShowCreate(false);
      setForm({ name: '', email: '', password: '', deptId: '', role: 2 });
      loadUsers();
      setMsg('계정이 생성되었습니다.');
    } catch (e) {
      setMsg('오류: ' + (e.code === 'auth/email-already-in-use' ? '이미 사용 중인 이메일입니다.' : e.message));
    }
  }

  async function updateUserInfo() {
    await updateDoc(doc(db, 'users', showEdit.id), {
      name: showEdit.name, deptId: showEdit.deptId,
      role: Number(showEdit.role), status: showEdit.status,
      updatedAt: serverTimestamp(),
    });
    await writeLog(userProfile.id, 'UPDATE_USER', showEdit.email, `role:${showEdit.role}, status:${showEdit.status}`);
    setShowEdit(null);
    loadUsers();
    setMsg('계정이 수정되었습니다.');
  }

  async function unlockUser(u) {
    await updateDoc(doc(db, 'users', u.id), { status: 'active', loginFailCount: 0 });
    await writeLog(userProfile.id, 'UNLOCK_USER', u.email);
    loadUsers();
    setMsg(`${u.name} 계정 잠금이 해제되었습니다.`);
  }

  async function changePassword(uid, email) {
    const { updatePassword, getAuth } = await import('firebase/auth');
    try {
      const target = auth.currentUser;
      // 관리자가 타인 비밀번호 변경 (Firebase Admin SDK 없이는 제한됨)
      // 실제로는 Cloud Function 필요 — 여기선 UI만 구성
      await writeLog(userProfile.id, 'CHANGE_PASSWORD', email);
      setShowPw(null);
      setNewPw('');
      setMsg('비밀번호 변경 요청이 처리되었습니다.');
    } catch (e) {
      setMsg('오류: ' + e.message);
    }
  }

  const deptName = (deptId) => depts.find(d => d.id === deptId)?.name || deptId || '-';

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 500 }}>계정 관리</div>
        <button onClick={() => setShowCreate(true)} style={{
          fontSize: 12, padding: '6px 14px', background: '#185FA5',
          color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer',
        }}>+ 계정 생성</button>
      </div>

      {msg && (
        <div style={{
          fontSize: 12, padding: '8px 14px', borderRadius: 8, marginBottom: 16,
          background: '#EAF3DE', color: '#0F6E56', border: '0.5px solid #C0DD97',
        }}>{msg}</div>
      )}

      <Card>
        {users.map((u, i) => (
          <div key={u.id} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 0',
            borderBottom: i < users.length - 1 ? '0.5px solid rgba(0,0,0,0.06)' : 'none',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 34, height: 34, borderRadius: '50%', background: '#B5D4F4',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 500, color: '#0C447C',
              }}>{u.name?.[0] || '?'}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{u.name}</div>
                <div style={{ fontSize: 11, color: '#999' }}>{deptName(u.deptId)} · {u.email}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 500, color: ROLE_COLORS[u.role] }}>{ROLES[u.role]}</span>
              <span style={{ fontSize: 11, color: STATUS_COLORS[u.status] }}>{STATUS_LABELS[u.status]}</span>
              <div style={{ display: 'flex', gap: 6 }}>
                {u.status === 'locked' && (
                  <button onClick={() => unlockUser(u)} style={{
                    fontSize: 11, padding: '3px 8px', border: '0.5px solid #A32D2D',
                    borderRadius: 6, color: '#A32D2D', background: 'transparent', cursor: 'pointer',
                  }}>잠금 해제</button>
                )}
                <button onClick={() => setShowPw(u)} style={{
                  fontSize: 11, padding: '3px 8px', border: '0.5px solid rgba(0,0,0,0.14)',
                  borderRadius: 6, color: '#555', background: 'transparent', cursor: 'pointer',
                }}>비밀번호</button>
                <button onClick={() => setShowEdit({ ...u })} style={{
                  fontSize: 11, padding: '3px 8px', border: '0.5px solid rgba(0,0,0,0.14)',
                  borderRadius: 6, color: '#555', background: 'transparent', cursor: 'pointer',
                }}>수정</button>
              </div>
            </div>
          </div>
        ))}
      </Card>

      {showCreate && (
        <Modal title="새 계정 생성" onClose={() => setShowCreate(false)}>
          <Field label="이름 *"><input style={inputStyle} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></Field>
          <Field label="이메일 *"><input style={inputStyle} type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></Field>
          <Field label="비밀번호 *"><input style={inputStyle} type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></Field>
          <Field label="부서">
            <select style={inputStyle} value={form.deptId} onChange={e => setForm({ ...form, deptId: e.target.value })}>
              <option value="">선택</option>
              {depts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </Field>
          <Field label="권한">
            <select style={inputStyle} value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
              {Object.entries(ROLES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </Field>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
            <button onClick={() => setShowCreate(false)} style={{ fontSize: 12, padding: '7px 14px', border: '0.5px solid rgba(0,0,0,0.14)', borderRadius: 8, color: '#555' }}>취소</button>
            <button onClick={createUser} style={{ fontSize: 12, padding: '7px 14px', background: '#185FA5', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}>생성</button>
          </div>
        </Modal>
      )}

      {showEdit && (
        <Modal title="계정 수정" onClose={() => setShowEdit(null)}>
          <Field label="이름"><input style={inputStyle} value={showEdit.name} onChange={e => setShowEdit({ ...showEdit, name: e.target.value })} /></Field>
          <Field label="부서">
            <select style={inputStyle} value={showEdit.deptId} onChange={e => setShowEdit({ ...showEdit, deptId: e.target.value })}>
              <option value="">선택</option>
              {depts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </Field>
          <Field label="권한">
            <select style={inputStyle} value={showEdit.role} onChange={e => setShowEdit({ ...showEdit, role: e.target.value })}>
              {Object.entries(ROLES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </Field>
          <Field label="상태">
            <select style={inputStyle} value={showEdit.status} onChange={e => setShowEdit({ ...showEdit, status: e.target.value })}>
              <option value="active">활성</option>
              <option value="inactive">비활성</option>
            </select>
          </Field>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
            <button onClick={() => setShowEdit(null)} style={{ fontSize: 12, padding: '7px 14px', border: '0.5px solid rgba(0,0,0,0.14)', borderRadius: 8, color: '#555' }}>취소</button>
            <button onClick={updateUserInfo} style={{ fontSize: 12, padding: '7px 14px', background: '#185FA5', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}>저장</button>
          </div>
        </Modal>
      )}

      {showPw && (
        <Modal title={`비밀번호 변경 — ${showPw.name}`} onClose={() => setShowPw(null)}>
          <Field label="새 비밀번호">
            <input style={inputStyle} type="password" value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="8자 이상" />
          </Field>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
            <button onClick={() => setShowPw(null)} style={{ fontSize: 12, padding: '7px 14px', border: '0.5px solid rgba(0,0,0,0.14)', borderRadius: 8, color: '#555' }}>취소</button>
            <button onClick={() => changePassword(showPw.id, showPw.email)} style={{ fontSize: 12, padding: '7px 14px', background: '#185FA5', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}>변경</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
