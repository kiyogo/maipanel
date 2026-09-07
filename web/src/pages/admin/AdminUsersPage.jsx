import React, { useState } from 'react';
import {
  Users,
  Search,
  Wallet,
  Shield,
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  PlusCircle,
  MinusCircle
} from 'lucide-react';
import { useCloudData } from '../../context/CloudDataContext';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../../components/common/Modal';
import { formatVND, formatDate } from '../../utils/formatters';

export function AdminUsersPage({ onNavigate }) {
  const { usersList, adjustUserBalance, toggleUserBan } = useCloudData();
  const { success, error } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [balanceModalUser, setBalanceModalUser] = useState(null);
  const [adjustAmount, setAdjustAmount] = useState(100000);
  const [isAddition, setIsAddition] = useState(true);
  const [auditReason, setAuditReason] = useState('');

  const filteredUsers = usersList.filter(
    u =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdjustBalance = (e) => {
    e.preventDefault();
    if (!auditReason.trim()) {
      error('Thiếu lý do Audit', 'Bắt buộc phải nhập lý do điều chỉnh số dư để lưu vào Audit Log.');
      return;
    }

    const finalAmount = isAddition ? Math.abs(adjustAmount) : -Math.abs(adjustAmount);
    try {
      adjustUserBalance(balanceModalUser.id, finalAmount, auditReason.trim());
      setBalanceModalUser(null);
      setAuditReason('');
      success(
        'Điều chỉnh thành công!',
        `Đã ${isAddition ? 'cộng' : 'trừ'} ${formatVND(Math.abs(adjustAmount))} cho ${balanceModalUser.email}. Lý do: ${auditReason}`
      );
    } catch (err) {
      error('Lỗi', err.message);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Quản Lý Người Dùng & Khách Hàng ({usersList.length})
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Xem thông tin tài khoản, khóa/mở khóa và điều chỉnh số dư có lưu vết Audit Log bắt buộc.
          </p>
        </div>
      </div>

      {/* Search toolbar */}
      <div className="card" style={{ padding: '0.875rem 1.25rem', marginBottom: '1.5rem' }}>
        <div className="input-with-icon" style={{ maxWidth: '380px' }}>
          <Search size={16} className="input-icon-left" />
          <input
            type="text"
            className="form-input"
            placeholder="Tìm theo tên, email, username..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Họ tên & Email</th>
              <th>Username</th>
              <th>Số điện thoại</th>
              <th>Số dư ví</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th style={{ textAlign: 'right' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(u => (
              <tr key={u.id}>
                <td>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{u.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.email}</div>
                </td>
                <td><code style={{ fontSize: '0.8125rem' }}>{u.username}</code></td>
                <td><span style={{ fontSize: '0.8125rem' }}>{u.phone}</span></td>
                <td>
                  <span style={{ fontWeight: 700, color: 'var(--primary-text)' }}>
                    {formatVND(u.balance || 0)}
                  </span>
                </td>
                <td>
                  <span className={`badge ${u.role === 'admin' ? 'badge-warning' : 'badge-neutral'}`}>
                    {u.role.toUpperCase()}
                  </span>
                </td>
                <td>
                  <span className={`badge ${u.status === 'banned' ? 'badge-danger' : 'badge-success'}`}>
                    {u.status === 'banned' ? 'Đã khóa' : 'Hoạt động'}
                  </span>
                </td>
                <td>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {formatDate(u.createdDate, false)}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '0.375rem' }}>
                    <button
                      className="btn btn-outline btn-sm"
                      title="Cộng/Trừ số dư có lý do"
                      onClick={() => setBalanceModalUser(u)}
                    >
                      <Wallet size={13} />
                      <span>Số dư</span>
                    </button>
                    {u.role !== 'admin' && (
                      <button
                        className={`btn ${u.status === 'banned' ? 'btn-outline' : 'btn-danger-outline'} btn-sm`}
                        onClick={() => toggleUserBan(u.id)}
                      >
                        {u.status === 'banned' ? <Unlock size={13} /> : <Lock size={13} />}
                        <span>{u.status === 'banned' ? 'Mở khóa' : 'Khóa'}</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ADJUST BALANCE MODAL WITH MANDATORY AUDIT REASON */}
      {balanceModalUser && (
        <Modal
          isOpen={true}
          onClose={() => setBalanceModalUser(null)}
          title={`Điều Chỉnh Số Dư: ${balanceModalUser.name}`}
        >
          <form onSubmit={handleAdjustBalance}>
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
              <div>Khách hàng: <b>{balanceModalUser.name}</b> ({balanceModalUser.email})</div>
              <div>Số dư hiện tại: <b style={{ color: 'var(--primary-text)' }}>{formatVND(balanceModalUser.balance || 0)}</b></div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <button
                type="button"
                className={`btn btn-sm ${isAddition ? 'btn-primary' : 'btn-outline'}`}
                style={{ flex: 1 }}
                onClick={() => setIsAddition(true)}
              >
                <PlusCircle size={15} />
                <span>Cộng tiền (+)</span>
              </button>
              <button
                type="button"
                className={`btn btn-sm ${!isAddition ? 'btn-danger' : 'btn-outline'}`}
                style={{ flex: 1 }}
                onClick={() => setIsAddition(false)}
              >
                <MinusCircle size={15} />
                <span>Trừ tiền (-)</span>
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">Số tiền điều chỉnh (VNĐ) *</label>
              <input
                type="number"
                min="1000"
                step="10000"
                required
                className="form-input"
                value={adjustAmount}
                onChange={e => setAdjustAmount(Number(e.target.value))}
                style={{ fontSize: '1.15rem', fontWeight: 700 }}
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: 'var(--danger-text)', fontWeight: 600 }}>
                Lý do Audit Log (Bắt buộc) *
              </label>
              <textarea
                rows={3}
                required
                className="form-textarea"
                value={auditReason}
                onChange={e => setAuditReason(e.target.value)}
                placeholder="Ví dụ: Đền bù gián đoạn mạng SLA, Khuyến mãi nạp đầu, Hoàn tiền hủy máy..."
              />
              <span className="form-hint">Lý do này sẽ được ghi vĩnh viễn vào nhật ký kiểm toán hệ thống.</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button type="button" className="btn btn-outline btn-sm" onClick={() => setBalanceModalUser(null)}>
                Hủy bỏ
              </button>
              <button type="submit" className="btn btn-primary btn-sm">
                Xác nhận Điều Chỉnh Số Dư
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
