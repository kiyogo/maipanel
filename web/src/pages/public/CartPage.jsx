import React, { useState } from 'react';
import {
  Trash2,
  ShoppingCart,
  ArrowRight,
  Tag,
  ShieldCheck,
  Plus,
  Minus,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { EmptyState } from '../../components/common/EmptyState';
import { formatVND } from '../../utils/formatters';

export function CartPage({ onNavigate }) {
  const {
    items,
    totalItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    couponCode,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    subtotal,
    discount,
    tax,
    total
  } = useCart();

  const { success, error } = useToast();
  const [inputCoupon, setInputCoupon] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;

    const res = applyCoupon(inputCoupon);
    if (res.success) {
      success('Thành công!', res.message);
      setInputCoupon('');
    } else {
      error('Lỗi mã giảm giá', res.message);
    }
  };

  if (items.length === 0) {
    return (
      <div className="section-sm">
        <div className="container">
          <Breadcrumb
            items={[{ label: 'Giỏ hàng', path: '/cart' }]}
            onNavigate={onNavigate}
          />
          <div className="card" style={{ padding: '3rem 1.5rem', textAlign: 'center', backgroundColor: 'var(--bg-card)' }}>
            <EmptyState
              icon={ShoppingCart}
              title="Giỏ hàng của bạn đang trống"
              description="Hãy lựa chọn các gói Cloud Server, VPS, Game Server hoặc Hosting để tiếp tục."
              actionText="Khám phá Dịch vụ Cloud"
              onAction={() => onNavigate('/services')}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-sm">
      <div className="container">
        <Breadcrumb
          items={[{ label: 'Giỏ hàng', path: '/cart' }]}
          onNavigate={onNavigate}
        />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Giỏ Hàng Dịch Vụ ({totalItems} sản phẩm)
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Kiểm tra lại cấu hình và áp dụng mã giảm giá trước khi hoàn tất thanh toán.
            </p>
          </div>

          <button
            className="btn btn-ghost btn-sm"
            style={{ color: 'var(--danger)' }}
            onClick={clearCart}
          >
            <Trash2 size={15} />
            <span>Xóa toàn bộ giỏ hàng</span>
          </button>
        </div>

        {/* Layout: Cart Items List + Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', alignItems: 'flex-start' }} className="cart-grid">
          {/* Left: Cart Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {items.map((item) => (
              <div
                key={item.cartItemId}
                className="card"
                style={{ padding: '1.25rem', backgroundColor: 'var(--bg-card)' }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {item.productName}
                    </h3>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      Hostname: {item.config?.hostname}
                    </div>
                  </div>

                  <button
                    className="icon-btn"
                    style={{ width: '32px', height: '32px', color: 'var(--danger)' }}
                    onClick={() => {
                      removeFromCart(item.cartItemId);
                      success('Đã xóa', 'Sản phẩm đã được xóa khỏi giỏ hàng.');
                    }}
                    title="Xóa sản phẩm"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Configuration Breakdown Tags */}
                <div
                  style={{
                    padding: '0.75rem',
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                    fontSize: '0.8125rem',
                    marginBottom: '1rem'
                  }}
                >
                  <span className="badge badge-neutral">📍 {item.config?.datacenter}</span>
                  <span className="badge badge-neutral">💿 {item.config?.os}</span>
                  <span className="badge badge-neutral">⚡ {item.config?.cpu}</span>
                  <span className="badge badge-neutral">🧠 {item.config?.ram}</span>
                  <span className="badge badge-neutral">💾 {item.config?.storage}</span>
                  <span className="badge badge-primary">⏱️ {item.config?.billingCycleLabel}</span>
                </div>

                {/* Quantity and Price */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Số lượng:</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      <button
                        className="btn btn-outline btn-sm"
                        style={{ padding: '0.25rem 0.5rem' }}
                        onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                      >
                        <Minus size={12} />
                      </button>
                      <span style={{ fontWeight: 700, minWidth: '20px', textAlign: 'center', fontSize: '0.9rem' }}>
                        {item.quantity}
                      </span>
                      <button
                        className="btn btn-outline btn-sm"
                        style={{ padding: '0.25rem 0.5rem' }}
                        onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                      {formatVND(item.totalPrice * item.quantity)}
                    </div>
                    {item.quantity > 1 && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        ({formatVND(item.totalPrice)} / gói)
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Order Summary & Coupon */}
          <div style={{ position: 'sticky', top: '90px' }}>
            <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-card)' }}>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1rem' }}>
                Tổng Chi Phí
              </div>

              {/* Coupon Form */}
              <div style={{ marginBottom: '1.25rem' }}>
                <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Mã giảm giá (ví dụ: CLOUD2026)"
                    value={inputCoupon}
                    onChange={e => setInputCoupon(e.target.value.toUpperCase())}
                    style={{ textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}
                  />
                  <button type="submit" className="btn btn-secondary btn-sm">
                    Áp dụng
                  </button>
                </form>

                {/* Available sample coupons hint */}
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.375rem' }}>
                  Mã thử nghiệm: <code style={{ color: 'var(--primary-text)', fontWeight: 600 }}>CLOUD2026</code> (-15%), <code style={{ color: 'var(--primary-text)', fontWeight: 600 }}>WELCOME10</code>
                </div>

                {appliedCoupon && (
                  <div
                    style={{
                      marginTop: '0.75rem',
                      padding: '0.625rem 0.75rem',
                      backgroundColor: 'var(--success-surface)',
                      border: '1px solid var(--success-border)',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.8125rem',
                      color: 'var(--success-text)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      <CheckCircle2 size={15} />
                      <span>Đã áp dụng: <b>{appliedCoupon.code}</b></span>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      style={{ color: 'var(--danger)', fontSize: '0.75rem', fontWeight: 600 }}
                    >
                      Gỡ bỏ
                    </button>
                  </div>
                )}
              </div>

              {/* Price Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.875rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>Tạm tính:</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{formatVND(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success-text)', fontWeight: 600 }}>
                    <span>Giảm giá coupon:</span>
                    <span>-{formatVND(discount)}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Thuế VAT (0%):</span>
                  <span>0đ</span>
                </div>
              </div>

              {/* Final Total */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Tổng thanh toán:</span>
                  <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                    {formatVND(total)}
                  </span>
                </div>
              </div>

              <button
                className="btn btn-primary btn-block btn-lg"
                onClick={() => onNavigate('/checkout')}
              >
                <span>Tiến hành thanh toán</span>
                <ArrowRight size={18} />
              </button>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '1rem' }}>
                🔒 Giao dịch bảo mật chuẩn PCI-DSS Level 1
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
