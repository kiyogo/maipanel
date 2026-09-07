import React from 'react';
import { AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { Modal } from './Modal';

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Xác nhận thao tác',
  message,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy bỏ',
  type = 'danger', // 'danger' | 'warning' | 'info'
  isLoading = false
}) {
  const isDanger = type === 'danger';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="md"
      footer={
        <>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`btn btn-sm ${isDanger ? 'btn-danger' : 'btn-primary'}`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Đang xử lý...' : confirmText}
          </button>
        </>
      }
    >
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: isDanger ? 'var(--danger-surface)' : 'var(--warning-surface)',
            color: isDanger ? 'var(--danger)' : 'var(--warning)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          {isDanger ? <AlertCircle size={22} /> : <AlertTriangle size={22} />}
        </div>
        <div style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          {message}
        </div>
      </div>
    </Modal>
  );
}
