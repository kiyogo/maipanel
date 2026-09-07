import React from 'react';
import { ShieldCheck, HardDrive, Network, Clock, Server, Lock } from 'lucide-react';

export function TrustSection() {
  const trustMetrics = [
    {
      icon: Clock,
      value: '99.99%',
      label: 'Uptime SLA Cam kết',
      desc: 'Hệ thống hạ tầng mạng dự phòng N+1'
    },
    {
      icon: HardDrive,
      value: '100% NVMe',
      label: 'PCIe Gen4 Enterprise',
      desc: 'Tốc độ đọc ghi lên tới 7,000 MB/s'
    },
    {
      icon: Network,
      value: '10 Gbps',
      label: 'Cổng Mạng Uplink BGP',
      desc: 'Kết nối trực tiếp 4 nhà mạng lớn VN'
    },
    {
      icon: ShieldCheck,
      value: '1.2 Tbps',
      label: 'Anti-DDoS Shield',
      desc: 'Tự động giảm thiểu tấn công L4/L7'
    },
    {
      icon: Server,
      value: '24/7/365',
      label: 'Hỗ trợ Kỹ thuật Trực tiếp',
      desc: 'Thời gian phản hồi ticket dưới 15 phút'
    }
  ];

  return (
    <section className="section-sm section-bg-secondary">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          {trustMetrics.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '1.25rem',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.625rem' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--primary-surface)',
                      color: 'var(--primary-text)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid var(--primary-border)'
                    }}
                  >
                    <Icon size={18} />
                  </div>
                  <span style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                    {item.value}
                  </span>
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                  {item.label}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {item.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
