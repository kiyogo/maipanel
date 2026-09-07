import React, { useState } from 'react';
import {
  Bell,
  Check,
  CheckCheck,
  Server,
  Wallet,
  ShoppingBag,
  Shield,
  Info,
  ArrowRight
} from 'lucide-react';
import { useCloudData } from '../../context/CloudDataContext';
import { useToast } from '../../context/ToastContext';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { EmptyState } from '../../components/common/EmptyState';
import { formatDate } from '../../utils/formatters';

export function NotificationsPage({ onNavigate }) {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useCloudData();
  const { success } = useToast();
  const [filterCat, setFilterCat] = useState('all');

  const filteredNotifs = filterCat === 'all'
    ? notifications
    : notifications.filter(n => n.category === filterCat);

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'order': return <ShoppingBag size={18} color="var(--info)" />;
      case 'payment': return <Wallet size={18} color="var(--success)" />;
      case 'service': return <Server size={18} color="var(--primary)" />;
      case 'security': return <Shield size={18} color="var(--danger)" />;
      default: return <Info size={18} color="var(--warning)" />;
    }
  };

  return (
    <div>
      <Breadcrumb
        items={[
          { label: 'Bảng điều khiển', path: '/dashboard' },
          { label: 'Trung tâm thông báo', path: '/dashboard/notifications' }
        ]}
        onNavigate={onNavigate}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Trung Tâm Thông Báo ({notifications.length})
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Thông báo trạng thái đơn hàng, biến động số dư ví, sao lưu snapshot và bảo trì hạ tầng.
          </p>
        </div>

        <button
          className="btn btn-outline btn-sm"
          onClick={() => {
            markAllNotificationsAsRead();
            success('Đã đánh dấu!', 'Tất cả thông báo đã được đánh dấu là đã đọc.');
          }}
        >
          <CheckCheck size={16} />
          <span>Đánh dấu đã đọc tất cả</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="segmented-control" style={{ marginBottom: '1.5rem' }}>
        <button
          className={`segment-btn ${filterCat === 'all' ? 'active' : ''}`}
          onClick={() => setFilterCat('all')}
        >
          Tất cả
        </button>
        <button
          className={`segment-btn ${filterCat === 'service' ? 'active' : ''}`}
          onClick={() => setFilterCat('service')}
        >
          Máy chủ & Dịch vụ
        </button>
        <button
          className={`segment-btn ${filterCat === 'payment' ? 'active' : ''}`}
          onClick={() => setFilterCat('payment')}
        >
          Thanh toán & Ví
        </button>
        <button
          className={`segment-btn ${filterCat === 'order' ? 'active' : ''}`}
          onClick={() => setFilterCat('order')}
        >
          Đơn hàng
        </button>
        <button
          className={`segment-btn ${filterCat === 'system' ? 'active' : ''}`}
          onClick={() => setFilterCat('system')}
        >
          Hệ thống
        </button>
      </div>

      {/* Notifications List */}
      {filteredNotifs.length === 0 ? (
        <div className="card" style={{ padding: '3rem 1.5rem', backgroundColor: 'var(--bg-card)' }}>
          <EmptyState
            icon={Bell}
            title="Không có thông báo mới"
            description="Bạn đã xem hết toàn bộ thông báo trong mục này."
          />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filteredNotifs.map(notif => (
            <div
              key={notif.id}
              className="card"
              style={{
                padding: '1.125rem 1.25rem',
                backgroundColor: notif.read ? 'var(--bg-card)' : 'var(--bg-secondary)',
                border: notif.read ? '1px solid var(--border-color)' : '1px solid var(--primary-border)',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '1rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '0.125rem' }}>
                  {getCategoryIcon(notif.category)}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: notif.read ? 600 : 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                      {notif.title}
                    </span>
                    {!notif.read && (
                      <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>Mới</span>
                    )}
                  </div>

                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    {notif.message}
                  </p>

                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {formatDate(notif.date)}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {notif.link && (
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => {
                      markNotificationAsRead(notif.id);
                      onNavigate(notif.link);
                    }}
                  >
                    <span>Xem</span>
                    <ArrowRight size={13} />
                  </button>
                )}
                {!notif.read && (
                  <button
                    className="btn btn-ghost btn-sm btn-icon-only"
                    title="Đánh dấu đã đọc"
                    onClick={() => markNotificationAsRead(notif.id)}
                  >
                    <Check size={15} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
