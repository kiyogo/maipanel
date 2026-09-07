import React, { useState } from 'react';
import {
  HelpCircle,
  Plus,
  Search,
  MessageSquare,
  ArrowRight,
  Send,
  UserCheck,
  CheckCircle2,
  Clock,
  Paperclip
} from 'lucide-react';
import { useCloudData } from '../../context/CloudDataContext';
import { useToast } from '../../context/ToastContext';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { EmptyState } from '../../components/common/EmptyState';
import { formatDate } from '../../utils/formatters';

export function TicketsListPage({ onNavigate }) {
  const { tickets } = useCloudData();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredTickets = tickets.filter(t => {
    const matchStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchQuery =
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchQuery;
  });

  return (
    <div>
      <Breadcrumb
        items={[
          { label: 'Bảng điều khiển', path: '/dashboard' },
          { label: 'Ticket hỗ trợ', path: '/dashboard/tickets' }
        ]}
        onNavigate={onNavigate}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Hệ Thống Ticket Hỗ Trợ Kỹ Thuật ({tickets.length})
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Trao đổi trực tiếp 24/7 với các kỹ sư hệ thống của Nexus Cloud.
          </p>
        </div>

        <button
          className="btn btn-primary btn-sm"
          onClick={() => onNavigate('/dashboard/tickets/new')}
        >
          <Plus size={16} />
          <span>Tạo Ticket Mới</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div
        className="card"
        style={{
          padding: '0.875rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap'
        }}
      >
        <div className="input-with-icon" style={{ flex: '1 1 280px' }}>
          <Search size={16} className="input-icon-left" />
          <input
            type="text"
            className="form-input"
            placeholder="Tìm kiếm ticket..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className={`segment-btn ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            Tất cả
          </button>
          <button
            className={`segment-btn ${statusFilter === 'open' ? 'active' : ''}`}
            onClick={() => setStatusFilter('open')}
          >
            Đang xử lý
          </button>
          <button
            className={`segment-btn ${statusFilter === 'answered' ? 'active' : ''}`}
            onClick={() => setStatusFilter('answered')}
          >
            Kỹ thuật đã trả lời
          </button>
          <button
            className={`segment-btn ${statusFilter === 'closed' ? 'active' : ''}`}
            onClick={() => setStatusFilter('closed')}
          >
            Đã đóng
          </button>
        </div>
      </div>

      {/* Tickets Table */}
      {filteredTickets.length === 0 ? (
        <div className="card" style={{ padding: '3rem 1.5rem', backgroundColor: 'var(--bg-card)' }}>
          <EmptyState
            icon={HelpCircle}
            title="Chưa có ticket nào"
            description="Bạn chưa có yêu cầu hỗ trợ kỹ thuật nào."
            actionText="Tạo Ticket Mới Ngay"
            onAction={() => onNavigate('/dashboard/tickets/new')}
          />
        </div>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã Ticket</th>
                <th>Tiêu Đề Yêu Cầu</th>
                <th>Phòng Ban</th>
                <th>Độ Ưu Tiên</th>
                <th>Cập Nhật Lần Cuối</th>
                <th>Trạng Thái</th>
                <th style={{ textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map(ticket => (
                <tr key={ticket.id}>
                  <td>
                    <span
                      onClick={() => onNavigate(`/dashboard/tickets/${ticket.id}`)}
                      style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', cursor: 'pointer' }}
                    >
                      {ticket.id}
                    </span>
                  </td>
                  <td>
                    <div
                      onClick={() => onNavigate(`/dashboard/tickets/${ticket.id}`)}
                      style={{ fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }}
                    >
                      {ticket.subject}
                    </div>
                    {ticket.serviceName && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Máy chủ: {ticket.serviceName}
                      </div>
                    )}
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8125rem' }}>{ticket.departmentName}</span>
                  </td>
                  <td>
                    <span className={`badge ${ticket.priority === 'urgent' ? 'badge-danger' : ticket.priority === 'high' ? 'badge-warning' : 'badge-neutral'}`}>
                      {ticket.priority.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                      {formatDate(ticket.lastUpdate)}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${ticket.status === 'answered' ? 'badge-success' : ticket.status === 'open' ? 'badge-info' : 'badge-neutral'}`}>
                      {ticket.status === 'answered' ? 'Kỹ thuật đã trả lời' : ticket.status === 'open' ? 'Đang mở' : 'Đã đóng'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => onNavigate(`/dashboard/tickets/${ticket.id}`)}
                    >
                      <span>Xem tin nhắn</span>
                      <ArrowRight size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function TicketCreatePage({ onNavigate }) {
  const { services, createTicket } = useCloudData();
  const { success, error } = useToast();

  const [subject, setSubject] = useState('');
  const [department, setDepartment] = useState('technical');
  const [priority, setPriority] = useState('medium');
  const [serviceId, setServiceId] = useState(services[0]?.id || '');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      error('Lỗi', 'Vui lòng nhập đầy đủ tiêu đề và nội dung yêu cầu.');
      return;
    }

    const created = createTicket({
      subject,
      department,
      priority,
      serviceId,
      message
    });

    success('Tạo Ticket thành công!', `Ticket ${created.id} đã được gửi đến các kỹ sư trực.`);
    onNavigate(`/dashboard/tickets/${created.id}`);
  };

  return (
    <div style={{ maxWidth: '800px' }}>
      <Breadcrumb
        items={[
          { label: 'Bảng điều khiển', path: '/dashboard' },
          { label: 'Ticket hỗ trợ', path: '/dashboard/tickets' },
          { label: 'Tạo ticket mới', path: '/dashboard/tickets/new' }
        ]}
        onNavigate={onNavigate}
      />

      <div className="card" style={{ padding: '2rem', backgroundColor: 'var(--bg-card)' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          Tạo Yêu Cầu Hỗ Trợ Mới
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.75rem' }}>
          Kỹ sư hỗ trợ sẽ phản hồi trong vòng dưới 15 phút.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Tiêu đề yêu cầu *</label>
            <input
              type="text"
              required
              className="form-input"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="Ví dụ: Cần hỗ trợ mở port 443 hoặc phân giải DNS..."
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Phòng ban tiếp nhận:</label>
              <select className="form-select" value={department} onChange={e => setDepartment(e.target.value)}>
                <option value="technical">Phòng Kỹ thuật (24/7)</option>
                <option value="billing">Phòng Kế toán & Hóa đơn</option>
                <option value="sales">Phòng Kinh doanh & Báo giá</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Mức độ ưu tiên:</label>
              <select className="form-select" value={priority} onChange={e => setPriority(e.target.value)}>
                <option value="low">Thấp (Tư vấn chung)</option>
                <option value="medium">Trung bình (Tiêu chuẩn)</option>
                <option value="high">Cao (Ứng dụng gặp sự cố)</option>
                <option value="urgent">Khẩn cấp (Server ngừng hoạt động)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Dịch vụ / Máy chủ liên quan:</label>
            <select className="form-select" value={serviceId} onChange={e => setServiceId(e.target.value)}>
              <option value="">-- Dịch vụ chung / Khác --</option>
              {services.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.ip})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Nội dung chi tiết *</label>
            <textarea
              rows={5}
              required
              className="form-textarea"
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Mô tả cụ thể thông báo lỗi, lệnh đã chạy hoặc cấu hình mong muốn..."
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => onNavigate('/dashboard/tickets')}
            >
              Hủy bỏ
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              <Send size={15} />
              <span>Gửi Yêu Cầu Hỗ Trợ</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function TicketDetailPage({ ticketId, onNavigate }) {
  const { tickets, addTicketMessage, closeTicket } = useCloudData();
  const { success } = useToast();
  const [replyText, setReplyText] = useState('');

  const ticket = tickets.find(t => t.id === ticketId) || tickets[0];

  if (!ticket) {
    return <div>Ticket không tồn tại.</div>;
  }

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    addTicketMessage(ticket.id, replyText.trim(), false);
    setReplyText('');
    success('Đã gửi phản hồi', 'Tin nhắn của bạn đã được chuyển đến kỹ sư.');
  };

  const handleSimulateStaffReply = () => {
    addTicketMessage(ticket.id, 'Kỹ thuật viên Nexus đã tiếp nhận và thực hiện xong cấu hình cho anh ạ. Nhờ anh kiểm tra lại nhé!', true);
    success('Mô phỏng thành công!', 'Kỹ thuật viên đã trả lời vào cuộc hội thoại.');
  };

  return (
    <div>
      <Breadcrumb
        items={[
          { label: 'Bảng điều khiển', path: '/dashboard' },
          { label: 'Ticket hỗ trợ', path: '/dashboard/tickets' },
          { label: ticket.id, path: `/dashboard/tickets/${ticket.id}` }
        ]}
        onNavigate={onNavigate}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Ticket #{ticket.id}
            </h1>
            <span className="badge badge-primary">{ticket.departmentName}</span>
            <span className={`badge ${ticket.status === 'closed' ? 'badge-neutral' : 'badge-success'}`}>
              {ticket.status.toUpperCase()}
            </span>
          </div>
          <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            {ticket.subject}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {/* Staff response simulation tool */}
          <button
            className="btn btn-outline btn-sm"
            onClick={handleSimulateStaffReply}
            title="Mô phỏng tin nhắn phản hồi từ nhân viên kỹ thuật"
          >
            <UserCheck size={14} />
            <span>Mô phỏng Kỹ thuật trả lời</span>
          </button>

          {ticket.status !== 'closed' && (
            <button
              className="btn btn-danger-outline btn-sm"
              onClick={() => {
                closeTicket(ticket.id);
                success('Đã đóng ticket', `Ticket ${ticket.id} đã được đóng.`);
              }}
            >
              Đóng Ticket
            </button>
          )}
        </div>
      </div>

      {/* Ticket Chat Container */}
      <div className="ticket-chat-container">
        <div className="ticket-chat-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            <span>Liên quan: <b>{ticket.serviceName}</b></span>
            <span>Khởi tạo lúc: {formatDate(ticket.createdDate)}</span>
          </div>
        </div>

        {/* Message Thread */}
        <div className="ticket-messages-list">
          {ticket.messages.map(msg => {
            const isUser = msg.senderType === 'user';
            return (
              <div
                key={msg.id}
                className={`message-bubble ${isUser ? 'message-user' : 'message-staff'}`}
              >
                <div style={{ fontWeight: 700, fontSize: '0.8125rem', color: isUser ? 'var(--primary-text)' : 'var(--text-primary)', marginBottom: '0.25rem' }}>
                  {msg.senderName} {msg.senderType === 'staff' && <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>Staff</span>}
                </div>
                <div>{msg.message}</div>
                <div className="message-meta">
                  <span>{formatDate(msg.time)}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reply Input Area */}
        {ticket.status !== 'closed' ? (
          <form onSubmit={handleSendReply} className="ticket-input-area">
            <input
              type="text"
              className="form-input"
              placeholder="Nhập nội dung phản hồi cho kỹ thuật viên..."
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
            />
            <button type="submit" className="btn btn-primary btn-sm">
              <Send size={15} />
              <span>Gửi</span>
            </button>
          </form>
        ) : (
          <div style={{ padding: '1rem', textAlign: 'center', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Ticket này đã được đóng. Bạn có thể mở ticket mới nếu cần hỗ trợ thêm.
          </div>
        )}
      </div>
    </div>
  );
}
