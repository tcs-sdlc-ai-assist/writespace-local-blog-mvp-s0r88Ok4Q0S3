import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Avatar from '../components/Avatar.jsx';
import { getPosts } from '../utils/StorageHelper.js';
import { getSession } from '../utils/SessionManager.js';

// BlogList inline (simple, since not in codebase yet)
function BlogList({ posts, max = 3 }) {
  if (!posts.length) {
    return (
      <div className="text-gray-500 italic py-8 text-center">
        No blog posts yet. Be the first to write!
      </div>
    );
  }
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.slice(0, max).map((post) => (
        <div key={post.id} className="bg-white border rounded-lg shadow-sm p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <Avatar role="viewer" size="sm" className="mr-2" />
            <span className="text-sm text-gray-600">{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
          <h3 className="font-bold text-lg mb-1 truncate">{post.title}</h3>
          <p className="text-gray-700 flex-1 mb-2">{post.excerpt || post.content.slice(0, 100) + (post.content.length > 100 ? '...' : '')}</p>
          <Link
            to={`/blogs/${post.id}`}
            className="inline-block mt-auto text-blue-600 hover:underline font-medium text-sm"
          >
            Read more &rarr;
          </Link>
        </div>
      ))}
    </div>
  );
}

export default function LandingPage() {
  const [posts, setPosts] = useState([]);
  const session = getSession();
  const navigate = useNavigate();

  useEffect(() => {
    setPosts(
      getPosts()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    );
  }, []);

  // Role-aware CTA
  let ctaButton;
  if (session && session.userId) {
    ctaButton = (
      <button
        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition"
        onClick={() => navigate('/blogs')}
      >
        Go to Blogs
      </button>
    );
  } else {
    ctaButton = (
      <div className="flex gap-3">
        <Link
          to="/login"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="px-6 py-3 bg-white border border-blue-600 text-blue-700 rounded-lg font-semibold shadow hover:bg-blue-50 transition"
        >
          Register
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <header className="w-full bg-white border-b shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-blue-700">
            <span className="text-2xl">✍️</span>
            WriteSpace
          </Link>
          <nav className="flex items-center gap-4">
            <Link to="/blogs" className="text-gray-700 hover:text-blue-700 font-medium">
              Blogs
            </Link>
            {session && session.userId ? (
              <Link to="/profile" className="flex items-center gap-2">
                <Avatar role={session.role} size="sm" username={session.username} />
                <span className="text-gray-700 font-medium">{session.username}</span>
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-700 font-medium">
                  Login
                </Link>
                <Link to="/register" className="text-gray-700 hover:text-blue-700 font-medium">
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center py-16 px-4 bg-gradient-to-b from-blue-50 to-transparent">
        <div className="max-w-2xl w-full text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Welcome to <span className="text-blue-700">WriteSpace</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8">
            A simple, local-first blog platform. Write, share, and manage your thoughts—all in your browser.
          </p>
          {ctaButton}
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why WriteSpace?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <span className="text-3xl mb-3">⚡</span>
            <h3 className="font-semibold text-lg mb-2">Instant & Private</h3>
            <p className="text-gray-600 text-center">
              All your data stays in your browser. No sign-up required to try. Lightning-fast and secure for demos.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <span className="text-3xl mb-3">👑</span>
            <h3 className="font-semibold text-lg mb-2">Role-based Access</h3>
            <p className="text-gray-600 text-center">
              Admins can manage users and all blogs. Viewers can write, edit, and delete their own posts.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <span className="text-3xl mb-3">📝</span>
            <h3 className="font-semibold text-lg mb-2">Simple & Modern UI</h3>
            <p className="text-gray-600 text-center">
              Clean, responsive design powered by React and Tailwind CSS. No clutter, just writing.
            </p>
          </div>
        </div>
      </section>

      {/* Latest Posts Preview */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Latest Posts</h2>
          <Link to="/blogs" className="text-blue-600 hover:underline font-medium">
            View all &rarr;
          </Link>
        </div>
        <BlogList posts={posts} max={3} />
      </section>

      {/* Footer */}
      <footer className="w-full bg-white border-t mt-auto">
        <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-2 text-gray-500 text-sm">
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