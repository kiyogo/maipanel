import React, { useState, useEffect, useRef } from 'react';
import { Layout, Avatar, Dropdown, Space, Typography, Spin, ConfigProvider, Empty, Drawer, Button } from './custom-ui';
import type { MenuProps } from './custom-ui';
import {
  DashboardOutlined,
  CloudServerOutlined,
  ProjectOutlined,
  DatabaseOutlined,
  SafetyOutlined,
  FolderOutlined,
  FileTextOutlined,
  UserOutlined,
  CodeOutlined,
  AppstoreOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  RobotOutlined,
  RocketOutlined,
  SunOutlined,
  MoonOutlined,
  GlobalOutlined,
  BgColorsOutlined,
} from '@ant-design/icons';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useLanguage } from './context/LanguageContext';
import { useAppearanceSettings } from './hooks/useAppearanceSettings';
import { MenuItem, WorkspaceTab } from './types/menu';
import { findItemByPath } from './utils/routeHelper';
import { SidebarFlyout } from './components/sidebar/SidebarFlyout';
import { SidebarAccordion } from './components/sidebar/SidebarAccordion';
import { WorkspaceTabBar } from './components/sidebar/WorkspaceTabBar';
import { NotificationDropdown } from './components/notification/NotificationDropdown';
import { MobileBottomNav } from './components/navigation/MobileBottomNav';

import Dashboard from './pages/Dashboard';
import Servers from './pages/Servers';
import Projects from './pages/Projects';
import Database from './pages/Database';
import Security from './pages/Security';
import Files from './pages/Files';
import Logs from './pages/Logs';
import Accounts from './pages/Accounts';
import Terminal from './pages/Terminal';
import Applications from './pages/Applications';
import Settings from './pages/Settings';
import Login from './pages/Login';
import AICenter from './pages/AICenter';
import TableDemo from './pages/TableDemo';
import MinecraftPanel from './pages/MinecraftPanel';

const { Sider, Content, Header } = Layout;
const { Text } = Typography;

// ===== Menu Items Generator =====
const getMenuItems = (t: (key: string) => string): MenuItem[] => [
  { id: 'home', title: t('menu.home'), path: '/', icon: <DashboardOutlined /> },
  { id: 'servers', title: t('menu.servers'), path: '/servers', icon: <CloudServerOutlined /> },
  { id: 'projects', title: t('menu.projects'), path: '/projects', icon: <ProjectOutlined /> },
  { id: 'database', title: t('menu.database'), path: '/database', icon: <DatabaseOutlined /> },
  { id: 'security', title: t('menu.security'), path: '/security', icon: <SafetyOutlined /> },
  { id: 'files', title: t('menu.files'), path: '/files', icon: <FolderOutlined /> },
  { id: 'logs', title: t('menu.logs'), path: '/logs', icon: <FileTextOutlined /> },
  { id: 'accounts', title: t('menu.accounts'), path: '/accounts', icon: <UserOutlined /> },
  { id: 'terminal', title: t('menu.terminal'), path: '/terminal', icon: <CodeOutlined /> },
  { id: 'apps', title: t('menu.apps'), path: '/apps', icon: <AppstoreOutlined /> },
  { id: 'ai', title: t('menu.ai'), path: '/ai', icon: <RobotOutlined /> },
  { id: 'game-minecraft', title: 'Minecraft Server', path: '/game/minecraft', icon: <RocketOutlined /> },
  { id: 'settings', title: t('menu.settings'), path: '/settings', icon: <SettingOutlined /> },
  { id: 'table-demo', title: 'Table Demo', path: '/table-demo', icon: <ProjectOutlined /> },
];

const getUserMenuItems = (t: (key: string) => string): MenuProps['items'] => [
  { key: 'settings', icon: <SettingOutlined />, label: t('menu.settings') },
  { key: 'logout', icon: <LogoutOutlined />, label: t('menu.logout'), danger: true },
];

// ===== Error Boundary =====
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Kpanel Error Boundary caught:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24, color: 'red' }}>
          <h2>Đã xảy ra lỗi giao diện</h2>
          <pre style={{ whiteSpace: 'pre-wrap', background: '#FEF2F2', padding: 16, borderRadius: 8, border: '1px solid #FECACA', color: '#DC2626' }}>
            {this.state.error?.toString()}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{ marginTop: 12, padding: '8px 16px', background: '#009688', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}
          >
            Tải lại trang
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ===== App Layout =====
const AppLayout: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { settings, setTheme } = useAppearanceSettings();

  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 992);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const menuItems = React.useMemo(() => getMenuItems(t), [t]);
  const userMenuItems = React.useMemo(() => getUserMenuItems(t), [t]);

  // Responsive listener
  useEffect(() => {
    const handleResize = () => {
      const mob = window.innerWidth <= 992;
      setIsMobile(mob);
      if (!mob) setMobileDrawerOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Workspace Tabs state
  const [tabs, setTabs] = useState<WorkspaceTab[]>(() => [
    { id: '/', title: t('menu.home'), path: '/', closable: false },
  ]);

  useEffect(() => {
    if (settings.workspaceTabMode !== 'on') return;
    const currentItem = findItemByPath(menuItems, location.pathname);
    const title = currentItem?.title || location.pathname;
    setTabs((prev) => {
      if (prev.some((tab) => tab.path === location.pathname)) return prev;
      return [...prev, { id: location.pathname, title, path: location.pathname, closable: true }];
    });
  }, [location.pathname, settings.workspaceTabMode, menuItems]);

  const handleCloseTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTabs((prev) => {
      const filtered = prev.filter((tab) => tab.id !== id);
      if (location.pathname === id) {
        const next = filtered[filtered.length - 1] || { path: '/' };
        navigate(next.path);
      }
      return filtered;
    });
  };

  const handleMenuClick = (info: { key: string }) => {
    if (info.key === 'logout') {
      logout();
      navigate('/login');
    } else if (info.key === 'settings') {
      navigate('/settings');
    }
  };

  const toggleTheme = () => {
    const next = settings.theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  };

  const isDark = settings.theme === 'dark';

  return (
    <Layout className="kpanel-app-layout" style={{ minHeight: '100vh', background: 'var(--color-bg, #FDFDFD)' }}>
      {/* Desktop Sider */}
      {!isMobile && (
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          trigger={null}
          width={220}
          className="kiyovn-sidebar kpanel-sidebar"
          style={{
            background: isDark ? '#111827' : '#F5F5F5',
            borderRight: isDark ? '1px solid #1F2937' : '1px solid #E0E0E0',
            overflowY: 'auto',
            overflowX: 'hidden',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
            zIndex: 200,
            transition: 'all 0.15s ease',
          }}
        >
          {/* Logo Bar */}
          <div
            onClick={() => navigate('/')}
            style={{
              height: 48,
              display: 'flex',
              alignItems: 'center',
              paddingLeft: collapsed ? 14 : 20,
              borderBottom: isDark ? '1px solid #1F2937' : '1px solid #E0E0E0',
              gap: 10,
              overflow: 'hidden',
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                background: '#009688',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 2px 6px rgba(0, 150, 136, 0.35)',
              }}
            >
              <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>K</span>
            </div>
            {!collapsed && (
              <Text style={{ fontWeight: 700, fontSize: 16, color: isDark ? '#F9FAFB' : '#212121', whiteSpace: 'nowrap' }}>
                Kpanel
              </Text>
            )}
          </div>

          {/* Dynamic Navigation Mode */}
          <div style={{ padding: '6px 0' }}>
            {settings.sidebarMenuMode === 'accordion' ? (
              <SidebarAccordion
                items={menuItems}
                inlineAccordionMode={settings.inlineAccordionMode}
                collapsed={collapsed}
              />
            ) : (
              <SidebarFlyout
                items={menuItems}
                hoverMode={settings.hoverMode}
                collapsed={collapsed}
              />
            )}
          </div>
        </Sider>
      )}

      {/* Mobile Drawer Navigation */}
      {isMobile && (
        <Drawer
          title="Menu Điều Hướng Kpanel"
          open={mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
          width={260}
          mask
        >
          <div style={{ padding: '8px 0' }}>
            <SidebarAccordion
              items={menuItems}
              inlineAccordionMode="off"
              onItemClick={() => setMobileDrawerOpen(false)}
            />
          </div>
        </Drawer>
      )}

      {/* Main Layout Area */}
      <Layout
        className="kpanel-main-container"
        style={{
          marginLeft: isMobile ? 0 : collapsed ? 80 : 220,
          transition: 'margin-left 0.15s ease',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--color-bg, #FDFDFD)',
        }}
      >
        {/* Sticky Header */}
        <Header
          className="kpanel-header"
          style={{
            background: isDark ? '#111827' : '#FFFFFF',
            borderBottom: isDark ? '1px solid #1F2937' : '1px solid #E0E0E0',
            padding: '0 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 48,
            position: 'sticky',
            top: 0,
            zIndex: 100,
            transition: 'background 0.2s ease',
          }}
        >
          {/* Left Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              onClick={() => {
                if (isMobile) {
                  setMobileDrawerOpen(!mobileDrawerOpen);
                } else {
                  setCollapsed(!collapsed);
                }
              }}
              style={{
                cursor: 'pointer',
                color: isDark ? '#9CA3AF' : '#757575',
                fontSize: 18,
                lineHeight: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                borderRadius: 4,
                transition: 'background 0.12s',
              }}
              title={collapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </div>

            {isMobile && (
              <span style={{ fontWeight: 700, fontSize: 16, color: isDark ? '#F9FAFB' : '#212121' }}>
                Kpanel
              </span>
            )}
          </div>

          {/* Right Header Toolbar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              title={isDark ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
              style={{
                width: 32,
                height: 32,
                borderRadius: 4,
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: isDark ? '#FBBF24' : '#757575',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                transition: 'all 0.15s ease',
                outline: 'none',
              }}
            >
              {isDark ? <SunOutlined /> : <MoonOutlined />}
            </button>

            {/* Notification Dropdown */}
            <NotificationDropdown />

            {/* User Dropdown */}
            <Dropdown menu={{ items: userMenuItems, onClick: handleMenuClick }} trigger={['click']}>
              <Space style={{ cursor: 'pointer', userSelect: 'none', padding: '4px 8px', borderRadius: 6, transition: 'background 0.12s' }}>
                <Avatar size={28} style={{ backgroundColor: '#009688' }} icon={<UserOutlined />} />
                <Text style={{ fontWeight: 500, color: isDark ? '#F9FAFB' : '#212121' }}>
                  {user?.name || 'Administrator'}
                </Text>
              </Space>
            </Dropdown>
          </div>
        </Header>

        {/* Workspace Tab Bar */}
        {settings.workspaceTabMode === 'on' && (
          <WorkspaceTabBar tabs={tabs} onCloseTab={handleCloseTab} />
        )}

        {/* Page Content Shell */}
        <Content
          className="kiyovn-main-content kpanel-main-content"
          style={{
            padding: location.pathname.startsWith('/files') ? 0 : '15px',
            background: 'var(--color-bg, #FDFDFD)',
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            minHeight: 'calc(100vh - 48px)',
            marginBottom: isMobile ? 56 : 0,
          }}
        >
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/monitor" element={<Servers />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:category" element={<Projects />} />
              <Route path="/projects/:category/:id" element={<Projects />} />
              <Route path="/database" element={<Database />} />
              <Route path="/database/:type" element={<Database />} />
              <Route path="/security" element={<Security />} />
              <Route path="/files" element={<Files />} />
              <Route path="/servers" element={<Servers />} />
              <Route path="/logs" element={<Logs />} />
              <Route path="/accounts" element={<Accounts />} />
              <Route path="/terminal" element={<Terminal />} />
              <Route path="/apps" element={<Applications />} />
              <Route path="/ai" element={<AICenter />} />
              <Route path="/game/minecraft" element={<MinecraftPanel />} />
              <Route path="/game/minecraft/:tab" element={<MinecraftPanel />} />
              <Route path="/game/minecraft/:tab/:playerKey" element={<MinecraftPanel />} />
              <Route path="/projects/game-server/minecraft" element={<MinecraftPanel />} />
              <Route path="/projects/game-server/minecraft/:tab" element={<MinecraftPanel />} />
              <Route path="/projects/game-server/minecraft/:tab/:playerKey" element={<MinecraftPanel />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/table-demo" element={<TableDemo />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ErrorBoundary>
        </Content>

        {/* Mobile Bottom Navigation */}
        {isMobile && (
          <MobileBottomNav
            mobileMenuOpen={mobileDrawerOpen}
            onToggleMobileMenu={() => setMobileDrawerOpen(!mobileDrawerOpen)}
          />
        )}
      </Layout>
    </Layout>
  );
};

// ===== Top Loading Bar =====
const TopLoadingBar: React.FC = () => {
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    setProgress(15);

    const t1 = setTimeout(() => setProgress(35), 100);
    const t2 = setTimeout(() => setProgress(65), 250);
    const t3 = setTimeout(() => setProgress(85), 450);
    const t4 = setTimeout(() => setProgress(100), 650);
    const t5 = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [location]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: `${progress}%`,
        height: '3px',
        background: 'linear-gradient(to right, #009688, #00BCD4, #4CAF50)',
        transition: 'width 0.25s ease-out',
        zIndex: 99999,
        pointerEvents: 'none',
      }}
    />
  );
};

// ===== Root App =====
const App: React.FC = () => {
  const { isLoggedIn, loading } = useAuth();
  const { language, t } = useLanguage();

  const localeMap: any = {
    vi: {},
    en: {},
    ja: {},
    zh: {},
  };

  const customRenderEmpty = () => (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={<span style={{ color: '#BFBFBF', fontSize: 14 }}>{t('common.notAvailable')}</span>}
    />
  );

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#F5F5F5' }}>
        <Spin size="large" tip="Đang tải cấu hình hệ thống..." />
      </div>
    );
  }

  return (
    <ConfigProvider locale={localeMap[language]} renderEmpty={customRenderEmpty}>
      <Router>
        <TopLoadingBar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={isLoggedIn ? <AppLayout /> : <Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
};

export default App;
