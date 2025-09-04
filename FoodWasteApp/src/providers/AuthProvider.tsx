import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile, User } from 'firebase/auth';
import { auth, db } from '../services/firebase';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';

type Role = 'supplier' | 'producer';

type UserProfile = {
  uid: string;
  email: string;
  displayName?: string;
  role: Role;
  phone?: string;
  location?: string;
};

type AuthContextValue = {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (params: { email: string; password: string; displayName: string; role: Role }) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const profileDoc = await getDoc(doc(collection(db, 'users'), firebaseUser.uid));
        if (profileDoc.exists()) {
          setUserProfile(profileDoc.data() as UserProfile);
        } else {
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const refreshProfile = async () => {
    if (!user) return;
    const profileDoc = await getDoc(doc(collection(db, 'users'), user.uid));
    if (profileDoc.exists()) setUserProfile(profileDoc.data() as UserProfile);
  };

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async ({ email, password, displayName, role }: { email: string; password: string; displayName: string; role: Role }) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (cred.user) {
      await updateProfile(cred.user, { displayName });
      const profile: UserProfile = {
        uid: cred.user.uid,
        email: cred.user.email || email,
        displayName,
        role,
      };
      await setDoc(doc(collection(db, 'users'), cred.user.uid), profile);
      setUserProfile(profile);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUserProfile(null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({ user, userProfile, loading, login, register, logout, refreshProfile }),
    [user, userProfile, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

