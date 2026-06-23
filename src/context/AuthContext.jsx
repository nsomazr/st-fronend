import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { adminApi } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem('access_token')
  );
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (username, password) => {
    setLoading(true);
    try {
      const { data } = await adminApi.login(username, password);
      if (!data?.access) {
        throw new Error('Login response missing access token');
      }
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      setIsAuthenticated(true);
      return data;
    } catch (err) {
      setIsAuthenticated(false);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsAuthenticated(false);
  }, []);

  const value = useMemo(
    () => ({ isAuthenticated, loading, login, logout }),
    [isAuthenticated, loading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
