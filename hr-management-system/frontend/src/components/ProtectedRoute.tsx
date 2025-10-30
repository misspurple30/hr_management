import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../layouts/DashboardLayout';

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Redirige vers la page de connexion si non authentifié
    return <Navigate to="/login" replace />;
  }

  // Si authentifié, affiche le Layout du Dashboard
  // qui lui-même affichera la page (ex: DashboardPage) via <Outlet />
  return <DashboardLayout />;
};

export default ProtectedRoute;