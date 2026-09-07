import React from 'react';
import { ArrowRight, CheckCircle2, PhoneCall } from 'lucide-react';

export function BottomCtaSection({ onNavigate }) {
  return (
    <section className="section-sm" style={{ borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)' }}>
      <div className="container">
        <div
          className="card"
          style={{
            padding: '3rem 2.5rem',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <div className="section-tag" style={{ marginBottom: '1rem' }}>
            <span>Bắt đầu ngay hôm nay</span>
          </div>

          <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', maxWidth: '640px' }}>
            Sẵn sàng nâng cấp hạ tầng đám mây cho doanh nghiệp của bạn?
          </h2>

          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '560px', marginBottom: '2rem', lineHeight: 1.6 }}>
            Khởi tạo máy chủ Cloud Server chỉ với 1 cú nhấp chuột hoặc liên hệ đội ngũ chuyên gia hạ tầng để nhận tư vấn kiến trúc chuyên sâu miễn phí.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => onNavigate('/cloud-server')}
            >
              <span>Khởi tạo Cloud Server ngay</span>
              <ArrowRight size={18} />
            </button>
            <button
              className="btn btn-outline btn-lg"
              onClick={() => onNavigate('/contact')}
            >
              <PhoneCall size={18} />
              <span>Tư vấn Doanh nghiệp</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
