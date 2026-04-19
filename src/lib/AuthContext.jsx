import React, { createContext, useState, useContext, useEffect } from 'react';
import { getSession, loginAdmin, loginPaciente, logout } from '@/api/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    const session = getSession();
    if (session) {
      setUser(session);
      setIsAuthenticated(true);
    }
    setIsLoadingAuth(false);
  }, []);

  const handleLoginAdmin = (email, senha) => {
    const session = loginAdmin(email, senha);
    setUser(session);
    setIsAuthenticated(true);
    return session;
  };

  const handleLoginPaciente = (email) => {
    // Pode lançar erro se e-mail não encontrado
    const session = loginPaciente(email);
    setUser(session);
    setIsAuthenticated(true);
    return session;
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoadingAuth,
      isLoadingPublicSettings: false,
      authError: null,
      loginAdmin: handleLoginAdmin,
      loginPaciente: handleLoginPaciente,
      logout: handleLogout,
      navigateToLogin: () => {},
      checkAppState: () => {},
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
