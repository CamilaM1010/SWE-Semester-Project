import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../utils/auth';

//Contains links to necessary features/areas
const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <div className="navbar">
      <Link to="/" className="logo">
        Dy<span>Notes</span>
      </Link>
      <div className="auth-buttons">
        {!user ? (
          <>
            <Link to="/login" className="btn btn-login">
              Log In
            </Link>
            <Link to="/register" className="btn btn-register">
              Register
            </Link>
          </>
        ) : (
          <>
            <Link to="/private" className="btn btn-login">
              My Notes
            </Link>
            <button onClick={logout} className="btn btn-register">
              Log Out
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;