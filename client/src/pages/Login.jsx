import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PasswordInput from '../components/PasswordInput';
import { useAuth } from '../utils/auth';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = await login(username, password);
    
    if (result.success) {
      navigate('/private');
    } else {
      setError(result.error);
      
      // Auto-hide error after 5 seconds
      setTimeout(() => setError(''), 5000);
    }
  };

  return (
    <div className="auth-container">
      <div className="form-container">
        <div className="logo-container">
          <div className="logo">Dy<span>Notes</span></div>
        </div>

        <h2>Welcome Back</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input 
              type="text" 
              id="username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
          </div>
          
          <PasswordInput 
            id="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <button type="submit">Log In</button>
        </form>

        <div className="form-link">
          Don't have an account? <Link to="/register">Register</Link>
        </div>

        <div className="form-link">
          Forgot password? <Link to="/reset-password">Reset Password</Link>
        </div>
        
        <Link to="/" className="home-link">Return to Home</Link>
        
        <div className="tag-line">Transform your learning experience with dynamic note-taking</div>
      </div>
    </div>
  );
};

export default Login;