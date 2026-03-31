import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getUsers, addUser } from '../utils/StorageHelper.js';
import { setSession, getSession, isAuthenticated } from '../utils/SessionManager.js';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

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

    const uname = username.trim();
    const pwd = password;
    const conf = confirm;

    // Validation
    if (!uname || !pwd || !conf) {
      setError('Please fill in all fields.');
      setSubmitting(false);
      return;
    }
    if (uname === 'admin') {
      setError('Username "admin" is reserved.');
      setSubmitting(false);
      return;
    }
    if (pwd.length < 4) {
      setError('Password must be at least 4 characters.');
      setSubmitting(false);
      return;
    }
    if (pwd !== conf) {
      setError('Passwords do not match.');
      setSubmitting(false);
      return;
    }
    const users = getUsers();
    if (users.some((u) => u.username === uname)) {
      setError('Username is already taken.');
      setSubmitting(false);
      return;
    }

    // Create user
    const user = {
      username: uname,
      password: pwd,
      role: 'viewer',
    };
    addUser(user);

    // Get the user with id (since addUser assigns id)
    const newUsers = getUsers();
    const created = newUsers.find((u) => u.username === uname);

    setSession({
      userId: created.id,
      role: created.role,
      username: created.username,
    });

    navigate('/blogs', { replace: true });
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
            <Link to="/login" className="text-gray-700 hover:text-blue-700 font-medium">
              Login
            </Link>
          </nav>
        </div>
      </header>

      {/* Register Form */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-lg shadow p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Register for WriteSpace</h1>
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
            <div className="mb-4">
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
                autoComplete="new-password"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-1" htmlFor="confirm">
                Confirm Password
              </label>
              <input
                id="confirm"
                type="password"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                disabled={submitting}
                autoComplete="new-password"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition disabled:opacity-60"
              disabled={submitting}
            >
              {submitting ? 'Registering...' : 'Register'}
            </button>
          </form>
          <div className="mt-6 text-center text-gray-600 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline font-medium">
              Login
            </Link>
          </div>
          <div className="mt-4 text-xs text-gray-400 text-center">
            <span className="block">Admin account is reserved. Register as a viewer.</span>
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