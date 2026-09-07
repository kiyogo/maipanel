import React from 'react';
import {
  TrendingUp,
  ShoppingCart,
  Users,
  Server,
  HelpCircle,
  Shield,
  ArrowRight
} from 'lucide-react';
import { useCloudData } from '../../context/CloudDataContext';
import { formatVND, formatDate } from '../../utils/formatters';

export function AdminOverviewPage({ onNavigate }) {
  const { services, orders, usersList, tickets, auditLogs } = useCloudData();

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const openTickets = tickets.filter(t => t.status === 'open' || t.status === 'customer_reply').length;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
          Tổng Quan Quản Trị Hệ Thống (Admin Overview)
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Theo dõi doanh số, số lượng máy chủ hoạt động, khách hàng và nhật ký kiểm toán hệ thống.
        </p>
      </div>

      {/* 4 Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="stat-card">
          <div>
            <div className="stat-label">Tổng Doanh Thu Đơn Hàng</div>
            <div className="stat-value">{formatVND(totalRevenue)}</div>
          </div>
          <div className="stat-icon-box" style={{ backgroundColor: 'var(--success-surface)', color: 'var(--success-text)', borderColor: 'var(--success-border)' }}>
            <TrendingUp size={20} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Tổng Số Khách Hàng</div>
            <div className="stat-value">{usersList.length} Users</div>
          </div>
          <div className="stat-icon-box" style={{ backgroundColor: 'var(--info-surface)', color: 'var(--info-text)', borderColor: 'var(--info-border)' }}>
            <Users size={20} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Máy Chủ Hoạt Động</div>
            <div className="stat-value">{services.length} Nodes</div>
          </div>
          <div className="stat-icon-box">
            <Server size={20} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Ticket Chờ Xử Lý</div>
            <div className="stat-value">{openTickets}</div>
          </div>
          <div className="stat-icon-box" style={{ backgroundColor: 'var(--warning-surface)', color: 'var(--warning-text)', borderColor: 'var(--warning-border)' }}>
            <HelpCircle size={20} />
          </div>
        </div>
      </div>

      {/* Grid: Recent Orders + Recent Audit Logs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Recent Orders */}
        <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-card)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Đơn Hàng Toàn Hệ Thống
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('/admin/orders')}>
              <span>Quản lý</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {orders.slice(0, 4).map(o => (
              <div
                key={o.id}
                style={{
                  padding: '0.75rem',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.8125rem'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{o.id} - {o.customerName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formatDate(o.date)}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{formatVND(o.total)}</div>
                  <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>{o.orderStatus}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Audit Logs */}
        <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-card)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Nhật Ký Audit Trail Gần Đây
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('/admin/audit-logs')}>
              <span>Tất cả logs</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {auditLogs.slice(0, 4).map(log => (
              <div
                key={log.id}
                style={{
                  padding: '0.75rem',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.8125rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                  <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>{log.action}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formatDate(log.date)}</span>
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  {log.details}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminProductsPage({ onNavigate }) {
  const { products, addOrUpdateProduct, deleteProduct } = useCloudData();
  const { success } = useToast();

  const [editProduct, setEditProduct] = useState(null); // When editing / adding

  const handleSaveProduct = (e) => {
    e.preventDefault();
    addOrUpdateProduct(editProduct);
    setEditProduct(null);
    success('Đã lưu sản phẩm!', `Thông tin sản phẩm ${editProduct.name} đã được cập nhật.`);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Quản Lý Sản Phẩm & Gói Dịch Vụ ({products.length})
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Thêm mới, điều chỉnh giá cơ bản, thông số kỹ thuật và chu kỳ thanh toán.
          </p>
        </div>

        <button
          className="btn btn-primary btn-sm"
          onClick={() =>
            setEditProduct({
              id: 'prod-' + Date.now(),
              name: 'Gói Cloud Mới',
              slug: 'goi-cloud-moi',
              category: 'cloud-server',
              badge: 'Mới',
              tagline: 'Mô tả gói dịch vụ mới...',
              basePriceMonthly: 199000,
              specs: {
                cpu: '2 vCPU',
                ram: '4 GB RAM',
                storage: '60 GB NVMe',
                networkSpeed: '1 Gbps Port'
              },
              popular: false
            })
          }
        >
          + Thêm Sản Phẩm Mới
        </button>
      </div>

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Tên sản phẩm</th>
              <th>Danh mục</th>
              <th>Giá cơ bản / tháng</th>
              <th>Thông số nổi bật</th>
              <th>Nhãn (Badge)</th>
              <th style={{ textAlign: 'right' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{p.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {p.id}</div>
                </td>
                <td>
                  <span className="badge badge-neutral">{p.category}</span>
                </td>
                <td>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                    {formatVND(p.basePriceMonthly)}
                  </span>
                </td>
                <td>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                    {p.specs.cpu || p.specs.domains} • {p.specs.ram || p.specs.storage}
                  </div>
                </td>
                <td>
                  {p.badge ? <span className="badge badge-primary">{p.badge}</span> : '-'}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '0.375rem' }}>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => setEditProduct({ ...p })}
                    >
                      Chỉnh sửa
                    </button>
                    <button
                      className="btn btn-danger-outline btn-sm"
                      onClick={() => {
                        deleteProduct(p.id);
                        success('Đã xóa', `Đã xóa sản phẩm ${p.name}`);
                      }}
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* EDIT / CREATE PRODUCT MODAL */}
      {editProduct && (
        <div className="modal-overlay" onClick={() => setEditProduct(null)}>
          <div className="modal-content modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                {editProduct.id.startsWith('prod-') ? 'Thêm Sản Phẩm Mới' : `Chỉnh Sửa: ${editProduct.name}`}
              </div>
            </div>

            <form onSubmit={handleSaveProduct}>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Tên sản phẩm *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      value={editProduct.name}
                      onChange={e => setEditProduct({ ...editProduct, name: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Danh mục dịch vụ *</label>
                    <select
                      className="form-select"
                      value={editProduct.category}
                      onChange={e => setEditProduct({ ...editProduct, category: e.target.value })}
                    >
                      <option value="cloud-server">Cloud Server</option>
                      <option value="vps">VPS NVMe</option>
                      <option value="game-server">Game Server</option>
                      <option value="hosting">Web Hosting</option>
                      <option value="storage">Object Storage</option>
                      <option value="domain">Tên miền</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Giá cơ bản theo tháng (VNĐ) *</label>
                    <input
                      type="number"
                      required
                      className="form-input"
                      value={editProduct.basePriceMonthly}
                      onChange={e => setEditProduct({ ...editProduct, basePriceMonthly: Number(e.target.value) })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Nhãn Badge (Tùy chọn):</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editProduct.badge || ''}
                      onChange={e => setEditProduct({ ...editProduct, badge: e.target.value })}
                      placeholder="Phổ biến / Bán chạy / Mới"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Mô tả ngắn (Tagline):</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editProduct.tagline || ''}
                    onChange={e => setEditProduct({ ...editProduct, tagline: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setEditProduct(null)}>
                  Hủy bỏ
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Lưu Sản Phẩm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
