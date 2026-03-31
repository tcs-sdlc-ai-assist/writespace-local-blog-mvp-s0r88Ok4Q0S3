// src/utils/SessionManager.js

import {
  getSession as storageGetSession,
  setSession as storageSetSession,
  clearSession as storageClearSession,
  getUsers,
} from './StorageHelper.js';

// Returns the current session object or null
export function getSession() {
  return storageGetSession();
}

// Returns true if a user is logged in
export function isAuthenticated() {
  const session = storageGetSession();
  return !!(session && session.userId);
}

// Returns true if the current session is admin
export function isAdmin() {
  const session = storageGetSession();
  return session && session.role === 'admin';
}

// Returns the current user object (from users list), or null for hardcoded admin
export function getCurrentUser() {
  const session = storageGetSession();
  if (!session) return null;
  if (session.userId === 'admin') {
    // Hardcoded admin user
    return {
      id: 'admin',
      username: 'admin',
      password: 'admin123',
      role: 'admin',
    };
  }
  const users = getUsers();
  return users.find((u) => u.id === session.userId) || null;
}

// Logs out the current user
export function logout() {
  storageClearSession();
}