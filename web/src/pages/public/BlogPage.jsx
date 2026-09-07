import React, { useState } from 'react';
import { Calendar, User, Clock, ArrowRight, BookOpen, Tag } from 'lucide-react';
import { BLOG_POSTS } from '../../data/blogData';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { formatDate } from '../../utils/formatters';

export function BlogPage({ onNavigate }) {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = ['all', 'Hạ tầng', 'Kiến thức', 'Bảo mật'];

  const filteredPosts = activeCategory === 'all'
    ? BLOG_POSTS
    : BLOG_POSTS.filter(b => b.category === activeCategory);

  return (
    <div className="section-sm">
      <div className="container">
        <Breadcrumb
          items={[{ label: 'Tin tức & Kiến thức', path: '/blog' }]}
          onNavigate={onNavigate}
        />

        <div style={{ maxWidth: '720px', marginBottom: '2.5rem' }}>
          <div className="section-tag">
            <BookOpen size={14} />
            <span>Nexus Cloud Insights</span>
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            Kiến Thức Hạ Tầng & Bản Tin Công Nghệ
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
            Chia sẻ kinh nghiệm tối ưu hóa máy chủ Linux, kiến trúc đám mây và thông báo nâng cấp hệ thống.
          </p>

          {/* Category tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
            {categories.map(cat => (
              <button
                key={cat}
                className={`segment-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat === 'all' ? 'Tất cả bài viết' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-3" style={{ gap: '1.75rem' }}>
          {filteredPosts.map(post => (
            <div
              key={post.id}
              className="card card-hoverable"
              style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-card)' }}
              onClick={() => onNavigate(`/blog/${post.slug}`)}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span className="badge badge-primary">{post.category}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{post.readTime}</span>
              </div>

              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem', lineHeight: 1.4 }}>
                {post.title}
              </h2>

              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem', flex: '1 1 auto' }}>
                {post.summary}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <Calendar size={13} />
                  <span>{formatDate(post.date, false)}</span>
                </div>
                <span style={{ color: 'var(--primary-text)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  Đọc tiếp <ArrowRight size={13} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function BlogPostPage({ slug, onNavigate }) {
  const post = BLOG_POSTS.find(p => p.slug === slug) || BLOG_POSTS[0];

  return (
    <div className="section-sm">
      <div className="container" style={{ maxWidth: '840px' }}>
        <Breadcrumb
          items={[
            { label: 'Tin tức & Kiến thức', path: '/blog' },
            { label: post.title, path: `/blog/${post.slug}` }
          ]}
          onNavigate={onNavigate}
        />

        <article className="card" style={{ padding: '2.5rem', backgroundColor: 'var(--bg-card)' }}>
          <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
            <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>{post.category}</span>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem', lineHeight: 1.25 }}>
              {post.title}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.8125rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <User size={14} />
                <span>{post.author}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <Calendar size={14} />
                <span>{formatDate(post.date, false)}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <Clock size={14} />
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>

          <div style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.8 }} className="blog-body">
            {post.content.split('\n\n').map((para, idx) => {
              if (para.startsWith('### ')) {
                return (
                  <h3 key={idx} style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '1.75rem', marginBottom: '0.75rem' }}>
                    {para.replace('### ', '')}
                  </h3>
                );
              }
              return (
                <p key={idx} style={{ marginBottom: '1.25rem' }}>
                  {para}
                </p>
              );
            })}
          </div>

          <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => onNavigate('/blog')}
            >
              ← Quay lại danh sách tin tức
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => onNavigate('/cloud-server')}
            >
              Trải nghiệm Cloud Server ngay
            </button>
          </div>
        </article>
      </div>
    </div>
  );
}
