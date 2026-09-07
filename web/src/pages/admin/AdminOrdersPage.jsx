import React, { useState } from 'react';
import { ShoppingCart, Search, CheckCircle2, Clock, XCircle, RefreshCw, ArrowRight } from 'lucide-react';
import { useCloudData } from '../../context/CloudDataContext';
import { useToast } from '../../context/ToastContext';
import { formatVND, formatDate } from '../../utils/formatters';

export function AdminOrdersPage({ onNavigate }) {
  const { orders, updateOrderStatus } = useCloudData();
  const { success } = useToast();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = orders.filter(
    o =>
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
    success('Đã cập nhật trạng thái!', `Đơn hàng ${orderId} chuyển sang "${newStatus}".`);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Quản Lý Đơn Hàng Toàn Hệ Thống ({orders.length})
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Xem chi tiết đơn hàng, cập nhật trạng thái cấp phát máy chủ và xử lý hoàn tiền.
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: '0.875rem 1.25rem', marginBottom: '1.5rem' }}>
        <div className="input-with-icon" style={{ maxWidth: '380px' }}>
          <Search size={16} className="input-icon-left" />
          <input
            type="text"
            className="form-input"
            placeholder="Tìm theo mã đơn, tên khách, email..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Khách hàng</th>
              <th>Sản phẩm</th>
              <th>Tổng tiền</th>
              <th>Phương thức</th>
              <th>Trạng thái hiện tại</th>
              <th style={{ textAlign: 'right' }}>Cập nhật trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(ord => (
              <tr key={ord.id}>
                <td>
                  <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{ord.id}</span>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formatDate(ord.date)}</div>
                </td>
                <td>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{ord.customerName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ord.customerEmail}</div>
                </td>
                <td>
                  <div style={{ fontWeight: 500 }}>{ord.items[0]?.productName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ord.items[0]?.plan}</div>
                </td>
                <td>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{formatVND(ord.total)}</span>
                </td>
                <td>
                  <span className="badge badge-neutral" style={{ textTransform: 'capitalize' }}>
                    {ord.paymentMethod}
                  </span>
                </td>
                <td>
                  <span className={`badge ${ord.orderStatus === 'completed' ? 'badge-success' : ord.orderStatus === 'pending' ? 'badge-warning' : 'badge-info'}`}>
                    {ord.orderStatus.toUpperCase()}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <select
                    className="form-select"
                    style={{ width: 'auto', display: 'inline-block', fontSize: '0.8125rem', padding: '0.375rem 0.5rem' }}
                    value={ord.orderStatus}
                    onChange={e => handleStatusChange(ord.id, e.target.value)}
                  >
                    <option value="pending">Pending (Chờ)</option>
                    <option value="processing">Processing (Đang tạo)</option>
                    <option value="completed">Completed (Xong)</option>
                    <option value="cancelled">Cancelled (Hủy)</option>
                    <option value="refunded">Refunded (Hoàn tiền)</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AdminTicketsPage({ onNavigate }) {
  const { tickets, addTicketMessage, closeTicket } = useCloudData();
  const { success } = useToast();

  const [selectedTicketId, setSelectedTicketId] = useState(tickets[0]?.id || null);
  const [replyText, setReplyText] = useState('');

  const currentTicket = tickets.find(t => t.id === selectedTicketId) || tickets[0];

  const handleAdminReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !currentTicket) return;

    addTicketMessage(currentTicket.id, replyText.trim(), true);
    setReplyText('');
    success('Đã gửi trả lời!', 'Phản hồi từ quản trị viên đã được cập nhật.');
  };

  return (
    <div>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          Trung Tâm Xử Lý Tickets Khách Hàng ({tickets.length})
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Xem và trả lời các yêu cầu hỗ trợ kỹ thuật và hóa đơn từ người dùng.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '1.5rem', alignItems: 'flex-start' }} className="admin-tickets-grid">
        {/* Left: Tickets List */}
        <div className="card" style={{ padding: '1rem', backgroundColor: 'var(--bg-card)', maxHeight: '600px', overflowY: 'auto' }}>
          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem', padding: '0 0.5rem' }}>
            Hàng Chờ Tickets
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {tickets.map(t => (
              <div
                key={t.id}
                onClick={() => setSelectedTicketId(t.id)}
                style={{
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: t.id === selectedTicketId ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                  backgroundColor: t.id === selectedTicketId ? 'var(--primary-surface)' : 'var(--bg-secondary)',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  <span>{t.id}</span>
                  <span className={`badge ${t.status === 'open' ? 'badge-warning' : 'badge-neutral'}`} style={{ fontSize: '0.65rem' }}>
                    {t.status}
                  </span>
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: '0.25rem 0', fontWeight: 600 }}>
                  {t.subject}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {t.departmentName} • {formatDate(t.lastUpdate)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Active Ticket Thread & Reply */}
        {currentTicket ? (
          <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-card)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {currentTicket.subject}
                </h3>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  ID: {currentTicket.id} • Dịch vụ: <b>{currentTicket.serviceName}</b> • Độ ưu tiên: <b style={{ textTransform: 'uppercase' }}>{currentTicket.priority}</b>
                </div>
              </div>

              {currentTicket.status !== 'closed' && (
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    closeTicket(currentTicket.id);
                    success('Đã đóng ticket', `Ticket ${currentTicket.id} đã hoàn tất.`);
                  }}
                >
                  Đóng ticket
                </button>
              )}
            </div>

            {/* Conversation list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', maxHeight: '360px', overflowY: 'auto', marginBottom: '1.25rem', padding: '0.5rem' }}>
              {currentTicket.messages.map(m => (
                <div
                  key={m.id}
                  style={{
                    padding: '0.875rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    backgroundColor: m.senderType === 'staff' ? 'var(--warning-surface)' : 'var(--bg-secondary)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                    <span>{m.senderName} ({m.senderType.toUpperCase()})</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>{formatDate(m.time)}</span>
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{m.message}</div>
                </div>
              ))}
            </div>

            {/* Reply Input Form */}
            <form onSubmit={handleAdminReply} style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Trả lời khách hàng với tư cách Admin / Support..."
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
              />
              <button type="submit" className="btn btn-primary btn-sm">
                Trả lời
              </button>
            </form>
          </div>
        ) : (
          <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
            Chọn một ticket để xem nội dung
          </div>
        )}
      </div>
    </div>
  );
}
