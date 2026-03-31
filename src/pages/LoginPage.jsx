import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { getUsers } from '../utils/StorageHelper.js';
import { setSession, getSession, isAuthenticated } from '../utils/SessionManager.js';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // If already logged in, redirect away
  useEffect(() => {
    if (isAuthenticated()) {
      const session = getSession();
      if (session.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/blogs', { replace: true });
      }
    }
  }, [navigate]);

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    // Trim input
    const uname = username.trim();
    const pwd = password;

    // Validate input
    if (!uname || !pwd) {
      setError('Please enter both username and password.');
      setSubmitting(false);
      return;
    }

    // Hardcoded admin
    if (uname === 'admin' && pwd === 'admin123') {
      setSession({
        userId: 'admin',
        role: 'admin',
        username: 'admin',
      });
      // Redirect to admin dashboard or intended page
      const from = location.state?.from?.pathname;
      navigate(from && from !== '/login' ? from : '/admin', { replace: true });
      return;
    }

    // Check localStorage users
    const users = getUsers();
    const user = users.find(
      (u) => u.username === uname && u.password === pwd
    );
    if (user) {
      setSession({
        userId: user.id,
        role: user.role,
        username: user.username,
      });
      const from = location.state?.from?.pathname;
      navigate(from && from !== '/login' ? from : '/blogs', { replace: true });
      return;
    }

    setError('Invalid username or password.');
    setSubmitting(false);
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <header className="w-full bg-white border-b shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-blue-700">
            <span className="text-2xl">✍️</span>
            WriteSpace
          </Link>
          <nav className="flex items-center gap-4">
            <Link to="/blogs" className="text-gray-700 hover:text-blue-700 font-medium">
              Blogs
            </Link>
            <Link to="/register" className="text-gray-700 hover:text-blue-700 font-medium">
              Register
            </Link>
          </nav>
        </div>
      </header>

      {/* Login Form */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-lg shadow p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Login to WriteSpace</h1>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded px-4 py-2 mb-4 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                type="text"
                autoFocus
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={submitting}
                autoComplete="username"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-1" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={submitting}
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition disabled:opacity-60"
              disabled={submitting}
            >
              {submitting ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <div className="mt-6 text-center text-gray-600 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:underline font-medium">
              Register
            </Link>
          </div>
          <div className="mt-4 text-xs text-gray-400 text-center">
            <span className="block">Demo admin: <b>admin</b> / <b>admin123</b></span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t mt-auto">
        <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-2 text-gray-500 text-sm">
          <div>
            &copy; {new Date().getFullYear()} WriteSpace. All rights reserved.
          </div>
          <div>
            Made with <span className="text-red-500">♥</span> for local blogging.
          </div>
        </div>
      </footer>
    </div>
  );
}