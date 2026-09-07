import React, { useState } from 'react';
import {
  Rocket,
  Cloud,
  Code2,
  Search,
  Copy,
  Check,
  BookOpen,
  ChevronRight,
  ShieldCheck,
  Terminal
} from 'lucide-react';
import { DOCS_SECTIONS } from '../../data/docsData';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { useToast } from '../../context/ToastContext';

export function DocsPage({ onNavigate }) {
  const { success } = useToast();
  const [selectedSectionId, setSelectedSectionId] = useState(DOCS_SECTIONS[0].id);
  const [selectedArticleId, setSelectedArticleId] = useState(DOCS_SECTIONS[0].articles[0].id);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [docSearch, setDocSearch] = useState('');

  const currentSection = DOCS_SECTIONS.find(s => s.id === selectedSectionId) || DOCS_SECTIONS[0];
  const currentArticle = currentSection.articles.find(a => a.id === selectedArticleId) || currentSection.articles[0];

  const handleCopy = (codeText, idx) => {
    navigator.clipboard.writeText(codeText);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
    success('Đã sao chép!', 'Đoạn mã đã được lưu vào bộ nhớ tạm.');
  };

  const getIconComponent = (iconName) => {
    switch (iconName) {
      case 'Rocket': return Rocket;
      case 'Cloud': return Cloud;
      case 'Code2': return Code2;
      default: return BookOpen;
    }
  };

  return (
    <div className="section-sm">
      <div className="container">
        <Breadcrumb
          items={[
            { label: 'Tài liệu kỹ thuật', path: '/docs' },
            { label: currentSection.title, path: '/docs' },
            { label: currentArticle.title, path: `/docs#${currentArticle.id}` }
          ]}
          onNavigate={onNavigate}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2.5rem', alignItems: 'flex-start' }} className="docs-layout">
          {/* Docs Sidebar */}
          <div className="card" style={{ padding: '1.25rem', backgroundColor: 'var(--bg-card)', position: 'sticky', top: '90px' }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <div className="input-with-icon">
                <Search size={16} className="input-icon-left" />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Tìm tài liệu..."
                  value={docSearch}
                  onChange={e => setDocSearch(e.target.value)}
                  style={{ fontSize: '0.8125rem', padding: '0.5rem 0.5rem 0.5rem 2.25rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {DOCS_SECTIONS.map(section => {
                const Icon = getIconComponent(section.icon);
                return (
                  <div key={section.id}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                      <Icon size={15} color="var(--primary)" />
                      <span>{section.title}</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      {section.articles.map(article => {
                        const isActive = selectedArticleId === article.id;
                        return (
                          <button
                            key={article.id}
                            className={`sidebar-link ${isActive ? 'active' : ''}`}
                            onClick={() => {
                              setSelectedSectionId(section.id);
                              setSelectedArticleId(article.id);
                            }}
                            style={{ width: '100%', textAlign: 'left', fontSize: '0.8125rem', padding: '0.5rem 0.75rem' }}
                          >
                            <span>{article.title}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Docs Article Content Reader */}
          <div className="card" style={{ padding: '2.5rem', backgroundColor: 'var(--bg-card)' }}>
            <div style={{ paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.75rem' }}>
              <div style={{ fontSize: '0.8125rem', color: 'var(--primary-text)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.375rem' }}>
                {currentSection.title}
              </div>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                {currentArticle.title}
              </h1>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
                {currentArticle.summary}
              </p>
            </div>

            {/* Markdown rendered body */}
            <div style={{ color: 'var(--text-primary)', lineHeight: 1.7, fontSize: '0.95rem' }} className="docs-content-body">
              {currentArticle.content.split('\n\n').map((paragraph, pIdx) => {
                if (paragraph.startsWith('### ')) {
                  return (
                    <h3 key={pIdx} style={{ fontSize: '1.35rem', fontWeight: 700, marginTop: '1.75rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                      {paragraph.replace('### ', '')}
                    </h3>
                  );
                }
                if (paragraph.startsWith('#### ')) {
                  return (
                    <h4 key={pIdx} style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                      {paragraph.replace('#### ', '')}
                    </h4>
                  );
                }
                if (paragraph.startsWith('```')) {
                  const lines = paragraph.split('\n');
                  const lang = lines[0].replace('```', '') || 'bash';
                  const codeText = lines.slice(1, -1).join('\n');

                  return (
                    <div
                      key={pIdx}
                      style={{
                        margin: '1.25rem 0',
                        backgroundColor: '#0F172A',
                        border: '1px solid #1E293B',
                        borderRadius: 'var(--radius-md)',
                        overflow: 'hidden'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 1rem', backgroundColor: '#1E293B', color: '#94A3B8', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                        <span>{lang.toUpperCase()}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(codeText, pIdx)}
                          style={{ color: '#E2E8F0', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem' }}
                        >
                          {copiedIndex === pIdx ? <Check size={14} color="#84CC16" /> : <Copy size={14} />}
                          <span>{copiedIndex === pIdx ? 'Đã chép' : 'Sao chép'}</span>
                        </button>
                      </div>
                      <pre style={{ padding: '1rem', overflowX: 'auto', color: '#F8FAFC', fontSize: '0.875rem', fontFamily: 'var(--font-mono)', margin: 0 }}>
                        <code>{codeText}</code>
                      </pre>
                    </div>
                  );
                }

                return (
                  <p key={pIdx} style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
