import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import api from '../api/api';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  expiresAt: number | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Token expiration time (30 minutes in milliseconds)
const TOKEN_EXPIRATION_TIME = 30 * 60 * 1000;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);

  const logout = useCallback(() => {
    setToken(null);
    setExpiresAt(null);
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiresAt');
  }, []);

  useEffect(() => {
    // Check for saved token on mount
    const savedToken = localStorage.getItem('token');
    const savedExpiresAt = localStorage.getItem('tokenExpiresAt');
    
    if (savedToken && savedExpiresAt) {
      const expirationTime = parseInt(savedExpiresAt, 10);
      
      // Check if token has already expired
      if (Date.now() < expirationTime) {
        setToken(savedToken);
        setExpiresAt(expirationTime);
      } else {
        // Token expired, clear it
        logout();
      }
    }
    setLoading(false);
  }, [logout]);

  // Auto-logout on token expiration
  useEffect(() => {
    if (!expiresAt) return;

    const timeUntilExpiration = expiresAt - Date.now();
    
    // If token is already expired, logout immediately
    if (timeUntilExpiration <= 0) {
      logout();
      return;
    }

    // Set timeout to logout when token expires
    const timeoutId = setTimeout(() => {
      logout();
      alert('Your session has expired. Please log in again.');
    }, timeUntilExpiration);

    return () => clearTimeout(timeoutId);
  }, [expiresAt, logout]);

  const login = async (username: string, password: string) => {
    try {
      // FastAPI expects form data for OAuth2PasswordRequestForm
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);

      const response = await api.post('/login', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const accessToken = response.data.access_token;
      const expirationTime = Date.now() + TOKEN_EXPIRATION_TIME;
      
      setToken(accessToken);
      setExpiresAt(expirationTime);
      localStorage.setItem('token', accessToken);
      localStorage.setItem('tokenExpiresAt', expirationTime.toString());
    } catch (error: any) {
      console.error('Login failed:', error);
      throw new Error(error?.response?.data?.detail || 'Login failed');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!token,
        token,
        login,
        logout,
        loading,
        expiresAt,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
