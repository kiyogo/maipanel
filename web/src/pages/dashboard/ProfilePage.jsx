import React, { useState } from 'react';
import {
  User,
  Shield,
  Key,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  LogOut,
  Laptop,
  Globe,
  Clock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { Modal } from '../../components/common/Modal';
import { formatDate } from '../../utils/formatters';

export function ProfilePage({ onNavigate }) {
  const { user, updateProfile, toggle2FA } = useAuth();
  const { success, error } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [company, setCompany] = useState(user?.company || '');
  const [taxId, setTaxId] = useState(user?.taxId || '');

  // Password change state
  const [currPass, setCurrPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confPass, setConfPass] = useState('');

  // 2FA modal state
  const [twoFactorModalOpen, setTwoFactorModalOpen] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');

  const activeSessions = [
    {
      id: 'sess-1',
      device: 'Windows 11 PC (Chrome 124.0)',
      ip: '113.190.244.12',
      location: 'Hà Nội, Việt Nam',
      current: true,
      lastActive: 'Đang hoạt động'
    },
    {
      id: 'sess-2',
      device: 'iPhone 15 Pro (Safari Mobile)',
      ip: '14.232.190.88',
      location: 'Hà Nội, Việt Nam',
      current: false,
      lastActive: '2 giờ trước'
    }
  ];

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    updateProfile({ name, phone, company, taxId });
    success('Thành công!', 'Thông tin hồ sơ của bạn đã được cập nhật.');
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (newPass !== confPass) {
      error('Lỗi', 'Mật khẩu xác nhận không khớp.');
      return;
    }
    if (newPass.length < 8) {
      error('Lỗi', 'Mật khẩu mới phải có tối thiểu 8 ký tự.');
      return;
    }
    setCurrPass('');
    setNewPass('');
    setConfPass('');
    success('Đổi mật khẩu thành công!', 'Mật khẩu tài khoản đã được thay đổi.');
  };

  const handleConfirm2FA = (e) => {
    e.preventDefault();
    if (twoFactorCode.length !== 6) {
      error('Mã không hợp lệ', 'Mã xác thực Google Authenticator phải có 6 chữ số.');
      return;
    }
    toggle2FA();
    setTwoFactorModalOpen(false);
    setTwoFactorCode('');
    success('Xác thực 2 bước', user?.twoFactorEnabled ? 'Đã tắt bảo mật 2FA.' : 'Đã kích hoạt bảo mật 2FA thành công.');
  };

  return (
    <div>
      <Breadcrumb
        items={[
          { label: 'Bảng điều khiển', path: '/dashboard' },
          { label: 'Hồ sơ & Bảo mật', path: '/dashboard/profile' }
        ]}
        onNavigate={onNavigate}
      />

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          Hồ Sơ Cá Nhân & Cài Đặt Bảo Mật
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Quản lý thông tin tài khoản, xác thực hai yếu tố (2FA) và các phiên đăng nhập.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'flex-start' }} className="profile-grid">
        {/* Left Column: Profile Info & Password */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Profile Form */}
          <div className="card" style={{ padding: '1.75rem', backgroundColor: 'var(--bg-card)' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
              Thông Tin Tài Khoản
            </div>

            <form onSubmit={handleUpdateProfile}>
              <div className="form-group">
                <label className="form-label">Họ và tên:</label>
                <input
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email (Không thể thay đổi):</label>
                <input
                  type="email"
                  disabled
                  className="form-input"
                  value={user?.email || ''}
                  style={{ backgroundColor: 'var(--bg-secondary)', cursor: 'not-allowed' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Số điện thoại liên hệ:</label>
                <input
                  type="tel"
                  className="form-input"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Tên công ty / Tổ chức:</label>
                  <input
                    type="text"
                    className="form-input"
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Mã số thuế (VAT):</label>
                  <input
                    type="text"
                    className="form-input"
                    value={taxId}
                    onChange={e => setTaxId(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ marginTop: '1.25rem' }}>
                <button type="submit" className="btn btn-primary btn-sm">
                  Lưu thay đổi hồ sơ
                </button>
              </div>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="card" style={{ padding: '1.75rem', backgroundColor: 'var(--bg-card)' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
              Đổi Mật Khẩu Đăng Nhập
            </div>

            <form onSubmit={handleChangePassword}>
              <div className="form-group">
                <label className="form-label">Mật khẩu hiện tại:</label>
                <input
                  type="password"
                  required
                  className="form-input"
                  value={currPass}
                  onChange={e => setCurrPass(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Mật khẩu mới:</label>
                  <input
                    type="password"
                    required
                    className="form-input"
                    value={newPass}
                    onChange={e => setNewPass(e.target.value)}
                    placeholder="Tối thiểu 8 ký tự"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Xác nhận mật khẩu:</label>
                  <input
                    type="password"
                    required
                    className="form-input"
                    value={confPass}
                    onChange={e => setConfPass(e.target.value)}
                    placeholder="Nhập lại mật khẩu"
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-secondary btn-sm" style={{ marginTop: '0.5rem' }}>
                Cập nhật mật khẩu
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: 2FA & Active Sessions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Two-Factor Authentication (2FA) */}
          <div className="card" style={{ padding: '1.75rem', backgroundColor: 'var(--bg-card)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Smartphone size={20} color="var(--primary)" />
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Xác Thực 2 Bước (2FA)
                </div>
              </div>
              <span className={`badge ${user?.twoFactorEnabled ? 'badge-success' : 'badge-neutral'}`}>
                {user?.twoFactorEnabled ? 'ĐANG BẬT' : 'CHƯA BẬT'}
              </span>
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.6 }}>
              Bảo vệ tài khoản bằng mã bảo mật TOTP từ Google Authenticator hoặc Authy khi đăng nhập.
            </p>

            <button
              className={`btn btn-sm ${user?.twoFactorEnabled ? 'btn-danger-outline' : 'btn-primary'}`}
              onClick={() => setTwoFactorModalOpen(true)}
            >
              {user?.twoFactorEnabled ? 'Tắt xác thực 2 bước (2FA)' : 'Thiết lập 2FA Google Authenticator'}
            </button>
          </div>

          {/* Active Sessions */}
          <div className="card" style={{ padding: '1.75rem', backgroundColor: 'var(--bg-card)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Phiên Đăng Nhập Đang Hoạt Động
              </div>
              <button
                className="btn btn-ghost btn-sm"
                style={{ color: 'var(--danger)' }}
                onClick={() => success('Đã đăng xuất các thiết bị khác', 'Tất cả các phiên khác đã bị thu hồi.')}
              >
                Đăng xuất tất cả
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {activeSessions.map(sess => (
                <div
                  key={sess.id}
                  style={{
                    padding: '0.875rem',
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Laptop size={18} color="var(--text-muted)" />
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {sess.device} {sess.current && <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>Thiết bị này</span>}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {sess.ip} • {sess.location} • {sess.lastActive}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2FA SETUP MODAL */}
      <Modal
        isOpen={twoFactorModalOpen}
        onClose={() => setTwoFactorModalOpen(false)}
        title="Cấu Hình Xác Thực 2 Bước (Google Authenticator)"
      >
        <form onSubmit={handleConfirm2FA}>
          <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
            <div style={{ width: '140px', height: '140px', background: '#FFFFFF', padding: '0.5rem', margin: '0 auto 1rem auto', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=otpauth://totp/NexusCloud:sonnguyen?secret=JBSWY3DPEHPK3PXP"
                alt="2FA QR Code"
                style={{ width: '100%', height: '100%' }}
              />
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              Quét mã QR bằng ứng dụng Google Authenticator và nhập mã 6 số bên dưới:
            </p>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ textAlign: 'center', display: 'block' }}>Mã xác thực 6 chữ số:</label>
            <input
              type="text"
              maxLength={6}
              required
              className="form-input"
              value={twoFactorCode}
              onChange={e => setTwoFactorCode(e.target.value)}
              placeholder="123456"
              style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.3em', fontFamily: 'var(--font-mono)' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => setTwoFactorModalOpen(false)}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              Xác nhận
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
