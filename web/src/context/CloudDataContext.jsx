import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_SERVICES,
  INITIAL_ORDERS,
  INITIAL_TRANSACTIONS,
  INITIAL_TICKETS,
  INITIAL_NOTIFICATIONS,
  INITIAL_API_KEYS,
  INITIAL_AUDIT_LOGS,
  INITIAL_USERS
} from '../data/initialData';
import { PRODUCTS as INITIAL_PRODUCTS, COUPONS as INITIAL_COUPONS } from '../data/products';
import { useAuth } from './AuthContext';

const CloudDataContext = createContext();

export function CloudDataProvider({ children }) {
  const { user, updateProfile } = useAuth();

  // 1. Services Store
  const [services, setServices] = useState(() => {
    const saved = localStorage.getItem('nexus_cloud_services');
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  // 2. Orders Store
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('nexus_cloud_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  // 3. Transactions Store
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('nexus_cloud_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  // 4. Tickets Store
  const [tickets, setTickets] = useState(() => {
    const saved = localStorage.getItem('nexus_cloud_tickets');
    return saved ? JSON.parse(saved) : INITIAL_TICKETS;
  });

  // 5. Notifications Store
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('nexus_cloud_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // 6. API Keys Store
  const [apiKeys, setApiKeys] = useState(() => {
    const saved = localStorage.getItem('nexus_cloud_apikeys');
    return saved ? JSON.parse(saved) : INITIAL_API_KEYS;
  });

  // 7. Admin Products Store
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('nexus_cloud_products_list');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  // 8. Admin Users Store
  const [usersList, setUsersList] = useState(() => {
    const saved = localStorage.getItem('nexus_cloud_users_list');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  // 9. Admin Audit Logs Store
  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem('nexus_cloud_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  // 10. Coupons Store
  const [coupons, setCoupons] = useState(() => {
    const saved = localStorage.getItem('nexus_cloud_coupons');
    return saved ? JSON.parse(saved) : INITIAL_COUPONS;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('nexus_cloud_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('nexus_cloud_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('nexus_cloud_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('nexus_cloud_tickets', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem('nexus_cloud_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('nexus_cloud_apikeys', JSON.stringify(apiKeys));
  }, [apiKeys]);

  useEffect(() => {
    localStorage.setItem('nexus_cloud_products_list', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('nexus_cloud_users_list', JSON.stringify(usersList));
  }, [usersList]);

  useEffect(() => {
    localStorage.setItem('nexus_cloud_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('nexus_cloud_coupons', JSON.stringify(coupons));
  }, [coupons]);

  // Periodic simulated live resource fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setServices(prev =>
        prev.map(srv => {
          if (srv.status !== 'running') return srv;
          const cpuDelta = (Math.random() * 6 - 3).toFixed(1);
          const ramDelta = (Math.random() * 2 - 1).toFixed(1);
          const netInDelta = (Math.random() * 8 - 4).toFixed(1);
          const netOutDelta = (Math.random() * 12 - 6).toFixed(1);

          return {
            ...srv,
            metrics: {
              ...srv.metrics,
              cpuUsage: Math.max(5, Math.min(95, +(srv.metrics.cpuUsage + +cpuDelta).toFixed(1))),
              ramUsage: Math.max(15, Math.min(90, +(srv.metrics.ramUsage + +ramDelta).toFixed(1))),
              networkIn: Math.max(2, Math.min(500, +(srv.metrics.networkIn + +netInDelta).toFixed(1))),
              networkOut: Math.max(5, Math.min(800, +(srv.metrics.networkOut + +netOutDelta).toFixed(1)))
            }
          };
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // --- SERVICE ACTIONS ---
  const startService = (serviceId) => {
    setServices(prev =>
      prev.map(s => (s.id === serviceId ? { ...s, status: 'running' } : s))
    );
    addAuditLog('SERVICE_START', `Bật máy chủ ${serviceId}`);
  };

  const stopService = (serviceId) => {
    setServices(prev =>
      prev.map(s => (s.id === serviceId ? { ...s, status: 'stopped', metrics: { ...s.metrics, cpuUsage: 0, ramUsage: 0, networkIn: 0, networkOut: 0 } } : s))
    );
    addAuditLog('SERVICE_STOP', `Tắt máy chủ ${serviceId}`);
  };

  const restartService = (serviceId) => {
    setServices(prev =>
      prev.map(s => (s.id === serviceId ? { ...s, status: 'restarting' } : s))
    );
    setTimeout(() => {
      setServices(prev =>
        prev.map(s => (s.id === serviceId ? { ...s, status: 'running' } : s))
      );
    }, 2500);
    addAuditLog('SERVICE_REBOOT', `Khởi động lại máy chủ ${serviceId}`);
  };

  const reinstallServiceOs = (serviceId, newOsId, newOsName, rootPassword) => {
    setServices(prev =>
      prev.map(s =>
        s.id === serviceId
          ? {
              ...s,
              status: 'rebuilding',
              os: newOsId,
              osName: newOsName,
              rootPass: rootPassword
            }
          : s
      )
    );

    setTimeout(() => {
      setServices(prev =>
        prev.map(s => (s.id === serviceId ? { ...s, status: 'running' } : s))
      );
    }, 3000);

    addAuditLog('SERVICE_REINSTALL_OS', `Cài lại HĐH cho ${serviceId}: ${newOsName}`);
  };

  const changeServicePassword = (serviceId, newPassword) => {
    setServices(prev =>
      prev.map(s => (s.id === serviceId ? { ...s, rootPass: newPassword } : s))
    );
    addAuditLog('SERVICE_CHANGE_PASSWORD', `Đổi mật khẩu máy chủ ${serviceId}`);
  };

  const createSnapshot = (serviceId, snapshotName) => {
    const newSnapshot = {
      id: 'snp-' + Date.now(),
      name: snapshotName || `Snapshot-${new Date().toLocaleDateString('vi-VN')}`,
      size: (Math.random() * 15 + 10).toFixed(1) + ' GB',
      date: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    setServices(prev =>
      prev.map(s => {
        if (s.id === serviceId) {
          return {
            ...s,
            snapshots: [...(s.snapshots || []), newSnapshot]
          };
        }
        return s;
      })
    );
    addAuditLog('SNAPSHOT_CREATE', `Tạo Snapshot ${newSnapshot.name} cho máy chủ ${serviceId}`);
  };

  const deleteSnapshot = (serviceId, snapshotId) => {
    setServices(prev =>
      prev.map(s => {
        if (s.id === serviceId) {
          return {
            ...s,
            snapshots: (s.snapshots || []).filter(snap => snap.id !== snapshotId)
          };
        }
        return s;
      })
    );
  };

  const upgradeServicePlan = (serviceId, newCpu, newRam, newStorage) => {
    setServices(prev =>
      prev.map(s => {
        if (s.id === serviceId) {
          return {
            ...s,
            specs: {
              ...s.specs,
              cpu: newCpu,
              cpuLabel: `${newCpu} vCPU`,
              ram: newRam,
              ramLabel: `${newRam} GB RAM`,
              storage: newStorage,
              storageLabel: `${newStorage} GB NVMe Gen4`
            }
          };
        }
        return s;
      })
    );
    addAuditLog('SERVICE_UPGRADE', `Nâng cấp cấu hình máy chủ ${serviceId}`);
  };

  const renewService = (serviceId, months) => {
    setServices(prev =>
      prev.map(s => {
        if (s.id === serviceId) {
          const currentRenew = new Date(s.renewDate);
          currentRenew.setMonth(currentRenew.getMonth() + months);
          return {
            ...s,
            renewDate: currentRenew.toISOString()
          };
        }
        return s;
      })
    );
  };

  // --- ORDER & PAYMENT ACTIONS ---
  const createOrder = (orderData) => {
    const orderId = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      id: orderId,
      date: new Date().toISOString(),
      customerName: user?.name || orderData.customerName || 'Khách hàng',
      customerEmail: user?.email || orderData.customerEmail || 'customer@example.com',
      items: orderData.items,
      subtotal: orderData.subtotal,
      discount: orderData.discount || 0,
      tax: orderData.tax || 0,
      total: orderData.total,
      paymentMethod: orderData.paymentMethod, // 'wallet' | 'vietqr' | 'bank'
      paymentStatus: 'paid', // Instant completed for demo
      orderStatus: 'completed'
    };

    setOrders(prev => [newOrder, ...prev]);

    // If paid by wallet, deduct balance
    if (orderData.paymentMethod === 'wallet') {
      const newBal = (user?.balance || 0) - orderData.total;
      updateProfile({ balance: Math.max(0, newBal) });

      const newTxn = {
        id: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
        type: 'payment',
        description: `Thanh toán đơn hàng ${orderId}`,
        amount: -orderData.total,
        balanceBefore: user?.balance || 0,
        balanceAfter: Math.max(0, newBal),
        status: 'success',
        date: new Date().toISOString(),
        reference: orderId
      };
      setTransactions(prev => [newTxn, ...prev]);
    }

    // Auto-provision servers in services list
    orderData.items.forEach((item, idx) => {
      const srvId = `srv-${Math.floor(10000 + Math.random() * 90000)}`;
      const randomOctet3 = Math.floor(60 + Math.random() * 10);
      const randomOctet4 = Math.floor(10 + Math.random() * 240);
      const generatedIp = `103.145.${randomOctet3}.${randomOctet4}`;

      const provisionedService = {
        id: srvId,
        name: item.config?.hostname || `${item.productId}-${idx + 1}`,
        productId: item.productId,
        productName: item.productName,
        category: item.category || 'cloud-server',
        status: 'running',
        ip: generatedIp,
        ipv6: `2405:4803:c001:${randomOctet4}::1`,
        datacenter: item.config?.datacenterId || 'vn-hn',
        datacenterName: item.config?.datacenter || 'Hà Nội, VN (Viettel IDC)',
        os: item.config?.osId || 'ubuntu-24',
        osName: item.config?.os || 'Ubuntu 24.04 LTS',
        specs: {
          cpu: typeof item.config?.cpu === 'number' ? item.config.cpu : 4,
          cpuLabel: `${item.config?.cpu || '4 vCPU'}`,
          ram: typeof item.config?.ram === 'number' ? item.config.ram : 8,
          ramLabel: `${item.config?.ram || '8 GB'} RAM`,
          storage: typeof item.config?.storage === 'number' ? item.config.storage : 80,
          storageLabel: `${item.config?.storage || '80 GB'} NVMe Enterprise`,
          bandwidth: '1 Gbps Không giới hạn'
        },
        metrics: {
          cpuUsage: 14.5,
          ramUsage: 22.0,
          diskUsage: 15.0,
          networkIn: 8.0,
          networkOut: 14.2,
          uptimeHours: 1
        },
        rootUser: 'root',
        rootPass: 'Nx$' + Math.random().toString(36).substring(2, 8) + '!2026',
        priceMonthly: item.unitPriceMonthly || 289000,
        billingCycle: `${item.config?.billingCycleMonths || 1}m`,
        createdDate: new Date().toISOString(),
        renewDate: new Date(Date.now() + (item.config?.billingCycleMonths || 1) * 30 * 86400000).toISOString(),
        autoRenew: true,
        snapshots: []
      };

      setServices(prev => [provisionedService, ...prev]);
    });

    // Add Notification
    addNotification({
      category: 'order',
      title: `Đơn hàng ${orderId} đã hoàn tất`,
      message: `Dịch vụ của bạn đã được kích hoạt thành công trên hệ thống.`,
      link: `/dashboard/orders`
    });

    addAuditLog('ORDER_CREATE', `Tạo đơn hàng ${orderId} trị giá ${orderData.total}đ`);
    return newOrder;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, orderStatus: newStatus } : o))
    );
    addAuditLog('ORDER_STATUS_UPDATE', `Cập nhật trạng thái đơn ${orderId} -> ${newStatus}`);
  };

  // --- WALLET TOP-UP ACTIONS ---
  const topUpWallet = (amount, method = 'vietqr') => {
    const currentBalance = user?.balance || 0;
    const newBalance = currentBalance + amount;
    updateProfile({ balance: newBalance });

    const newTxn = {
      id: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
      type: 'deposit',
      description: `Nạp tiền vào ví qua ${method === 'vietqr' ? 'VietQR tự động' : 'Chuyển khoản'}`,
      amount: amount,
      balanceBefore: currentBalance,
      balanceAfter: newBalance,
      status: 'success',
      date: new Date().toISOString(),
      reference: `VQR-${Math.floor(10000 + Math.random() * 90000)}`
    };

    setTransactions(prev => [newTxn, ...prev]);

    addNotification({
      category: 'payment',
      title: 'Nạp tiền vào ví thành công',
      message: `Tài khoản đã được cộng ${new Intl.NumberFormat('vi-VN').format(amount)}đ. Số dư mới: ${new Intl.NumberFormat('vi-VN').format(newBalance)}đ`,
      link: '/dashboard/wallet'
    });

    addAuditLog('WALLET_DEPOSIT', `Nạp ${amount}đ vào ví qua ${method}`);
    return newTxn;
  };

  // --- SUPPORT TICKETS ACTIONS ---
  const createTicket = ({ subject, department, priority, serviceId, message }) => {
    const ticketId = `TCK-${Math.floor(1000 + Math.random() * 9000)}`;
    const matchedService = services.find(s => s.id === serviceId);

    const newTicket = {
      id: ticketId,
      subject,
      department,
      departmentName: department === 'technical' ? 'Phòng Kỹ thuật' : department === 'billing' ? 'Phòng Kế toán & Thanh toán' : 'Phòng Kinh doanh',
      priority,
      status: 'open',
      serviceId: serviceId || null,
      serviceName: matchedService ? matchedService.name : 'Dịch vụ chung',
      createdDate: new Date().toISOString(),
      lastUpdate: new Date().toISOString(),
      messages: [
        {
          id: 'msg-' + Date.now(),
          senderType: 'user',
          senderName: user?.name || 'Khách hàng',
          time: new Date().toISOString(),
          message
        }
      ]
    };

    setTickets(prev => [newTicket, ...prev]);

    addNotification({
      category: 'system',
      title: `Ticket ${ticketId} đã được tạo`,
      message: `Kỹ thuật viên đang xử lý yêu cầu "${subject}".`,
      link: `/dashboard/tickets/${ticketId}`
    });

    addAuditLog('TICKET_CREATE', `Tạo Ticket hỗ trợ ${ticketId}: ${subject}`);
    return newTicket;
  };

  const addTicketMessage = (ticketId, messageText, isStaff = false) => {
    const newMsg = {
      id: 'msg-' + Date.now(),
      senderType: isStaff ? 'staff' : 'user',
      senderName: isStaff ? 'Nguyễn Anh Đức (Kỹ thuật viên)' : (user?.name || 'Khách hàng'),
      time: new Date().toISOString(),
      message: messageText
    };

    setTickets(prev =>
      prev.map(t => {
        if (t.id === ticketId) {
          return {
            ...t,
            status: isStaff ? 'answered' : 'customer_reply',
            lastUpdate: new Date().toISOString(),
            messages: [...t.messages, newMsg]
          };
        }
        return t;
      })
    );
  };

  const closeTicket = (ticketId) => {
    setTickets(prev =>
      prev.map(t => (t.id === ticketId ? { ...t, status: 'closed' } : t))
    );
    addAuditLog('TICKET_CLOSE', `Đóng ticket ${ticketId}`);
  };

  // --- API KEY ACTIONS ---
  const createApiKey = (keyName, permissions) => {
    const rawSecret = 'nxc_live_' + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const newKey = {
      id: 'key-' + Date.now(),
      name: keyName,
      tokenPrefix: rawSecret.substring(0, 15) + '...',
      fullToken: rawSecret,
      permissions: permissions || ['servers:read', 'servers:control'],
      createdDate: new Date().toISOString(),
      lastUsed: 'Chưa sử dụng',
      status: 'active'
    };

    setApiKeys(prev => [newKey, ...prev]);
    addAuditLog('API_KEY_CREATE', `Tạo API Key mới: ${keyName}`);
    return newKey;
  };

  const revokeApiKey = (keyId) => {
    setApiKeys(prev => prev.filter(k => k.id !== keyId));
    addAuditLog('API_KEY_REVOKE', `Thu hồi API Key ${keyId}`);
  };

  // --- NOTIFICATIONS ACTIONS ---
  const addNotification = ({ category, title, message, link }) => {
    const newNotif = {
      id: 'notif-' + Date.now(),
      category: category || 'system',
      title,
      message,
      date: new Date().toISOString(),
      read: false,
      link: link || '/dashboard/notifications'
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (notifId) => {
    setNotifications(prev =>
      prev.map(n => (n.id === notifId ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // --- ADMIN ACTIONS ---
  const adjustUserBalance = (userId, amount, reason) => {
    if (!reason || reason.trim() === '') {
      throw new Error('Bắt buộc phải nhập lý do audit log khi thay đổi số dư người dùng.');
    }

    setUsersList(prev =>
      prev.map(u => {
        if (u.id === userId) {
          const newBal = (u.balance || 0) + amount;
          if (user && user.id === userId) {
            updateProfile({ balance: newBal });
          }
          return { ...u, balance: newBal };
        }
        return u;
      })
    );

    const targetUser = usersList.find(u => u.id === userId);
    addAuditLog(
      'ADMIN_BALANCE_ADJUST',
      `Điều chỉnh số dư ${amount >= 0 ? '+' : ''}${amount}đ cho user ${targetUser?.email || userId}. Lý do: ${reason}`
    );
  };

  const toggleUserBan = (userId) => {
    setUsersList(prev =>
      prev.map(u => {
        if (u.id === userId) {
          const newStatus = u.status === 'active' ? 'banned' : 'active';
          addAuditLog('USER_STATUS_CHANGE', `${newStatus === 'banned' ? 'Khóa' : 'Mở khóa'} tài khoản ${u.email}`);
          return { ...u, status: newStatus };
        }
        return u;
      })
    );
  };

  const addOrUpdateProduct = (productData) => {
    setProducts(prev => {
      const exists = prev.some(p => p.id === productData.id);
      if (exists) {
        return prev.map(p => (p.id === productData.id ? { ...p, ...productData } : p));
      } else {
        return [productData, ...prev];
      }
    });
    addAuditLog('PRODUCT_EDIT', `Cập nhật thông tin sản phẩm ${productData.name}`);
  };

  const deleteProduct = (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    addAuditLog('PRODUCT_DELETE', `Xóa sản phẩm ${productId}`);
  };

  const createAdminCoupon = (couponData) => {
    setCoupons(prev => [couponData, ...prev]);
    addAuditLog('COUPON_CREATE', `Tạo mã giảm giá mới: ${couponData.code}`);
  };

  const deleteAdminCoupon = (couponCode) => {
    setCoupons(prev => prev.filter(c => c.code !== couponCode));
    addAuditLog('COUPON_DELETE', `Xóa mã giảm giá: ${couponCode}`);
  };

  const addAuditLog = (action, details) => {
    const newLog = {
      id: 'aud-' + Date.now(),
      actor: user?.email || 'admin@nexuscloud.vn',
      action,
      target: user?.email || 'System',
      details,
      ip: '113.190.244.12',
      date: new Date().toISOString()
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  return (
    <CloudDataContext.Provider
      value={{
        services,
        orders,
        transactions,
        tickets,
        notifications,
        unreadNotificationsCount: notifications.filter(n => !n.read).length,
        apiKeys,
        products,
        usersList,
        auditLogs,
        coupons,
        // Service Actions
        startService,
        stopService,
        restartService,
        reinstallServiceOs,
        changeServicePassword,
        createSnapshot,
        deleteSnapshot,
        upgradeServicePlan,
        renewService,
        // Order Actions
        createOrder,
        updateOrderStatus,
        // Wallet Actions
        topUpWallet,
        // Ticket Actions
        createTicket,
        addTicketMessage,
        closeTicket,
        // API Actions
        createApiKey,
        revokeApiKey,
        // Notification Actions
        markNotificationAsRead,
        markAllNotificationsAsRead,
        // Admin Actions
        adjustUserBalance,
        toggleUserBan,
        addOrUpdateProduct,
        deleteProduct,
        createAdminCoupon,
        deleteAdminCoupon,
        addAuditLog
      }}
    >
      {children}
    </CloudDataContext.Provider>
  );
}

export function useCloudData() {
  const context = useContext(CloudDataContext);
  if (!context) {
    throw new Error('useCloudData must be used within a CloudDataProvider');
  }
  return context;
}
