import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../firebase';
import { Card, RoleBadge, Btn, Input, Select } from '../components/Common';

function AccountTab() {
  const [users, setUsers] = useState([]);
  const [depts, setDepts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', dept: '', role: 1 });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  async function load() {
    const [uSnap, dSnap] = await Promise.all([getDocs(collection(db, 'users')), getDocs(collection(db, 'departments'))]);
    setUsers(uSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    setDepts(dSnap.docs.map(d => ({ id: d.id, ...d.data() })).filter(d => d.status === 'active'));
  }
  useEffect(() => { load(); }, []);

  async function createAccount() {
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await addDoc(collection(db, 'users'), {
        uid: cred.user.uid, name: form.name, email: form.email,
        dept: form.dept, role: Number(form.role), status: 'active',
        loginFailCount: 0, createdAt: serverTimestamp(),
      });
      setMsg('계정이 생성됐습니다.');
      setShowForm(false);
      setForm({ name: '', email: '', password: '', dept: '', role: 1 });
      load();
    } catch (e) { setMsg('오류: ' + e.message); }
    finally { setLoading(false); }
  }

  async function toggleStatus(user) {
    const next = user.status === 'active' ? 'inactive' : 'active';
    await updateDoc(doc(db, 'users', user.id), { status: next });
    load();
  }

  async function unlock(user) {
    await updateDoc(doc(db, 'users', user.id), { status: 'active', loginFailCount: 0 });
    load();
  }

  async function changePassword(user) {
    const pw = prompt(`${user.name}의 새 비밀번호:`);
    if (!pw) return;
    setMsg('비밀번호 변경은 Firebase Console에서 직접 변경하거나 이메일 재설정 링크를 사용하세요.');
  }

  const statusColor = { active: 'var(--green)', inactive: '#888', locked: 'var(--red)' };
  const statusLabel = { active: '활성', inactive: '비활성', locked: '잠금' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 500 }}>계정 관리</div>
        <Btn variant="primary" onClick={() => setShowForm(s => !s)}>+ 계정 생성</Btn>
      </div>

      {msg && <div style={{ fontSize: 12, padding: '8px 12px', background: '#f0f0ee', borderRadius: 8, marginBottom: 12 }}>{msg}</div>}

      {showForm && (
        <Card style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 14 }}>새 계정 생성</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Input label="이름" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            <Input label="이메일" type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            <Input label="비밀번호" type="password" required value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
            <Select label="부서" required value={form.dept} onChange={e => setForm(f => ({ ...f, dept: e.target.value }))}>
              <option value="">선택</option>
              {depts.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
            </Select>
            <Select label="권한" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
              <option value={1}>뷰어</option>
              <option value={2}>사용자</option>
              <option value={3}>편집자</option>
              <option value={4}>최고관리자</option>
            </Select>
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
            <Btn onClick={() => setShowForm(false)}>취소</Btn>
            <Btn variant="primary" onClick={createAccount} disabled={loading}>{loading ? '생성 중...' : '생성'}</Btn>
          </div>
        </Card>
      )}

      <Card>
        {users.map((u, i) => (
          <div key={u.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < users.length - 1 ? '0.5px solid var(--border)' : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#B5D4F4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 500, color: '#0C447C' }}>{u.name?.[0]}</div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{u.name}</span>
                  <RoleBadge role={u.role} />
                  <span style={{ fontSize: 10, color: statusColor[u.status] }}>● {statusLabel[u.status]}</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{u.email} · {u.dept}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {u.status === 'locked' && <Btn onClick={() => unlock(u)} style={{ fontSize: 11, padding: '4px 8px' }}>잠금 해제</Btn>}
              <Btn onClick={() => changePassword(u)} style={{ fontSize: 11, padding: '4px 8px' }}>비번 변경</Btn>
              <Btn onClick={() => toggleStatus(u)} style={{ fontSize: 11, padding: '4px 8px', color: u.status === 'active' ? 'var(--amber)' : 'var(--green)' }}>
                {u.status === 'active' ? '비활성화' : '활성화'}
              </Btn>
            </div>
          </div>
        ))}
        {users.length === 0 && <div style={{ fontSize: 12, color: 'var(--text-tertiary)', textAlign: 'center', padding: 20 }}>계정이 없습니다</div>}
      </Card>
    </div>
  );
}

function DeptTab() {
  const [depts, setDepts] = useState([]);
  const [name, setName] = useState('');

  async function load() {
    const snap = await getDocs(collection(db, 'departments'));
    setDepts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  }
  useEffect(() => { load(); }, []);

  async function addDept() {
    if (!name.trim()) return;
    await addDoc(collection(db, 'departments'), { name, status: 'active', createdAt: serverTimestamp() });
    setName('');
    load();
  }

  async function toggle(dept) {
    await updateDoc(doc(db, 'departments', dept.id), { status: dept.status === 'active' ? 'inactive' : 'active' });
    load();
  }

  async function rename(dept) {
    const newName = prompt('새 부서명:', dept.name);
    if (!newName || newName === dept.name) return;
    await updateDoc(doc(db, 'departments', dept.id), { name: newName });
    load();
  }

  async function deleteDept(dept) {
    if (!window.confirm(`"${dept.name}" 부서를 삭제할까요?`)) return;
    await deleteDoc(doc(db, 'departments', dept.id));
    load();
  }

  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 16 }}>부서 관리</div>
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="새 부서명" onKeyDown={e => e.key === 'Enter' && addDept()}
            style={{ flex: 1, padding: '8px 12px', fontSize: 13, border: '0.5px solid var(--border-md)', borderRadius: 'var(--radius-md)', outline: 'none' }} />
          <Btn variant="primary" onClick={addDept}>추가</Btn>
        </div>
      </Card>
      <Card>
        {depts.map((d, i) => (
          <div key={d.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < depts.length - 1 ? '0.5px solid var(--border)' : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 13 }}>{d.name}</span>
              <span style={{ fontSize: 10, color: d.status === 'active' ? 'var(--green)' : '#888' }}>● {d.status === 'active' ? '활성' : '비활성'}</span>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <Btn onClick={() => rename(d)} style={{ fontSize: 11, padding: '4px 8px' }}>수정</Btn>
              <Btn onClick={() => toggle(d)} style={{ fontSize: 11, padding: '4px 8px', color: d.status === 'active' ? 'var(--amber)' : 'var(--green)' }}>{d.status === 'active' ? '비활성화' : '활성화'}</Btn>
              <Btn variant="danger" onClick={() => deleteDept(d)} style={{ fontSize: 11, padding: '4px 8px' }}>삭제</Btn>
            </div>
          </div>
        ))}
        {depts.length === 0 && <div style={{ fontSize: 12, color: 'var(--text-tertiary)', textAlign: 'center', padding: 20 }}>부서가 없습니다</div>}
      </Card>
    </div>
  );
}

function IPTab() {
  const [ips, setIPs] = useState([]);
  const [ip, setIp] = useState('');
  const [memo, setMemo] = useState('');

  async function load() {
    const snap = await getDocs(collection(db, 'allowedIPs'));
    setIPs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  }
  useEffect(() => { load(); }, []);

  async function addIP() {
    if (!ip.trim()) return;
    await addDoc(collection(db, 'allowedIPs'), { ip, memo, createdAt: serverTimestamp() });
    setIp(''); setMemo('');
    load();
  }

  async function deleteIP(item) {
    await deleteDoc(doc(db, 'allowedIPs', item.id));
    load();
  }

  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 8 }}>허용 IP 관리</div>
      <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 16, padding: '8px 12px', background: '#f0f0ee', borderRadius: 8 }}>
        IP가 없으면 모든 접속을 허용합니다. IP를 추가하면 해당 IP만 접속 가능해요.
      </div>
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <input value={ip} onChange={e => setIp(e.target.value)} placeholder="IP 주소 (예: 123.456.789.0)"
            style={{ flex: 1, padding: '8px 12px', fontSize: 13, border: '0.5px solid var(--border-md)', borderRadius: 'var(--radius-md)', outline: 'none' }} />
          <input value={memo} onChange={e => setMemo(e.target.value)} placeholder="메모 (선택)"
            style={{ flex: 1, padding: '8px 12px', fontSize: 13, border: '0.5px solid var(--border-md)', borderRadius: 'var(--radius-md)', outline: 'none' }} />
          <Btn variant="primary" onClick={addIP}>추가</Btn>
        </div>
      </Card>
      <Card>
        {ips.map((item, i) => (
          <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < ips.length - 1 ? '0.5px solid var(--border)' : 'none' }}>
            <div>
              <div style={{ fontSize: 13, fontFamily: 'monospace' }}>{item.ip}</div>
              {item.memo && <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{item.memo}</div>}
            </div>
            <Btn variant="danger" onClick={() => deleteIP(item)} style={{ fontSize: 11, padding: '4px 8px' }}>삭제</Btn>
          </div>
        ))}
        {ips.length === 0 && <div style={{ fontSize: 12, color: 'var(--text-tertiary)', textAlign: 'center', padding: 20 }}>등록된 IP가 없습니다 (모든 접속 허용)</div>}
      </Card>
    </div>
  );
}

const TABS = [{ id: 'accounts', label: '계정 관리' }, { id: 'depts', label: '부서 관리' }, { id: 'ips', label: 'IP 관리' }];

export default function Admin() {
  const [tab, setTab] = useState('accounts');
  return (
    <div>
      <div style={{ display: 'flex', borderBottom: '0.5px solid var(--border)', marginBottom: 24 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: '8px 16px', fontSize: 13, color: tab === t.id ? 'var(--blue)' : 'var(--text-secondary)', borderBottom: `2px solid ${tab === t.id ? 'var(--blue)' : 'transparent'}`, marginBottom: -1, fontWeight: tab === t.id ? 500 : 400 }}>
            {t.label}
          </button>
        ))}
      </div>
      {tab === 'accounts' && <AccountTab />}
      {tab === 'depts' && <DeptTab />}
      {tab === 'ips' && <IPTab />}
    </div>
  );
}
