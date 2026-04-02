import React, { createContext, useContext, useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc, serverTimestamp, collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const snap = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (snap.exists()) {
          const data = snap.data();
          if (data.status === 'locked') {
            await signOut(auth);
            setUser(null);
            setProfile(null);
          } else if (data.status === 'inactive') {
            await signOut(auth);
            setUser(null);
            setProfile(null);
          } else {
            setUser(firebaseUser);
            setProfile(data);
            await updateDoc(doc(db, 'users', firebaseUser.uid), {
              lastLogin: serverTimestamp(),
              loginFailCount: 0,
            });
          }
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  async function login(email, password) {
    const snap = await getDocs(collection(db, 'users'));
    const userDoc = snap.docs.find(d => d.data().email === email);

    if (!userDoc) throw new Error('존재하지 않는 계정입니다.');

    const data = userDoc.data();
    if (data.status === 'locked') throw new Error('잠긴 계정입니다. 관리자에게 문의하세요.');
    if (data.status === 'inactive') throw new Error('비활성화된 계정입니다.');

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      const newCount = (data.loginFailCount || 0) + 1;
      if (newCount >= 5) {
        await updateDoc(doc(db, 'users', userDoc.id), { status: 'locked', loginFailCount: newCount });
        throw new Error('비밀번호 5회 오류로 계정이 잠겼습니다. 관리자에게 문의하세요.');
      } else {
        await updateDoc(doc(db, 'users', userDoc.id), { loginFailCount: newCount });
        throw new Error(`비밀번호가 틀렸습니다. (${newCount}/5회)`);
      }
    }
  }

  async function logout() {
    await signOut(auth);
  }

  const value = { user, profile, loading, login, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
