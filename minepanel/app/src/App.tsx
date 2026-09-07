import React, { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Dropdown, Space, Typography, Spin, ConfigProvider, Empty } from './custom-ui';
import type { MenuProps } from './custom-ui';
import {
  CloudServerOutlined,
  DatabaseOutlined,
  FolderOutlined,
  UserOutlined,
  CodeOutlined,
  AppstoreOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  RocketOutlined,
} from '@ant-design/icons';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useLanguage } from './context/LanguageContext';
import Files from './pages/Files';
import Login from './pages/Login';
import MinecraftPanel from './pages/MinecraftPanel';

const { Sider, Content, Header } = Layout;
const { Text } = Typography;

// ===== Dynamic Menu items generator =====
const getNavItems = (t: (key: string) => string): MenuProps['items'] => [
  { key: '/overview', icon: <RocketOutlined />, label: <Link to="/overview">Tổng quan</Link> },
  { key: '/software', icon: <AppstoreOutlined />, label: <Link to="/software">Phần mềm</Link> },
  { key: '/console', icon: <CodeOutlined />, label: <Link to="/console">Dòng lệnh</Link> },
  { key: '/config', icon: <SettingOutlined />, label: <Link to="/config">Cấu hình</Link> },
  { key: '/players', icon: <UserOutlined />, label: <Link to="/players">Quản lý Người chơi</Link> },
  { key: '/plugins', icon: <CloudServerOutlined />, label: <Link to="/plugins">Cửa hàng Plugin</Link> },
  { key: '/backups', icon: <DatabaseOutlined />, label: <Link to="/backups">Sao lưu</Link> },
  { key: '/files', icon: <FolderOutlined />, label: <Link to="/files">Thư mục</Link> },
];

const getUserMenuItems = (t: (key: string) => string): MenuProps['items'] => [
  { key: 'profile', icon: <UserOutlined />, label: t('menu.profile') },
  { key: 'logout', icon: <LogoutOutlined />, label: t('menu.logout'), danger: true },
];

// ===== Error Boundary =====
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: Error | null }> {
  constructor(props: any) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error: Error) { return { hasError: true, error }; }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) { console.error("Error Boundary caught:", error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24, color: 'red' }}>
          <h2>Something went wrong.</h2>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{this.state.error?.toString()}</pre>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{this.state.error?.stack}</pre>
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
  const { user, logout } = useAuth();

  // Detect when sticky elements touch the bottom to toggle border radius
  useEffect(() => {
    const handleScroll = () => {
      const paginations = document.querySelectorAll('.ant-pagination-container, .ant-pagination');
      paginations.forEach(p => {
        const rect = p.getBoundingClientRect();
        // If bottom of pagination matches bottom of viewport, it is stuck
        if (Math.abs(rect.bottom - window.innerHeight) <= 1) {
          p.classList.add('is-stuck');
        } else {
          p.classList.remove('is-stuck');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    handleScroll(); // Check on mount

    // Catch layout changes (like switching tabs)
    const resizeObserver = new ResizeObserver(() => {
      handleScroll();
    });
    resizeObserver.observe(document.body);

    // Catch DOM updates (new elements rendering) with a small debounce
    let timeout: ReturnType<typeof setTimeout>;
    const mutationObserver = new MutationObserver(() => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        handleScroll();
      }, 50);
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    // Fallback interval to ensure it's never stuck in the wrong state
    const interval = setInterval(handleScroll, 200);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  const handleMenuClick = (info: { key: string }) => {
    if (info.key === 'logout') {
      logout();
      navigate('/login');
    }
  };

  const navItems = getNavItems(t);
  const userMenuItems = getUserMenuItems(t);

  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        trigger={null}
        width={220}
        style={{
          background: '#F5F5F5',
          borderRight: '1px solid #E0E0E0',
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 200,
        }}
      >
        {/* Logo */}
        <div style={{
          height: 48,
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 20,
          borderBottom: '1px solid #E0E0E0',
          gap: 10,
          overflow: 'hidden',
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: 6,
            background: '#009688',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>M</span>
          </div>
          {!collapsed && (
            <Text style={{ fontWeight: 700, fontSize: 16, color: '#212121' }}>Minepanel</Text>
          )}
        </div>
        {/* Nav menu */}
        <Menu
          mode="inline"
          selectedKeys={[
            location.pathname.startsWith('/players') ? '/players' :
            location.pathname === '/' ? '/overview' :
            location.pathname
          ]}
          items={navItems}
          style={{ background: 'transparent', border: 'none', marginTop: 6 }}
        />
      </Sider>

      {/* Main */}
      <Layout style={{ marginLeft: collapsed ? 80 : 220, transition: 'margin-left 0.15s ease', height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Header style={{
          background: '#FFFFFF',
          borderBottom: '1px solid #E0E0E0',
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 48,
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}>
          <div
            onClick={() => setCollapsed(!collapsed)}
            style={{ cursor: 'pointer', color: '#757575', fontSize: 18, lineHeight: 1 }}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </div>

          <Dropdown menu={{ items: userMenuItems, onClick: handleMenuClick }} trigger={['click']}>
            <Space style={{ cursor: 'pointer' }}>
              <Avatar size={28} style={{ backgroundColor: '#009688' }} icon={<UserOutlined />} />
              <Text style={{ fontWeight: 500 }}>{user?.name || 'Administrator'}</Text>
            </Space>
          </Dropdown>
        </Header>

        {/* Page content */}
        <Content style={{ background: '#FDFDFD', display: 'flex', flexDirection: 'column', flex: 1 }}>
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Navigate to="/overview" replace />} />
              <Route path="/overview" element={<MinecraftPanel />} />
              <Route path="/software" element={<MinecraftPanel />} />
              <Route path="/console" element={<MinecraftPanel />} />
              <Route path="/config" element={<MinecraftPanel />} />
              <Route path="/players" element={<MinecraftPanel />} />
              <Route path="/players/:playerKey" element={<MinecraftPanel />} />
              <Route path="/plugins" element={<MinecraftPanel />} />
              <Route path="/backups" element={<MinecraftPanel />} />
              <Route path="/files" element={<MinecraftPanel />} />
              <Route path="*" element={<Navigate to="/overview" replace />} />
            </Routes>
          </ErrorBoundary>
        </Content>
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
