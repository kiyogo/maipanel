import React, { useState } from 'react';
import {
  Wallet,
  QrCode,
  Building,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Copy,
  Check
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useCloudData } from '../../context/CloudDataContext';
import { useToast } from '../../context/ToastContext';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { EmptyState } from '../../components/common/EmptyState';
import { formatVND } from '../../utils/formatters';

export function CheckoutPage({ onNavigate }) {
  const { items, subtotal, discount, tax, total, clearCart } = useCart();
  const { user } = useAuth();
  const { createOrder } = useCloudData();
  const { success, error } = useToast();

  const [customerName, setCustomerName] = useState(user?.name || 'Nguyễn Hoàng Sơn');
  const [customerEmail, setCustomerEmail] = useState(user?.email || 'sonnguyen@example.com');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '0988 123 456');
  const [companyName, setCompanyName] = useState(user?.company || '');
  const [taxId, setTaxId] = useState(user?.taxId || '');

  // Payment Method: 'wallet' | 'vietqr' | 'bank'
  const [paymentMethod, setPaymentMethod] = useState('wallet');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  const walletBalance = user?.balance || 0;
  const isWalletSufficient = walletBalance >= total;

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
    success('Đã sao chép!', text);
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    if (items.length === 0) {
      error('Lỗi', 'Giỏ hàng của bạn đang trống.');
      return;
    }

    if (paymentMethod === 'wallet' && !isWalletSufficient) {
      error('Số dư không đủ', 'Vui lòng chọn VietQR hoặc nạp thêm tiền vào ví để thanh toán.');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      try {
        const orderData = {
          customerName,
          customerEmail,
          customerPhone,
          items: items.map(item => ({
            productId: item.productId,
            productName: item.productName,
            category: item.category,
            plan: `${item.config?.cpu} / ${item.config?.ram} / ${item.config?.storage}`,
            datacenter: item.config?.datacenter,
            os: item.config?.os,
            billingCycle: item.config?.billingCycleLabel,
            price: item.totalPrice,
            quantity: item.quantity,
            config: item.config,
            unitPriceMonthly: item.unitPriceMonthly
          })),
          subtotal,
          discount,
          tax,
          total,
          paymentMethod
        };

        const placedOrder = createOrder(orderData);
        clearCart();
        setIsProcessing(false);
        success('Thanh toán thành công!', `Đơn hàng ${placedOrder.id} đã hoàn tất và dịch vụ đã được kích hoạt.`);
        onNavigate(`/dashboard/orders/${placedOrder.id}`);
      } catch (err) {
        setIsProcessing(false);
        error('Lỗi đặt hàng', err.message);
      }
    }, 1200);
  };

  if (items.length === 0) {
    return (
      <div className="section-sm">
        <div className="container">
          <Breadcrumb
            items={[
              { label: 'Giỏ hàng', path: '/cart' },
              { label: 'Thanh toán', path: '/checkout' }
            ]}
            onNavigate={onNavigate}
          />
          <div className="card" style={{ padding: '3rem 1.5rem', textAlign: 'center', backgroundColor: 'var(--bg-card)' }}>
            <EmptyState
              title="Không có sản phẩm nào để thanh toán"
              description="Hãy thêm sản phẩm vào giỏ hàng trước khi tiến hành thanh toán."
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
          items={[
            { label: 'Giỏ hàng', path: '/cart' },
            { label: 'Thanh toán đơn hàng', path: '/checkout' }
          ]}
          onNavigate={onNavigate}
        />

        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.375rem' }}>
            Hoàn Tất Đơn Hàng & Thanh Toán
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Vui lòng kiểm tra lại thông tin khách hàng và lựa chọn phương thức thanh toán.
          </p>
        </div>

        <form onSubmit={handlePlaceOrder}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '2rem', alignItems: 'flex-start' }} className="checkout-grid">
            {/* Left Column: Form Info & Payment Selection */}
            <div>
              {/* Section 1: Customer Details */}
              <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem', backgroundColor: 'var(--bg-card)' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
                  1. Thông Tin Khách Hàng / Đơn Vị Đăng Ký
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Họ và tên *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Địa chỉ Email *</label>
                    <input
                      type="email"
                      className="form-input"
                      required
                      value={customerEmail}
                      onChange={e => setCustomerEmail(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Số điện thoại *</label>
                    <input
                      type="tel"
                      className="form-input"
                      required
                      value={customerPhone}
                      onChange={e => setCustomerPhone(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Tên công ty (Tùy chọn)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={companyName}
                      onChange={e => setCompanyName(e.target.value)}
                      placeholder="Công ty Cổ phần..."
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Payment Methods */}
              <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-card)' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
                  2. Lựa Chọn Phương Thức Thanh Toán
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                  {/* Option 1: Account Wallet Balance */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '1rem',
                      padding: '1.125rem',
                      borderRadius: 'var(--radius-md)',
                      border: paymentMethod === 'wallet' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                      backgroundColor: paymentMethod === 'wallet' ? 'var(--primary-surface)' : 'var(--bg-card)',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="wallet"
                      checked={paymentMethod === 'wallet'}
                      onChange={() => setPaymentMethod('wallet')}
                      style={{ marginTop: '0.25rem', accentColor: 'var(--primary)' }}
                    />
                    <div style={{ flex: '1 1 auto' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          <Wallet size={18} color="var(--primary)" />
                          <span>Số dư Ví tài khoản Nexus</span>
                        </div>
                        <span className="badge badge-primary">
                          Số dư: {formatVND(walletBalance)}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.375rem' }}>
                        {isWalletSufficient ? (
                          <span style={{ color: 'var(--success-text)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <CheckCircle2 size={14} /> Số dư khả dụng đủ để thanh toán ngay lập tức.
                          </span>
                        ) : (
                          <span style={{ color: 'var(--danger-text)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <AlertTriangle size={14} /> Số dư không đủ (thiếu {formatVND(total - walletBalance)}). Vui lòng chọn VietQR hoặc nạp thêm.
                          </span>
                        )}
                      </div>
                    </div>
                  </label>

                  {/* Option 2: VietQR Automated QR Code */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '1rem',
                      padding: '1.125rem',
                      borderRadius: 'var(--radius-md)',
                      border: paymentMethod === 'vietqr' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                      backgroundColor: paymentMethod === 'vietqr' ? 'var(--primary-surface)' : 'var(--bg-card)',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="vietqr"
                      checked={paymentMethod === 'vietqr'}
                      onChange={() => setPaymentMethod('vietqr')}
                      style={{ marginTop: '0.25rem', accentColor: 'var(--primary)' }}
                    />
                    <div style={{ flex: '1 1 auto' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          <QrCode size={18} color="var(--primary)" />
                          <span>Quét mã VietQR (Tự động 24/7)</span>
                        </div>
                        <span className="badge badge-success">Khuyên dùng</span>
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.375rem' }}>
                        Hỗ trợ tất cả ứng dụng ngân hàng và ví điện tử. Kích hoạt tự động sau 10 giây.
                      </div>

                      {/* VietQR Dynamic Preview Box if Selected */}
                      {paymentMethod === 'vietqr' && (
                        <div
                          style={{
                            marginTop: '1rem',
                            padding: '1.25rem',
                            backgroundColor: 'var(--bg-card)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border-color)',
                            display: 'flex',
                            gap: '1.5rem',
                            alignItems: 'center'
                          }}
                        >
                          {/* Generated QR Box */}
                          <div
                            style={{
                              background: '#FFFFFF',
                              padding: '0.75rem',
                              borderRadius: '8px',
                              border: '1px solid var(--border-color)',
                              textAlign: 'center'
                            }}
                          >
                            <img
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=247-MB-0988123456-NEXUS-ORD-${total}`}
                              alt="VietQR Payment Code"
                              style={{ width: '130px', height: '130px', margin: '0 auto' }}
                            />
                            <div style={{ fontSize: '0.7rem', color: '#111827', fontWeight: 700, marginTop: '0.25rem' }}>
                              VietQR Napas 247
                            </div>
                          </div>

                          {/* Bank details with copy */}
                          <div style={{ flex: '1 1 auto', fontSize: '0.8125rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span style={{ color: 'var(--text-muted)' }}>Ngân hàng:</span>
                              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>MBBank (Quân Đội)</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ color: 'var(--text-muted)' }}>Số tài khoản:</span>
                              <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                0988999888
                                <button type="button" onClick={() => copyToClipboard('0988999888', 'stk')} style={{ color: 'var(--text-muted)' }}>
                                  {copiedField === 'stk' ? <Check size={13} color="var(--success)" /> : <Copy size={13} />}
                                </button>
                              </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span style={{ color: 'var(--text-muted)' }}>Chủ tài khoản:</span>
                              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>CTY NEXUS CLOUD VN</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ color: 'var(--text-muted)' }}>Số tiền:</span>
                              <span style={{ fontWeight: 800, color: 'var(--primary-text)' }}>{formatVND(total)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ color: 'var(--text-muted)' }}>Nội dung CK:</span>
                              <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                NXC ORD {Math.floor(1000 + Math.random() * 9000)}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </label>

                  {/* Option 3: Manual Bank Transfer */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '1rem',
                      padding: '1.125rem',
                      borderRadius: 'var(--radius-md)',
                      border: paymentMethod === 'bank' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                      backgroundColor: paymentMethod === 'bank' ? 'var(--primary-surface)' : 'var(--bg-card)',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank"
                      checked={paymentMethod === 'bank'}
                      onChange={() => setPaymentMethod('bank')}
                      style={{ marginTop: '0.25rem', accentColor: 'var(--primary)' }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        <Building size={18} color="var(--primary)" />
                        <span>Chuyển khoản Doanh nghiệp (Ủy nhiệm chi / VAT)</span>
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.375rem' }}>
                        Phù hợp cho công ty cần xuất hóa đơn tài chính điện tử VAT (e-Invoice).
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary & Place Order Button */}
            <div style={{ position: 'sticky', top: '90px' }}>
              <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-card)', boxShadow: 'var(--shadow-modal)' }}>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1rem' }}>
                  Chi Tiết Đơn Hàng ({items.length} mục)
                </div>

                {/* Items preview list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem', maxHeight: '240px', overflowY: 'auto' }}>
                  {items.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '0.625rem 0.75rem',
                        backgroundColor: 'var(--bg-secondary)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.8125rem'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, color: 'var(--text-primary)' }}>
                        <span>{item.productName} (x{item.quantity})</span>
                        <span>{formatVND(item.totalPrice * item.quantity)}</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        {item.config?.cpu} • {item.config?.ram} • {item.config?.billingCycleLabel}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Calculations */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                    <span>Tạm tính:</span>
                    <span>{formatVND(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success-text)', fontWeight: 600 }}>
                      <span>Giảm giá:</span>
                      <span>-{formatVND(discount)}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                    <span>Thuế VAT:</span>
                    <span>0đ</span>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Tổng thanh toán:</span>
                    <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                      {formatVND(total)}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-block btn-lg"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <span>Đang xử lý đơn hàng...</span>
                  ) : (
                    <>
                      <span>Xác Nhận & Đặt Hàng</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>

                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '1rem', lineHeight: 1.4 }}>
                  Bằng việc bấm Đặt Hàng, bạn đồng ý với Điều khoản Dịch vụ và Chính sách Bảo mật của Nexus Cloud.
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
