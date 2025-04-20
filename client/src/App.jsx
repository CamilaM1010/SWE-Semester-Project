import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './utils/auth';

// Import components
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Private from './pages/Private';
import ResetPassword from './pages/ResetPassword';
import Cornell from './pages/Cornell';
import QuizGenerator from './pages/QuizGenerator';
import Folder from './pages/Folder'; 

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <div className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route 
                path="/private" 
                element={
                  <ProtectedRoute>
                    <Private />
                  </ProtectedRoute>
                } 
              />
              <Route
                path="/notes/:noteId?"
                element={
                  <ProtectedRoute>
                    <Cornell/>
                  </ProtectedRoute>
                }
              />

<Route path="/quiz-test" element={<ProtectedRoute><QuizGenerator /></ProtectedRoute>}/>

              <Route
                path="/folder/:folderId?"
                element={
                  <ProtectedRoute>
                    <Folder/>
                  </ProtectedRoute>
                }
                />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;