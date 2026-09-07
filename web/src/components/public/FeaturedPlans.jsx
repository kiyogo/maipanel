import React, { useState } from 'react';
import { Check, ArrowRight, Zap, ShieldCheck } from 'lucide-react';
import { PRODUCTS } from '../../data/products';
import { formatVND } from '../../utils/formatters';

export function FeaturedPlans({ onNavigate }) {
  const [billingCycle, setBillingCycle] = useState('1m'); // '1m' | '12m'
  const discountMultiplier = billingCycle === '12m' ? 0.8 : 1; // 20% discount on yearly

  const cloudServers = PRODUCTS.filter(p => p.category === 'cloud-server');

  return (
    <section className="section section-bg-secondary">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">
            <span>Bảng giá Nổi bật</span>
          </div>
          <h2 className="section-title">Gói Cloud Server Enterprise Nổi Bật</h2>
          <p className="section-subtitle">
            Khởi tạo tức thì trên cụm máy chủ vi xử lý AMD EPYC™ Gen4 thế hệ mới nhất.
          </p>

          {/* Billing Cycle Switcher */}
          <div style={{ marginTop: '2rem', display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '0.375rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-full)' }}>
            <button
              className={`btn btn-sm ${billingCycle === '1m' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ borderRadius: 'var(--radius-full)' }}
              onClick={() => setBillingCycle('1m')}
            >
              Thanh toán Hàng tháng
            </button>
            <button
              className={`btn btn-sm ${billingCycle === '12m' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ borderRadius: 'var(--radius-full)', display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}
              onClick={() => setBillingCycle('12m')}
            >
              <span>Thanh toán 1 Năm</span>
              <span className="badge badge-warning" style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem' }}>
                Tiết kiệm 20%
              </span>
            </button>
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-4" style={{ alignItems: 'stretch' }}>
          {cloudServers.map((plan) => {
            const calculatedPrice = Math.round(plan.basePriceMonthly * discountMultiplier);
            const isPro = plan.id === 'cloud-pro';

            return (
              <div
                key={plan.id}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  border: isPro ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-card)'
                }}
              >
                {plan.badge && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-12px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: isPro ? 'var(--primary)' : 'var(--bg-secondary)',
                      color: isPro ? '#111827' : 'var(--text-secondary)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.75rem',
                      borderRadius: 'var(--radius-full)',
                      border: '1px solid var(--border-color)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em'
                    }}
                  >
                    {plan.badge}
                  </div>
                )}

                <div style={{ paddingTop: '0.5rem', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.375rem' }}>
                    {plan.name}
                  </h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.5, minHeight: '36px' }}>
                    {plan.tagline}
                  </p>
                </div>

                {/* Price Display */}
                <div style={{ marginBottom: '1.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.375rem' }}>
                    <span style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                      {formatVND(calculatedPrice)}
                    </span>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>/tháng</span>
                  </div>
                  {billingCycle === '12m' && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--primary-text)', fontWeight: 600, marginTop: '0.25rem' }}>
                      Giá gốc: {formatVND(plan.basePriceMonthly)}/tháng
                    </div>
                  )}
                </div>

                {/* Specs List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.75rem', flex: '1 1 auto', fontSize: '0.875rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                    <Check size={16} color="var(--primary)" />
                    <span>{plan.specs.cpu}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                    <Check size={16} color="var(--primary)" />
                    <span>{plan.specs.ram}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                    <Check size={16} color="var(--primary)" />
                    <span>{plan.specs.storage}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                    <Check size={16} color="var(--primary)" />
                    <span>{plan.specs.networkSpeed}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                    <Check size={16} color="var(--primary)" />
                    <span>{plan.specs.ipv4} + {plan.specs.ipv6}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                    <Check size={16} color="var(--primary)" />
                    <span>{plan.specs.backup}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                    <Check size={16} color="var(--primary)" />
                    <span>{plan.specs.ddos}</span>
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  className={`btn ${isPro ? 'btn-primary' : 'btn-outline'} btn-block`}
                  onClick={() => onNavigate(`/product/${plan.id}`)}
                >
                  <span>Cấu hình & Đăng ký</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
