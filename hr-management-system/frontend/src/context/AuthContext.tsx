import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatar?: string;
}
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
}

// Type pour la réponse de login
interface LoginData {
  user: User;
  accessToken: string;
  refreshToken: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  data: LoginData;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      setToken(storedToken);
      fetchCurrentUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      localStorage.removeItem('accessToken');
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post<ApiResponse>('/auth/login', {
        email,
        password,
      });

      const { user: userData, accessToken } = response.data.data;
      
      // Stocker le token
      localStorage.setItem('accessToken', accessToken);
      setToken(accessToken);
      setUser(userData);

      // Rediriger vers le dashboard
      navigate('/');

    } catch (error) {
      console.error('Échec de la connexion:', error);
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Email ou mot de passe incorrect');
      } else {
        throw new Error('Erreur de connexion. Veuillez réessayer.');
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  // Fonction pour rafraîchir les données utilisateur
  const refreshUser = async () => {
    await fetchCurrentUser();
  };

  const value = {
    user,
    isAuthenticated: !!token && !!user,
    login,
    logout,
    isLoading,
    refreshUser,
  };

  // Ne pas render les enfants tant qu'on ne sait pas si on est authentifié
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};