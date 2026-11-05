import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore the demo session on first load
  useEffect(() => {
    authService.getSession().then(({ data }) => { setUser(data); setLoading(false); });
  }, []);

  // Each action returns { error } so pages can show a message
  const run = useCallback(async (fn) => {
    const res = await fn();
    if (res.data) setUser(res.data);
    return res;
  }, []);

  const value = useMemo(() => ({
    user, loading,
    isAuthenticated: !!user,
    login: (c) => run(() => authService.login(c)),
    loginAsDemo: (role) => run(() => authService.loginAsDemo(role)),
    register: (d) => run(() => authService.register(d)),
    logout: async () => { await authService.logout(); setUser(null); },
  }), [user, loading, run]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
