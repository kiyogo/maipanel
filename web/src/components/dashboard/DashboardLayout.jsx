import React, { useState } from 'react';
import {
  LayoutDashboard,
  Server,
  FileText,
  Wallet,
  HelpCircle,
  Key,
  Shield,
  Bell,
  Sun,
  Moon,
  LogOut,
  ChevronRight,
  Cloud,
  ExternalLink,
  Menu as MenuIcon,
  X,
  User
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useCloudData } from '../../context/CloudDataContext';
import { formatVND } from '../../utils/formatters';

export function DashboardLayout({ children, currentPath, onNavigate }) {
  const { user, isAdmin, logout, loginAs } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { unreadNotificationsCount } = useCloudData();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { label: 'Tổng quan', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Dịch vụ của tôi', path: '/dashboard/services', icon: Server },
    { label: 'Đơn hàng & Hóa đơn', path: '/dashboard/orders', icon: FileText },
    { label: 'Ví & Nạp tiền', path: '/dashboard/wallet', icon: Wallet },
    { label: 'Ticket hỗ trợ', path: '/dashboard/tickets', icon: HelpCircle },
    { label: 'Quản lý API Keys', path: '/dashboard/api', icon: Key },
    { label: 'Thông báo', path: '/dashboard/notifications', icon: Bell, badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : null },
    { label: 'Hồ sơ & Bảo mật', path: '/dashboard/profile', icon: Shield }
  ];

  const handleNav = (path) => {
    setSidebarOpen(false);
    onNavigate(path);
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="mobile-nav-overlay"
          onClick={() => setSidebarOpen(false)}
          style={{ zIndex: 85 }}
        />
      )}

      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Brand */}
        <div className="sidebar-brand">
          <a
            href="/"
            onClick={(e) => { e.preventDefault(); handleNav('/'); }}
            className="brand-logo"
          >
            <div className="brand-icon-box">
              <Cloud size={18} strokeWidth={2.5} />
            </div>
            <span>NEXUS<span className="accent">CLOUD</span></span>
          </a>
        </div>

        {/* Navigation List */}
        <div className="sidebar-nav">
          <div className="sidebar-section-title">Quản Lý Khách Hàng</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path || (item.path !== '/dashboard' && currentPath.startsWith(item.path));
            return (
              <button
                key={item.path}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
                onClick={() => handleNav(item.path)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="badge badge-warning" style={{ marginLeft: 'auto' }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Admin Switcher if authorized */}
          {isAdmin && (
            <>
              <div className="sidebar-section-title" style={{ marginTop: '0.75rem', color: 'var(--warning-text)' }}>
                Khu Vực Quản Trị
              </div>
              <button
                className="sidebar-link"
                style={{ backgroundColor: 'var(--warning-surface)', color: 'var(--warning-text)', fontWeight: 600 }}
                onClick={() => handleNav('/admin')}
              >
                <Shield size={18} />
                <span>Cổng Quản Trị Admin</span>
              </button>
            </>
          )}

          {/* Role Switcher Demo Tool */}
          <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
            <div style={{ padding: '0.5rem 0.75rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '0.75rem' }}>
              <div style={{ color: 'var(--text-muted)', marginBottom: '0.375rem' }}>Chuyển vai trò Demo:</div>
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                <button
                  className={`btn btn-sm ${!isAdmin ? 'btn-primary' : 'btn-outline'}`}
                  style={{ flex: 1, padding: '0.2rem 0.4rem', fontSize: '0.7rem' }}
                  onClick={() => loginAs('customer')}
                >
                  Khách hàng
                </button>
                <button
                  className={`btn btn-sm ${isAdmin ? 'btn-primary' : 'btn-outline'}`}
                  style={{ flex: 1, padding: '0.2rem 0.4rem', fontSize: '0.7rem' }}
                  onClick={() => { loginAs('admin'); handleNav('/admin'); }}
                >
                  Admin
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.375rem 0.5rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-surface)',
                color: 'var(--primary-text)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.85rem',
                border: '1px solid var(--primary-border)'
              }}
            >
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div style={{ flex: '1 1 auto', overflow: 'hidden' }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                {user?.name || user?.username}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--primary-text)', fontWeight: 600 }}>
                {formatVND(user?.balance || 0)}
              </div>
            </div>
          </div>

          <button
            className="dropdown-item danger"
            onClick={() => { logout(); handleNav('/'); }}
          >
            <LogOut size={16} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="dashboard-main">
        {/* Top Header */}
        <header className="dashboard-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              className="icon-btn"
              onClick={() => setSidebarOpen(prev => !prev)}
              aria-label="Mở Menu"
              id="mobile-menu-toggle"
            >
              <MenuIcon size={18} />
            </button>

            <a
              href="/"
              onClick={(e) => { e.preventDefault(); handleNav('/'); }}
              style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
            >
              <span>Trang chủ Nexus</span>
              <ExternalLink size={13} />
            </a>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Wallet Balance Pill */}
            <button
              className="btn btn-outline btn-sm"
              onClick={() => handleNav('/dashboard/wallet')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Wallet size={15} color="var(--primary)" />
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{formatVND(user?.balance || 0)}</span>
              <span className="badge badge-primary" style={{ fontSize: '0.6875rem' }}>+ Nạp tiền</span>
            </button>

            {/* Notification Bell */}
            <button
              className="icon-btn"
              onClick={() => handleNav('/dashboard/notifications')}
              style={{ position: 'relative' }}
              title="Thông báo"
            >
              <Bell size={18} />
              {unreadNotificationsCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--warning)'
                  }}
                />
              )}
            </button>

            {/* Theme Toggle */}
            <button
              className="icon-btn"
              onClick={toggleTheme}
              title="Đổi giao diện Light / Dark"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>
        </header>

        {/* Dashboard Body Outlet */}
        <main className="dashboard-body">
          {children}
        </main>
      </div>
    </div>
  );
}
