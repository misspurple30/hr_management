import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';

// Composant pour gérer la redirection /login si déjà connecté
const LoginRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Route de Connexion */}
      <Route path="/login" element={<LoginRoute />} />

      {/* Routes Protégées (layout principal) */}
      <Route element={<ProtectedRoute />}>
        {/* 'index' signifie que c'est la page par défaut pour '/' */}
        <Route index element={<DashboardPage />} /> 
        
        {/* Ajoutez vos autres pages protégées ici */}
        <Route path="/employees" element={<div>Page Employés (à créer)</div>} />
        <Route path="/departments" element={<div>Page Départements (à créer)</div>} />
      </Route>

      {/* Redirection par défaut si aucune route ne correspond */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;