import React, { useState } from 'react';
import { Cloud, Lock, Mail, ArrowRight, UserCheck, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export function LoginPage({ onNavigate }) {
  const { login, loginAs } = useAuth();
  const { success, error } = useToast();

  const [account, setAccount] = useState('sonnguyen@example.com');
  const [password, setPassword] = useState('NexusPassword123!');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!account.trim() || !password.trim()) {
      error('Lỗi', 'Vui lòng nhập đầy đủ email và mật khẩu.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = login(account, password);
      setIsLoading(false);
      if (res.success) {
        success('Đăng nhập thành công!', `Chào mừng trở lại, ${res.user.name}.`);
        onNavigate('/dashboard');
      }
    }, 600);
  };

  const handleDemoLogin = (role) => {
    loginAs(role);
    success('Đăng nhập Demo!', `Đã đăng nhập với vai trò ${role === 'admin' ? 'Quản trị viên Admin' : 'Khách hàng'}.`);
    onNavigate(role === 'admin' ? '/admin' : '/dashboard');
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div className="card" style={{ maxWidth: '440px', width: '100%', padding: '2.5rem', backgroundColor: 'var(--bg-card)', boxShadow: 'var(--shadow-modal)' }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary)',
              color: '#111827',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto'
            }}
          >
            <Cloud size={24} strokeWidth={2.5} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.375rem' }}>
            Đăng Nhập Tài Khoản
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Truy cập cổng quản lý máy chủ và dịch vụ Nexus Cloud
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email hoặc Tên đăng nhập</label>
            <div className="input-with-icon">
              <Mail size={16} className="input-icon-left" />
              <input
                type="text"
                required
                className="form-input"
                value={account}
                onChange={e => setAccount(e.target.value)}
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
              <label className="form-label" style={{ margin: 0 }}>Mật khẩu</label>
              <a
                href="/forgot-password"
                onClick={(e) => { e.preventDefault(); onNavigate('/forgot-password'); }}
                style={{ fontSize: '0.8125rem', color: 'var(--primary-dark)', fontWeight: 500 }}
              >
                Quên mật khẩu?
              </a>
            </div>
            <div className="input-with-icon">
              <Lock size={16} className="input-icon-left" />
              <input
                type="password"
                required
                className="form-input"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <label className="custom-checkbox">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
              />
              <span>Ghi nhớ đăng nhập</span>
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block btn-lg"
            disabled={isLoading}
          >
            {isLoading ? 'Đang xác thực...' : 'Đăng nhập'}
          </button>
        </form>

        {/* Demo Fast Login Switchers */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '0.75rem' }}>
            Đăng nhập nhanh tài khoản thử nghiệm:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => handleDemoLogin('customer')}
            >
              <UserCheck size={14} />
              <span>Khách hàng</span>
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => handleDemoLogin('admin')}
              style={{ color: 'var(--warning-text)' }}
            >
              <Shield size={14} />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>

        {/* Register Prompt */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Chưa có tài khoản?{' '}
          <a
            href="/register"
            onClick={(e) => { e.preventDefault(); onNavigate('/register'); }}
            style={{ color: 'var(--primary-dark)', fontWeight: 600 }}
          >
            Đăng ký ngay
          </a>
        </div>
      </div>
    </div>
  );
}

export function RegisterPage({ onNavigate }) {
  const { register } = useAuth();
  const { success, error } = useToast();

  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: true
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      error('Mật khẩu không khớp', 'Vui lòng kiểm tra lại mật khẩu xác nhận.');
      return;
    }
    if (!formData.agreeTerms) {
      error('Điều khoản', 'Vui lòng đồng ý với Điều khoản Dịch vụ để tiếp tục.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      register(formData);
      setIsLoading(false);
      success('Đăng ký thành công!', 'Tài khoản của bạn đã được kích hoạt cùng 500.000đ số dư trải nghiệm.');
      onNavigate('/dashboard');
    }, 700);
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div className="card" style={{ maxWidth: '480px', width: '100%', padding: '2.5rem', backgroundColor: 'var(--bg-card)', boxShadow: 'var(--shadow-modal)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.375rem' }}>
            Đăng Ký Tài Khoản Mới
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Nhận ngay 500.000đ vào ví và trải nghiệm hạ tầng Cloud Server NVMe Gen4
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Họ và tên *</label>
            <input
              type="text"
              required
              className="form-input"
              value={formData.fullName}
              onChange={e => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="Nguyễn Văn A"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">Tên đăng nhập *</label>
              <input
                type="text"
                required
                className="form-input"
                value={formData.username}
                onChange={e => setFormData({ ...formData, username: e.target.value })}
                placeholder="nguyenvana"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Số điện thoại *</label>
              <input
                type="tel"
                required
                className="form-input"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                placeholder="0988 123 456"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Địa chỉ Email *</label>
            <input
              type="email"
              required
              className="form-input"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              placeholder="name@example.com"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">Mật khẩu *</label>
              <input
                type="password"
                required
                className="form-input"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Xác nhận mật khẩu *</label>
              <input
                type="password"
                required
                className="form-input"
                value={formData.confirmPassword}
                onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="••••••••"
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label className="custom-checkbox">
              <input
                type="checkbox"
                checked={formData.agreeTerms}
                onChange={e => setFormData({ ...formData, agreeTerms: e.target.checked })}
              />
              <span style={{ fontSize: '0.8125rem' }}>
                Tôi đồng ý với Điều khoản Dịch vụ và Chính sách Bảo mật của Nexus Cloud.
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block btn-lg"
            disabled={isLoading}
          >
            {isLoading ? 'Đang tạo tài khoản...' : 'Đăng ký ngay'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Đã có tài khoản?{' '}
          <a
            href="/login"
            onClick={(e) => { e.preventDefault(); onNavigate('/login'); }}
            style={{ color: 'var(--primary-dark)', fontWeight: 600 }}
          >
            Đăng nhập
          </a>
        </div>
      </div>
    </div>
  );
}

export function ForgotPasswordPage({ onNavigate }) {
  const { success } = useToast();
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSent(true);
    success('Đã gửi mã khôi phục!', `Hướng dẫn đặt lại mật khẩu đã được gửi về email ${email}.`);
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div className="card" style={{ maxWidth: '440px', width: '100%', padding: '2.5rem', backgroundColor: 'var(--bg-card)', boxShadow: 'var(--shadow-modal)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.375rem' }}>
            Khôi Phục Mật Khẩu
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Nhập email tài khoản để nhận liên kết đặt lại mật khẩu bảo mật
          </p>
        </div>

        {isSent ? (
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Kiểm tra hộp thư đến của <b>{email}</b> và bấm vào liên kết xác nhận để thiết lập mật khẩu mới.
            </p>
            <button className="btn btn-outline btn-block" onClick={() => onNavigate('/login')}>
              Quay lại đăng nhập
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Email đăng ký</label>
              <input
                type="email"
                required
                className="form-input"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@example.com"
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block btn-lg">
              Gửi liên kết khôi phục
            </button>

            <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem' }}>
              <a
                href="/login"
                onClick={(e) => { e.preventDefault(); onNavigate('/login'); }}
                style={{ color: 'var(--text-secondary)' }}
              >
                ← Quay lại đăng nhập
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
