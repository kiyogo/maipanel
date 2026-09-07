import React, { useState, useMemo } from 'react';
import {
  Layers,
  Cloud,
  Server,
  Gamepad2,
  Globe,
  Database,
  Search,
  ShieldCheck,
  Cpu,
  ArrowRight,
  Filter,
  Check
} from 'lucide-react';
import { PRODUCTS, PRODUCT_CATEGORIES } from '../../data/products';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { EmptyState } from '../../components/common/EmptyState';
import { formatVND } from '../../utils/formatters';

export function ServicesPage({ queryParams = {}, onNavigate }) {
  const initialCategory = queryParams.category || 'all';
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular'); // 'popular' | 'price-asc' | 'price-desc' | 'name-asc'

  const categories = [
    { id: 'all', name: 'Tất cả dịch vụ', icon: Layers },
    { id: 'cloud-server', name: 'Cloud Server', icon: Cloud },
    { id: 'vps', name: 'VPS NVMe', icon: Server },
    { id: 'game-server', name: 'Game Server', icon: Gamepad2 },
    { id: 'hosting', name: 'Web Hosting', icon: Globe },
    { id: 'storage', name: 'Object Storage', icon: Database },
    { id: 'domain', name: 'Tên miền', icon: Search },
    { id: 'backup', name: 'Cloud Backup', icon: ShieldCheck }
  ];

  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    // Filter by Category
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          (p.specs && Object.values(p.specs).some(val => String(val).toLowerCase().includes(q)))
      );
    }

    // Sort
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.basePriceMonthly - b.basePriceMonthly);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.basePriceMonthly - a.basePriceMonthly);
    } else if (sortBy === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // Default popular first
      result.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
    }

    return result;
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <div className="section-sm">
      <div className="container">
        <Breadcrumb
          items={[{ label: 'Danh mục dịch vụ', path: '/services' }]}
          onNavigate={onNavigate}
        />

        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            Danh Mục Dịch Vụ Hạ Tầng Đám Mây
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Khám phá và tùy chỉnh cấu hình máy chủ, lưu trữ và giải pháp hạ tầng số theo nhu cầu của bạn.
          </p>
        </div>

        {/* Layout: Sidebar Filter + Product Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem', alignItems: 'flex-start' }} className="services-layout">
          {/* Category Sidebar */}
          <div className="card" style={{ padding: '1rem', backgroundColor: 'var(--bg-card)', position: 'sticky', top: '90px' }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', padding: '0.5rem 0.75rem', marginBottom: '0.25rem' }}>
              Nhóm Dịch Vụ
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {categories.map(cat => {
                const Icon = cat.icon;
                const isActive = selectedCategory === cat.id;
                const count = cat.id === 'all' ? PRODUCTS.length : PRODUCTS.filter(p => p.category === cat.id).length;

                return (
                  <button
                    key={cat.id}
                    className={`sidebar-link ${isActive ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat.id)}
                    style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                      <Icon size={16} />
                      <span>{cat.name}</span>
                    </div>
                    <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content: Search/Sort Bar + Grid */}
          <div>
            {/* Top Toolbar */}
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
              {/* Search input */}
              <div className="input-with-icon" style={{ flex: '1 1 280px' }}>
                <Search size={16} className="input-icon-left" />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Tìm theo tên dịch vụ, CPU, RAM..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Sort dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Sắp xếp:</span>
                <select
                  className="form-select"
                  style={{ width: 'auto', padding: '0.5rem 0.75rem', fontSize: '0.875rem' }}
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                >
                  <option value="popular">Nổi bật nhất</option>
                  <option value="price-asc">Giá: Thấp đến Cao</option>
                  <option value="price-desc">Giá: Cao đến Thấp</option>
                  <option value="name-asc">Tên gói A-Z</option>
                </select>
              </div>
            </div>

            {/* Product Cards Grid */}
            {filteredProducts.length === 0 ? (
              <EmptyState
                title="Không tìm thấy dịch vụ phù hợp"
                description="Hãy thử thay đổi từ khóa tìm kiếm hoặc chọn danh mục khác."
                actionText="Xem tất cả dịch vụ"
                onAction={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              />
            ) : (
              <div className="grid grid-cols-2" style={{ gap: '1.25rem' }}>
                {filteredProducts.map(prod => (
                  <div
                    key={prod.id}
                    className="card"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      backgroundColor: 'var(--bg-card)',
                      border: prod.popular ? '1px solid var(--primary-border)' : '1px solid var(--border-color)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            {prod.name}
                          </h3>
                          {prod.badge && (
                            <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                              {prod.badge}
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                          {prod.tagline}
                        </p>
                      </div>
                    </div>

                    {/* Specs Checklist */}
                    <div
                      style={{
                        padding: '0.875rem',
                        backgroundColor: 'var(--bg-secondary)',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '1.25rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.4rem',
                        fontSize: '0.8125rem'
                      }}
                    >
                      {prod.specs.cpu && (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Vi xử lý:</span>
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{prod.specs.cpu}</span>
                        </div>
                      )}
                      {prod.specs.ram && (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Bộ nhớ RAM:</span>
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{prod.specs.ram}</span>
                        </div>
                      )}
                      {prod.specs.storage && (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Ổ cứng:</span>
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{prod.specs.storage}</span>
                        </div>
                      )}
                      {prod.specs.networkSpeed && (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Băng thông:</span>
                          <span style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>{prod.specs.networkSpeed}</span>
                        </div>
                      )}
                      {prod.specs.domains && (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Tên miền:</span>
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{prod.specs.domains}</span>
                        </div>
                      )}
                      {prod.specs.type && (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Loại tên miền:</span>
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{prod.specs.type}</span>
                        </div>
                      )}
                    </div>

                    {/* Bottom Price & Action */}
                    <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                      <div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                          {formatVND(prod.basePriceMonthly)}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          / {prod.billingPeriod || 'tháng'} (Chưa VAT)
                        </div>
                      </div>

                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => onNavigate(`/product/${prod.id}`)}
                      >
                        <span>Cấu hình & Mua</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
