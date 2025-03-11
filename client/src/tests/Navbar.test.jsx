import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from '../../components/Navbar';  
import { useAuth } from '../utils/auth';

jest.mock('../utils/auth', () => ({
  useAuth: jest.fn()
}));

describe('Navbar', () => {
  test('displays login and register when not authenticated', () => {
    useAuth.mockReturnValue({
      user: null,
      logout: jest.fn()
    });

    render(
      <Router>
        <Navbar />
      </Router>
    );

    expect(screen.getByText('Log In')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
    expect(screen.queryByText('My Notes')).toBeNull();
    expect(screen.queryByText('Log Out')).toBeNull();
  });

  test('displays notes and logout when authenticated', () => {
    useAuth.mockReturnValue({
      user: { username: 'testuser' },
      logout: jest.fn()
    });

    render(
      <Router>
        <Navbar />
      </Router>
    );

    expect(screen.getByText('My Notes')).toBeInTheDocument();
    expect(screen.getByText('Log Out')).toBeInTheDocument();
    expect(screen.queryByText('Log In')).toBeNull();
    expect(screen.queryByText('Register')).toBeNull();
  });
});