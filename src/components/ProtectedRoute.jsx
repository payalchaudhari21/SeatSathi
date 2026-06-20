import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Login } from '../pages/Login';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  return children;
};
