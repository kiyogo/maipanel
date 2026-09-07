import React, { useState } from 'react';
import { Check, X, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { PRODUCTS, BILLING_CYCLES } from '../../data/products';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { formatVND } from '../../utils/formatters';

export function PricingPage({ onNavigate }) {
  const [activeCategory, setActiveCategory] = useState('cloud-server');
  const [selectedCycle, setSelectedCycle] = useState('1m');

  const categories = [
    { id: 'cloud-server', label: 'Cloud Server Enterprise' },
    { id: 'vps', label: 'VPS NVMe' },
    { id: 'game-server', label: 'Game Server' },
    { id: 'hosting', label: 'Web Hosting cPanel' },
    { id: 'storage', label: 'Object Storage' },
    { id: 'domain', label: 'Tên miền' }
  ];

  const cycleObj = BILLING_CYCLES.find(c => c.id === selectedCycle) || BILLING_CYCLES[0];
  const discountMultiplier = 1 - cycleObj.discount;

  const currentProducts = PRODUCTS.filter(p => p.category === activeCategory);

  return (
    <div className="section-sm">
      <div className="container">
        <Breadcrumb
          items={[{ label: 'Bảng giá dịch vụ', path: '/pricing' }]}
          onNavigate={onNavigate}
        />

        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 2.5rem auto' }}>
          <div className="section-tag">
            <Zap size={14} />
            <span>Bảng Giá Minh Bạch</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
            Bảng Giá Dịch Vụ Hạ Tầng Đám Mây
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
            Cam kết không chi phí ẩn, không phụ phí lưu lượng băng thông, hoàn tiền trong 30 ngày nếu không hài lòng.
          </p>

          {/* Billing Cycle Switcher */}
          <div style={{ marginTop: '2rem', display: 'inline-flex', gap: '0.5rem', padding: '0.375rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-full)' }}>
            {BILLING_CYCLES.map(cycle => (
              <button
                key={cycle.id}
                className={`btn btn-sm ${selectedCycle === cycle.id ? 'btn-primary' : 'btn-ghost'}`}
                style={{ borderRadius: 'var(--radius-full)' }}
                onClick={() => setSelectedCycle(cycle.id)}
              >
                <span>{cycle.label}</span>
                {cycle.badge && (
                  <span className="badge badge-warning" style={{ fontSize: '0.6875rem', padding: '0.15rem 0.35rem' }}>
                    {cycle.badge.split(' ')[0]} {cycle.badge.split(' ')[1]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="tabs-nav" style={{ justifyContent: 'center', marginBottom: '2.5rem' }}>
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`tab-btn ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Dynamic Pricing Matrix Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(280px, 1fr))`, gap: '1.5rem', marginBottom: '3.5rem' }}>
          {currentProducts.map(prod => {
            const calculatedPrice = Math.round(prod.basePriceMonthly * discountMultiplier);
            const isHighlighted = prod.popular;

            return (
              <div
                key={prod.id}
                className="card"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: isHighlighted ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative'
                }}
              >
                {prod.badge && (
                  <div style={{ marginBottom: '0.5rem' }}>
                    <span className={`badge ${isHighlighted ? 'badge-primary' : 'badge-neutral'}`}>
                      {prod.badge}
                    </span>
                  </div>
                )}

                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                  {prod.name}
                </h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', minHeight: '36px', marginBottom: '1.25rem' }}>
                  {prod.tagline}
                </p>

                <div style={{ marginBottom: '1.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.375rem' }}>
                    <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                      {formatVND(calculatedPrice)}
                    </span>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                      / {prod.billingPeriod || 'tháng'}
                    </span>
                  </div>
                  {cycleObj.discount > 0 && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--primary-text)', fontWeight: 600, marginTop: '0.25rem' }}>
                      Giá gốc: {formatVND(prod.basePriceMonthly)}/tháng (Giảm {cycleObj.discount * 100}%)
                    </div>
                  )}
                </div>

                {/* Specs List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', marginBottom: '2rem', flex: '1 1 auto' }}>
                  {Object.entries(prod.specs).map(([key, val], idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <Check size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: '0.125rem' }} />
                      <span style={{ color: 'var(--text-secondary)' }}>{val}</span>
                    </div>
                  ))}
                </div>

                <button
                  className={`btn ${isHighlighted ? 'btn-primary' : 'btn-outline'} btn-block`}
                  onClick={() => onNavigate(`/product/${prod.id}`)}
                >
                  <span>Cấu hình gói này</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Feature Comparison Matrix */}
        <div className="card" style={{ padding: '2rem', backgroundColor: 'var(--bg-card)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
            Cam Kết Tiêu Chuẩn Cho Mọi Khách Hàng
          </h3>

          <div className="grid grid-cols-3" style={{ gap: '1.5rem' }}>
            <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>99.99% Uptime SLA</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Được quy định rõ ràng trong hợp đồng điện tử và đền bù trực tiếp vào số dư ví nếu vi phạm.</div>
            </div>
            <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Miễn Phí Băng Thông</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Không giới hạn dung lượng tải về và truyền tải ra internet nội địa Việt Nam.</div>
            </div>
            <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Anti-DDoS 1.2 Tbps</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Bảo vệ tự động 24/7 với hệ thống lọc phần cứng BGP Core.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
