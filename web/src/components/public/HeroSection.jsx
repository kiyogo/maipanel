import React from 'react';
import { Server, ArrowRight, ShieldCheck, Zap, Activity, Cpu, CheckCircle2 } from 'lucide-react';
import { formatVND } from '../../utils/formatters';

export function HeroSection({ onNavigate }) {
  return (
    <section className="section" style={{ paddingTop: '4rem', paddingBottom: '4.5rem' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2.5rem', alignItems: 'center' }}>
          {/* Left Column: Headline & CTAs */}
          <div style={{ gridColumn: 'span 7' }} className="hero-left-col">
            <div className="section-tag" style={{ marginBottom: '1.25rem' }}>
              <Zap size={14} />
              <span>Hạ tầng Cloud 100% NVMe Gen4 Enterprise</span>
            </div>

            <h1 style={{ fontSize: '2.75rem', lineHeight: 1.15, marginBottom: '1.25rem', letterSpacing: '-0.025em' }}>
              Cloud Infrastructure đơn giản, mạnh mẽ và ổn định.
            </h1>

            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2rem', maxWidth: '560px' }}>
              Cung cấp hạ tầng Cloud Server, VPS, Game Server và Storage hiệu năng cao cho website, ứng dụng, cơ sở dữ liệu và hệ thống doanh nghiệp với cam kết 99.99% Uptime SLA.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
              <button
                className="btn btn-primary btn-lg"
                onClick={() => onNavigate('/cloud-server')}
              >
                <span>Khám phá Cloud Server</span>
                <ArrowRight size={18} />
              </button>
              <button
                className="btn btn-outline btn-lg"
                onClick={() => onNavigate('/services')}
              >
                <span>Xem tất cả dịch vụ</span>
              </button>
            </div>

            {/* Quick trust metrics */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem', flexWrap: 'wrap', fontSize: '0.875rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} color="var(--primary)" />
                <span>Kích hoạt trong 45 giây</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} color="var(--primary)" />
                <span>Anti-DDoS 1.2 Tbps L4/L7</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} color="var(--primary)" />
                <span>Hoàn tiền 30 ngày</span>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Minimal Server Architecture Card Mockup */}
          <div style={{ gridColumn: 'span 5' }} className="hero-right-col">
            <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-modal)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--success)' }}></div>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                    srv-production-01.nxc.vn
                  </span>
                </div>
                <span className="badge badge-success">Running</span>
              </div>

              {/* Specs & Realtime Telemetry Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ padding: '0.875rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Vi xử lý CPU (EPYC)</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>4 vCPU</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--success-text)', marginTop: '0.25rem' }}>28% Tải trung bình</div>
                </div>

                <div style={{ padding: '0.875rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Bộ nhớ RAM ECC</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>8.0 GB</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>4.2 GB / 8.0 GB</div>
                </div>

                <div style={{ padding: '0.875rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Ổ cứng NVMe Gen4</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>80 GB</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>7,000 MB/s IOPS</div>
                </div>

                <div style={{ padding: '0.875rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Băng thông mạng</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>1 Gbps</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--primary-text)', marginTop: '0.25rem' }}>BGP Đa hướng</div>
                </div>
              </div>

              {/* Node location & IP */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', fontSize: '0.8125rem', border: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>🇻🇳</span>
                  <span style={{ fontWeight: 500 }}>Viettel IDC Pháp Vân (Tier 3)</span>
                </div>
                <code style={{ color: 'var(--text-secondary)' }}>103.145.62.110</code>
              </div>

              {/* Action buttons preview */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className="btn btn-primary btn-sm btn-block"
                  onClick={() => onNavigate('/product/cloud-pro')}
                >
                  Cấu hình gói này từ {formatVND(289000)}/th
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
