import React, { useState } from 'react';
import {
  Wallet,
  QrCode,
  ArrowUpRight,
  ArrowDownLeft,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  Filter,
  Plus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCloudData } from '../../context/CloudDataContext';
import { useToast } from '../../context/ToastContext';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { Modal } from '../../components/common/Modal';
import { formatVND, formatDate } from '../../utils/formatters';

export function WalletPage({ onNavigate }) {
  const { user } = useAuth();
  const { transactions, topUpWallet } = useCloudData();
  const { success, error } = useToast();

  const [topUpModalOpen, setTopUpModalOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState(500000);
  const [copiedField, setCopiedField] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const presetAmounts = [200000, 500000, 1000000, 2000000, 5000000];

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
    success('Đã sao chép!', text);
  };

  const handleSimulateTopUp = () => {
    if (topUpAmount < 10000) {
      error('Lỗi', 'Số tiền nạp tối thiểu là 10.000đ.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      topUpWallet(topUpAmount, 'vietqr');
      setIsProcessing(false);
      setTopUpModalOpen(false);
      success('Nạp tiền thành công!', `Đã cộng ${formatVND(topUpAmount)} vào số dư ví của bạn.`);
    }, 800);
  };

  return (
    <div>
      <Breadcrumb
        items={[
          { label: 'Bảng điều khiển', path: '/dashboard' },
          { label: 'Ví & Nạp tiền', path: '/dashboard/wallet' }
        ]}
        onNavigate={onNavigate}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Quản Lý Ví & Nạp Tiền
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Nạp tiền tự động 24/7 qua VietQR để duy trì và tự động gia hạn các dịch vụ Cloud Server.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setTopUpModalOpen(true)}
        >
          <Plus size={16} />
          <span>Nạp Tiền Vào Ví</span>
        </button>
      </div>

      {/* Balance Card & Quick Top-up Preview */}
      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '1.5rem', marginBottom: '2rem' }} className="wallet-top-grid">
        {/* Balance Card */}
        <div className="card" style={{ padding: '2rem', backgroundColor: 'var(--bg-card)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
              <Wallet size={18} color="var(--primary)" />
              <span>Số Dư Khả Dụng Hiện Tại</span>
            </div>
            <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
              {formatVND(user?.balance || 0)}
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--success-text)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.375rem' }}>
              <CheckCircle2 size={14} /> Sẵn sàng thanh toán & tự động gia hạn
            </div>
          </div>

          <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
            <button
              className="btn btn-primary btn-block"
              onClick={() => setTopUpModalOpen(true)}
            >
              <QrCode size={16} />
              <span>Nạp tiền qua VietQR 24/7</span>
            </button>
          </div>
        </div>

        {/* Top-up Presets Quick Card */}
        <div className="card" style={{ padding: '1.75rem', backgroundColor: 'var(--bg-card)' }}>
          <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            Nạp Nhanh Theo Hạn Mức Khuyên Dùng
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Hệ thống ngân hàng Napas 247 xử lý tự động trong vòng 5-10 giây không cần duyệt thủ công.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
            {presetAmounts.map(amt => (
              <button
                key={amt}
                className="btn btn-outline btn-sm"
                onClick={() => {
                  setTopUpAmount(amt);
                  setTopUpModalOpen(true);
                }}
                style={{ padding: '0.75rem 0.5rem', fontWeight: 700, fontSize: '0.9rem' }}
              >
                {formatVND(amt)}
              </button>
            ))}
          </div>

          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>🔒 Miễn phí phí giao dịch nạp tiền • Hỗ trợ xuất hóa đơn VAT</span>
          </div>
        </div>
      </div>

      {/* Transactions History Ledger */}
      <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-card)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Lịch Sử Biến Động Số Dư ({transactions.length})
          </div>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã GD</th>
                <th>Thời Gian</th>
                <th>Mô Tả Giao Dịch</th>
                <th>Loại</th>
                <th>Số Tiền</th>
                <th>Số Dư Sau</th>
                <th>Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(txn => {
                const isPositive = txn.amount > 0;
                return (
                  <tr key={txn.id}>
                    <td>
                      <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>
                        {txn.id}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                        {formatDate(txn.date)}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{txn.description}</div>
                      {txn.reference && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mã tham chiếu: {txn.reference}</div>
                      )}
                    </td>
                    <td>
                      <span className="badge badge-neutral" style={{ textTransform: 'capitalize' }}>
                        {txn.type === 'deposit' ? 'Nạp tiền' : txn.type === 'payment' ? 'Thanh toán' : 'Điều chỉnh'}
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          fontWeight: 700,
                          color: isPositive ? 'var(--success-text)' : 'var(--danger-text)'
                        }}
                      >
                        {isPositive ? '+' : ''}{formatVND(txn.amount)}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {formatVND(txn.balanceAfter)}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-success">Thành công</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* TOP-UP MODAL WITH VIETQR SIMULATION */}
      <Modal
        isOpen={topUpModalOpen}
        onClose={() => setTopUpModalOpen(false)}
        title="Nạp Tiền Vào Ví Bằng VietQR Tự Động"
        size="lg"
      >
        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '1.5rem', alignItems: 'center' }}>
          {/* Generated QR Box */}
          <div className="vietqr-box">
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              Quét bằng App Ngân Hàng
            </div>
            <div className="qr-code-wrapper">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=247-MB-0988999888-NEXUS-TOPUP-${topUpAmount}`}
                alt="VietQR Topup Code"
                style={{ width: '160px', height: '160px' }}
              />
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--success-text)', fontWeight: 600 }}>
              ● Đang chờ quét mã...
            </div>
          </div>

          {/* Amount input & Details */}
          <div>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Nhập số tiền cần nạp (VNĐ):</label>
              <input
                type="number"
                step="50000"
                min="10000"
                className="form-input"
                value={topUpAmount}
                onChange={e => setTopUpAmount(Number(e.target.value))}
                style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-text)' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              {presetAmounts.map(p => (
                <button
                  key={p}
                  type="button"
                  className="btn btn-outline btn-sm"
                  style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                  onClick={() => setTopUpAmount(p)}
                >
                  {formatVND(p)}
                </button>
              ))}
            </div>

            <table className="bank-info-table">
              <tbody>
                <tr>
                  <td>Ngân hàng:</td>
                  <td>MBBank (Quân Đội)</td>
                </tr>
                <tr>
                  <td>Số tài khoản:</td>
                  <td>
                    <span>0988999888</span>
                    <button type="button" onClick={() => copyToClipboard('0988999888', 'stk')} style={{ marginLeft: '6px', color: 'var(--text-muted)' }}>
                      <Copy size={13} />
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>Chủ tài khoản:</td>
                  <td>CTY NEXUS CLOUD VN</td>
                </tr>
                <tr>
                  <td>Nội dung chuyển khoản:</td>
                  <td>
                    <span>NXC TOPUP {user?.id?.replace('usr-', '') || '8821'}</span>
                    <button type="button" onClick={() => copyToClipboard(`NXC TOPUP ${user?.id?.replace('usr-', '') || '8821'}`, 'nd')} style={{ marginLeft: '6px', color: 'var(--text-muted)' }}>
                      <Copy size={13} />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>

            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-outline btn-sm" onClick={() => setTopUpModalOpen(false)}>
                Đóng
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleSimulateTopUp}
                disabled={isProcessing}
              >
                {isProcessing ? 'Đang kiểm tra giao dịch...' : 'Xác Nhận Nạp Tiền (Mô phỏng)'}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
