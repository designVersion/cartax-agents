import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import { writeLog } from '../../firebase/firestore';
import { Card } from '../../components/Common';

export default function DeptAdmin() {
  const { userProfile } = useAuth();
  const [depts, setDepts] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [editId, setEditId] = useState(null);
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => { loadDepts(); }, []);

  async function loadDepts() {
    const snap = await getDocs(collection(db, 'departments'));
    setDepts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  }

  async function create() {
    if (!name.trim()) return;
    await addDoc(collection(db, 'departments'), {
      name: name.trim(), status: 'active', createdAt: serverTimestamp(),
    });
    await writeLog(userProfile.id, 'CREATE_DEPT', name);
    setName(''); setShowCreate(false);
    loadDepts();
    setMsg('부서가 생성되었습니다.');
  }

  async function save(id) {
    await updateDoc(doc(db, 'departments', id), { name: name.trim(), updatedAt: serverTimestamp() });
    await writeLog(userProfile.id, 'UPDATE_DEPT', name);
    setEditId(null); setName('');
    loadDepts();
    setMsg('부서가 수정되었습니다.');
  }

  async function toggleStatus(d) {
    const next = d.status === 'active' ? 'inactive' : 'active';
    await updateDoc(doc(db, 'departments', d.id), { status: next });
    await writeLog(userProfile.id, 'TOGGLE_DEPT', d.name, next);
    loadDepts();
  }

  const inputStyle = {
    padding: '7px 11px', fontSize: 13, border: '0.5px solid rgba(0,0,0,0.14)',
    borderRadius: 7, outline: 'none', background: 'white', color: '#111',
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 500 }}>부서 관리</div>
        <button onClick={() => { setShowCreate(true); setName(''); }} style={{
          fontSize: 12, padding: '6px 14px', background: '#185FA5',
          color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer',
        }}>+ 부서 추가</button>
      </div>

      {msg && (
        <div style={{ fontSize: 12, padding: '8px 14px', borderRadius: 8, marginBottom: 16, background: '#EAF3DE', color: '#0F6E56', border: '0.5px solid #C0DD97' }}>{msg}</div>
      )}

      {showCreate && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, alignItems: 'center' }}>
          <input style={{ ...inputStyle, flex: 1 }} placeholder="부서명 입력" value={name} onChange={e => setName(e.target.value)} />
          <button onClick={create} style={{ fontSize: 12, padding: '7px 14px', background: '#185FA5', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}>추가</button>
          <button onClick={() => setShowCreate(false)} style={{ fontSize: 12, padding: '7px 14px', border: '0.5px solid rgba(0,0,0,0.14)', borderRadius: 8, color: '#555' }}>취소</button>
        </div>
      )}

      <Card>
        {depts.length === 0 && (
          <div style={{ textAlign: 'center', padding: 32, fontSize: 13, color: '#999' }}>부서가 없습니다.</div>
        )}
        {depts.map((d, i) => (
          <div key={d.id} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '11px 0',
            borderBottom: i < depts.length - 1 ? '0.5px solid rgba(0,0,0,0.06)' : 'none',
          }}>
            {editId === d.id ? (
              <div style={{ display: 'flex', gap: 8, flex: 1, alignItems: 'center' }}>
                <input style={{ ...inputStyle, flex: 1 }} value={name} onChange={e => setName(e.target.value)} />
                <button onClick={() => save(d.id)} style={{ fontSize: 12, padding: '5px 12px', background: '#185FA5', color: 'white', border: 'none', borderRadius: 7, cursor: 'pointer' }}>저장</button>
                <button onClick={() => setEditId(null)} style={{ fontSize: 12, padding: '5px 12px', border: '0.5px solid rgba(0,0,0,0.14)', borderRadius: 7, color: '#555' }}>취소</button>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: d.status === 'active' ? '#1D9E75' : '#ccc',
                  }} />
                  <span style={{ fontSize: 13 }}>{d.name}</span>
                  <span style={{ fontSize: 11, color: d.status === 'active' ? '#0F6E56' : '#aaa' }}>
                    {d.status === 'active' ? '활성' : '비활성'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => { setEditId(d.id); setName(d.name); }} style={{ fontSize: 11, padding: '3px 8px', border: '0.5px solid rgba(0,0,0,0.14)', borderRadius: 6, color: '#555' }}>수정</button>
                  <button onClick={() => toggleStatus(d)} style={{
                    fontSize: 11, padding: '3px 8px', borderRadius: 6, cursor: 'pointer',
                    border: `0.5px solid ${d.status === 'active' ? 'rgba(0,0,0,0.14)' : '#185FA5'}`,
                    color: d.status === 'active' ? '#555' : '#185FA5', background: 'transparent',
                  }}>{d.status === 'active' ? '비활성화' : '활성화'}</button>
                </div>
              </>
            )}
          </div>
        ))}
      </Card>
    </div>
  );
}
