import React, { useState } from 'react';
import {
  Cloud,
  Server,
  Cpu,
  HardDrive,
  Network,
  ShieldCheck,
  Check,
  ArrowRight,
  MapPin,
  Layers,
  Zap
} from 'lucide-react';
import { PRODUCTS } from '../../data/products';
import { DATACENTERS } from '../../data/datacenters';
import { OS_OPTIONS } from '../../data/osList';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { formatVND } from '../../utils/formatters';

export function CloudServerPage({ onNavigate }) {
  const [selectedDatacenter, setSelectedDatacenter] = useState(DATACENTERS[0].id);
  const [selectedOsType, setSelectedOsType] = useState('all'); // 'all' | 'Linux' | 'Windows'

  const cloudServers = PRODUCTS.filter(p => p.category === 'cloud-server');
  const currentDc = DATACENTERS.find(d => d.id === selectedDatacenter) || DATACENTERS[0];

  const filteredOs = selectedOsType === 'all'
    ? OS_OPTIONS
    : OS_OPTIONS.filter(os => os.type === selectedOsType);

  return (
    <div className="section-sm">
      <div className="container">
        <Breadcrumb
          items={[{ label: 'Cloud Server Enterprise', path: '/cloud-server' }]}
          onNavigate={onNavigate}
        />

        {/* Page Header */}
        <div style={{ maxWidth: '800px', marginBottom: '3rem' }}>
          <div className="section-tag">
            <Zap size={14} />
            <span>Hạ Tầng Điện Toán Đám Mây Doanh Nghiệp</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem', lineHeight: 1.2 }}>
            Cloud Server Enterprise Gen4
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Khởi tạo máy chủ ảo với vi xử lý AMD EPYC™ xung nhịp cao, 100% ổ cứng NVMe Gen4 Enterprise (IOPS 800.000) và kết nối mạng BGP Anycast tốc độ 1Gbps - 10Gbps.
          </p>
        </div>

        {/* 1. Datacenter Location Selector */}
        <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-card)', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              1. Lựa chọn Vị trí Trung tâm Dữ liệu (Datacenter Location)
            </div>
            <span className="badge badge-success">
              Đang chọn: {currentDc.name} ({currentDc.latency})
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            {DATACENTERS.map(dc => {
              const isSelected = selectedDatacenter === dc.id;
              return (
                <div
                  key={dc.id}
                  onClick={() => setSelectedDatacenter(dc.id)}
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                    backgroundColor: isSelected ? 'var(--primary-surface)' : 'var(--bg-secondary)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.25rem' }}>{dc.flag}</span>
                      <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                        {dc.name}
                      </span>
                    </div>
                    {isSelected && <Check size={16} color="var(--primary)" strokeWidth={3} />}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                    {dc.facility}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Độ trễ: <b style={{ color: 'var(--success-text)' }}>{dc.latency}</b></span>
                    <span style={{ color: 'var(--text-muted)' }}>{dc.network.split(' ')[0]} {dc.network.split(' ')[1]}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Cloud Server Packages Grid */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
            2. Chọn Cấu Hình Cloud Server Phù Hợp
          </div>

          <div className="grid grid-cols-4">
            {cloudServers.map(plan => {
              const isPro = plan.id === 'cloud-pro';
              return (
                <div
                  key={plan.id}
                  className="card"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    border: isPro ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  {plan.badge && (
                    <div style={{ marginBottom: '0.5rem' }}>
                      <span className={`badge ${isPro ? 'badge-primary' : 'badge-neutral'}`}>
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                    {plan.name}
                  </h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', minHeight: '36px', marginBottom: '1rem' }}>
                    {plan.tagline}
                  </p>

                  <div style={{ marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                    <span style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                      {formatVND(plan.basePriceMonthly)}
                    </span>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>/tháng</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.8125rem', marginBottom: '1.5rem', flex: '1 1 auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      <Cpu size={15} color="var(--primary)" />
                      <span>{plan.specs.cpu}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      <Server size={15} color="var(--primary)" />
                      <span>{plan.specs.ram}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      <HardDrive size={15} color="var(--primary)" />
                      <span>{plan.specs.storage}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                      <Network size={15} color="var(--primary)" />
                      <span>{plan.specs.networkSpeed}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                      <ShieldCheck size={15} color="var(--primary)" />
                      <span>{plan.specs.ddos}</span>
                    </div>
                  </div>

                  <button
                    className={`btn ${isPro ? 'btn-primary' : 'btn-outline'} btn-block`}
                    onClick={() => onNavigate(`/product/${plan.id}?datacenter=${selectedDatacenter}`)}
                  >
                    <span>Tùy chỉnh & Đặt mua</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Supported Operating Systems Preview */}
        <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-card)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                3. Danh Sách Hệ Điều Hành Hỗ Trợ 1-Click
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                Tất cả các bản phân phối Linux đều miễn phí 100%. Bản quyền Windows Server chuẩn doanh nghiệp.
              </div>
            </div>

            <div className="segmented-control">
              <button
                className={`segment-btn ${selectedOsType === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedOsType('all')}
              >
                Tất cả HĐH
              </button>
              <button
                className={`segment-btn ${selectedOsType === 'Linux' ? 'active' : ''}`}
                onClick={() => setSelectedOsType('Linux')}
              >
                Linux (Free)
              </button>
              <button
                className={`segment-btn ${selectedOsType === 'Windows' ? 'active' : ''}`}
                onClick={() => setSelectedOsType('Windows')}
              >
                Windows Server
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
            {filteredOs.map(os => (
              <div
                key={os.id}
                style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}
              >
                <span style={{ fontSize: '1.35rem' }}>{os.icon}</span>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {os.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: os.free ? 'var(--success-text)' : 'var(--text-muted)' }}>
                    {os.free ? 'Miễn phí bản quyền' : `+${formatVND(os.pricePerMonth)}/tháng`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
