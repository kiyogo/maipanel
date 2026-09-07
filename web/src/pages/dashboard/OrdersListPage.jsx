import React, { useState } from 'react';
import {
  FileText,
  Search,
  ArrowRight,
  Printer,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download
} from 'lucide-react';
import { useCloudData } from '../../context/CloudDataContext';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { EmptyState } from '../../components/common/EmptyState';
import { formatVND, formatDate } from '../../utils/formatters';

export function OrdersListPage({ onNavigate }) {
  const { orders } = useCloudData();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredOrders = orders.filter(ord => {
    const matchStatus = statusFilter === 'all' || ord.orderStatus === statusFilter;
    const matchQuery =
      ord.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.items.some(i => i.productName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchStatus && matchQuery;
  });

  return (
    <div>
      <Breadcrumb
        items={[
          { label: 'Bảng điều khiển', path: '/dashboard' },
          { label: 'Lịch sử đơn hàng', path: '/dashboard/orders' }
        ]}
        onNavigate={onNavigate}
      />

      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          Lịch Sử Đơn Hàng & Hóa Đơn ({orders.length})
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Xem và quản lý tất cả đơn hàng dịch vụ hạ tầng đã đặt trên hệ thống Nexus Cloud.
        </p>
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
            placeholder="Tìm theo mã đơn hàng (ORD-...), tên gói..."
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
            className={`segment-btn ${statusFilter === 'completed' ? 'active' : ''}`}
            onClick={() => setStatusFilter('completed')}
          >
            Hoàn tất
          </button>
          <button
            className={`segment-btn ${statusFilter === 'processing' ? 'active' : ''}`}
            onClick={() => setStatusFilter('processing')}
          >
            Đang xử lý
          </button>
          <button
            className={`segment-btn ${statusFilter === 'pending' ? 'active' : ''}`}
            onClick={() => setStatusFilter('pending')}
          >
            Chờ thanh toán
          </button>
        </div>
      </div>

      {/* Orders List Table */}
      {filteredOrders.length === 0 ? (
        <div className="card" style={{ padding: '3rem 1.5rem', backgroundColor: 'var(--bg-card)' }}>
          <EmptyState
            icon={FileText}
            title="Chưa có đơn hàng nào"
            description="Bạn chưa có đơn hàng nào phù hợp với bộ lọc tìm kiếm."
            actionText="Khám phá Dịch vụ Cloud"
            onAction={() => onNavigate('/services')}
          />
        </div>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã Đơn Hàng</th>
                <th>Thời Gian</th>
                <th>Dịch Vụ Đăng Ký</th>
                <th>Phương Thức</th>
                <th>Tổng Tiền</th>
                <th>Trạng Thái</th>
                <th style={{ textAlign: 'right' }}>Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id}>
                  <td>
                    <span
                      onClick={() => onNavigate(`/dashboard/orders/${order.id}`)}
                      style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', cursor: 'pointer' }}
                    >
                      {order.id}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                      {formatDate(order.date)}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {order.items[0]?.productName} {order.items.length > 1 && `(+${order.items.length - 1} mục khác)`}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {order.items[0]?.plan}
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-neutral" style={{ textTransform: 'capitalize' }}>
                      {order.paymentMethod === 'wallet' ? 'Ví tài khoản' : order.paymentMethod === 'vietqr' ? 'VietQR 24/7' : 'Chuyển khoản'}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                      {formatVND(order.total)}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${order.orderStatus === 'completed' ? 'badge-success' : order.orderStatus === 'pending' ? 'badge-warning' : 'badge-info'}`}>
                      {order.orderStatus.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => onNavigate(`/dashboard/orders/${order.id}`)}
                    >
                      <span>Hóa đơn</span>
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

export function OrderDetailPage({ orderId, onNavigate }) {
  const { orders } = useCloudData();
  const order = orders.find(o => o.id === orderId) || orders[0];

  if (!order) {
    return (
      <div>
        <Breadcrumb
          items={[
            { label: 'Lịch sử đơn hàng', path: '/dashboard/orders' },
            { label: 'Không tìm thấy', path: '' }
          ]}
          onNavigate={onNavigate}
        />
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <p>Không tìm thấy thông tin đơn hàng yêu cầu.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb
        items={[
          { label: 'Lịch sử đơn hàng', path: '/dashboard/orders' },
          { label: order.id, path: `/dashboard/orders/${order.id}` }
        ]}
        onNavigate={onNavigate}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Đơn Hàng #{order.id}
            </h1>
            <span className="badge badge-success">
              {order.orderStatus.toUpperCase()}
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
            Thời gian đặt hàng: {formatDate(order.date)}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => window.print()}
          >
            <Printer size={15} />
            <span>In Hóa Đơn</span>
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => onNavigate('/dashboard/services')}
          >
            <span>Đến trang Dịch vụ</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Invoice Card */}
      <div className="card" style={{ padding: '2.5rem', backgroundColor: 'var(--bg-card)', marginBottom: '2rem' }}>
        {/* Invoice Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              NEXUS CLOUD INFRASTRUCTURE
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Viettel IDC Pháp Vân, Hoàng Mai, Hà Nội, Việt Nam<br />
              Hotline: 1900 6868 • Email: billing@nexuscloud.vn
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>HÓA ĐƠN ĐIỆN TỬ</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Mã số: {order.id}</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Ngày tạo: {formatDate(order.date, false)}</div>
          </div>
        </div>

        {/* Customer & Payment Info */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem', fontSize: '0.875rem' }}>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Khách Hàng:</div>
            <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{order.customerName}</div>
            <div style={{ color: 'var(--text-muted)' }}>Email: {order.customerEmail}</div>
          </div>

          <div>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Thông Tin Thanh Toán:</div>
            <div style={{ color: 'var(--text-secondary)' }}>
              Phương thức: <b style={{ textTransform: 'capitalize' }}>{order.paymentMethod === 'wallet' ? 'Ví Nexus' : 'VietQR 24/7'}</b>
            </div>
            <div style={{ color: 'var(--success-text)', fontWeight: 600 }}>
              Trạng thái: ĐÃ THANH TOÁN THÀNH CÔNG
            </div>
          </div>
        </div>

        {/* Invoice Items Table */}
        <div className="table-responsive" style={{ marginBottom: '1.5rem' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Mô tả dịch vụ</th>
                <th>Chu kỳ</th>
                <th>Số lượng</th>
                <th>Đơn giá</th>
                <th style={{ textAlign: 'right' }}>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, idx) => (
                <tr key={idx}>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.productName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {item.plan} • {item.datacenter} • {item.os}
                    </div>
                  </td>
                  <td>{item.billingCycle || '1 Tháng'}</td>
                  <td>{item.quantity}</td>
                  <td>{formatVND(item.price)}</td>
                  <td style={{ textAlign: 'right', fontWeight: 700 }}>
                    {formatVND(item.price * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Invoice Summary */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Tạm tính:</span>
              <span>{formatVND(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success-text)', fontWeight: 600 }}>
                <span>Khuyến mãi / Giảm giá:</span>
                <span>-{formatVND(order.discount)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Thuế VAT (0%):</span>
              <span>0đ</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              <span>Tổng thanh toán:</span>
              <span>{formatVND(order.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
