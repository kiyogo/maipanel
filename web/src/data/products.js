export const PRODUCT_CATEGORIES = [
  { id: 'all', name: 'Tất cả dịch vụ', icon: 'Layers' },
  { id: 'cloud-server', name: 'Cloud Server', icon: 'Cloud' },
  { id: 'vps', name: 'VPS NVMe', icon: 'Server' },
  { id: 'game-server', name: 'Game Server', icon: 'Gamepad2' },
  { id: 'hosting', name: 'Web Hosting', icon: 'Globe' },
  { id: 'storage', name: 'Object Storage', icon: 'Database' },
  { id: 'domain', name: 'Tên miền', icon: 'Search' },
  { id: 'backup', name: 'Cloud Backup', icon: 'ShieldCheck' },
  { id: 'dedicated', name: 'Dedicated Server', icon: 'Cpu' }
];

export const PRODUCTS = [
  // 1. CLOUD SERVERS (Main Flagship)
  {
    id: 'cloud-basic',
    name: 'Cloud Server Basic',
    slug: 'cloud-basic',
    category: 'cloud-server',
    badge: 'Phổ biến',
    tagline: 'Phù hợp website doanh nghiệp, API backend và ứng dụng vừa & nhỏ',
    basePriceMonthly: 129000,
    specs: {
      cpu: '2 vCPU (AMD EPYC™ 3.4GHz)',
      ram: '2 GB DDR4 ECC',
      storage: '40 GB NVMe Enterprise Gen4',
      bandwidth: 'Không giới hạn băng thông',
      networkSpeed: '1 Gbps Trong nước / 100 Mbps Quốc tế',
      ipv4: '1 IPv4 Riêng',
      ipv6: '1 IPv6 /64 Miễn phí',
      backup: 'Snapshot 1 bản tự động',
      ddos: 'Anti-DDoS 1.2 Tbps BGP Layer 4/7',
      uptime: '99.99% SLA Cam kết'
    },
    configOptions: {
      cpuSteps: [2, 4, 6, 8, 12, 16],
      ramSteps: [2, 4, 8, 16, 24, 32],
      storageMin: 40,
      storageMax: 500,
      storageStep: 10,
      cpuPricePerUnit: 35000, // per vCPU / month
      ramPricePerUnit: 25000, // per GB / month
      storagePricePerUnit: 1500 // per GB NVMe / month
    },
    popular: false
  },
  {
    id: 'cloud-pro',
    name: 'Cloud Server Pro',
    slug: 'cloud-pro',
    category: 'cloud-server',
    badge: 'Khuyên dùng',
    tagline: 'Hiệu năng cao cho hệ thống thương mại điện tử, microservices và database',
    basePriceMonthly: 289000,
    specs: {
      cpu: '4 vCPU (AMD EPYC™ 3.4GHz)',
      ram: '4 GB DDR4 ECC',
      storage: '80 GB NVMe Enterprise Gen4',
      bandwidth: 'Không giới hạn băng thông',
      networkSpeed: '1 Gbps Trong nước / 200 Mbps Quốc tế',
      ipv4: '1 IPv4 Riêng',
      ipv6: '1 IPv6 /64 Miễn phí',
      backup: 'Daily Backup + Snapshot 2 bản',
      ddos: 'Anti-DDoS 1.2 Tbps BGP Layer 4/7',
      uptime: '99.99% SLA Cam kết'
    },
    configOptions: {
      cpuSteps: [4, 6, 8, 12, 16, 24],
      ramSteps: [4, 8, 16, 24, 32, 64],
      storageMin: 80,
      storageMax: 1000,
      storageStep: 20,
      cpuPricePerUnit: 35000,
      ramPricePerUnit: 25000,
      storagePricePerUnit: 1500
    },
    popular: true
  },
  {
    id: 'cloud-business',
    name: 'Cloud Server Business',
    slug: 'cloud-business',
    category: 'cloud-server',
    badge: 'Hiệu năng cao',
    tagline: 'Cấu hình mạnh mẽ cho doanh nghiệp lớn, xử lý dữ liệu lớn và ERP',
    basePriceMonthly: 569000,
    specs: {
      cpu: '8 vCPU (AMD EPYC™ 3.4GHz)',
      ram: '8 GB DDR4 ECC',
      storage: '160 GB NVMe Enterprise Gen4',
      bandwidth: 'Không giới hạn băng thông',
      networkSpeed: '2 Gbps Trong nước / 400 Mbps Quốc tế',
      ipv4: '1 IPv4 Riêng',
      ipv6: '1 IPv6 /64 Miễn phí',
      backup: 'Daily Backup + Snapshot 3 bản',
      ddos: 'Anti-DDoS 1.2 Tbps BGP Layer 4/7',
      uptime: '99.99% SLA Cam kết'
    },
    configOptions: {
      cpuSteps: [8, 12, 16, 24, 32, 48],
      ramSteps: [8, 16, 24, 32, 64, 128],
      storageMin: 160,
      storageMax: 2000,
      storageStep: 50,
      cpuPricePerUnit: 35000,
      ramPricePerUnit: 25000,
      storagePricePerUnit: 1500
    },
    popular: false
  },
  {
    id: 'cloud-enterprise',
    name: 'Cloud Server Enterprise',
    slug: 'cloud-enterprise',
    category: 'cloud-server',
    badge: 'Tối thượng',
    tagline: 'Hạ tầng Dedicated vCPU độc quyền không chia sẻ, tối đa IOPS và thông lượng',
    basePriceMonthly: 1190000,
    specs: {
      cpu: '16 vCPU (Dedicated AMD EPYC™)',
      ram: '16 GB DDR4 ECC',
      storage: '320 GB NVMe Enterprise Gen4 (Hardware RAID 10)',
      bandwidth: 'Không giới hạn băng thông',
      networkSpeed: '10 Gbps Trong nước / 1 Gbps Quốc tế',
      ipv4: '2 IPv4 Riêng',
      ipv6: '1 IPv6 /64 Miễn phí',
      backup: 'Disaster Recovery + Live Replication',
      ddos: 'Anti-DDoS 1.2 Tbps BGP Layer 4/7 SLA',
      uptime: '99.99% SLA Cam kết'
    },
    configOptions: {
      cpuSteps: [16, 24, 32, 48, 64],
      ramSteps: [16, 32, 64, 128, 256],
      storageMin: 320,
      storageMax: 4000,
      storageStep: 100,
      cpuPricePerUnit: 35000,
      ramPricePerUnit: 25000,
      storagePricePerUnit: 1500
    },
    popular: false
  },

  // 2. VPS NVME
  {
    id: 'vps-starter',
    name: 'VPS NVMe Starter',
    slug: 'vps-starter',
    category: 'vps',
    badge: 'Tiết kiệm',
    tagline: 'Khởi đầu hoàn hảo cho lập trình viên, học tập và bot automation',
    basePriceMonthly: 79000,
    specs: {
      cpu: '1 vCPU Core',
      ram: '1 GB RAM',
      storage: '25 GB SSD NVMe',
      bandwidth: 'Băng thông không giới hạn',
      networkSpeed: '500 Mbps Port',
      ipv4: '1 IPv4',
      ddos: 'Anti-DDoS Cơ bản',
      uptime: '99.9% SLA'
    },
    popular: false
  },
  {
    id: 'vps-turbo',
    name: 'VPS NVMe Turbo 4G',
    slug: 'vps-turbo',
    category: 'vps',
    badge: 'Bán chạy',
    tagline: 'Cấu hình tiêu chuẩn chạy Node.js, Python, Golang, Docker containers',
    basePriceMonthly: 199000,
    specs: {
      cpu: '2 vCPU High Frequency',
      ram: '4 GB RAM DDR4',
      storage: '60 GB SSD NVMe Gen4',
      bandwidth: 'Băng thông không giới hạn',
      networkSpeed: '1 Gbps Port',
      ipv4: '1 IPv4',
      ddos: 'Anti-DDoS 1.2 Tbps',
      uptime: '99.95% SLA'
    },
    popular: true
  },
  {
    id: 'vps-storage',
    name: 'VPS Storage 1TB',
    slug: 'vps-storage',
    category: 'vps',
    badge: 'Lưu trữ lớn',
    tagline: 'Dung lượng ổ cứng cực lớn cho lưu file, media, backup data từ xa',
    basePriceMonthly: 399000,
    specs: {
      cpu: '2 vCPU',
      ram: '4 GB RAM',
      storage: '1000 GB HDD Enterprise (RAID 60)',
      bandwidth: '10 TB / Tháng',
      networkSpeed: '1 Gbps Port',
      ipv4: '1 IPv4',
      ddos: 'Anti-DDoS Bảo vệ',
      uptime: '99.9% SLA'
    },
    popular: false
  },

  // 3. GAME SERVERS
  {
    id: 'game-minecraft',
    name: 'Minecraft Ultra Server',
    slug: 'game-minecraft',
    category: 'game-server',
    badge: 'Tối ưu Game',
    tagline: 'Chạy vi xử lý xung nhịp 5.7GHz (Ryzen 9), chống lag, hỗ trợ Paper/Purpur/Forge/Fabric',
    basePriceMonthly: 169000,
    specs: {
      cpu: 'Ryzen 9 7950X (5.7GHz Boost)',
      ram: '6 GB DDR5 5600MHz',
      storage: '50 GB NVMe Gen4 (7000MB/s)',
      slots: 'Không giới hạn Slots',
      panel: 'Pterodactyl Panel Game',
      ddos: 'L4/L7 Game Anti-DDoS Filtered',
      backup: 'Tự động sao lưu mỗi 6 giờ'
    },
    popular: true
  },
  {
    id: 'game-palworld',
    name: 'Palworld / Rust Dedicated Node',
    slug: 'game-palworld',
    category: 'game-server',
    badge: 'RAM Khủng',
    tagline: 'Dành riêng cho các game ăn nhiều tài nguyên RAM (Palworld, Rust, Ark, CS2)',
    basePriceMonthly: 349000,
    specs: {
      cpu: 'Ryzen 9 7950X (4 Dedicated Threads)',
      ram: '16 GB DDR5 RAM',
      storage: '100 GB NVMe Gen4',
      slots: 'Tối đa 64 Players',
      panel: 'Pterodactyl 1-Click Modpack',
      ddos: 'Game Filter DDoS Shield',
      backup: 'Snapshot 1-Click Restore'
    },
    popular: false
  },

  // 4. WEB HOSTING
  {
    id: 'hosting-nvme-pro',
    name: 'cPanel NVMe Hosting Pro',
    slug: 'hosting-nvme-pro',
    category: 'hosting',
    badge: 'WordPress Speed',
    tagline: 'LiteSpeed Web Server Enterprise + LSCache, tối ưu 100% cho WordPress',
    basePriceMonthly: 69000,
    specs: {
      domains: '3 Tên miền riêng',
      storage: '10 GB NVMe Gen4',
      bandwidth: 'Không giới hạn',
      mailboxes: '10 Email theo tên miền',
      ssl: 'SSL Miễn phí vĩnh viễn',
      database: 'MariaDB 10.6 + Redis Cache',
      backup: 'JetBackup 7 bản sao lưu 7 ngày'
    },
    popular: false
  },
  {
    id: 'hosting-business',
    name: 'Business cPanel Turbo',
    slug: 'hosting-business',
    category: 'hosting',
    badge: 'Doanh nghiệp',
    tagline: 'Tài nguyên CPU 4 Cores / 4GB RAM riêng biệt, cam kết không nghẽn tài nguyên',
    basePriceMonthly: 189000,
    specs: {
      domains: 'Không giới hạn Tên miền',
      storage: '35 GB NVMe Gen4 Enterprise',
      bandwidth: 'Không giới hạn',
      mailboxes: 'Không giới hạn Email Domain',
      ssl: 'SSL Miễn phí vĩnh viễn',
      database: 'Redis Object Cache Riêng',
      backup: 'JetBackup 30 ngày'
    },
    popular: true
  },

  // 5. OBJECT STORAGE & BACKUP
  {
    id: 'storage-s3-standard',
    name: 'S3-Compatible Object Storage 500GB',
    slug: 'storage-s3-standard',
    category: 'storage',
    badge: 'API Ready',
    tagline: 'Tương thích 100% AWS S3 API, lưu trữ file tĩnh, hình ảnh CDN, video, media',
    basePriceMonthly: 120000,
    specs: {
      capacity: '500 GB Dung lượng Hot Storage',
      egress: '1 TB Miễn phí Egress Data/tháng',
      api: 'S3 API / CLI / Cyberduck / Rclone',
      replication: '3x Data Replication Cluster',
      uptime: '99.999999999% (11 Chín) Durability'
    },
    popular: false
  },
  {
    id: 'backup-veeam-cloud',
    name: 'Cloud Backup Veeam Engine',
    slug: 'backup-veeam-cloud',
    category: 'backup',
    badge: 'Bảo mật dữ liệu',
    tagline: 'Sao lưu tự động máy chủ từ xa, mã hóa AES-256, khôi phục chỉ với 1 click',
    basePriceMonthly: 99000,
    specs: {
      storage: '200 GB Mã hóa Backup',
      frequency: 'Lên lịch Hàng giờ / Hàng ngày',
      retention: 'Lưu trữ 30 điểm khôi phục',
      encryption: 'AES-256 Bit End-to-End'
    },
    popular: false
  },

  // 6. DOMAIN
  {
    id: 'domain-vn',
    name: 'Tên miền Quốc gia .VN',
    slug: 'domain-vn',
    category: 'domain',
    badge: 'Uy tín',
    tagline: 'Tên miền quốc gia Việt Nam khẳng định thương hiệu và bảo hộ pháp lý',
    basePriceMonthly: 450000, // per year
    billingPeriod: 'năm',
    specs: {
      type: 'Tên miền cấp cao .VN',
      dns: 'DNS Anycast miễn phí',
      lock: 'Khóa tên miền chống đánh cắp',
      whois: 'Hỗ trợ ẩn thông tin cá nhân'
    },
    popular: true
  },
  {
    id: 'domain-com',
    name: 'Tên miền Quốc tế .COM',
    slug: 'domain-com',
    category: 'domain',
    badge: 'Toàn cầu',
    tagline: 'Đuôi tên miền thông dụng nhất thế giới',
    basePriceMonthly: 280000, // per year
    billingPeriod: 'năm',
    specs: {
      type: 'Tên miền quốc tế .COM',
      dns: 'DNS Anycast tốc độ cao',
      lock: 'Domain Lock bảo mật',
      whois: 'Ẩn thông tin WHOIS miễn phí trọn đời'
    },
    popular: false
  }
];

export const BILLING_CYCLES = [
  { id: '1m', label: '1 Tháng', months: 1, discount: 0 },
  { id: '3m', label: '3 Tháng', months: 3, discount: 0.05, badge: 'Giảm 5%' },
  { id: '6m', label: '6 Tháng', months: 6, discount: 0.10, badge: 'Giảm 10%' },
  { id: '12m', label: '12 Tháng (1 Năm)', months: 12, discount: 0.20, badge: 'Giảm 20% + Tặng 1 tháng' }
];

export const COUPONS = [
  {
    code: 'CLOUD2026',
    discountPercent: 15,
    maxDiscount: 200000,
    minOrder: 100000,
    description: 'Giảm 15% cho đơn hàng đầu tiên (tối đa 200.000đ)'
  },
  {
    code: 'WELCOME10',
    discountPercent: 10,
    maxDiscount: 100000,
    minOrder: 50000,
    description: 'Giảm 10% chào mừng thành viên mới'
  },
  {
    code: 'PROMO50K',
    discountFixed: 50000,
    minOrder: 200000,
    description: 'Giảm ngay 50.000đ cho đơn từ 200.000đ'
  }
];
