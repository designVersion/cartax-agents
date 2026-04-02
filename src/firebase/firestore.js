import { db, auth } from './config';
import {
  doc, setDoc, getDoc, collection,
  query, where, getDocs, updateDoc, addDoc, serverTimestamp
} from 'firebase/firestore';

// 로그 기록
export async function writeLog(userId, action, target = '', detail = '', ip = '') {
  try {
    await addDoc(collection(db, 'logs'), {
      userId, action, target, detail, ip,
      timestamp: serverTimestamp(),
    });
  } catch (e) {
    console.error('로그 기록 실패:', e);
  }
}

// 유저 정보 가져오기
export async function getUser(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// 유저 정보 업데이트
export async function updateUser(uid, data) {
  await updateDoc(doc(db, 'users', uid), { ...data, updatedAt: serverTimestamp() });
}

// 로그인 실패 횟수 증가 + 5회 초과 시 잠금
export async function handleLoginFailure(uid) {
  const user = await getUser(uid);
  if (!user) return;
  const failCount = (user.loginFailCount || 0) + 1;
  const update = { loginFailCount: failCount };
  if (failCount >= 5) update.status = 'locked';
  await updateDoc(doc(db, 'users', uid), update);
}

// 로그인 성공 시 초기화
export async function handleLoginSuccess(uid, ip = '') {
  await updateDoc(doc(db, 'users', uid), {
    loginFailCount: 0,
    lastLogin: serverTimestamp(),
    lastLoginIp: ip,
  });
}

// 부서 목록 가져오기 (활성화된 것만)
export async function getActiveDepts() {
  const q = query(collection(db, 'departments'), where('status', '==', 'active'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// 허용 IP 목록 가져오기
export async function getAllowedIPs() {
  const snap = await getDocs(collection(db, 'allowedIPs'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// IP 허용 여부 체크
export async function checkIPAllowed(ip) {
  const snap = await getDocs(collection(db, 'allowedIPs'));
  if (snap.empty) return true; // 허용 IP 없으면 전체 허용
  return snap.docs.some(d => d.data().ip === ip);
}

// 최초 최고관리자 계정 생성 (초기 세팅용)
export async function createSuperAdmin(uid, data) {
  await setDoc(doc(db, 'users', uid), {
    ...data,
    role: 4,
    status: 'active',
    loginFailCount: 0,
    createdAt: serverTimestamp(),
  });
}
