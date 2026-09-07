import React, { useState } from 'react';
import { Server, ArrowRight, Check } from 'lucide-react';
import { PRODUCTS } from '../../data/products';
import { formatVND } from '../../utils/formatters';

export function PricingPreviewSection({ onNavigate }) {
  const [activeCategory, setActiveCategory] = useState('cloud-server');

  const categories = [
    { id: 'cloud-server', label: 'Cloud Server' },
    { id: 'vps', label: 'VPS NVMe' },
    { id: 'game-server', label: 'Game Server' },
    { id: 'hosting', label: 'Web Hosting' }
  ];

  const filteredProducts = PRODUCTS.filter(p => p.category === activeCategory);

  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">
            <span>Tổng Hợp Bảng Giá</span>
          </div>
          <h2 className="section-title">Bảng Giá Nhanh Theo Danh Mục</h2>
          <p className="section-subtitle">
            Lựa chọn dịch vụ phù hợp với ngân sách và quy mô dự án của bạn.
          </p>

          {/* Category Tabs */}
          <div style={{ marginTop: '2rem', display: 'inline-flex', gap: '0.5rem', padding: '0.25rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`segment-btn ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing Comparison Table */}
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Gói dịch vụ</th>
                <th>Thông số vi xử lý (CPU)</th>
                <th>Bộ nhớ RAM</th>
                <th>Ổ cứng lưu trữ</th>
                <th>Băng thông / Port</th>
                <th>Giá tháng</th>
                <th style={{ textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(p => (
                <tr key={p.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.tagline}</div>
                  </td>
                  <td><code style={{ fontSize: '0.8125rem' }}>{p.specs.cpu || p.specs.domains || '-'}</code></td>
                  <td><code style={{ fontSize: '0.8125rem' }}>{p.specs.ram || p.specs.mailboxes || '-'}</code></td>
                  <td><code style={{ fontSize: '0.8125rem' }}>{p.specs.storage || p.specs.capacity || '-'}</code></td>
                  <td><span style={{ fontSize: '0.8125rem' }}>{p.specs.networkSpeed || p.specs.bandwidth || '1 Gbps'}</span></td>
                  <td>
                    <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {formatVND(p.basePriceMonthly)}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/th</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => onNavigate(`/product/${p.id}`)}
                    >
                      <span>Chọn gói</span>
                      <ArrowRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button
            className="btn btn-outline"
            onClick={() => onNavigate('/pricing')}
          >
            <span>Xem bảng so sánh chi tiết tất cả các gói</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
