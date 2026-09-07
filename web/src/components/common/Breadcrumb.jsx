import React from 'react';
import { PackageOpen, ChevronRight, Home } from 'lucide-react';

export function EmptyState({
  icon: Icon = PackageOpen,
  title = 'Không có dữ liệu',
  description = 'Hiện tại chưa có bản ghi nào để hiển thị trong mục này.',
  actionText,
  onAction
}) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Icon size={26} />
      </div>
      <div className="empty-state-title">{title}</div>
      <div className="empty-state-desc">{description}</div>
      {actionText && onAction && (
        <button className="btn btn-primary btn-sm" onClick={onAction}>
          {actionText}
        </button>
      )}
    </div>
  );
}

export function Breadcrumb({ items, onNavigate }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <div className="breadcrumb-item">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/');
          }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
        >
          <Home size={14} />
          <span>Trang chủ</span>
        </a>
      </div>
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={idx}>
            <ChevronRight size={13} color="var(--text-muted)" />
            <div className={`breadcrumb-item ${isLast ? 'active' : ''}`}>
              {isLast || !item.path ? (
                <span>{item.label}</span>
              ) : (
                <a
                  href={item.path}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(item.path);
                  }}
                >
                  {item.label}
                </a>
              )}
            </div>
          </React.Fragment>
        );
      })}
    </nav>
  );
}

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
