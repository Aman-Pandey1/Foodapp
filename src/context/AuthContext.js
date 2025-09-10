import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { observeAuthState, loginWithEmail, registerWithEmail, logout as authLogout, getUserProfile, updateProfile as updateAuthProfile } from '../services/auth';

const AuthContext = createContext({
  user: null,
  profile: null,
  role: null,
  loading: true,
  login: async (_e, _p) => {},
  register: async (_p) => {},
  logout: async () => {},
  refreshProfile: async () => {},
  updateProfile: async (_p) => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = observeAuthState(async (u) => {
      setUser(u);
      if (u?.uid) {
        const p = await getUserProfile(u.uid);
        setProfile(p);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user?.uid) return null;
    const p = await getUserProfile(user.uid);
    setProfile(p);
    return p;
  }, [user?.uid]);

  const login = useCallback(async (email, password) => {
    const u = await loginWithEmail({ email, password });
    setUser(u);
    await refreshProfile();
    return u;
  }, [refreshProfile]);

  const register = useCallback(async ({ email, password, displayName, role }) => {
    const u = await registerWithEmail({ email, password, displayName, role });
    setUser(u);
    await refreshProfile();
    return u;
  }, [refreshProfile]);

  const updateProfile = useCallback(async (updates) => {
    await updateAuthProfile(updates);
    await refreshProfile();
  }, [refreshProfile]);

  const logout = useCallback(async () => {
    await authLogout();
    setUser(null);
    setProfile(null);
  }, []);

  const value = useMemo(() => ({
    user,
    profile,
    role: profile?.role || null,
    loading,
    login,
    register,
    logout,
    refreshProfile,
    updateProfile,
  }), [user, profile, loading, login, register, logout, refreshProfile, updateProfile]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

