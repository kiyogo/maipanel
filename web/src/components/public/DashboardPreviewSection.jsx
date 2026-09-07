import React from 'react';
import { LayoutDashboard, Server, Wallet, Activity, Play, RotateCcw, Power, Terminal, ArrowRight } from 'lucide-react';
import { formatVND } from '../../utils/formatters';

export function DashboardPreviewSection({ onNavigate }) {
  return (
    <section className="section section-bg-secondary">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">
            <span>Trải Nghiệm Khách Hàng</span>
          </div>
          <h2 className="section-title">Bảng Điều Khiển Đơn Giản, Trực Quan</h2>
          <p className="section-subtitle">
            Toàn quyền kiểm soát tài nguyên máy chủ, mạng, snapshot và hóa đơn trên một giao diện thống nhất.
          </p>
        </div>

        {/* Dashboard Mockup Container */}
        <div
          className="card"
          style={{
            maxWidth: '1000px',
            margin: '0 auto',
            padding: '0',
            overflow: 'hidden',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-modal)'
          }}
        >
          {/* Mockup Header */}
          <div
            style={{
              padding: '0.875rem 1.25rem',
              backgroundColor: 'var(--bg-secondary)',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#EF4444' }}></div>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#F59E0B' }}></div>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#22C55E' }}></div>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                https://portal.nexuscloud.vn/dashboard
              </span>
            </div>
            <span className="badge badge-success">Sẵn sàng 100%</span>
          </div>

          {/* Mockup Inner Body */}
          <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Top Stat Cards Preview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Số dư khả dụng</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>{formatVND(4850000)}</div>
              </div>
              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Máy chủ đang chạy</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--success-text)' }}>3 / 3 Online</div>
              </div>
              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Đơn hàng hoàn tất</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>12 Đơn</div>
              </div>
              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ticket hỗ trợ</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>0 Chờ duyệt</div>
              </div>
            </div>

            {/* Server Quick Action Box Preview */}
            <div style={{ padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-card)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                    prod-api-cluster-01 (Ubuntu 24.04 LTS)
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    IPv4: 103.145.62.110 • Datacenter: Hà Nội (Viettel IDC)
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-sm btn-outline" style={{ pointerEvents: 'none' }}>
                    <RotateCcw size={14} /> Restart
                  </button>
                  <button className="btn btn-sm btn-outline" style={{ pointerEvents: 'none' }}>
                    <Terminal size={14} /> Web Console
                  </button>
                </div>
              </div>

              {/* Progress bars */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                    <span>CPU (4 Cores)</span>
                    <span style={{ fontWeight: 600 }}>28.4%</span>
                  </div>
                  <div className="progress-track"><div className="progress-fill" style={{ width: '28.4%' }}></div></div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                    <span>RAM ECC (8 GB)</span>
                    <span style={{ fontWeight: 600 }}>54.2%</span>
                  </div>
                  <div className="progress-track"><div className="progress-fill" style={{ width: '54.2%' }}></div></div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                    <span>NVMe Gen4 (80 GB)</span>
                    <span style={{ fontWeight: 600 }}>38.0%</span>
                  </div>
                  <div className="progress-track"><div className="progress-fill" style={{ width: '38%' }}></div></div>
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <button
                className="btn btn-primary"
                onClick={() => onNavigate('/dashboard')}
              >
                <span>Trải nghiệm Bảng Điều Khiển Thực Tế</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
