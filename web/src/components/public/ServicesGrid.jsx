import React from 'react';
import {
  Cloud,
  Server,
  Gamepad2,
  Globe,
  Database,
  Search,
  ShieldCheck,
  Cpu,
  ArrowRight
} from 'lucide-react';
import { formatVND } from '../../utils/formatters';

export function ServicesGrid({ onNavigate }) {
  const servicesList = [
    {
      id: 'cloud-server',
      name: 'Cloud Server Enterprise',
      icon: Cloud,
      desc: 'Máy chủ ảo hiệu năng cao dùng vi xử lý AMD EPYC, 100% NVMe Gen4 và khả năng mở rộng linh hoạt realtime.',
      priceFrom: 129000,
      path: '/cloud-server',
      tag: 'Phổ biến nhất'
    },
    {
      id: 'vps',
      name: 'VPS NVMe Turbo',
      icon: Server,
      desc: 'Máy chủ riêng ảo chi phí tối ưu, port mạng 1Gbps, thích hợp cho web apps, microservices và bot automation.',
      priceFrom: 79000,
      path: '/services?category=vps',
      tag: 'Tiết kiệm'
    },
    {
      id: 'game-server',
      name: 'Game Server (Ryzen 9)',
      icon: Gamepad2,
      desc: 'Tối ưu xung nhịp cao 5.7GHz cho Minecraft, CS2, Palworld, Rust với bộ lọc chống DDoS Game chuyên dụng.',
      priceFrom: 169000,
      path: '/services?category=game-server',
      tag: '5.7GHz Single Core'
    },
    {
      id: 'hosting',
      name: 'cPanel Web Hosting NVMe',
      icon: Globe,
      desc: 'Hosting cPanel với LiteSpeed Web Server, bảo mật Imunify360 và tăng tốc LSCache gấp 10 lần WordPress.',
      priceFrom: 69000,
      path: '/services?category=hosting',
      tag: 'LiteSpeed'
    },
    {
      id: 'storage',
      name: 'S3-Compatible Object Storage',
      icon: Database,
      desc: 'Lưu trữ đối tượng không giới hạn, tương thích 100% AWS S3 API, phù hợp cho backup, static assets và video CDN.',
      priceFrom: 120000,
      path: '/services?category=storage',
      tag: 'AWS S3 API'
    },
    {
      id: 'domain',
      name: 'Đăng ký Tên miền .VN & Quốc tế',
      icon: Search,
      desc: 'Tra cứu và đăng ký tên miền nhanh chóng, DNS Anycast miễn phí, bảo mật DNSSEC và khóa tên miền an toàn.',
      priceFrom: 280000,
      path: '/services?category=domain',
      tag: 'DNS Anycast'
    }
  ];

  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">
            <span>Danh mục Dịch vụ</span>
          </div>
          <h2 className="section-title">Hệ sinh thái Hạ tầng Đám mây Toàn diện</h2>
          <p className="section-subtitle">
            Tất cả các dịch vụ hạ tầng số cần thiết cho sự phát triển của bạn, từ máy chủ tính toán, lưu trữ đến tên miền.
          </p>
        </div>

        <div className="grid grid-cols-3">
          {servicesList.map((srv) => {
            const Icon = srv.icon;
            return (
              <div
                key={srv.id}
                className="card card-hoverable"
                style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
                onClick={() => onNavigate(srv.path)}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--primary-surface)',
                      color: 'var(--primary-text)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid var(--primary-border)'
                    }}
                  >
                    <Icon size={22} />
                  </div>
                  {srv.tag && <span className="badge badge-neutral">{srv.tag}</span>}
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.625rem', color: 'var(--text-primary)' }}>
                  {srv.name}
                </h3>

                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem', flex: '1 1 auto' }}>
                  {srv.desc}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', marginTop: 'auto' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Giá từ: </span>
                    <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {formatVND(srv.priceFrom)}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/tháng</span>
                  </div>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      color: 'var(--primary-text)'
                    }}
                  >
                    Chi tiết <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
