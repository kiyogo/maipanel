import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  DashboardOutlined,
  CloudServerOutlined,
  ProjectOutlined,
  DatabaseOutlined,
  MenuOutlined,
} from '@ant-design/icons';

interface MobileBottomNavProps {
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  unreadNotificationsCount?: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  mobileMenuOpen,
  onToggleMobileMenu,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const isActivePath = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath === path || currentPath.startsWith(`${path}/`);
  };

  const navItems = [
    {
      key: 'dashboard',
      label: 'Tổng quan',
      icon: <DashboardOutlined />,
      active: isActivePath('/'),
      onClick: () => navigate('/'),
    },
    {
      key: 'servers',
      label: 'Máy chủ',
      icon: <CloudServerOutlined />,
      active: isActivePath('/servers'),
      onClick: () => navigate('/servers'),
    },
    {
      key: 'projects',
      label: 'Dự án',
      icon: <ProjectOutlined />,
      active: isActivePath('/projects'),
      onClick: () => navigate('/projects'),
    },
    {
      key: 'database',
      label: 'Cơ sở dữ liệu',
      icon: <DatabaseOutlined />,
      active: isActivePath('/database'),
      onClick: () => navigate('/database'),
    },
    {
      key: 'menu',
      label: 'Menu',
      icon: <MenuOutlined />,
      active: mobileMenuOpen,
      onClick: onToggleMobileMenu,
    },
  ];

  return (
    <nav
      className="kpanel-mobile-bottom-nav"
      aria-label="Điều hướng di động"
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        height: 56,
        zIndex: 9998,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(0, 0, 0, 0.08)',
        boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.04)',
        padding: '0 4px',
        userSelect: 'none',
      }}
    >
      {navItems.map((item) => {
        const isSelected = item.active;
        return (
          <button
            key={item.key}
            type="button"
            onClick={item.onClick}
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              padding: '6px 0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              cursor: 'pointer',
              color: isSelected ? '#009688' : '#757575',
              transition: 'all 0.12s ease',
              outline: 'none',
            }}
          >
            <span style={{ fontSize: 18, lineHeight: 1 }}>{item.icon}</span>
            <span style={{ fontSize: 10.5, fontWeight: isSelected ? 600 : 450 }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
