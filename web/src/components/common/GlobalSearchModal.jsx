import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Server, Cloud, FileText, ArrowRight, ShieldCheck } from 'lucide-react';
import { PRODUCTS } from '../../data/products';
import { DOCS_SECTIONS } from '../../data/docsData';

export function GlobalSearchModal({ isOpen, onClose, onNavigate }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onNavigate(null, 'OPEN_SEARCH');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNavigate]);

  if (!isOpen) return null;

  const filteredProducts = query.trim()
    ? PRODUCTS.filter(
        p =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.tagline.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase())
      )
    : PRODUCTS.slice(0, 4);

  const matchedDocs = [];
  if (query.trim()) {
    DOCS_SECTIONS.forEach(sec => {
      sec.articles.forEach(art => {
        if (
          art.title.toLowerCase().includes(query.toLowerCase()) ||
          art.summary.toLowerCase().includes(query.toLowerCase())
        ) {
          matchedDocs.push({ ...art, sectionTitle: sec.title });
        }
      });
    });
  }

  const handleSelect = (path) => {
    onClose();
    onNavigate(path);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '640px', marginTop: '5vh' }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Search size={20} color="var(--text-muted)" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Tìm kiếm máy chủ, VPS, gói hosting, tài liệu hướng dẫn..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{
              flex: '1 1 auto',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '1rem',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-sans)'
            }}
          />
          <kbd style={{ fontSize: '0.75rem', padding: '0.2rem 0.4rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-muted)' }}>
            ESC
          </kbd>
          <button onClick={onClose} style={{ color: 'var(--text-muted)', padding: '4px' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ maxHeight: '420px', overflowY: 'auto', padding: '0.75rem' }}>
          {/* Products Group */}
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '0.5rem 0.75rem', letterSpacing: '0.05em' }}>
            Dịch vụ & Sản phẩm ({filteredProducts.length})
          </div>
          {filteredProducts.length === 0 ? (
            <div style={{ padding: '0.75rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Không tìm thấy sản phẩm phù hợp.
            </div>
          ) : (
            filteredProducts.map(prod => (
              <div
                key={prod.id}
                onClick={() => handleSelect(`/product/${prod.id}`)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.625rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  transition: 'background var(--transition-fast)'
                }}
                className="search-item-hover"
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-secondary)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: 'var(--primary-surface)', border: '1px solid var(--primary-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-text)' }}>
                    <Server size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {prod.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {prod.tagline}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--primary-text)' }}>
                    {new Intl.NumberFormat('vi-VN').format(prod.basePriceMonthly)}đ/th
                  </span>
                  <ArrowRight size={14} color="var(--text-muted)" />
                </div>
              </div>
            ))
          )}

          {/* Docs Section */}
          {matchedDocs.length > 0 && (
            <div style={{ marginTop: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '0.5rem 0.75rem', letterSpacing: '0.05em' }}>
                Tài liệu Hướng dẫn ({matchedDocs.length})
              </div>
              {matchedDocs.map(doc => (
                <div
                  key={doc.id}
                  onClick={() => handleSelect(`/docs`)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.625rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-secondary)')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <FileText size={16} color="var(--info)" />
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                        {doc.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {doc.sectionTitle}
                      </div>
                    </div>
                  </div>
                  <ArrowRight size={14} color="var(--text-muted)" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ padding: '0.75rem 1.25rem', borderTop: '1px solid var(--border-color)', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <span><kbd style={{ padding: '2px 4px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '3px' }}>↵</kbd> để chọn</span>
            <span><kbd style={{ padding: '2px 4px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '3px' }}>esc</kbd> để đóng</span>
          </div>
          <span>Nexus Cloud Search v2.0</span>
        </div>
      </div>
    </div>
  );
}
