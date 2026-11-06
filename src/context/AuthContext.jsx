
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import * as authService from '../services/authService';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    authService.getSession().then(({ data }) => {
      if (mounted) {
        setUser(data);
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setUser(null);
        setLoading(false);
        return;
      }

      setTimeout(async () => {
        const { data } = await authService.getSession();
        if (mounted) {
          setUser(data);
          setLoading(false);
        }
      }, 0);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const run = useCallback(async (fn) => {
    const res = await fn();
    if (res.data) setUser(res.data);
    return res;
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    isAuthenticated: !!user,
    login: (credentials) => run(() => authService.login(credentials)),
    loginWithGoogle: authService.loginWithGoogle,
    register: (details) => run(() => authService.register(details)),
    loginAsDemo: (role) => run(() => authService.loginAsDemo(role)),
    logout: async () => {
      await authService.logout();
      setUser(null);
    },
  }), [user, loading, run]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
