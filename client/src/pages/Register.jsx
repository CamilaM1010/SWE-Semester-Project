import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PasswordInput from '../components/PasswordInput';
import { useAuth } from '../utils/auth';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setTimeout(() => setError(''), 5000);
      return;
    }
    
    const result = await register(username, password);
    
    if (result.success) {
      navigate('/login');
    } else {
      setError(result.error);
      setTimeout(() => setError(''), 5000);
    }
  };

  return (
    <div className="auth-container">
      <div className="form-container">
        <div className="logo-container">
          <div className="logo">Dy<span>Notes</span></div>
        </div>
        
        <h2>Start Your Learning Journey</h2>
        
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
          
          <PasswordInput 
            id="confirmPassword"
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          
          <button type="submit">Create Account</button>
        </form>
        
        <div className="form-link">
          Already have an account? <Link to="/login">Log in</Link>
        </div>
        
        <Link to="/" className="home-link">Return to Home</Link>
        
        <div className="value-proposition">
          Join DyNotes and transform your note-taking into a dynamic, adaptive learning experience
        </div>
      </div>
    </div>
  );
};

export default Register;