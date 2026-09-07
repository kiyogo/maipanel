import React, { useState } from 'react';
import { Phone, Mail, MapPin, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { useToast } from '../../context/ToastContext';

export function ContactPage({ onNavigate }) {
  const { success } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'cloud-server',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    success('Đã gửi yêu cầu tư vấn!', 'Đội ngũ chuyên gia Nexus Cloud sẽ liên hệ lại với bạn trong vòng 30 phút.');
  };

  return (
    <div className="section-sm">
      <div className="container" style={{ maxWidth: '1000px' }}>
        <Breadcrumb
          items={[{ label: 'Liên hệ tư vấn', path: '/contact' }]}
          onNavigate={onNavigate}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem', alignItems: 'flex-start' }} className="contact-grid">
          {/* Left Column: Contact Info */}
          <div>
            <div className="section-tag">
              <MessageSquare size={14} />
              <span>Hỗ Trợ 24/7/365</span>
            </div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
              Liên Hệ & Tư Vấn Kiến Trúc Hạ Tầng
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              Bạn cần tư vấn giải pháp Cloud Server tùy chỉnh cho doanh nghiệp hoặc di chuyển hệ thống hiện tại? Đội ngũ kỹ sư giải pháp luôn sẵn sàng đồng hành.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-surface)', color: 'var(--primary-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid var(--primary-border)' }}>
                  <Phone size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Tổng đài hỗ trợ 24/7</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>1900 6868 (Miễn phí cước gọi)</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-surface)', color: 'var(--primary-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid var(--primary-border)' }}>
                  <Mail size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Email hỗ trợ & kinh doanh</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>support@nexuscloud.vn / sales@nexuscloud.vn</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-surface)', color: 'var(--primary-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid var(--primary-border)' }}>
                  <MapPin size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Trung tâm Vận hành NOC</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Tầng 12, Tòa nhà Viettel IDC, Pháp Vân, Hoàng Mai, Hà Nội</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="card" style={{ padding: '2rem', backgroundColor: 'var(--bg-card)' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--success-surface)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                  <CheckCircle2 size={32} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  Gửi Thông Tin Thành Công
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                  Chuyên viên giải pháp của chúng tôi sẽ gọi điện hỗ trợ bạn trong ít phút tới.
                </p>
                <button className="btn btn-outline btn-sm" onClick={() => setSubmitted(false)}>
                  Gửi yêu cầu khác
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
                  Gửi Yêu Cầu Tư Vấn
                </h3>

                <div className="form-group">
                  <label className="form-label">Họ và tên *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nguyễn Văn A"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Email công việc *</label>
                    <input
                      type="email"
                      required
                      className="form-input"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@company.com"
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
                  <label className="form-label">Dịch vụ quan tâm:</label>
                  <select
                    className="form-select"
                    value={formData.service}
                    onChange={e => setFormData({ ...formData, service: e.target.value })}
                  >
                    <option value="cloud-server">Cloud Server Enterprise</option>
                    <option value="vps">VPS NVMe Turbo</option>
                    <option value="game-server">Game Server</option>
                    <option value="storage">Object Storage S3</option>
                    <option value="dedicated">Dedicated Server Riêng</option>
                    <option value="other">Tư vấn giải pháp khác</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Mô tả nhu cầu kỹ thuật:</label>
                  <textarea
                    rows={4}
                    className="form-textarea"
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Ví dụ: Cần triển khai hệ thống eCommerce chịu tải 50,000 visitors cùng lúc..."
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-block">
                  <Send size={16} />
                  <span>Gửi Yêu Cầu Tư Vấn</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
