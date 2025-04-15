import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import Private from './pages/Private';
import { useAuth } from './utils/auth';
import QuizGenerator from './pages/QuizGenerator';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/private" element={ <ProtectedRoute><Private /></ProtectedRoute>} />
      <Route path="/quiz-test" element={<ProtectedRoute><QuizGenerator /> </ProtectedRoute>}/>

    </Routes>
  );
}

export default AppRoutes;