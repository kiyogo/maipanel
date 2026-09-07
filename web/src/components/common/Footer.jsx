import React from 'react';
import { Cloud, ShieldCheck, Cpu, HardDrive, Phone, Mail, MapPin, CheckCircle2 } from 'lucide-react';

export function Footer({ onNavigate }) {
  const handleNav = (path) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onNavigate(path);
  };

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          {/* Brand Info */}
          <div className="footer-brand">
            <a
              href="/"
              onClick={(e) => { e.preventDefault(); handleNav('/'); }}
              className="brand-logo"
            >
              <div className="brand-icon-box">
                <Cloud size={18} strokeWidth={2.5} />
              </div>
              <span>NEXUS<span className="accent">CLOUD</span></span>
            </a>
            <p>
              Nền tảng hạ tầng điện toán đám mây thế hệ mới. Cung cấp Cloud Server, VPS NVMe, Game Server và Storage hiệu năng cao với độ ổn định 99.99% SLA.
            </p>
            <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8125rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={15} color="var(--primary)" />
                <span>Viettel IDC Pháp Vân & FPT High-Tech Park, VN</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={15} color="var(--primary)" />
                <span>Hotline: 1900 6868 (24/7 Support)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={15} color="var(--primary)" />
                <span>support@nexuscloud.vn</span>
              </div>
            </div>
          </div>

          {/* Dịch vụ Cloud */}
          <div className="footer-col">
            <h5>Dịch vụ Hạ tầng</h5>
            <div className="footer-links">
              <a href="/cloud-server" onClick={(e) => { e.preventDefault(); handleNav('/cloud-server'); }}>Cloud Server Enterprise</a>
              <a href="/services?category=vps" onClick={(e) => { e.preventDefault(); handleNav('/services?category=vps'); }}>VPS NVMe Turbo</a>
              <a href="/services?category=game-server" onClick={(e) => { e.preventDefault(); handleNav('/services?category=game-server'); }}>Game Server (Ryzen 9)</a>
              <a href="/services?category=hosting" onClick={(e) => { e.preventDefault(); handleNav('/services?category=hosting'); }}>cPanel Web Hosting</a>
              <a href="/services?category=storage" onClick={(e) => { e.preventDefault(); handleNav('/services?category=storage'); }}>S3 Object Storage</a>
              <a href="/services?category=domain" onClick={(e) => { e.preventDefault(); handleNav('/services?category=domain'); }}>Đăng ký Tên miền .VN / .COM</a>
            </div>
          </div>

          {/* Hỗ trợ & Tài liệu */}
          <div className="footer-col">
            <h5>Hỗ trợ & Tài nguyên</h5>
            <div className="footer-links">
              <a href="/docs" onClick={(e) => { e.preventDefault(); handleNav('/docs'); }}>Tài liệu kỹ thuật</a>
              <a href="/docs#api-authentication" onClick={(e) => { e.preventDefault(); handleNav('/docs'); }}>API Reference v1</a>
              <a href="/status" onClick={(e) => { e.preventDefault(); handleNav('/status'); }}>Trạng thái mạng (Status)</a>
              <a href="/pricing" onClick={(e) => { e.preventDefault(); handleNav('/pricing'); }}>Bảng giá chi tiết</a>
              <a href="/blog" onClick={(e) => { e.preventDefault(); handleNav('/blog'); }}>Tin tức & Cập nhật</a>
              <a href="/contact" onClick={(e) => { e.preventDefault(); handleNav('/contact'); }}>Liên hệ & Tư vấn</a>
            </div>
          </div>

          {/* Chính sách & Pháp lý */}
          <div className="footer-col">
            <h5>Chính sách & Pháp lý</h5>
            <div className="footer-links">
              <a href="/terms" onClick={(e) => { e.preventDefault(); handleNav('/terms'); }}>Điều khoản dịch vụ</a>
              <a href="/privacy" onClick={(e) => { e.preventDefault(); handleNav('/privacy'); }}>Chính sách bảo mật</a>
              <a href="/sla" onClick={(e) => { e.preventDefault(); handleNav('/sla'); }}>Cam kết chất lượng SLA 99.99%</a>
              <a href="/refund" onClick={(e) => { e.preventDefault(); handleNav('/refund'); }}>Chính sách hoàn tiền 30 ngày</a>
              <a href="/aup" onClick={(e) => { e.preventDefault(); handleNav('/aup'); }}>Quy định sử dụng chấp nhận được (AUP)</a>
            </div>
          </div>

          {/* Phương thức thanh toán */}
          <div className="footer-col">
            <h5>Thanh toán & Đối tác</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8125rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                <CheckCircle2 size={16} color="var(--success)" />
                <span>VietQR 24/7 Tự động</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                <CheckCircle2 size={16} color="var(--success)" />
                <span>Chuyển khoản Napas 247</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                <CheckCircle2 size={16} color="var(--success)" />
                <span>Ví điện tử & Thẻ quốc tế</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                <ShieldCheck size={16} color="var(--primary)" />
                <span>Bảo mật PCI-DSS Level 1</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <div>
            © 2026 Nexus Cloud Infrastructure Co., Ltd. Tất cả quyền được bảo lưu. Giấy phép cung cấp dịch vụ viễn thông số 89/GP-BTTTT.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--success)' }}></span>
              Tất cả hệ thống hoạt động 100%
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
