export const INITIAL_USERS = [
  {
    id: 'usr-1',
    name: 'Nguyễn Hoàng Sơn',
    username: 'sonnguyen',
    email: 'sonnguyen@example.com',
    phone: '0988 123 456',
    company: 'Nexus Tech Solutions JSC',
    taxId: '0108928374',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    balance: 4850000, // 4,850,000 VND
    role: 'customer', // 'customer' | 'admin' | 'staff'
    twoFactorEnabled: true,
    createdDate: '2025-06-10T08:30:00Z',
    status: 'active'
  },
  {
    id: 'usr-admin',
    name: 'Quản Trị Viên Nexus',
    username: 'admin',
    email: 'admin@nexuscloud.vn',
    phone: '0909 999 888',
    company: 'Nexus Cloud Infrastructure Co., Ltd',
    taxId: '0109999999',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    balance: 99999999,
    role: 'admin',
    twoFactorEnabled: true,
    createdDate: '2024-01-01T00:00:00Z',
    status: 'active'
  }
];

export const INITIAL_SERVICES = [
  {
    id: 'srv-91024',
    name: 'prod-api-cluster-01',
    productId: 'cloud-pro',
    productName: 'Cloud Server Pro',
    category: 'cloud-server',
    status: 'running', // 'running' | 'stopped' | 'restarting' | 'rebuilding'
    ip: '103.145.62.110',
    ipv6: '2405:4803:c001:110::1',
    datacenter: 'vn-hn',
    datacenterName: 'Hà Nội, VN (Viettel IDC Pháp Vân)',
    os: 'ubuntu-24',
    osName: 'Ubuntu 24.04 LTS (Noble)',
    specs: {
      cpu: 4,
      cpuLabel: '4 vCPU (AMD EPYC™ 3.4GHz)',
      ram: 8,
      ramLabel: '8 GB DDR4 ECC',
      storage: 80,
      storageLabel: '80 GB NVMe Gen4 Enterprise',
      bandwidth: 'Không giới hạn (1 Gbps Port)'
    },
    metrics: {
      cpuUsage: 28.4,
      ramUsage: 54.2,
      diskUsage: 38.0,
      networkIn: 45.2, // Mbps
      networkOut: 89.6, // Mbps
      uptimeHours: 348
    },
    rootUser: 'root',
    rootPass: 'Nx$99Kx#2026!Prod',
    priceMonthly: 289000,
    billingCycle: '1m',
    createdDate: '2025-11-12T14:20:00Z',
    renewDate: '2026-09-12T14:20:00Z',
    autoRenew: true,
    snapshots: [
      { id: 'snp-1', name: 'Snapshot-Auto-Weekly-01', size: '24.5 GB', date: '2026-03-01 02:00' },
      { id: 'snp-2', name: 'Pre-Deploy-Backend-v2.4', size: '28.1 GB', date: '2026-03-10 18:30' }
    ]
  },
  {
    id: 'srv-88219',
    name: 'mc-smp-vietnam-node',
    productId: 'game-minecraft',
    productName: 'Minecraft Ultra Server',
    category: 'game-server',
    status: 'running',
    ip: '103.145.63.205',
    ipv6: '2405:4803:c001:205::1',
    datacenter: 'vn-hcm',
    datacenterName: 'TP.HCM, VN (FPT Q9 High-Tech)',
    os: 'ubuntu-22',
    osName: 'Ubuntu 22.04 LTS + PaperMC 1.20.4',
    specs: {
      cpu: 4,
      cpuLabel: 'Ryzen 9 7950X (5.7GHz Boost)',
      ram: 6,
      ramLabel: '6 GB DDR5 5600MHz',
      storage: 50,
      storageLabel: '50 GB NVMe Gen4 (7000MB/s)',
      bandwidth: '1 Gbps Game Anti-DDoS Port'
    },
    metrics: {
      cpuUsage: 42.1,
      ramUsage: 78.5,
      diskUsage: 45.0,
      networkIn: 12.4,
      networkOut: 36.8,
      uptimeHours: 194
    },
    rootUser: 'pterodactyl',
    rootPass: 'GameCraft#8899!',
    priceMonthly: 169000,
    billingCycle: '3m',
    createdDate: '2026-01-05T10:00:00Z',
    renewDate: '2026-10-05T10:00:00Z',
    autoRenew: true,
    snapshots: [
      { id: 'snp-3', name: 'World-Backup-Full', size: '12.8 GB', date: '2026-03-12 04:00' }
    ]
  },
  {
    id: 'srv-77103',
    name: 'dev-staging-env',
    productId: 'vps-turbo',
    productName: 'VPS NVMe Turbo 4G',
    category: 'vps',
    status: 'stopped',
    ip: '103.145.62.118',
    ipv6: '2405:4803:c001:118::1',
    datacenter: 'vn-hn',
    datacenterName: 'Hà Nội, VN (Viettel IDC Pháp Vân)',
    os: 'debian-12',
    osName: 'Debian 12 (Bookworm)',
    specs: {
      cpu: 2,
      cpuLabel: '2 vCPU High Frequency',
      ram: 4,
      ramLabel: '4 GB RAM DDR4',
      storage: 60,
      storageLabel: '60 GB SSD NVMe Gen4',
      bandwidth: '500 Mbps Port'
    },
    metrics: {
      cpuUsage: 0,
      ramUsage: 0,
      diskUsage: 22.0,
      networkIn: 0,
      networkOut: 0,
      uptimeHours: 0
    },
    rootUser: 'root',
    rootPass: 'Staging#Pass2026!',
    priceMonthly: 199000,
    billingCycle: '1m',
    createdDate: '2026-02-15T09:15:00Z',
    renewDate: '2026-08-15T09:15:00Z',
    autoRenew: false,
    snapshots: []
  }
];

export const INITIAL_ORDERS = [
  {
    id: 'ORD-2026-8942',
    date: '2026-03-10T14:32:00Z',
    customerName: 'Nguyễn Hoàng Sơn',
    customerEmail: 'sonnguyen@example.com',
    items: [
      {
        productId: 'cloud-pro',
        productName: 'Cloud Server Pro',
        plan: '4 vCPU / 4GB RAM / 80GB NVMe',
        datacenter: 'Hà Nội, VN (Viettel IDC)',
        os: 'Ubuntu 24.04 LTS',
        billingCycle: '3 Tháng (Giảm 5%)',
        price: 823650,
        quantity: 1
      }
    ],
    subtotal: 867000,
    discount: 43350,
    tax: 0,
    total: 823650,
    paymentMethod: 'wallet', // 'wallet' | 'vietqr' | 'bank'
    paymentStatus: 'paid', // 'pending' | 'paid' | 'failed' | 'refunded'
    orderStatus: 'completed' // 'pending' | 'processing' | 'completed' | 'cancelled'
  },
  {
    id: 'ORD-2026-7810',
    date: '2026-01-05T10:00:00Z',
    customerName: 'Nguyễn Hoàng Sơn',
    customerEmail: 'sonnguyen@example.com',
    items: [
      {
        productId: 'game-minecraft',
        productName: 'Minecraft Ultra Server',
        plan: 'Ryzen 9 / 6GB DDR5 / 50GB NVMe',
        datacenter: 'TP.HCM, VN (FPT Q9)',
        os: 'Ubuntu 22.04 + PaperMC',
        billingCycle: '3 Tháng (Giảm 5%)',
        price: 481650,
        quantity: 1
      }
    ],
    subtotal: 507000,
    discount: 25350,
    tax: 0,
    total: 481650,
    paymentMethod: 'vietqr',
    paymentStatus: 'paid',
    orderStatus: 'completed'
  }
];

export const INITIAL_TRANSACTIONS = [
  {
    id: 'TXN-90214',
    type: 'deposit', // 'deposit' | 'payment' | 'refund' | 'admin_adjust'
    description: 'Nạp tiền vào ví qua VietQR tự động (MBBank)',
    amount: 5000000,
    balanceBefore: 673650,
    balanceAfter: 5673650,
    status: 'success',
    date: '2026-03-10T14:15:00Z',
    reference: 'VQR-MB-99281'
  },
  {
    id: 'TXN-90215',
    type: 'payment',
    description: 'Thanh toán đơn hàng ORD-2026-8942 (Cloud Server Pro 3 Tháng)',
    amount: -823650,
    balanceBefore: 5673650,
    balanceAfter: 4850000,
    status: 'success',
    date: '2026-03-10T14:32:00Z',
    reference: 'ORD-2026-8942'
  }
];

export const INITIAL_TICKETS = [
  {
    id: 'TCK-1089',
    subject: 'Yêu cầu hỗ trợ cấu hình Reverse DNS (PTR Record) cho dải IP 103.145.62.110',
    department: 'technical', // 'technical' | 'billing' | 'sales'
    departmentName: 'Phòng Kỹ thuật',
    priority: 'high', // 'low' | 'medium' | 'high' | 'urgent'
    status: 'open', // 'open' | 'answered' | 'customer_reply' | 'closed'
    serviceId: 'srv-91024',
    serviceName: 'prod-api-cluster-01',
    createdDate: '2026-03-14T09:30:00Z',
    lastUpdate: '2026-03-14T11:45:00Z',
    messages: [
      {
        id: 'msg-1',
        senderType: 'user',
        senderName: 'Nguyễn Hoàng Sơn',
        time: '2026-03-14T09:30:00Z',
        message: 'Chào đội ngũ kỹ thuật, tôi cần trỏ bản ghi PTR của IP 103.145.62.110 về hostname mail.nexustech.vn để phục vụ gửi email transactional. Nhờ kỹ thuật hỗ trợ giúp tôi. Cảm ơn!'
      },
      {
        id: 'msg-2',
        senderType: 'staff',
        senderName: 'Lê Văn Nam (Kỹ thuật Tier 2)',
        time: '2026-03-14T11:45:00Z',
        message: 'Dạ chào anh Sơn, kỹ thuật đã tiếp nhận yêu cầu cấu hình PTR Record cho IP 103.145.62.110 -> mail.nexustech.vn trên hệ thống DNS trung tâm. Quá trình phân giải DNS toàn cầu sẽ hoàn tất trong vòng 1-2 giờ tới. Anh vui lòng kiểm tra lại sau thời gian trên nhé ạ.'
      }
    ]
  },
  {
    id: 'TCK-1042',
    subject: 'Mở Port 25565 và cấu hình Game Firewall Filter',
    department: 'technical',
    departmentName: 'Phòng Kỹ thuật',
    priority: 'medium',
    status: 'closed',
    serviceId: 'srv-88219',
    serviceName: 'mc-smp-vietnam-node',
    createdDate: '2026-01-06T15:20:00Z',
    lastUpdate: '2026-01-06T16:00:00Z',
    messages: [
      {
        id: 'msg-3',
        senderType: 'user',
        senderName: 'Nguyễn Hoàng Sơn',
        time: '2026-01-06T15:20:00Z',
        message: 'Nhờ kỹ thuật kiểm tra giúp firewall port 25565 của server Minecraft đã được mở ra ngoài internet chưa ạ.'
      },
      {
        id: 'msg-4',
        senderType: 'staff',
        senderName: 'Trần Minh (Support Game)',
        time: '2026-01-06T16:00:00Z',
        message: 'Kỹ thuật đã kiểm tra và cấu hình đầy đủ rule Anti-DDoS Layer 7 cho cổng 25565 TCP/UDP của server anh rồi ạ. Hiện tại game thủ đã có thể kết nối bình thường. Chúc anh một ngày tốt lành!'
      }
    ]
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    category: 'service', // 'system' | 'order' | 'payment' | 'service' | 'security'
    title: 'Bản sao lưu Snapshot định kỳ hoàn tất',
    message: 'Hệ thống đã hoàn tất sao lưu snapshot tự động cho máy chủ prod-api-cluster-01 thành công.',
    date: '2026-03-15T02:30:00Z',
    read: false,
    link: '/dashboard/services/srv-91024'
  },
  {
    id: 'notif-2',
    category: 'payment',
    title: 'Nạp tiền vào ví thành công',
    message: 'Tài khoản của bạn đã được cộng 5.000.000đ qua chuyển khoản VietQR tự động.',
    date: '2026-03-10T14:15:00Z',
    read: true,
    link: '/dashboard/wallet'
  },
  {
    id: 'notif-3',
    category: 'system',
    title: 'Thông báo nâng cấp hạ tầng mạng Core Switch',
    message: 'Lịch bảo trì nâng cấp Core Switch tại Datacenter Viettel IDC vào lúc 02:00 - 03:00 ngày 25/03/2026.',
    date: '2026-03-08T09:00:00Z',
    read: true,
    link: '/dashboard/notifications'
  }
];

export const INITIAL_API_KEYS = [
  {
    id: 'key-1',
    name: 'CI/CD GitHub Actions Deployer',
    tokenPrefix: 'nxc_live_9a8f7b...',
    fullToken: 'nxc_live_9a8f7b6c5d4e3f2a1b0c992817263544',
    permissions: ['servers:read', 'servers:control', 'snapshots:create'],
    createdDate: '2026-02-01T10:00:00Z',
    lastUsed: '2026-03-14T22:15:00Z',
    status: 'active'
  },
  {
    id: 'key-2',
    name: 'Terraform Automation Infrastructure',
    tokenPrefix: 'nxc_live_4e5d6c...',
    fullToken: 'nxc_live_4e5d6c7b8a9f0e1d2c3b4a5968778655',
    permissions: ['servers:all', 'billing:read', 'network:all'],
    createdDate: '2026-01-15T08:30:00Z',
    lastUsed: '2026-03-10T14:00:00Z',
    status: 'active'
  }
];

export const INITIAL_AUDIT_LOGS = [
  {
    id: 'aud-1',
    actor: 'admin@nexuscloud.vn',
    action: 'USER_BALANCE_ADJUST',
    target: 'sonnguyen@example.com',
    details: 'Cộng khuyến mãi đặc biệt 500,000đ theo chương trình VIP Partner',
    ip: '14.232.190.88',
    date: '2026-03-12T16:45:00Z'
  },
  {
    id: 'aud-2',
    actor: 'admin@nexuscloud.vn',
    action: 'PRODUCT_PRICE_UPDATE',
    target: 'cloud-pro',
    details: 'Cập nhật giá cơ bản gói Cloud Server Pro thành 289,000đ',
    ip: '14.232.190.88',
    date: '2026-03-01T10:00:00Z'
  },
  {
    id: 'aud-3',
    actor: 'sonnguyen@example.com',
    action: 'SERVER_REBOOT',
    target: 'srv-91024 (prod-api-cluster-01)',
    details: 'Thực hiện thao tác Restart máy chủ từ Web Dashboard',
    ip: '113.190.244.12',
    date: '2026-03-10T18:25:00Z'
  }
];
