import React from 'react';
import {
  Wallet,
  Server,
  FileText,
  HelpCircle,
  Plus,
  ArrowRight,
  RotateCcw,
  Terminal,
  Activity,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCloudData } from '../../context/CloudDataContext';
import { formatVND, formatDate } from '../../utils/formatters';

export function OverviewPage({ onNavigate }) {
  const { user } = useAuth();
  const { services, orders, tickets, restartService } = useCloudData();

  const runningServicesCount = services.filter(s => s.status === 'running').length;
  const openTicketsCount = tickets.filter(t => t.status === 'open' || t.status === 'customer_reply').length;

  return (
    <div>
      {/* Top Greeting */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            Chào mừng trở lại, {user?.name || 'Khách hàng'}!
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Hệ thống hạ tầng máy chủ và dịch vụ của bạn đang hoạt động ổn định.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => onNavigate('/dashboard/wallet')}
          >
            <Wallet size={15} />
            <span>Nạp tiền vào ví</span>
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => onNavigate('/cloud-server')}
          >
            <Plus size={16} />
            <span>Khởi tạo máy chủ mới</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="stat-card">
          <div>
            <div className="stat-label">Số Dư Ví Khả Dụng</div>
            <div className="stat-value">{formatVND(user?.balance || 0)}</div>
          </div>
          <div className="stat-icon-box">
            <Wallet size={20} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Máy Chủ Đang Chạy</div>
            <div className="stat-value">{runningServicesCount} / {services.length}</div>
          </div>
          <div className="stat-icon-box">
            <Server size={20} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Tổng Đơn Hàng</div>
            <div className="stat-value">{orders.length} Đơn</div>
          </div>
          <div className="stat-icon-box">
            <FileText size={20} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Ticket Hỗ Trợ Đang Mở</div>
            <div className="stat-value">{openTicketsCount}</div>
          </div>
          <div className="stat-icon-box">
            <HelpCircle size={20} />
          </div>
        </div>
      </div>

      {/* Main Grid: Active Services + Recent Orders */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '2rem', alignItems: 'flex-start' }} className="overview-main-grid">
        {/* Left: Active Services */}
        <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-card)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Máy Chủ Của Bạn ({services.length})
            </div>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => onNavigate('/dashboard/services')}
            >
              <span>Xem tất cả</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {services.slice(0, 3).map(srv => {
              const isRunning = srv.status === 'running';
              return (
                <div
                  key={srv.id}
                  style={{
                    padding: '1.25rem',
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                          {srv.name}
                        </span>
                        <span className={`badge ${isRunning ? 'badge-success' : 'badge-neutral'}`}>
                          {srv.status}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        {srv.osName} • {srv.datacenterName.split('(')[0]}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <code style={{ fontSize: '0.8125rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                        {srv.ip}
                      </code>
                    </div>
                  </div>

                  {/* Resource Bar Preview */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', margin: '0.75rem 0', fontSize: '0.75rem' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <span>CPU ({srv.specs.cpu} Cores)</span>
                        <span style={{ fontWeight: 600 }}>{srv.metrics.cpuUsage}%</span>
                      </div>
                      <div className="progress-track"><div className="progress-fill" style={{ width: `${srv.metrics.cpuUsage}%` }}></div></div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <span>RAM ({srv.specs.ram} GB)</span>
                        <span style={{ fontWeight: 600 }}>{srv.metrics.ramUsage}%</span>
                      </div>
                      <div className="progress-track"><div className="progress-fill" style={{ width: `${srv.metrics.ramUsage}%` }}></div></div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', marginTop: '0.75rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Gia hạn: {formatDate(srv.renewDate, false)}
                    </span>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => onNavigate(`/dashboard/services/${srv.id}`)}
                      >
                        Quản lý máy chủ
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Recent Orders & Quick Support */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Recent Orders Box */}
          <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-card)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Đơn Hàng Gần Đây
              </div>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => onNavigate('/dashboard/orders')}
              >
                <span>Tất cả</span>
                <ArrowRight size={14} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {orders.slice(0, 3).map(order => (
                <div
                  key={order.id}
                  onClick={() => onNavigate(`/dashboard/orders/${order.id}`)}
                  style={{
                    padding: '0.75rem',
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                    <span>{order.id}</span>
                    <span>{formatVND(order.total)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span>{order.items[0]?.productName || 'Cloud Server'}</span>
                    <span className="badge badge-success" style={{ fontSize: '0.6875rem' }}>{order.orderStatus}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Ticket Action */}
          <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-card)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-surface)', color: 'var(--primary-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <HelpCircle size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>Cần Hỗ Trợ Kỹ Thuật?</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Đội ngũ trực 24/7/365</div>
              </div>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.5 }}>
              Gửi ticket để được kỹ sư hỗ trợ phân giải DNS, mở port firewall, cấu hình RAID hoặc xử lý sự cố.
            </p>
            <button
              className="btn btn-outline btn-block btn-sm"
              onClick={() => onNavigate('/dashboard/tickets/new')}
            >
              Tạo Ticket Yêu Cầu Hỗ Trợ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
