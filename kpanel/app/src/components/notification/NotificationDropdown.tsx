import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircleOutlined,
  BellOutlined,
  CheckOutlined,
  RightOutlined,
  CloudServerOutlined,
  DatabaseOutlined,
  SafetyCertificateOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { notificationService, AppNotification } from '../../services/notificationService';

export const NotificationDropdown: React.FC = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const loadNotifications = () => {
    setNotifications(notificationService.getNotifications());
  };

  useEffect(() => {
    loadNotifications();
    window.addEventListener('kpanel-notifications-updated', loadNotifications);
    return () => window.removeEventListener('kpanel-notifications-updated', loadNotifications);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [open]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleMarkAsRead = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = notificationService.markNotificationAsRead(id);
    setNotifications(updated);
  };

  const handleMarkAllAsRead = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = notificationService.markAllNotificationsAsRead();
    setNotifications(updated);
  };

  const handleClearAll = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = notificationService.clearAllNotifications();
    setNotifications(updated);
  };

  const handleNotificationClick = (item: AppNotification) => {
    handleMarkAsRead(item.id);
    setOpen(false);
    if (item.link) {
      navigate(item.link);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'server':
        return <CloudServerOutlined style={{ color: '#009688' }} />;
      case 'database':
        return <DatabaseOutlined style={{ color: '#1565C0' }} />;
      case 'backup':
        return <CheckCircleOutlined style={{ color: '#2E7D32' }} />;
      case 'security':
        return <SafetyCertificateOutlined style={{ color: '#E65100' }} />;
      default:
        return <BellOutlined style={{ color: '#009688' }} />;
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case 'server':
        return '#E0F2F1';
      case 'database':
        return '#E3F2FD';
      case 'backup':
        return '#E8F5E9';
      case 'security':
        return '#FFF3E0';
      default:
        return '#E0F2F1';
    }
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        title="Thông báo hệ thống"
        style={{
          position: 'relative',
          width: 32,
          height: 32,
          borderRadius: 4,
          background: open ? '#F3F4F6' : 'transparent',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          color: open ? '#009688' : '#757575',
          transition: 'background 0.12s ease, color 0.12s ease',
          outline: 'none',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#F3F4F6';
          e.currentTarget.style.color = '#212121';
        }}
        onMouseLeave={(e) => {
          if (!open) {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#757575';
          }
        }}
      >
        <BellOutlined style={{ fontSize: 17 }} />

        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: 1,
              right: 1,
              background: '#EF4444',
              color: '#FFFFFF',
              fontSize: 10,
              fontWeight: 700,
              minWidth: 15,
              height: 15,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 3px',
              border: '1.5px solid #FFFFFF',
              boxSizing: 'border-box',
              lineHeight: 1,
            }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Flyout Notification Popover */}
      {open && (
        <div
          className="k-pop-enter"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            width: 360,
            maxWidth: 'calc(100vw - 24px)',
            background: '#FFFFFF',
            borderRadius: 8,
            border: '1px solid #E0E0E0',
            boxShadow: '0 10px 28px rgba(0, 0, 0, 0.14), 0 3px 10px rgba(0, 0, 0, 0.08)',
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '10px 14px',
              borderBottom: '1px solid #E0E0E0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#FAFAFA',
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 600, color: '#212121' }}>Thông báo</span>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllAsRead}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#009688',
                    fontSize: 12,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: 0,
                  }}
                  title="Đánh dấu tất cả đã đọc"
                >
                  <CheckOutlined style={{ fontSize: 11 }} /> Đã đọc hết
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#9E9E9E',
                    fontSize: 12,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                    padding: 0,
                  }}
                  title="Xóa tất cả"
                >
                  <DeleteOutlined style={{ fontSize: 11 }} /> Xóa
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div style={{ maxHeight: 360, overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '28px 16px', textAlign: 'center', color: '#9E9E9E', fontSize: 13 }}>
                <BellOutlined style={{ fontSize: 22, marginBottom: 6, color: '#BDBDBD', display: 'block' }} />
                Không có thông báo nào
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  style={{
                    padding: '10px 12px',
                    borderBottom: '1px solid #F0F0F0',
                    cursor: 'pointer',
                    background: item.unread ? '#F7FDFD' : '#FFFFFF',
                    display: 'flex',
                    gap: 10,
                    alignItems: 'flex-start',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#F5F5F5')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = item.unread ? '#F7FDFD' : '#FFFFFF')}
                >
                  {/* Left Icon Badge */}
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 4,
                      background: getIconBg(item.type),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      fontSize: 14,
                    }}
                  >
                    {getIcon(item.type)}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: item.unread ? 600 : 500,
                          color: item.unread ? '#009688' : '#212121',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {item.title}
                      </span>
                      {item.unread && (
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            background: '#009688',
                            flexShrink: 0,
                          }}
                        />
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: '#616161',
                        margin: '2px 0 4px',
                        lineHeight: 1.35,
                      }}
                    >
                      {item.message}
                    </div>
                    <div style={{ fontSize: 11, color: '#9E9E9E' }}>{item.time || 'Vừa xong'}</div>
                  </div>

                  <RightOutlined style={{ fontSize: 10, color: '#BDBDBD', marginTop: 10 }} />
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
