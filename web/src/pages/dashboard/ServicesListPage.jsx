import React, { useState } from 'react';
import {
  Server,
  Plus,
  Search,
  Play,
  Square,
  RotateCcw,
  Terminal,
  ArrowRight,
  MoreVertical,
  RefreshCw
} from 'lucide-react';
import { useCloudData } from '../../context/CloudDataContext';
import { useToast } from '../../context/ToastContext';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { EmptyState } from '../../components/common/EmptyState';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { formatVND, formatDate } from '../../utils/formatters';

export function ServicesListPage({ onNavigate }) {
  const { services, startService, stopService, restartService } = useCloudData();
  const { success } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Confirmation modal state
  const [confirmAction, setConfirmAction] = useState(null); // { type: 'stop' | 'restart', serviceId: string, serviceName: string }

  const filteredServices = services.filter(srv => {
    const matchCat = filterCategory === 'all' || srv.category === filterCategory;
    const matchQuery =
      srv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.ip.includes(searchQuery) ||
      srv.osName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQuery;
  });

  const handleExecuteConfirm = () => {
    if (!confirmAction) return;

    if (confirmAction.type === 'stop') {
      stopService(confirmAction.serviceId);
      success('Đã gửi lệnh tắt!', `Máy chủ ${confirmAction.serviceName} đang được tắt.`);
    } else if (confirmAction.type === 'restart') {
      restartService(confirmAction.serviceId);
      success('Đang khởi động lại!', `Máy chủ ${confirmAction.serviceName} đang khởi động lại.`);
    }

    setConfirmAction(null);
  };

  return (
    <div>
      <Breadcrumb
        items={[
          { label: 'Bảng điều khiển', path: '/dashboard' },
          { label: 'Dịch vụ của tôi', path: '/dashboard/services' }
        ]}
        onNavigate={onNavigate}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Quản Lý Dịch Vụ Của Bạn ({services.length})
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Danh sách tất cả máy chủ Cloud Server, VPS, Game Server và dịch vụ đang hoạt động.
          </p>
        </div>

        <button
          className="btn btn-primary btn-sm"
          onClick={() => onNavigate('/cloud-server')}
        >
          <Plus size={16} />
          <span>Khởi tạo máy chủ mới</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
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
            placeholder="Tìm theo tên máy chủ, địa chỉ IP, HĐH..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className={`segment-btn ${filterCategory === 'all' ? 'active' : ''}`}
            onClick={() => setFilterCategory('all')}
          >
            Tất cả
          </button>
          <button
            className={`segment-btn ${filterCategory === 'cloud-server' ? 'active' : ''}`}
            onClick={() => setFilterCategory('cloud-server')}
          >
            Cloud Server
          </button>
          <button
            className={`segment-btn ${filterCategory === 'game-server' ? 'active' : ''}`}
            onClick={() => setFilterCategory('game-server')}
          >
            Game Server
          </button>
          <button
            className={`segment-btn ${filterCategory === 'vps' ? 'active' : ''}`}
            onClick={() => setFilterCategory('vps')}
          >
            VPS
          </button>
        </div>
      </div>

      {/* Services Table */}
      {filteredServices.length === 0 ? (
        <div className="card" style={{ padding: '3rem 1.5rem', backgroundColor: 'var(--bg-card)' }}>
          <EmptyState
            icon={Server}
            title="Không tìm thấy máy chủ nào"
            description="Bạn chưa có máy chủ phù hợp với tiêu chí tìm kiếm này."
            actionText="Khởi tạo máy chủ ngay"
            onAction={() => onNavigate('/cloud-server')}
          />
        </div>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tên máy chủ & IP</th>
                <th>Trạng thái</th>
                <th>Cấu hình vCPU / RAM</th>
                <th>Ổ cứng NVMe</th>
                <th>Trung tâm dữ liệu</th>
                <th>Ngày gia hạn</th>
                <th style={{ textAlign: 'right' }}>Thao tác nhanh</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.map(srv => {
                const isRunning = srv.status === 'running';
                const isRebuilding = srv.status === 'rebuilding';
                const isRestarting = srv.status === 'restarting';

                let badgeType = 'badge-neutral';
                if (isRunning) badgeType = 'badge-success';
                else if (isRebuilding || isRestarting) badgeType = 'badge-warning';

                return (
                  <tr key={srv.id}>
                    <td>
                      <div
                        onClick={() => onNavigate(`/dashboard/services/${srv.id}`)}
                        style={{ fontWeight: 700, color: 'var(--text-primary)', cursor: 'pointer' }}
                        className="hover-underline"
                      >
                        {srv.name}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        <code style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{srv.ip}</code>
                        <span>•</span>
                        <span>{srv.osName.split(' ')[0]}</span>
                      </div>
                    </td>

                    <td>
                      <span className={`badge ${badgeType}`}>
                        {srv.status.toUpperCase()}
                      </span>
                    </td>

                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {srv.specs.cpu} vCPU / {srv.specs.ram} GB
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Tải CPU: {srv.metrics?.cpuUsage || 0}%
                      </div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {srv.specs.storage} GB
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        NVMe Gen4
                      </div>
                    </td>

                    <td>
                      <span style={{ fontSize: '0.8125rem' }}>{srv.datacenterName.split('(')[0]}</span>
                    </td>

                    <td>
                      <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                        {formatDate(srv.renewDate, false)}
                      </span>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
                        {isRunning ? (
                          <>
                            <button
                              className="btn btn-outline btn-sm btn-icon-only"
                              title="Khởi động lại (Restart)"
                              onClick={() => setConfirmAction({ type: 'restart', serviceId: srv.id, serviceName: srv.name })}
                            >
                              <RotateCcw size={14} />
                            </button>
                            <button
                              className="btn btn-outline btn-sm btn-icon-only"
                              title="Tắt máy chủ (Stop)"
                              onClick={() => setConfirmAction({ type: 'stop', serviceId: srv.id, serviceName: srv.name })}
                            >
                              <Square size={14} />
                            </button>
                          </>
                        ) : (
                          <button
                            className="btn btn-primary btn-sm btn-icon-only"
                            title="Bật máy chủ (Start)"
                            onClick={() => {
                              startService(srv.id);
                              success('Đã gửi lệnh bật!', `Máy chủ ${srv.name} đang khởi động.`);
                            }}
                          >
                            <Play size={14} />
                          </button>
                        )}

                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => onNavigate(`/dashboard/services/${srv.id}`)}
                        >
                          <span>Quản lý</span>
                          <ArrowRight size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleExecuteConfirm}
        title={confirmAction?.type === 'stop' ? 'Xác nhận tắt máy chủ' : 'Xác nhận khởi động lại'}
        message={
          confirmAction?.type === 'stop'
            ? `Bạn có chắc chắn muốn tắt máy chủ "${confirmAction?.serviceName}" không? Các website và ứng dụng trên máy chủ sẽ tạm ngừng hoạt động.`
            : `Bạn có chắc chắn muốn khởi động lại máy chủ "${confirmAction?.serviceName}" không? Quá trình reboot sẽ hoàn tất trong khoảng 15-30 giây.`
        }
        confirmText={confirmAction?.type === 'stop' ? 'Tắt máy chủ' : 'Khởi động lại'}
        type={confirmAction?.type === 'stop' ? 'danger' : 'warning'}
      />
    </div>
  );
}
