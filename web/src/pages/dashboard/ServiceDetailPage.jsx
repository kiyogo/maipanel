import React, { useState } from 'react';
import {
  Server,
  Play,
  Square,
  RotateCcw,
  Terminal,
  RefreshCw,
  Key,
  Camera,
  ArrowUpCircle,
  Calendar,
  Copy,
  Check,
  Eye,
  EyeOff,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Shield,
  Activity
} from 'lucide-react';
import { useCloudData } from '../../context/CloudDataContext';
import { useToast } from '../../context/ToastContext';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { Modal } from '../../components/common/Modal';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { WebTerminalModal, ServerMetricsChart } from '../../components/dashboard/WebTerminalModal';
import { OS_OPTIONS } from '../../data/osList';
import { formatVND, formatDate } from '../../utils/formatters';

export function ServiceDetailPage({ serviceId, onNavigate }) {
  const {
    services,
    startService,
    stopService,
    restartService,
    reinstallServiceOs,
    changeServicePassword,
    createSnapshot,
    deleteSnapshot,
    upgradeServicePlan,
    renewService
  } = useCloudData();

  const { success, error } = useToast();

  const server = services.find(s => s.id === serviceId) || services[0];

  // Active sub-modals
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [reinstallModalOpen, setReinstallModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [snapshotModalOpen, setSnapshotModalOpen] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [renewModalOpen, setRenewModalOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState(null); // { type, title, message }

  // Form states
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  // Reinstall OS form state
  const [reinstallOsId, setReinstallOsId] = useState('ubuntu-24');
  const [reinstallRootPass, setReinstallRootPass] = useState('');

  // Change Password form state
  const [newRootPass, setNewRootPass] = useState('');

  // Snapshot form state
  const [snapshotName, setSnapshotName] = useState('');

  // Upgrade form state
  const [upgradeCpu, setUpgradeCpu] = useState(server?.specs?.cpu || 4);
  const [upgradeRam, setUpgradeRam] = useState(server?.specs?.ram || 8);
  const [upgradeStorage, setUpgradeStorage] = useState(server?.specs?.storage || 80);

  // Renew form state
  const [renewMonths, setRenewMonths] = useState(1);

  if (!server) {
    return (
      <div>
        <Breadcrumb
          items={[
            { label: 'Dịch vụ của tôi', path: '/dashboard/services' },
            { label: 'Không tìm thấy máy chủ', path: '' }
          ]}
          onNavigate={onNavigate}
        />
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <p>Không tìm thấy thông tin máy chủ yêu cầu.</p>
          <button className="btn btn-primary btn-sm" onClick={() => onNavigate('/dashboard/services')}>
            Quay lại danh sách dịch vụ
          </button>
        </div>
      </div>
    );
  }

  const isRunning = server.status === 'running';
  const isRebuilding = server.status === 'rebuilding';
  const isRestarting = server.status === 'restarting';

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
    success('Đã sao chép!', text);
  };

  // Handlers
  const handlePowerAction = (actionType) => {
    if (actionType === 'stop') {
      setConfirmModal({
        type: 'stop',
        title: 'Tắt máy chủ',
        message: `Bạn có chắc chắn muốn tắt máy chủ "${server.name}" không? Toàn bộ dịch vụ web và database sẽ tạm dừng.`
      });
    } else if (actionType === 'restart') {
      setConfirmModal({
        type: 'restart',
        title: 'Khởi động lại máy chủ',
        message: `Bạn có chắc chắn muốn reboot máy chủ "${server.name}" không?`
      });
    } else if (actionType === 'start') {
      startService(server.id);
      success('Đã gửi lệnh bật!', `Máy chủ ${server.name} đang khởi động.`);
    }
  };

  const handleConfirmModalAction = () => {
    if (!confirmModal) return;
    if (confirmModal.type === 'stop') {
      stopService(server.id);
      success('Đã tắt máy chủ', `Máy chủ ${server.name} đã được tắt an toàn.`);
    } else if (confirmModal.type === 'restart') {
      restartService(server.id);
      success('Đang khởi động lại...', `Máy chủ ${server.name} đang được reboot.`);
    }
    setConfirmModal(null);
  };

  const handleReinstallSubmit = (e) => {
    e.preventDefault();
    if (!reinstallRootPass || reinstallRootPass.length < 8) {
      error('Mật khẩu không hợp lệ', 'Mật khẩu root mới phải có tối thiểu 8 ký tự.');
      return;
    }
    const chosenOs = OS_OPTIONS.find(o => o.id === reinstallOsId) || OS_OPTIONS[0];
    reinstallServiceOs(server.id, chosenOs.id, chosenOs.name, reinstallRootPass);
    setReinstallModalOpen(false);
    setReinstallRootPass('');
    success('Đang cài lại hệ điều hành!', `Máy chủ ${server.name} đang được format và cài đặt ${chosenOs.name}.`);
  };

  const handleChangePasswordSubmit = (e) => {
    e.preventDefault();
    if (!newRootPass || newRootPass.length < 8) {
      error('Mật khẩu không hợp lệ', 'Mật khẩu root mới phải có tối thiểu 8 ký tự.');
      return;
    }
    changeServicePassword(server.id, newRootPass);
    setPasswordModalOpen(false);
    setNewRootPass('');
    success('Đổi mật khẩu thành công!', 'Mật khẩu quản trị máy chủ đã được cập nhật.');
  };

  const handleCreateSnapshotSubmit = (e) => {
    e.preventDefault();
    createSnapshot(server.id, snapshotName);
    setSnapshotModalOpen(false);
    setSnapshotName('');
    success('Tạo Snapshot thành công!', 'Bản chụp nhanh máy chủ đã được lưu vào hệ thống sao lưu.');
  };

  const handleUpgradeSubmit = (e) => {
    e.preventDefault();
    upgradeServicePlan(server.id, upgradeCpu, upgradeRam, upgradeStorage);
    setUpgradeModalOpen(false);
    success('Nâng cấp thành công!', 'Cấu hình phần cứng máy chủ đã được áp dụng.');
  };

  const handleRenewSubmit = (e) => {
    e.preventDefault();
    renewService(server.id, renewMonths);
    setRenewModalOpen(false);
    success('Gia hạn thành công!', `Dịch vụ ${server.name} đã được gia hạn thêm ${renewMonths} tháng.`);
  };

  return (
    <div>
      <Breadcrumb
        items={[
          { label: 'Bảng điều khiển', path: '/dashboard' },
          { label: 'Dịch vụ của tôi', path: '/dashboard/services' },
          { label: server.name, path: `/dashboard/services/${server.id}` }
        ]}
        onNavigate={onNavigate}
      />

      {/* 1. Server Status Banner & Primary Controls */}
      <div className="server-status-banner">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.375rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {server.name}
            </h1>
            <span className={`badge ${isRunning ? 'badge-success' : isRebuilding || isRestarting ? 'badge-warning' : 'badge-neutral'}`}>
              {server.status.toUpperCase()}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.8125rem', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
            <span>IPv4: <b style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{server.ip}</b></span>
            <span>IPv6: <code style={{ color: 'var(--text-muted)' }}>{server.ipv6}</code></span>
            <span>HĐH: <b>{server.osName}</b></span>
            <span>Vị trí: <b>{server.datacenterName}</b></span>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="server-actions-bar">
          {isRunning ? (
            <>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => handlePowerAction('restart')}
                disabled={isRestarting || isRebuilding}
              >
                <RotateCcw size={15} />
                <span>Khởi động lại</span>
              </button>
              <button
                className="btn btn-danger-outline btn-sm"
                onClick={() => handlePowerAction('stop')}
                disabled={isRestarting || isRebuilding}
              >
                <Square size={15} />
                <span>Tắt máy</span>
              </button>
            </>
          ) : (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => handlePowerAction('start')}
            >
              <Play size={15} />
              <span>Bật máy chủ</span>
            </button>
          )}

          <button
            className="btn btn-primary btn-sm"
            onClick={() => setTerminalOpen(true)}
          >
            <Terminal size={15} />
            <span>Web Console</span>
          </button>
        </div>
      </div>

      {/* 2. Management Quick Action Panels Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <button
          className="card card-hoverable"
          style={{ padding: '1.25rem', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
          onClick={() => setReinstallModalOpen(true)}
        >
          <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-surface)', color: 'var(--primary-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <RefreshCw size={18} />
          </div>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>Cài Lại HĐH</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Format & Đổi OS</div>
          </div>
        </button>

        <button
          className="card card-hoverable"
          style={{ padding: '1.25rem', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
          onClick={() => setPasswordModalOpen(true)}
        >
          <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-surface)', color: 'var(--primary-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Key size={18} />
          </div>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>Đổi Mật Khẩu Root</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cập nhật SSH Root</div>
          </div>
        </button>

        <button
          className="card card-hoverable"
          style={{ padding: '1.25rem', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
          onClick={() => setSnapshotModalOpen(true)}
        >
          <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-surface)', color: 'var(--primary-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Camera size={18} />
          </div>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>Snapshot & Sao Lưu</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{server.snapshots?.length || 0} Bản lưu</div>
          </div>
        </button>

        <button
          className="card card-hoverable"
          style={{ padding: '1.25rem', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
          onClick={() => setUpgradeModalOpen(true)}
        >
          <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-surface)', color: 'var(--primary-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowUpCircle size={18} />
          </div>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>Nâng Cấp Gói</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tăng CPU, RAM, Disk</div>
          </div>
        </button>

        <button
          className="card card-hoverable"
          style={{ padding: '1.25rem', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
          onClick={() => setRenewModalOpen(true)}
        >
          <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-surface)', color: 'var(--primary-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calendar size={18} />
          </div>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>Gia Hạn Dịch Vụ</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Hết hạn: {formatDate(server.renewDate, false)}</div>
          </div>
        </button>
      </div>

      {/* 3. Live Monitoring Telemetry Bars */}
      <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-card)', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={18} color="var(--primary)" />
            <span>Giám Sát Tài Nguyên Thời Gian Thực</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tự động làm mới mỗi 4s</span>
        </div>

        <ServerMetricsChart server={server} />
      </div>

      {/* 4. Credentials & Access Details */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-card)' }}>
          <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
            Thông Tin Đăng Nhập Quản Trị
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px dashed var(--border-color)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Giao thức kết nối:</span>
              <span style={{ fontWeight: 600 }}>SSH (Port 22) / Web Console</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px dashed var(--border-color)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Tài khoản mặc định:</span>
              <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{server.rootUser}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px dashed var(--border-color)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Mật khẩu root:</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                  {showPassword ? server.rootPass : '••••••••••••'}
                </span>
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ color: 'var(--text-muted)' }}>
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
                <button type="button" onClick={() => copyToClipboard(server.rootPass, 'rootpass')} style={{ color: 'var(--text-muted)' }}>
                  {copiedField === 'rootpass' ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0' }}>
              <span style={{ color: 'var(--text-muted)' }}>Lệnh SSH nhanh:</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <code style={{ fontSize: '0.75rem', background: 'var(--bg-secondary)', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>
                  ssh root@{server.ip}
                </code>
                <button type="button" onClick={() => copyToClipboard(`ssh root@${server.ip}`, 'sshcmd')} style={{ color: 'var(--text-muted)' }}>
                  {copiedField === 'sshcmd' ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Snapshots Table */}
        <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-card)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Bản Chụp Snapshot ({server.snapshots?.length || 0})
            </div>
            <button className="btn btn-outline btn-sm" onClick={() => setSnapshotModalOpen(true)}>
              + Tạo bản chụp
            </button>
          </div>

          {!server.snapshots || server.snapshots.length === 0 ? (
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1.5rem 0' }}>
              Chưa có bản snapshot nào. Hãy tạo snapshot trước khi nâng cấp phần mềm.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {server.snapshots.map(snap => (
                <div
                  key={snap.id}
                  style={{
                    padding: '0.625rem 0.75rem',
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.8125rem'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{snap.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{snap.date} • {snap.size}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.375rem' }}>
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ color: 'var(--danger)', padding: '0.25rem 0.5rem' }}
                      onClick={() => {
                        deleteSnapshot(server.id, snap.id);
                        success('Đã xóa', `Đã xóa snapshot ${snap.name}`);
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* WEB TERMINAL MODAL */}
      <WebTerminalModal
        isOpen={terminalOpen}
        onClose={() => setTerminalOpen(false)}
        server={server}
      />

      {/* CONFIRMATION MODAL */}
      <ConfirmModal
        isOpen={!!confirmModal}
        onClose={() => setConfirmModal(null)}
        onConfirm={handleConfirmModalAction}
        title={confirmModal?.title}
        message={confirmModal?.message}
        type={confirmModal?.type === 'stop' ? 'danger' : 'warning'}
      />

      {/* REINSTALL OS MODAL */}
      <Modal
        isOpen={reinstallModalOpen}
        onClose={() => setReinstallModalOpen(false)}
        title="Cài Lại Hệ Điều Hành (Reinstall OS)"
      >
        <form onSubmit={handleReinstallSubmit}>
          <div style={{ padding: '0.75rem', backgroundColor: 'var(--danger-surface)', border: '1px solid var(--danger-border)', borderRadius: 'var(--radius-md)', color: 'var(--danger-text)', fontSize: '0.8125rem', marginBottom: '1.25rem' }}>
            ⚠️ <b>CẢNH BÁO</b>: Thao tác này sẽ định dạng (Format) toàn bộ ổ đĩa chính và cài mới hệ điều hành. Hãy chắc chắn bạn đã sao lưu dữ liệu quan trọng.
          </div>

          <div className="form-group">
            <label className="form-label">Chọn Hệ điều hành mới:</label>
            <select
              className="form-select"
              value={reinstallOsId}
              onChange={e => setReinstallOsId(e.target.value)}
            >
              {OS_OPTIONS.map(os => (
                <option key={os.id} value={os.id}>
                  {os.name} ({os.free ? 'Miễn phí' : `+${formatVND(os.pricePerMonth)}/th`})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Mật khẩu root mới (Tối thiểu 8 ký tự):</label>
            <input
              type="password"
              required
              className="form-input"
              value={reinstallRootPass}
              onChange={e => setReinstallRootPass(e.target.value)}
              placeholder="Nhập mật khẩu root bảo mật..."
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => setReinstallModalOpen(false)}>
              Hủy bỏ
            </button>
            <button type="submit" className="btn btn-danger btn-sm">
              Xác nhận Cài lại HĐH
            </button>
          </div>
        </form>
      </Modal>

      {/* CHANGE ROOT PASSWORD MODAL */}
      <Modal
        isOpen={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
        title="Đổi Mật Khẩu Root / Administrator"
      >
        <form onSubmit={handleChangePasswordSubmit}>
          <div className="form-group">
            <label className="form-label">Mật khẩu root mới:</label>
            <input
              type="password"
              required
              className="form-input"
              value={newRootPass}
              onChange={e => setNewRootPass(e.target.value)}
              placeholder="Tối thiểu 8 ký tự..."
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => setPasswordModalOpen(false)}>
              Hủy bỏ
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              Cập nhật mật khẩu
            </button>
          </div>
        </form>
      </Modal>

      {/* CREATE SNAPSHOT MODAL */}
      <Modal
        isOpen={snapshotModalOpen}
        onClose={() => setSnapshotModalOpen(false)}
        title="Tạo Bản Chụp Snapshot Mới"
      >
        <form onSubmit={handleCreateSnapshotSubmit}>
          <div className="form-group">
            <label className="form-label">Tên bản chụp (Gợi nhớ):</label>
            <input
              type="text"
              required
              className="form-input"
              value={snapshotName}
              onChange={e => setSnapshotName(e.target.value)}
              placeholder="Ví dụ: Pre-Deploy-v2.0"
            />
            <span className="form-hint">Quá trình chụp diễn ra ngầm trong 5-10 giây và không làm gián đoạn máy chủ.</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => setSnapshotModalOpen(false)}>
              Hủy bỏ
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              Tạo Snapshot
            </button>
          </div>
        </form>
      </Modal>

      {/* UPGRADE PLAN MODAL */}
      <Modal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        title="Nâng Cấp Cấu Hình Máy Chủ"
      >
        <form onSubmit={handleUpgradeSubmit}>
          <div className="form-group">
            <label className="form-label">Số lượng vCPU Cores:</label>
            <select className="form-select" value={upgradeCpu} onChange={e => setUpgradeCpu(Number(e.target.value))}>
              {[2, 4, 8, 12, 16, 24, 32].map(c => (
                <option key={c} value={c}>{c} vCPU Cores</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Dung lượng RAM ECC:</label>
            <select className="form-select" value={upgradeRam} onChange={e => setUpgradeRam(Number(e.target.value))}>
              {[4, 8, 16, 24, 32, 64, 128].map(r => (
                <option key={r} value={r}>{r} GB DDR4 ECC</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Dung lượng ổ cứng NVMe Gen4:</label>
            <select className="form-select" value={upgradeStorage} onChange={e => setUpgradeStorage(Number(e.target.value))}>
              {[40, 80, 160, 320, 500, 1000].map(s => (
                <option key={s} value={s}>{s} GB NVMe (RAID 10)</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => setUpgradeModalOpen(false)}>
              Hủy bỏ
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              Xác nhận Nâng cấp
            </button>
          </div>
        </form>
      </Modal>

      {/* RENEW SUBSCRIPTION MODAL */}
      <Modal
        isOpen={renewModalOpen}
        onClose={() => setRenewModalOpen(false)}
        title="Gia Hạn Dịch Vụ Máy Chủ"
      >
        <form onSubmit={handleRenewSubmit}>
          <div className="form-group">
            <label className="form-label">Chọn chu kỳ gia hạn:</label>
            <select className="form-select" value={renewMonths} onChange={e => setRenewMonths(Number(e.target.value))}>
              <option value={1}>1 Tháng ({formatVND(server.priceMonthly)})</option>
              <option value={3}>3 Tháng (Giảm 5% - {formatVND(Math.round(server.priceMonthly * 3 * 0.95))})</option>
              <option value={6}>6 Tháng (Giảm 10% - {formatVND(Math.round(server.priceMonthly * 6 * 0.90))})</option>
              <option value={12}>12 Tháng (Giảm 20% - {formatVND(Math.round(server.priceMonthly * 12 * 0.80))})</option>
            </select>
          </div>

          <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Số tiền gia hạn sẽ được trừ trực tiếp vào số dư ví của bạn.
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => setRenewModalOpen(false)}>
              Hủy bỏ
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              Xác nhận Gia hạn
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
