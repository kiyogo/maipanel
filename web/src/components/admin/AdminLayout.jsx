import React, { useState } from 'react';
import {
  Shield,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  HelpCircle,
  Tag,
  FileText,
  Settings,
  ArrowLeft,
  Sun,
  Moon,
  LogOut,
  Menu as MenuIcon,
  Cloud
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export function AdminLayout({ children, currentPath, onNavigate }) {
  const { user, logout, loginAs } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const adminNav = [
    { label: 'Tổng quan Admin', path: '/admin', icon: LayoutDashboard },
    { label: 'Quản lý Sản phẩm', path: '/admin/products', icon: Package },
    { label: 'Quản lý Đơn hàng', path: '/admin/orders', icon: ShoppingCart },
    { label: 'Quản lý Khách hàng', path: '/admin/users', icon: Users },
    { label: 'Xử lý Tickets', path: '/admin/tickets', icon: HelpCircle },
    { label: 'Mã Giảm Giá', path: '/admin/coupons', icon: Tag },
    { label: 'Nhật Ký Audit Logs', path: '/admin/audit-logs', icon: FileText }
  ];

  const handleNav = (path) => {
    setSidebarOpen(false);
    onNavigate(path);
  };

  return (
    <div className="dashboard-layout">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="mobile-nav-overlay"
          onClick={() => setSidebarOpen(false)}
          style={{ zIndex: 85 }}
        />
      )}

      {/* Admin Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`} style={{ borderRight: '1px solid var(--border-color)' }}>
        <div className="sidebar-brand" style={{ backgroundColor: 'var(--warning-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--warning)',
                color: '#111827',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800
              }}
            >
              <Shield size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
                NEXUS ADMIN
              </div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--warning-text)', fontWeight: 600 }}>
                Hệ thống Quản trị
              </div>
            </div>
          </div>
        </div>

        <div className="sidebar-nav">
          <button
            className="btn btn-outline btn-sm btn-block"
            style={{ marginBottom: '1rem', justifyContent: 'flex-start' }}
            onClick={() => handleNav('/dashboard')}
          >
            <ArrowLeft size={14} />
            <span>Về Portal Khách Hàng</span>
          </button>

          <div className="sidebar-section-title">Quản Lý Toàn Hệ Thống</div>
          {adminNav.map(item => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.path}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
                onClick={() => handleNav(item.path)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="sidebar-footer">
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Admin: <b>{user?.email}</b>
          </div>
          <button
            className="dropdown-item danger"
            onClick={() => { logout(); handleNav('/'); }}
          >
            <LogOut size={16} />
            <span>Đăng xuất Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Body */}
      <div className="dashboard-main">
        <header className="dashboard-header" style={{ backgroundColor: 'var(--bg-card)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              className="icon-btn"
              onClick={() => setSidebarOpen(prev => !prev)}
              aria-label="Mở Menu"
              id="mobile-menu-toggle"
            >
              <MenuIcon size={18} />
            </button>
            <span className="badge badge-warning" style={{ fontWeight: 700 }}>
              CHẾ ĐỘ QUẢN TRỊ VIÊN (ADMIN PORTAL)
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button className="icon-btn" onClick={toggleTheme} title="Đổi giao diện Light / Dark">
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>
        </header>

        <main className="dashboard-body">
          {children}
        </main>
      </div>
    </div>
  );
}
