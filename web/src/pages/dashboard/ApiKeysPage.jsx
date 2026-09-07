import React, { useState } from 'react';
import {
  Key,
  Plus,
  Trash2,
  Copy,
  Check,
  AlertTriangle,
  Code2,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';
import { useCloudData } from '../../context/CloudDataContext';
import { useToast } from '../../context/ToastContext';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { Modal } from '../../components/common/Modal';
import { formatDate } from '../../utils/formatters';

export function ApiKeysPage({ onNavigate }) {
  const { apiKeys, createApiKey, revokeApiKey } = useCloudData();
  const { success } = useToast();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createdKeyData, setCreatedKeyData] = useState(null); // When key is just generated
  const [keyName, setKeyName] = useState('');
  const [copiedToken, setCopiedToken] = useState(false);

  const [perms, setPerms] = useState({
    'servers:read': true,
    'servers:control': true,
    'billing:read': false,
    'snapshots:create': true
  });

  const handleCreateKey = (e) => {
    e.preventDefault();
    if (!keyName.trim()) return;

    const selectedPerms = Object.keys(perms).filter(k => perms[k]);
    const newKey = createApiKey(keyName, selectedPerms);
    setCreateModalOpen(false);
    setKeyName('');
    setCreatedKeyData(newKey);
    success('Tạo API Key thành công!', 'Vui lòng sao chép mã khóa bảo mật bí mật.');
  };

  const handleCopySecret = () => {
    if (createdKeyData?.fullToken) {
      navigator.clipboard.writeText(createdKeyData.fullToken);
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2500);
      success('Đã sao chép Secret Token!', createdKeyData.fullToken);
    }
  };

  return (
    <div>
      <Breadcrumb
        items={[
          { label: 'Bảng điều khiển', path: '/dashboard' },
          { label: 'Quản lý API Keys', path: '/dashboard/api' }
        ]}
        onNavigate={onNavigate}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Quản Lý API Keys & Tự Động Hóa
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Sử dụng RESTful API để tự động hóa khởi tạo, quản lý chu trình máy chủ và tích hợp hệ thống CI/CD.
          </p>
        </div>

        <button
          className="btn btn-primary btn-sm"
          onClick={() => setCreateModalOpen(true)}
        >
          <Plus size={16} />
          <span>Tạo API Key Mới</span>
        </button>
      </div>

      {/* API Keys Table */}
      <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-card)', marginBottom: '2rem' }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
          Danh Sách API Keys Đang Hoạt Động ({apiKeys.length})
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tên định danh</th>
                <th>Token Prefix</th>
                <th>Phân quyền</th>
                <th>Lần dùng cuối</th>
                <th>Ngày tạo</th>
                <th style={{ textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {apiKeys.map(k => (
                <tr key={k.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{k.name}</div>
                  </td>
                  <td>
                    <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>
                      {k.tokenPrefix}
                    </code>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                      {k.permissions.map(p => (
                        <span key={p} className="badge badge-neutral" style={{ fontSize: '0.6875rem' }}>
                          {p}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                      {k.lastUsed}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                      {formatDate(k.createdDate, false)}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ color: 'var(--danger)' }}
                      onClick={() => {
                        revokeApiKey(k.id);
                        success('Đã thu hồi', `API Key "${k.name}" đã bị vô hiệu hóa.`);
                      }}
                    >
                      <Trash2 size={15} />
                      <span>Thu hồi</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick API Documentation Box */}
      <div className="card" style={{ padding: '1.75rem', backgroundColor: 'var(--bg-card)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
          <Code2 size={18} color="var(--primary)" />
          <span>Hướng Dẫn Gọi API Nhanh (Quick Start)</span>
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Truyền API Key vào Header <code>Authorization: Bearer &lt;YOUR_SECRET_KEY&gt;</code>:
        </p>

        <div style={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: 'var(--radius-md)', padding: '1rem', color: '#F8FAFC', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', overflowX: 'auto' }}>
          curl -X GET "https://api.nexuscloud.vn/v1/servers" \<br />
          &nbsp;&nbsp;-H "Authorization: Bearer nxc_live_9a8f7b6c..." \<br />
          &nbsp;&nbsp;-H "Content-Type: application/json"
        </div>
      </div>

      {/* CREATE API KEY MODAL */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Tạo API Key Mới"
      >
        <form onSubmit={handleCreateKey}>
          <div className="form-group">
            <label className="form-label">Tên định danh API Key *</label>
            <input
              type="text"
              required
              className="form-input"
              value={keyName}
              onChange={e => setKeyName(e.target.value)}
              placeholder="Ví dụ: GitHub Actions Staging Deployer"
            />
          </div>

          <div style={{ marginTop: '1.25rem', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              Phân quyền truy cập (Permissions):
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label className="custom-checkbox">
                <input
                  type="checkbox"
                  checked={perms['servers:read']}
                  onChange={e => setPerms({ ...perms, 'servers:read': e.target.checked })}
                />
                <span><code>servers:read</code> - Đọc danh sách và trạng thái máy chủ</span>
              </label>
              <label className="custom-checkbox">
                <input
                  type="checkbox"
                  checked={perms['servers:control']}
                  onChange={e => setPerms({ ...perms, 'servers:control': e.target.checked })}
                />
                <span><code>servers:control</code> - Bật, tắt, restart và cấu hình máy chủ</span>
              </label>
              <label className="custom-checkbox">
                <input
                  type="checkbox"
                  checked={perms['snapshots:create']}
                  onChange={e => setPerms({ ...perms, 'snapshots:create': e.target.checked })}
                />
                <span><code>snapshots:create</code> - Tạo và quản lý bản snapshot sao lưu</span>
              </label>
              <label className="custom-checkbox">
                <input
                  type="checkbox"
                  checked={perms['billing:read']}
                  onChange={e => setPerms({ ...perms, 'billing:read': e.target.checked })}
                />
                <span><code>billing:read</code> - Xem số dư ví và thông tin thanh toán</span>
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => setCreateModalOpen(false)}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              Sinh Mã API Key
            </button>
          </div>
        </form>
      </Modal>

      {/* ONE-TIME SECRET TOKEN MODAL */}
      <Modal
        isOpen={!!createdKeyData}
        onClose={() => setCreatedKeyData(null)}
        title="Mã Khóa API Bí Mật (One-Time Secret Key)"
      >
        <div>
          <div style={{ padding: '0.75rem', backgroundColor: 'var(--warning-surface)', border: '1px solid var(--warning-border)', borderRadius: 'var(--radius-md)', color: 'var(--warning-text)', fontSize: '0.8125rem', marginBottom: '1.25rem' }}>
            ⚠️ <b>CHÚ Ý</b>: Đây là lần duy nhất mã khóa bí mật này được hiển thị đầy đủ. Hãy sao chép và lưu vào nơi an toàn (ví dụ: GitHub Secrets hoặc HashiCorp Vault).
          </div>

          <div className="secret-key-box">
            <span>{createdKeyData?.fullToken}</span>
            <button type="button" className="btn btn-sm btn-primary" onClick={handleCopySecret}>
              {copiedToken ? <Check size={14} /> : <Copy size={14} />}
              <span>{copiedToken ? 'Đã chép' : 'Sao chép'}</span>
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setCreatedKeyData(null)}
            >
              Tôi đã lưu mã khóa này an toàn
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
