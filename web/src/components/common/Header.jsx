import React, { useState, useEffect, useRef } from 'react';
import {
  Cloud,
  Server,
  Gamepad2,
  Database,
  Globe,
  Tag,
  HelpCircle,
  Search,
  Sun,
  Moon,
  ShoppingCart,
  User,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  Wallet,
  FileText,
  Shield,
  Menu as MenuIcon,
  X,
  Key
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { GlobalSearchModal } from './GlobalSearchModal';
import { formatVND } from '../../utils/formatters';

export function Header({ currentPath, onNavigate }) {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, isAdmin, logout, loginAs } = useAuth();
  const { totalItems } = useCart();

  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleNav = (path) => {
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    onNavigate(path);
  };

  return (
    <>
      <header className="site-header">
        <div className="header-container">
          {/* Logo */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              handleNav('/');
            }}
            className="brand-logo"
          >
            <div className="brand-icon-box">
              <Cloud size={20} strokeWidth={2.5} />
            </div>
            <span>NEXUS<span className="accent">CLOUD</span></span>
          </a>

          {/* Desktop Navigation */}
          <nav className="desktop-nav" aria-label="Main Navigation">
            <a
              href="/cloud-server"
              onClick={(e) => { e.preventDefault(); handleNav('/cloud-server'); }}
              className={`nav-link ${currentPath === '/cloud-server' ? 'active' : ''}`}
            >
              Cloud Server
            </a>
            <a
              href="/services?category=vps"
              onClick={(e) => { e.preventDefault(); handleNav('/services?category=vps'); }}
              className={`nav-link ${currentPath.includes('vps') ? 'active' : ''}`}
            >
              VPS NVMe
            </a>
            <a
              href="/services?category=game-server"
              onClick={(e) => { e.preventDefault(); handleNav('/services?category=game-server'); }}
              className={`nav-link ${currentPath.includes('game') ? 'active' : ''}`}
            >
              Game Server
            </a>
            <a
              href="/services?category=hosting"
              onClick={(e) => { e.preventDefault(); handleNav('/services?category=hosting'); }}
              className={`nav-link ${currentPath.includes('hosting') ? 'active' : ''}`}
            >
              Hosting
            </a>
            <a
              href="/services?category=storage"
              onClick={(e) => { e.preventDefault(); handleNav('/services?category=storage'); }}
              className={`nav-link ${currentPath.includes('storage') ? 'active' : ''}`}
            >
              Storage
            </a>
            <a
              href="/services?category=domain"
              onClick={(e) => { e.preventDefault(); handleNav('/services?category=domain'); }}
              className={`nav-link ${currentPath.includes('domain') ? 'active' : ''}`}
            >
              Tên miền
            </a>
            <a
              href="/pricing"
              onClick={(e) => { e.preventDefault(); handleNav('/pricing'); }}
              className={`nav-link ${currentPath === '/pricing' ? 'active' : ''}`}
            >
              Bảng giá
            </a>
            <a
              href="/docs"
              onClick={(e) => { e.preventDefault(); handleNav('/docs'); }}
              className={`nav-link ${currentPath === '/docs' ? 'active' : ''}`}
            >
              Tài liệu
            </a>
          </nav>

          {/* Right Header Actions */}
          <div className="header-actions">
            {/* Search Button */}
            <button
              className="icon-btn"
              onClick={() => setSearchOpen(true)}
              aria-label="Tìm kiếm nhanh (Ctrl+K)"
              title="Tìm kiếm (Ctrl+K)"
            >
              <Search size={18} />
            </button>

            {/* Theme Toggle (Sun/Moon) */}
            <button
              className="icon-btn"
              onClick={toggleTheme}
              aria-label={`Chuyển sang giao diện ${theme === 'light' ? 'Tối' : 'Sáng'}`}
              title={`Chuyển sang ${theme === 'light' ? 'Dark Mode' : 'Light Mode'}`}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {/* Shopping Cart Button */}
            <button
              className="icon-btn"
              onClick={() => handleNav('/cart')}
              aria-label="Giỏ hàng"
              title="Giỏ hàng"
              style={{ position: 'relative' }}
            >
              <ShoppingCart size={18} />
              {totalItems > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    backgroundColor: 'var(--primary)',
                    color: '#111827',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    lineHeight: 1
                  }}
                >
                  {totalItems}
                </span>
              )}
            </button>

            {/* User Account / Auth Actions */}
            {isAuthenticated ? (
              <div style={{ position: 'relative' }} ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(prev => !prev)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.625rem',
                    padding: '0.375rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    cursor: 'pointer'
                  }}
                >
                  <div
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary-surface)',
                      color: 'var(--primary-text)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      border: '1px solid var(--primary-border)'
                    }}
                  >
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
                      {user?.name?.split(' ')[0] || user?.username}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--primary-text)', fontWeight: 600 }}>
                      {formatVND(user?.balance || 0)}
                    </div>
                  </div>
                  <ChevronDown size={14} color="var(--text-muted)" />
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="user-dropdown-menu">
                    <div className="dropdown-user-header">
                      <div className="dropdown-user-name">{user?.name}</div>
                      <div className="dropdown-user-email">{user?.email}</div>
                      <div style={{ display: 'flex', gap: '0.375rem', marginTop: '0.375rem' }}>
                        <span className="badge badge-primary">
                          Số dư: {formatVND(user?.balance || 0)}
                        </span>
                        {isAdmin && <span className="badge badge-warning">Admin</span>}
                      </div>
                    </div>

                    <button
                      className="dropdown-item"
                      onClick={() => handleNav('/dashboard')}
                    >
                      <LayoutDashboard size={16} />
                      Bảng điều khiển
                    </button>
                    <button
                      className="dropdown-item"
                      onClick={() => handleNav('/dashboard/services')}
                    >
                      <Server size={16} />
                      Dịch vụ của tôi
                    </button>
                    <button
                      className="dropdown-item"
                      onClick={() => handleNav('/dashboard/orders')}
                    >
                      <FileText size={16} />
                      Lịch sử đơn hàng
                    </button>
                    <button
                      className="dropdown-item"
                      onClick={() => handleNav('/dashboard/wallet')}
                    >
                      <Wallet size={16} />
                      Ví & Nạp tiền
                    </button>
                    <button
                      className="dropdown-item"
                      onClick={() => handleNav('/dashboard/tickets')}
                    >
                      <HelpCircle size={16} />
                      Ticket hỗ trợ
                    </button>
                    <button
                      className="dropdown-item"
                      onClick={() => handleNav('/dashboard/api')}
                    >
                      <Key size={16} />
                      Quản lý API Keys
                    </button>
                    <button
                      className="dropdown-item"
                      onClick={() => handleNav('/dashboard/profile')}
                    >
                      <Shield size={16} />
                      Hồ sơ & Bảo mật
                    </button>

                    <div style={{ borderTop: '1px solid var(--border-color)', margin: '0.375rem 0' }} />

                    {/* Quick Role Switch for Demo */}
                    <div style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Chuyển đổi vai trò demo:
                    </div>
                    <div style={{ display: 'flex', gap: '0.375rem', padding: '0 0.5rem 0.5rem 0.5rem' }}>
                      <button
                        className={`btn btn-sm ${!isAdmin ? 'btn-primary' : 'btn-outline'}`}
                        style={{ flex: 1, padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                        onClick={() => { loginAs('customer'); setUserMenuOpen(false); }}
                      >
                        Khách hàng
                      </button>
                      <button
                        className={`btn btn-sm ${isAdmin ? 'btn-primary' : 'btn-outline'}`}
                        style={{ flex: 1, padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                        onClick={() => { loginAs('admin'); setUserMenuOpen(false); handleNav('/admin'); }}
                      >
                        Admin
                      </button>
                    </div>

                    {isAdmin && (
                      <button
                        className="dropdown-item"
                        style={{ backgroundColor: 'var(--warning-surface)', color: 'var(--warning-text)', fontWeight: 600 }}
                        onClick={() => handleNav('/admin')}
                      >
                        <Shield size={16} />
                        Cổng Quản Trị Admin
                      </button>
                    )}

                    <div style={{ borderTop: '1px solid var(--border-color)', margin: '0.375rem 0' }} />

                    <button
                      className="dropdown-item danger"
                      onClick={() => { logout(); setUserMenuOpen(false); handleNav('/'); }}
                    >
                      <LogOut size={16} />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => handleNav('/login')}
                >
                  Đăng nhập
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleNav('/register')}
                >
                  Đăng ký
                </button>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              className="icon-btn"
              onClick={() => setMobileMenuOpen(prev => !prev)}
              aria-label="Mở menu di động"
              style={{ display: 'none' }}
              id="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X size={20} /> : <MenuIcon size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-nav-drawer" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
              <div className="brand-logo">
                <div className="brand-icon-box">
                  <Cloud size={18} strokeWidth={2.5} />
                </div>
                <span>NEXUS<span className="accent">CLOUD</span></span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button className="nav-link" onClick={() => handleNav('/cloud-server')}>Cloud Server</button>
              <button className="nav-link" onClick={() => handleNav('/services?category=vps')}>VPS NVMe</button>
              <button className="nav-link" onClick={() => handleNav('/services?category=game-server')}>Game Server</button>
              <button className="nav-link" onClick={() => handleNav('/services?category=hosting')}>Web Hosting</button>
              <button className="nav-link" onClick={() => handleNav('/services?category=storage')}>Object Storage</button>
              <button className="nav-link" onClick={() => handleNav('/services?category=domain')}>Tên miền</button>
              <button className="nav-link" onClick={() => handleNav('/pricing')}>Bảng giá</button>
              <button className="nav-link" onClick={() => handleNav('/docs')}>Tài liệu kỹ thuật</button>
              <button className="nav-link" onClick={() => handleNav('/blog')}>Tin tức & Blog</button>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {isAuthenticated ? (
                <>
                  <button className="btn btn-primary btn-block" onClick={() => handleNav('/dashboard')}>
                    Vào Bảng Điều Khiển
                  </button>
                  <button className="btn btn-outline btn-block" onClick={() => { logout(); setMobileMenuOpen(false); }}>
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <button className="btn btn-primary btn-block" onClick={() => handleNav('/register')}>
                    Đăng ký tài khoản
                  </button>
                  <button className="btn btn-outline btn-block" onClick={() => handleNav('/login')}>
                    Đăng nhập
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Global Search Dialog */}
      <GlobalSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={handleNav}
      />
    </>
  );
}
