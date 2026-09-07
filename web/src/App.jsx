import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { AdminLayout } from './components/admin/AdminLayout';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { ServicesPage } from './pages/public/ServicesPage';
import { CloudServerPage } from './pages/public/CloudServerPage';
import { ProductDetailPage } from './pages/public/ProductDetailPage';
import { PricingPage } from './pages/public/PricingPage';
import { CartPage } from './pages/public/CartPage';
import { CheckoutPage } from './pages/public/CheckoutPage';
import { DocsPage } from './pages/public/DocsPage';
import { BlogPage, BlogPostPage } from './pages/public/BlogPage';
import { StatusPage } from './pages/public/StatusPage';
import { ContactPage } from './pages/public/ContactPage';
import { LegalPage } from './pages/public/LegalPage';

// Auth Pages
import { LoginPage, RegisterPage, ForgotPasswordPage } from './pages/auth/LoginPage';

// Dashboard Pages
import { OverviewPage } from './pages/dashboard/OverviewPage';
import { ServicesListPage } from './pages/dashboard/ServicesListPage';
import { ServiceDetailPage } from './pages/dashboard/ServiceDetailPage';
import { OrdersListPage, OrderDetailPage } from './pages/dashboard/OrdersListPage';
import { WalletPage } from './pages/dashboard/WalletPage';
import { TicketsListPage, TicketCreatePage, TicketDetailPage } from './pages/dashboard/TicketsListPage';
import { ProfilePage } from './pages/dashboard/ProfilePage';
import { ApiKeysPage } from './pages/dashboard/ApiKeysPage';
import { NotificationsPage } from './pages/dashboard/NotificationsPage';

// Admin Pages
import { AdminOverviewPage, AdminProductsPage } from './pages/admin/AdminOverviewPage';
import { AdminOrdersPage, AdminTicketsPage } from './pages/admin/AdminOrdersPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminCouponsPage, AdminAuditLogsPage } from './pages/admin/AdminCouponsPage';

// Error Pages
import { NotFoundPage, AccessDeniedPage } from './pages/error/NotFoundPage';

export function App() {
  const { user, isAdmin, isAuthenticated } = useAuth();

  const [currentUrl, setCurrentUrl] = useState(() => {
    return window.location.pathname + window.location.search;
  });

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentUrl(window.location.pathname + window.location.search);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path, extraAction) => {
    if (extraAction === 'OPEN_SEARCH') {
      return;
    }

    if (!path) return;
    window.history.pushState({}, '', path);
    setCurrentUrl(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Parse path and query parameters
  const [pathname, searchStr] = currentUrl.split('?');
  const searchParams = new URLSearchParams(searchStr || '');
  const queryParams = Object.fromEntries(searchParams.entries());

  // Determine current page render
  const renderContent = () => {
    // 1. PUBLIC ROUTES
    if (pathname === '/' || pathname === '') {
      return <HomePage onNavigate={navigate} />;
    }

    if (pathname === '/services') {
      return <ServicesPage queryParams={queryParams} onNavigate={navigate} />;
    }

    if (pathname === '/cloud-server') {
      return <CloudServerPage onNavigate={navigate} />;
    }

    if (pathname.startsWith('/product/')) {
      const productId = pathname.replace('/product/', '');
      return <ProductDetailPage productId={productId} queryParams={queryParams} onNavigate={navigate} />;
    }

    if (pathname === '/pricing') {
      return <PricingPage onNavigate={navigate} />;
    }

    if (pathname === '/cart') {
      return <CartPage onNavigate={navigate} />;
    }

    if (pathname === '/checkout') {
      return <CheckoutPage onNavigate={navigate} />;
    }

    if (pathname === '/docs') {
      return <DocsPage onNavigate={navigate} />;
    }

    if (pathname === '/blog') {
      return <BlogPage onNavigate={navigate} />;
    }

    if (pathname.startsWith('/blog/')) {
      const slug = pathname.replace('/blog/', '');
      return <BlogPostPage slug={slug} onNavigate={navigate} />;
    }

    if (pathname === '/status') {
      return <StatusPage onNavigate={navigate} />;
    }

    if (pathname === '/contact') {
      return <ContactPage onNavigate={navigate} />;
    }

    if (pathname === '/terms') {
      return <LegalPage tab="terms" onNavigate={navigate} />;
    }

    if (pathname === '/privacy') {
      return <LegalPage tab="privacy" onNavigate={navigate} />;
    }

    if (pathname === '/sla') {
      return <LegalPage tab="sla" onNavigate={navigate} />;
    }

    if (pathname === '/refund') {
      return <LegalPage tab="refund" onNavigate={navigate} />;
    }

    // 2. AUTH ROUTES
    if (pathname === '/login') {
      return <LoginPage onNavigate={navigate} />;
    }

    if (pathname === '/register') {
      return <RegisterPage onNavigate={navigate} />;
    }

    if (pathname === '/forgot-password') {
      return <ForgotPasswordPage onNavigate={navigate} />;
    }

    // 3. USER DASHBOARD ROUTES
    if (pathname.startsWith('/dashboard')) {
      let pageComponent = <OverviewPage onNavigate={navigate} />;

      if (pathname === '/dashboard/services') {
        pageComponent = <ServicesListPage onNavigate={navigate} />;
      } else if (pathname.startsWith('/dashboard/services/')) {
        const srvId = pathname.replace('/dashboard/services/', '');
        pageComponent = <ServiceDetailPage serviceId={srvId} onNavigate={navigate} />;
      } else if (pathname === '/dashboard/orders') {
        pageComponent = <OrdersListPage onNavigate={navigate} />;
      } else if (pathname.startsWith('/dashboard/orders/')) {
        const ordId = pathname.replace('/dashboard/orders/', '');
        pageComponent = <OrderDetailPage orderId={ordId} onNavigate={navigate} />;
      } else if (pathname === '/dashboard/wallet') {
        pageComponent = <WalletPage onNavigate={navigate} />;
      } else if (pathname === '/dashboard/tickets') {
        pageComponent = <TicketsListPage onNavigate={navigate} />;
      } else if (pathname === '/dashboard/tickets/new') {
        pageComponent = <TicketCreatePage onNavigate={navigate} />;
      } else if (pathname.startsWith('/dashboard/tickets/')) {
        const tckId = pathname.replace('/dashboard/tickets/', '');
        pageComponent = <TicketDetailPage ticketId={tckId} onNavigate={navigate} />;
      } else if (pathname === '/dashboard/profile') {
        pageComponent = <ProfilePage onNavigate={navigate} />;
      } else if (pathname === '/dashboard/api') {
        pageComponent = <ApiKeysPage onNavigate={navigate} />;
      } else if (pathname === '/dashboard/notifications') {
        pageComponent = <NotificationsPage onNavigate={navigate} />;
      }

      return (
        <DashboardLayout currentPath={pathname} onNavigate={navigate}>
          {pageComponent}
        </DashboardLayout>
      );
    }

    // 4. ADMIN PORTAL ROUTES
    if (pathname.startsWith('/admin')) {
      if (!isAdmin) {
        return <AccessDeniedPage onNavigate={navigate} />;
      }

      let adminPageComponent = <AdminOverviewPage onNavigate={navigate} />;

      if (pathname === '/admin/products') {
        adminPageComponent = <AdminProductsPage onNavigate={navigate} />;
      } else if (pathname === '/admin/orders') {
        adminPageComponent = <AdminOrdersPage onNavigate={navigate} />;
      } else if (pathname === '/admin/users') {
        adminPageComponent = <AdminUsersPage onNavigate={navigate} />;
      } else if (pathname === '/admin/tickets') {
        adminPageComponent = <AdminTicketsPage onNavigate={navigate} />;
      } else if (pathname === '/admin/coupons') {
        adminPageComponent = <AdminCouponsPage onNavigate={navigate} />;
      } else if (pathname === '/admin/audit-logs') {
        adminPageComponent = <AdminAuditLogsPage onNavigate={navigate} />;
      }

      return (
        <AdminLayout currentPath={pathname} onNavigate={navigate}>
          {adminPageComponent}
        </AdminLayout>
      );
    }

    // Fallback 404
    return <NotFoundPage onNavigate={navigate} />;
  };

  // Determine if top Header/Footer should be shown (shown for all public and auth routes, hidden inside Dashboard and Admin layouts)
  const isDashboardOrAdmin = pathname.startsWith('/dashboard') || (pathname.startsWith('/admin') && isAdmin);

  return (
    <div className="app-wrapper">
      {!isDashboardOrAdmin && <Header currentPath={pathname} onNavigate={navigate} />}
      <div className="main-content">
        {renderContent()}
      </div>
      {!isDashboardOrAdmin && <Footer onNavigate={navigate} />}
    </div>
  );
}
