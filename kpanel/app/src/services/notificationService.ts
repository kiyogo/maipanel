export interface AppNotification {
  id: string;
  key?: string;
  title: string;
  message: string;
  type: 'server' | 'backup' | 'security' | 'database' | 'system' | string;
  link?: string;
  read?: boolean;
  unread?: boolean;
  time?: string;
  createdAt?: string;
}

const STORAGE_KEY = 'kpanel_notifications';

const DEFAULT_NOTIFICATIONS: AppNotification[] = [
  {
    id: '1',
    title: 'Hệ thống Kpanel sẵn sàng',
    message: 'Chào mừng bạn đến với bảng điều khiển Kpanel Fluent UI.',
    type: 'system',
    link: '/',
    unread: true,
    time: 'Vừa xong',
  },
  {
    id: '2',
    title: 'Giám sát tài nguyên',
    message: 'VPS-SG-01 hoạt động ổn định, tải CPU 42%, RAM 61%.',
    type: 'server',
    link: '/servers',
    unread: true,
    time: '10 phút trước',
  },
  {
    id: '3',
    title: 'Sao lưu cơ sở dữ liệu',
    message: 'Bản sao lưu tự động cho kpanel_postgres hoàn thành.',
    type: 'backup',
    link: '/database',
    unread: false,
    time: '1 giờ trước',
  },
  {
    id: '4',
    title: 'Chứng chỉ SSL',
    message: "Tất cả tên miền đã được kích hoạt SSL Let's Encrypt hợp lệ.",
    type: 'security',
    link: '/security',
    unread: false,
    time: 'Hôm qua',
  },
];

class NotificationService {
  private notifications: AppNotification[] = [];

  constructor() {
    this.load();
  }

  private load() {
    if (typeof window === 'undefined') {
      this.notifications = DEFAULT_NOTIFICATIONS;
      return;
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.notifications = JSON.parse(stored);
      } else {
        this.notifications = DEFAULT_NOTIFICATIONS;
        this.save();
      }
    } catch {
      this.notifications = DEFAULT_NOTIFICATIONS;
    }
  }

  private save() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.notifications));
      window.dispatchEvent(new Event('kpanel-notifications-updated'));
    } catch (e) {
      console.error('Failed to save notifications to localStorage', e);
    }
  }

  public getNotifications(): AppNotification[] {
    return [...this.notifications];
  }

  public markNotificationAsRead(id: string): AppNotification[] {
    this.notifications = this.notifications.map((n) =>
      n.id === id ? { ...n, unread: false, read: true } : n
    );
    this.save();
    return [...this.notifications];
  }

  public markAllNotificationsAsRead(): AppNotification[] {
    this.notifications = this.notifications.map((n) => ({ ...n, unread: false, read: true }));
    this.save();
    return [...this.notifications];
  }

  public deleteNotification(id: string): AppNotification[] {
    this.notifications = this.notifications.filter((n) => n.id !== id);
    this.save();
    return [...this.notifications];
  }

  public clearAllNotifications(): AppNotification[] {
    this.notifications = [];
    this.save();
    return [];
  }

  public addNotification(notif: Omit<AppNotification, 'id' | 'time'>): AppNotification[] {
    const newN: AppNotification = {
      ...notif,
      id: String(Date.now()),
      time: 'Vừa xong',
      unread: true,
      read: false,
    };
    this.notifications = [newN, ...this.notifications];
    this.save();
    return [...this.notifications];
  }
}

export const notificationService = new NotificationService();
