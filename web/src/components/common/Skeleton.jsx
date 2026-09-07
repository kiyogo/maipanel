import React from 'react';

export function SkeletonLoader({ rows = 4, height = 24 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="skeleton"
          style={{ height: `${height}px`, width: i === 0 ? '60%' : i === rows - 1 ? '80%' : '100%' }}
        />
      ))}
    </div>
  );
}
