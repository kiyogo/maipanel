import React, { useState } from 'react';
import { ShieldCheck, FileText, Lock, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Breadcrumb } from '../../components/common/Breadcrumb';

export function LegalPage({ tab = 'terms', onNavigate }) {
  const [activeTab, setActiveTab] = useState(tab);

  return (
    <div className="section-sm">
      <div className="container" style={{ maxWidth: '900px' }}>
        <Breadcrumb
          items={[{ label: 'Chính sách & Pháp lý', path: '/terms' }]}
          onNavigate={onNavigate}
        />

        <div className="tabs-nav" style={{ marginBottom: '2rem' }}>
          <button
            className={`tab-btn ${activeTab === 'terms' ? 'active' : ''}`}
            onClick={() => setActiveTab('terms')}
          >
            Điều khoản Dịch vụ
          </button>
          <button
            className={`tab-btn ${activeTab === 'privacy' ? 'active' : ''}`}
            onClick={() => setActiveTab('privacy')}
          >
            Chính sách Bảo mật
          </button>
          <button
            className={`tab-btn ${activeTab === 'sla' ? 'active' : ''}`}
            onClick={() => setActiveTab('sla')}
          >
            Cam kết SLA 99.99%
          </button>
          <button
            className={`tab-btn ${activeTab === 'refund' ? 'active' : ''}`}
            onClick={() => setActiveTab('refund')}
          >
            Chính sách Hoàn tiền 30 Ngày
          </button>
        </div>

        <div className="card" style={{ padding: '2.5rem', backgroundColor: 'var(--bg-card)', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
          {activeTab === 'terms' && (
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
                Điều Khoản Dịch Vụ Nexus Cloud (Terms of Service)
              </h1>
              <p>Chào mừng bạn đến với Nexus Cloud. Khi sử dụng các dịch vụ Cloud Server, VPS, Hosting, Storage và Tên miền, bạn đồng ý tuân thủ các điều khoản sau:</p>
              
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
                1. Quy định sử dụng máy chủ (AUP)
              </h3>
              <p>Khách hàng không được sử dụng máy chủ cho các mục đích vi phạm pháp luật Việt Nam và quốc tế bao gồm: phát tán mã độc (malware), tấn công mạng (DDoS/DoS), spam email hàng loạt không có sự cho phép, đào tiền ảo trái phép gây ảnh hưởng đến phần cứng dùng chung.</p>

              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
                2. Gia hạn và Bảo lưu Dữ liệu
              </h3>
              <p>Hệ thống sẽ gửi thông báo gia hạn trước ngày hết hạn 7 ngày, 3 ngày và 1 ngày qua email và tin nhắn. Sau khi dịch vụ hết hạn, máy chủ sẽ tạm khóa trong 7 ngày trước khi bị hủy hoàn toàn để đảm bảo quyền bảo mật dữ liệu.</p>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
                Chính Sách Bảo Mật Thông Tin (Privacy Policy)
              </h1>
              <p>Nexus Cloud tôn trọng và cam kết bảo vệ dữ liệu cá nhân cũng như dữ liệu vận hành của khách hàng theo tiêu chuẩn ISO/IEC 27001 và Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân.</p>
              
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
                1. Mã hóa dữ liệu truyền tải
              </h3>
              <p>Mọi giao dịch trên cổng thông tin đều được mã hóa bằng giao thức TLS 1.3 (256-bit). Mật khẩu tài khoản được băm một chiều (Hash) bằng thuật toán bcrypt / Argon2 và không ai có thể xem được dạng văn bản thô.</p>
            </div>
          )}

          {activeTab === 'sla' && (
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
                Cam Kết Mức Độ Dịch Vụ (SLA 99.99% Uptime)
              </h1>
              <p>Chúng tôi cam kết thời gian hoạt động liên tục của hạ tầng mạng và máy chủ ảo đạt mức tối thiểu 99.99% mỗi tháng.</p>
              
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
                Chính sách đền bù tín dụng (Service Credit)
              </h3>
              <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', listStyle: 'disc' }}>
                <li>Uptime từ 99.0% đến 99.9%: Hoàn 10% phí dịch vụ tháng đó vào Ví tài khoản.</li>
                <li>Uptime từ 95.0% đến 98.9%: Hoàn 25% phí dịch vụ tháng đó vào Ví tài khoản.</li>
                <li>Uptime dưới 95.0%: Hoàn 100% phí dịch vụ tháng đó vào Ví tài khoản.</li>
              </ul>
            </div>
          )}

          {activeTab === 'refund' && (
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
                Chính Sách Hoàn Tiền Trong 30 Ngày
              </h1>
              <p>Nếu bạn không hoàn toàn hài lòng với dịch vụ Cloud Server hoặc VPS trong vòng 30 ngày đầu tiên kể từ ngày đăng ký, Nexus Cloud sẽ hoàn lại 100% số tiền đã thanh toán vào tài khoản ngân hàng hoặc số dư Ví của bạn.</p>
              <p style={{ marginTop: '1rem' }}>Lưu ý: Chính sách không áp dụng cho phí duy trì tên miền đã kích hoạt qua VNNIC hoặc ICANN.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
