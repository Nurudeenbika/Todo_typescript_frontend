import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TodoPage from './pages/TodoPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';


const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/todos" element={<PrivateRoute><TodoPage /></PrivateRoute>} />
          <Route path="/" element={<Navigate to="/todos" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
