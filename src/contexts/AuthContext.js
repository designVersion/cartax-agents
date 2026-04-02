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
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 5000);

    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      clearTimeout(timeout);
      try {
        if (firebaseUser) {
          const snap = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (snap.exists()) {
            const data = snap.data();
            if (data.status === 'locked' || data.status === 'inactive') {
              await signOut(auth);
              setUser(null);
              setProfile(null);
            } else {
              setUser(firebaseUser);
              setProfile(data);
              try {
                await updateDoc(doc(db, 'users', firebaseUser.uid), {
                  lastLogin: serverTimestamp(),
                  loginFailCount: 0,
                });
              } catch {}
            }
          } else {
            setUser(null);
            setProfile(null);
          }
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch {
        setUser(null);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    });
    return () => { clearTimeout(timeout); unsub(); };
  }, []);

  async function login(email, password) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-email') {
        throw new Error('존재하지 않는 계정입니다.');
      }
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        try {
          const snap = await getDocs(collection(db, 'users'));
          const userDoc = snap.docs.find(d => d.data().email === email);
          if (userDoc) {
            const data = userDoc.data();
            if (data.status === 'locked') throw new Error('잠긴 계정입니다. 관리자에게 문의하세요.');
            const newCount = (data.loginFailCount || 0) + 1;
            if (newCount >= 5) {
              await updateDoc(doc(db, 'users', userDoc.id), { status: 'locked', loginFailCount: newCount });
              throw new Error('비밀번호 5회 오류로 계정이 잠겼습니다. 관리자에게 문의하세요.');
            }
            await updateDoc(doc(db, 'users', userDoc.id), { loginFailCount: newCount });
            throw new Error(`비밀번호가 틀렸습니다. (${newCount}/5회)`);
          }
        } catch (innerErr) {
          if (innerErr.message.includes('비밀번호') || innerErr.message.includes('잠긴')) {
            throw innerErr;
          }
        }
        throw new Error('비밀번호가 틀렸습니다.');
      }
      if (err.code === 'auth/too-many-requests') {
        throw new Error('로그인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요.');
      }
      throw new Error('로그인 중 오류가 발생했습니다.');
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
