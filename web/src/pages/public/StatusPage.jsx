import React from 'react';
import { CheckCircle2, Server, Network, Database, ShieldCheck, Clock } from 'lucide-react';
import { Breadcrumb } from '../../components/common/Breadcrumb';

export function StatusPage({ onNavigate }) {
  const clusterServices = [
    { name: 'Compute Cluster - Hà Nội (Viettel IDC)', status: 'operational', uptime: '100.00%', ping: '3ms' },
    { name: 'Compute Cluster - TP.HCM (FPT Q9 High-Tech)', status: 'operational', uptime: '100.00%', ping: '5ms' },
    { name: 'Compute Cluster - Singapore (Equinix SG1)', status: 'operational', uptime: '99.99%', ping: '28ms' },
    { name: 'Compute Cluster - Tokyo (Equinix TY2)', status: 'operational', uptime: '100.00%', ping: '55ms' },
    { name: 'S3-Compatible Object Storage Cluster', status: 'operational', uptime: '100.00%', ping: '4ms' },
    { name: 'Anti-DDoS Core BGP Anycast Filter', status: 'operational', uptime: '100.00%', ping: '1ms' },
    { name: 'Customer Portal & RESTful API v1', status: 'operational', uptime: '100.00%', ping: '2ms' },
    { name: 'VietQR & Automated Billing Gateway', status: 'operational', uptime: '100.00%', ping: '8ms' }
  ];

  return (
    <div className="section-sm">
      <div className="container" style={{ maxWidth: '900px' }}>
        <Breadcrumb
          items={[{ label: 'Trạng thái mạng', path: '/status' }]}
          onNavigate={onNavigate}
        />

        {/* Global Banner */}
        <div
          className="card"
          style={{
            padding: '1.75rem',
            backgroundColor: 'var(--success-surface)',
            border: '1px solid var(--success-border)',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}
        >
          <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: 'var(--success)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--success-text)', marginBottom: '0.25rem' }}>
              Tất Cả Cụm Hạ Tầng Đang Hoạt Động Bình Thường
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
              Cập nhật lần cuối: Vừa xong • Tỷ lệ uptime trung bình 90 ngày qua: <b>99.994%</b>
            </p>
          </div>
        </div>

        {/* Cluster List */}
        <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-card)', marginBottom: '2rem' }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
            Trạng Thái Chi Tiết Từng Cụm Dịch Vụ
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {clusterServices.map((srv, idx) => (
              <div
                key={idx}
                style={{
                  padding: '1rem 1.25rem',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--success)' }}></div>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                    {srv.name}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.8125rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Độ trễ: <b style={{ color: 'var(--text-primary)' }}>{srv.ping}</b></span>
                  <span style={{ color: 'var(--text-muted)' }}>90d Uptime: <b style={{ color: 'var(--success-text)' }}>{srv.uptime}</b></span>
                  <span className="badge badge-success">Operational</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
