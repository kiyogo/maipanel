import React, { useState } from 'react';
import { Tag, Plus, Trash2, Shield, Search, FileText, CheckCircle2 } from 'lucide-react';
import { useCloudData } from '../../context/CloudDataContext';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../../components/common/Modal';
import { formatVND, formatDate } from '../../utils/formatters';

export function AdminCouponsPage({ onNavigate }) {
  const { coupons, createAdminCoupon, deleteAdminCoupon } = useCloudData();
  const { success } = useToast();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(10);
  const [minOrder, setMinOrder] = useState(100000);
  const [description, setDescription] = useState('');

  const handleCreate = (e) => {
    e.preventDefault();
    if (!code.trim()) return;

    createAdminCoupon({
      code: code.trim().toUpperCase(),
      discountPercent: Number(discountPercent),
      minOrder: Number(minOrder),
      description: description.trim() || `Giảm ${discountPercent}%`
    });

    setCreateModalOpen(false);
    setCode('');
    setDescription('');
    success('Tạo coupon thành công!', `Mã ${code.toUpperCase()} đã sẵn sàng áp dụng.`);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Quản Lý Mã Giảm Giá & Khuyến Mãi ({coupons.length})
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Tạo mã coupon chiết khấu phần trăm hoặc giảm cố định cho các chiến dịch tiếp thị.
          </p>
        </div>

        <button className="btn btn-primary btn-sm" onClick={() => setCreateModalOpen(true)}>
          <Plus size={16} />
          <span>Tạo Mã Mới</span>
        </button>
      </div>

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Mã Coupon</th>
              <th>Mức giảm giá</th>
              <th>Đơn tối thiểu</th>
              <th>Mô tả chương trình</th>
              <th style={{ textAlign: 'right' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map(c => (
              <tr key={c.code}>
                <td>
                  <code style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary-text)' }}>
                    {c.code}
                  </code>
                </td>
                <td>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                    {c.discountPercent ? `${c.discountPercent}%` : formatVND(c.discountFixed)}
                  </span>
                </td>
                <td>
                  <span style={{ fontSize: '0.8125rem' }}>{c.minOrder ? formatVND(c.minOrder) : 'Không giới hạn'}</span>
                </td>
                <td>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{c.description}</span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button
                    className="btn btn-danger-outline btn-sm"
                    onClick={() => {
                      deleteAdminCoupon(c.code);
                      success('Đã xóa', `Đã xóa mã ${c.code}`);
                    }}
                  >
                    <Trash2 size={13} />
                    <span>Xóa</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CREATE COUPON MODAL */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Tạo Mã Giảm Giá Mới"
      >
        <form onSubmit={handleCreate}>
          <div className="form-group">
            <label className="form-label">Mã code (Viết hoa, không dấu) *</label>
            <input
              type="text"
              required
              className="form-input"
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              placeholder="VD: SUMMER2026"
              style={{ textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Chiết khấu (%) *</label>
              <input
                type="number"
                min="1"
                max="90"
                required
                className="form-input"
                value={discountPercent}
                onChange={e => setDiscountPercent(Number(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Đơn hàng tối thiểu (VNĐ):</label>
              <input
                type="number"
                step="50000"
                className="form-input"
                value={minOrder}
                onChange={e => setMinOrder(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Mô tả chương trình:</label>
            <input
              type="text"
              className="form-input"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="VD: Khuyến mãi mừng sự kiện hè 2026..."
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => setCreateModalOpen(false)}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              Tạo Coupon
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export function AdminAuditLogsPage({ onNavigate }) {
  const { auditLogs } = useCloudData();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = auditLogs.filter(
    l =>
      l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.details.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          Nhật Ký Kiểm Toán Toàn Hệ Thống (Audit Logs)
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Lưu vết toàn bộ các thao tác nhạy cảm của Quản trị viên, kỹ sư và thay đổi cấu hình hạ tầng.
        </p>
      </div>

      <div className="card" style={{ padding: '0.875rem 1.25rem', marginBottom: '1.5rem' }}>
        <div className="input-with-icon" style={{ maxWidth: '380px' }}>
          <Search size={16} className="input-icon-left" />
          <input
            type="text"
            className="form-input"
            placeholder="Tìm theo hành động, email actor, chi tiết..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Thời gian</th>
              <th>Người thực hiện (Actor)</th>
              <th>Hành động (Action)</th>
              <th>Chi tiết thao tác & Lý do</th>
              <th>Địa chỉ IP</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map(log => (
              <tr key={log.id}>
                <td>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                    {formatDate(log.date)}
                  </span>
                </td>
                <td>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{log.actor}</div>
                </td>
                <td>
                  <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>
                    {log.action}
                  </span>
                </td>
                <td>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                    {log.details}
                  </div>
                </td>
                <td>
                  <code style={{ fontSize: '0.75rem' }}>{log.ip}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
