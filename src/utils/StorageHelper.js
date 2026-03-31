// src/utils/StorageHelper.js

const USERS_KEY = 'ws_users';
const POSTS_KEY = 'ws_posts';
const SESSION_KEY = 'ws_session';

// Helper to generate a simple uuid (not cryptographically secure)
function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// USERS

export function getUsers() {
  try {
    const users = JSON.parse(localStorage.getItem(USERS_KEY));
    if (Array.isArray(users)) return users;
    return [];
  } catch (e) {
    return [];
  }
}

export function addUser(user) {
  try {
    const users = getUsers();
    users.push({ ...user, id: user.id || uuid() });
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (e) {
    // fail silently
  }
}

export function deleteUser(userId) {
  try {
    const users = getUsers().filter((u) => u.id !== userId);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (e) {
    // fail silently
  }
}

// POSTS

export function getPosts() {
  try {
    const posts = JSON.parse(localStorage.getItem(POSTS_KEY));
    if (Array.isArray(posts)) return posts;
    return [];
  } catch (e) {
    return [];
  }
}

export function addPost(post) {
  try {
    const posts = getPosts();
    const now = new Date().toISOString();
    posts.push({
      ...post,
      id: post.id || uuid(),
      createdAt: now,
      updatedAt: now,
    });
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  } catch (e) {
    // fail silently
  }
}

export function updatePost(post) {
  try {
    const posts = getPosts();
    const idx = posts.findIndex((p) => p.id === post.id);
    if (idx === -1) return;
    posts[idx] = {
      ...posts[idx],
      ...post,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  } catch (e) {
    // fail silently
  }
}

export function deletePost(postId) {
  try {
    const posts = getPosts().filter((p) => p.id !== postId);
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  } catch (e) {
    // fail silently
  }
}

// SESSION

export function getSession() {
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY));
    if (session && typeof session === 'object') return session;
    return null;
  } catch (e) {
    return null;
  }
}

export function setSession(session) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch (e) {
    // fail silently
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (e) {
    // fail silently
  }
}