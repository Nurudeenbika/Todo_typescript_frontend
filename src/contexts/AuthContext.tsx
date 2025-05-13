import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';

    interface AuthContextType {
      token: string | null;
      userId: string | null;
      login: (token: string, userId: string) => void;
      logout: () => void;
      isAuthenticated: boolean;
    }

    const AuthContext = createContext<AuthContextType | undefined>(undefined);

    interface AuthProviderProps {
      children: ReactNode;
    }

    export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
      const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
      const [userId, setUserId] = useState<string | null>(localStorage.getItem('userId'));

      useEffect(() => {
        if (token) {
          localStorage.setItem('token', token);
        } else {
          localStorage.removeItem('token');
        }

        if (userId) {
          localStorage.setItem('userId', userId);
        } else {
          localStorage.removeItem('userId');
        }
      }, [token, userId]);

      const login = (newToken: string, newUserId: string) => {
        setToken(newToken);
        setUserId(newUserId);
      };

      const logout = () => {
        setToken(null);
        setUserId(null);
      };

      const isAuthenticated = !!token;

      const value: AuthContextType = {
        token,
        userId,
        login,
        logout,
        isAuthenticated,
      };

      return (
        <AuthContext.Provider value={value}>
          {children}
        </AuthContext.Provider>
      );
    };

    export const useAuth = () => {
      const context = useContext(AuthContext);
      if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
      }
      return context;
    };