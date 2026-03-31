import React from 'react';

// Props:
// - role: 'admin' | 'viewer'
// - size: 'sm' | 'md' | 'lg' (default: 'md')
// - className: string (optional extra classes)
// - username: string (optional, for alt text)
export default function Avatar({ role = 'viewer', size = 'md', className = '', username = '' }) {
  let emoji = '📖';
  let label = 'Viewer';
  if (role === 'admin') {
    emoji = '👑';
    label = 'Admin';
  }

  let sizeClasses = 'w-10 h-10 text-2xl';
  if (size === 'sm') sizeClasses = 'w-7 h-7 text-lg';
  if (size === 'lg') sizeClasses = 'w-16 h-16 text-4xl';

  return (
    <span
      className={
        `inline-flex items-center justify-center rounded-full bg-gray-100 border border-gray-300 text-gray-700 font-semibold select-none ${sizeClasses} ${className}`
      }
      title={username ? `${label}: ${username}` : label}
      aria-label={label}
      role="img"
    >
      {emoji}
    </span>
  );
}