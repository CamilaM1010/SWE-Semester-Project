import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PasswordInput from '../components/PasswordInput';
import { useAuth } from '../utils/auth';

const ResetPassword = () => {
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setTimeout(() => setError(''), 5000);
      return;
    }
    
    const result = await resetPassword(username, newPassword, confirmPassword);
    
    if (result.success) {
      setSuccess('Password reset successful! Redirecting to login...');
      setTimeout(() => {
        setSuccess('');
        navigate('/login');
      }, 3000);
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
        
        <h2>Reset Your Password</h2>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <div className="instructions">
          Enter your username and create a new password
        </div>
        
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
            id="newPassword"
            label="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          
          <PasswordInput 
            id="confirmPassword"
            label="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          
          <button type="submit">Reset Password</button>
        </form>
        
        <div className="form-link">
          Remember your password? <Link to="/login">Log in</Link>
        </div>
        
        <Link to="/" className="home-link">Return to Home</Link>
      </div>
    </div>
  );
};

export default ResetPassword;