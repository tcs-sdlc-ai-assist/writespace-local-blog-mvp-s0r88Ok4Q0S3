import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, isAdmin } from '../utils/SessionManager.js';

// Usage:
// <ProtectedRoute>...</ProtectedRoute> // any logged-in user
// <ProtectedRoute role="admin">...</ProtectedRoute> // only admin

export default function ProtectedRoute({ role, children }) {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role === 'admin' && !isAdmin()) {
    // Non-admins trying to access admin route
    return <Navigate to="/blogs" replace />;
  }

  // Authenticated and role (if required) matches
  return children;
}