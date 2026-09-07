import React from 'react';
import { AlertTriangle, Home, ArrowLeft, ShieldAlert } from 'lucide-react';

export function NotFoundPage({ onNavigate }) {
  return (
    <div style={{ minHeight: '65vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '3rem 1rem' }}>
      <div className="card" style={{ maxWidth: '500px', width: '100%', padding: '3rem 2rem', backgroundColor: 'var(--bg-card)' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--warning-surface)', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
          <AlertTriangle size={32} />
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          404
        </h1>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
          Trang Không Tồn Tại
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: 1.6 }}>
          Đường dẫn bạn yêu cầu không tồn tại hoặc đã được di chuyển sang vị trí mới trên hệ thống Nexus Cloud.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <button className="btn btn-outline btn-sm" onClick={() => window.history.back()}>
            <ArrowLeft size={15} />
            <span>Quay lại</span>
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => onNavigate('/')}>
            <Home size={15} />
            <span>Về trang chủ</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export function AccessDeniedPage({ onNavigate }) {
  return (
    <div style={{ minHeight: '65vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '3rem 1rem' }}>
      <div className="card" style={{ maxWidth: '500px', width: '100%', padding: '3rem 2rem', backgroundColor: 'var(--bg-card)' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--danger-surface)', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
          <ShieldAlert size={32} />
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          403
        </h1>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
          Truy Cập Bị Từ Chối
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: 1.6 }}>
          Khu vực này chỉ dành riêng cho Quản trị viên hệ thống có quyền truy cập đặc quyền.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <button className="btn btn-outline btn-sm" onClick={() => onNavigate('/dashboard')}>
            <span>Về Bảng điều khiển Khách hàng</span>
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => onNavigate('/')}>
            <Home size={15} />
            <span>Trang chủ</span>
          </button>
        </div>
      </div>
    </div>
  );
}
