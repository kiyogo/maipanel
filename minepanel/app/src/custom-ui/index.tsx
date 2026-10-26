import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import { createPortal } from 'react-dom';
import { createRoot } from 'react-dom/client';
import { Link } from 'react-router-dom';
import { EyeOutlined, EyeInvisibleOutlined, CloseCircleFilled, CheckCircleFilled, InfoCircleFilled, ExclamationCircleFilled } from '@ant-design/icons';
import './theme.css';

// Global trigger tracker for origin-based animations
if (typeof window !== 'undefined') {
  const handlePointer = (e: MouseEvent | TouchEvent) => {
    const clientX = 'touches' in e ? e.touches[0]?.clientX : (e as MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0]?.clientY : (e as MouseEvent).clientY;
    if (clientX !== undefined && clientY !== undefined) {
      (window as any).__lastClickPos = { x: clientX, y: clientY };
    }
    const target = e.target as HTMLElement | null;
    if (target) {
      const triggerEl = target.closest('button, a, [role="button"], .ant-btn, .win11-cmd-btn, .k-action-btn, tr, td, .ant-table-row, .ant-select, .ant-dropdown, .ant-menu-item');
      if (triggerEl) {
        (window as any).__lastTriggerRect = triggerEl.getBoundingClientRect();
      } else {
        (window as any).__lastTriggerRect = target.getBoundingClientRect();
      }
    }
  };

  window.addEventListener('mousedown', handlePointer as any, true);
  window.addEventListener('touchstart', handlePointer as any, true);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const active = document.activeElement as HTMLElement | null;
      if (active) {
        (window as any).__lastTriggerRect = active.getBoundingClientRect();
        (window as any).__lastClickPos = {
          x: (window as any).__lastTriggerRect.left + (window as any).__lastTriggerRect.width / 2,
          y: (window as any).__lastTriggerRect.top + (window as any).__lastTriggerRect.height / 2,
        };
      }
    }
  }, true);
}

export function useOverlayAnimation(open: boolean, durationMs = 200) {
  const [shouldRender, setShouldRender] = useState(open);
  const [animClass, setAnimClass] = useState<'enter' | 'exit'>(open ? 'enter' : 'exit');
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const lockedOriginRef = useRef<string | null>(null);
  const exitTimerRef = useRef<any>(null);

  const closeImmediately = useCallback(() => {
    if (exitTimerRef.current) {
      clearTimeout(exitTimerRef.current);
      exitTimerRef.current = null;
    }
    setShouldRender(false);
    setAnimClass('exit');
    lockedOriginRef.current = null;
  }, []);

  useEffect(() => {
    if (open) {
      if (exitTimerRef.current) {
        clearTimeout(exitTimerRef.current);
        exitTimerRef.current = null;
      }
      setShouldRender(true);
      setAnimClass('enter');
    } else if (shouldRender) {
      setAnimClass('exit');
      exitTimerRef.current = setTimeout(() => {
        setShouldRender(false);
        lockedOriginRef.current = null;
      }, durationMs + 40); // Safety buffer to ensure CSS animation completes 100% before unmounting
      return () => {
        if (exitTimerRef.current) {
          clearTimeout(exitTimerRef.current);
          exitTimerRef.current = null;
        }
      };
    }
  }, [open, durationMs]);

  // Synchronously compute and lock transform-origin relative to overlay element bounding box
  React.useLayoutEffect(() => {
    if (shouldRender && overlayRef.current) {
      if (open || !lockedOriginRef.current) {
        let triggerX = window.innerWidth / 2;
        let triggerY = window.innerHeight / 2;

        const lastRect = (window as any).__lastTriggerRect;
        const lastPos = (window as any).__lastClickPos;

        if (lastRect) {
          triggerX = lastRect.left + lastRect.width / 2;
          triggerY = lastRect.top + lastRect.height / 2;
        } else if (lastPos) {
          triggerX = lastPos.x;
          triggerY = lastPos.y;
        }

        const rect = overlayRef.current.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          const originX = triggerX - rect.left;
          const originY = triggerY - rect.top;
          lockedOriginRef.current = `${originX}px ${originY}px`;
        }
      }

      if (lockedOriginRef.current) {
        overlayRef.current.style.transformOrigin = lockedOriginRef.current;
      }
    }
  }, [shouldRender, open]);

  return { shouldRender, animClass, overlayRef, closeImmediately };
}

// ==========================================
// 1. ConfigProvider
// ==========================================
export const ConfigContext = createContext<{ locale?: any; renderEmpty?: () => React.ReactNode }>({});
export const ConfigProvider: React.FC<{ locale?: any; renderEmpty?: () => React.ReactNode; children: React.ReactNode }> = ({ locale, renderEmpty, children }) => {
  return (
    <ConfigContext.Provider value={{ locale, renderEmpty }}>
      {children}
    </ConfigContext.Provider>
  );
};

// ==========================================
// 2. Empty
// ==========================================
export const Empty: React.FC<{ image?: React.ReactNode; description?: React.ReactNode }> & { PRESENTED_IMAGE_SIMPLE: React.ReactNode } = ({ image, description }) => {
  return (
    <div className="ant-empty" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 0', color: 'var(--antd-text-secondary)' }}>
      <div className="ant-empty-image" style={{ marginBottom: 8, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {image || (
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#b0bec5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            <path d="M2 10h20" strokeDasharray="3 3" />
          </svg>
        )}
      </div>
      <div className="ant-empty-description" style={{ fontSize: 14 }}>{description || 'No Data'}</div>
    </div>
  );
};
Empty.PRESENTED_IMAGE_SIMPLE = (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cfd8dc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.8 }}>
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    <path d="M2 10h20" strokeDasharray="3 3" />
  </svg>
);

// ==========================================
// 3. Layout (Layout, Header, Sider, Content)
// ==========================================
interface LayoutProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export const Layout: React.FC<LayoutProps> & {
  Header: React.FC<LayoutProps>;
  Sider: React.FC<any>;
  Content: React.FC<LayoutProps>;
} = ({ children, style, className }) => {
  const hasSider = React.Children.toArray(children).some(
    (child) => React.isValidElement(child) && (child.type as any).name === 'Sider'
  );
  return (
    <div
      className={`ant-layout ${hasSider ? 'ant-layout-has-sider' : ''} ${className || ''}`}
      style={style}
    >
      {children}
    </div>
  );
};

Layout.Header = ({ children, style, className }) => {
  return (
    <header className={`ant-layout-header ${className || ''}`} style={{ padding: '0 24px', display: 'flex', alignItems: 'center', height: 56, ...style }}>
      {children}
    </header>
  );
};

Layout.Content = ({ children, style, className }) => {
  return (
    <main className={`ant-layout-content ${className || ''}`} style={style}>
      {children}
    </main>
  );
};

Layout.Sider = ({ children, style, className, collapsible, collapsed, onCollapse, trigger, width = 200 }) => {
  const siderWidth = collapsed ? 80 : width;
  return (
    <aside
      className={`ant-layout-sider ${collapsed ? 'ant-layout-sider-collapsed' : ''} ${className || ''}`}
      style={{
        width: siderWidth,
        minWidth: siderWidth,
        maxWidth: siderWidth,
        flex: `0 0 ${siderWidth}px`,
        transition: 'all 0.2s',
        ...style,
      }}
    >
      <div className="ant-layout-sider-children" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
      {collapsible && trigger !== null && (
        <div
          className="ant-layout-sider-trigger"
          onClick={() => onCollapse && onCollapse(!collapsed)}
          style={{
            height: 48,
            lineHeight: '48px',
            textAlign: 'center',
            background: 'rgba(0,0,0,0.1)',
            cursor: 'pointer',
            borderTop: '1px solid rgba(0,0,0,0.15)',
          }}
        >
          {trigger || (collapsed ? '>' : '<')}
        </div>
      )}
    </aside>
  );
};

// ==========================================
// 4. Space
// ==========================================
interface SpaceProps {
  children?: React.ReactNode;
  direction?: 'horizontal' | 'vertical';
  size?: number | 'small' | 'middle' | 'large';
  align?: 'start' | 'end' | 'center' | 'baseline';
  style?: React.CSSProperties;
  className?: string;
}

export const Space: React.FC<SpaceProps> = ({
  children,
  direction = 'horizontal',
  size = 'small',
  align = 'center',
  style,
  className,
}) => {
  let gapVal = 8;
  if (typeof size === 'number') gapVal = size;
  else if (size === 'small') gapVal = 8;
  else if (size === 'middle') gapVal = 16;
  else if (size === 'large') gapVal = 24;

  return (
    <div
      className={`ant-space ant-space-${direction} ant-space-align-${align} ${className || ''}`}
      style={{
        display: 'inline-flex',
        flexDirection: direction === 'vertical' ? 'column' : 'row',
        gap: gapVal,
        ...style,
      }}
    >
      {React.Children.map(children, (child) => {
        if (child === null || child === undefined) return null;
        return <div className="ant-space-item">{child}</div>;
      })}
    </div>
  );
};

// ==========================================
// 5. Typography
// ==========================================
interface TypographyTextProps {
  children?: React.ReactNode;
  type?: 'secondary' | 'success' | 'warning' | 'danger';
  strong?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export const Typography: React.FC<{ children?: React.ReactNode; style?: React.CSSProperties; className?: string }> & {
  Text: React.FC<TypographyTextProps>;
  Title: React.FC<any>;
  Link: React.FC<any>;
  Paragraph: React.FC<any>;
} = ({ children, style, className }) => {
  return <div className={`ant-typography ${className || ''}`} style={style}>{children}</div>;
};

Typography.Text = ({ children, type, strong, style, className }) => {
  const typeClass = type ? `ant-typography-${type}` : '';
  const weightStyle = strong ? { fontWeight: 600 } : {};
  return (
    <span className={`ant-typography ${typeClass} ${className || ''}`} style={{ ...weightStyle, ...style }}>
      {children}
    </span>
  );
};

Typography.Title = ({ children, level = 1, style, className }) => {
  const Tag = `h${level}` as any;
  return (
    <Tag className={`ant-typography ant-typography-h${level} ${className || ''}`} style={style}>
      {children}
    </Tag>
  );
};

Typography.Link = ({ children, href, style, className, onClick }) => {
  return (
    <a href={href} onClick={onClick} className={`ant-typography ant-typography-link ${className || ''}`} style={{ color: 'var(--antd-primary)', textDecoration: 'none', cursor: 'pointer', ...style }}>
      {children}
    </a>
  );
};

Typography.Paragraph = ({ children, style, className }) => {
  return (
    <div className={`ant-typography ${className || ''}`} style={{ marginBottom: '1em', ...style }}>
      {children}
    </div>
  );
};

// ==========================================
// 6. Menu
// ==========================================
interface MenuItem {
  key: string;
  icon?: React.ReactNode;
  label: React.ReactNode;
  danger?: boolean;
}

interface MenuProps {
  items?: MenuItem[];
  selectedKeys?: string[];
  mode?: 'vertical' | 'horizontal' | 'inline';
  onClick?: (info: { key: string }) => void;
  style?: React.CSSProperties;
  compact?: boolean;
}

export const Menu: React.FC<MenuProps> = ({ items = [], selectedKeys = [], mode = 'inline', onClick, style, compact }) => {
  return (
    <ul
      className={`ant-menu ant-menu-light ant-menu-root ant-menu-${mode}`}
      style={{
        listStyle: 'none',
        padding: 0,
        margin: 0,
        ...style,
      }}
    >
      {items.map((item) => {
        if (!item) return null;
        const isSelected = selectedKeys.includes(item.key);

        let linkTo: string | undefined;
        let linkHref: string | undefined;
        let labelContent = item.label;

        if (React.isValidElement(item.label)) {
          const props = item.label.props as any;
          if (props.to) {
            linkTo = props.to;
            labelContent = props.children;
          } else if (props.href) {
            linkHref = props.href;
            labelContent = props.children;
          }
        }

        const handleItemClick = () => {
          onClick && onClick({ key: item.key });
        };

        const innerContent = (
          <>
            {item.icon && (
              <span className="ant-menu-item-icon" style={{ display: 'inline-flex', alignItems: 'center' }}>
                {item.icon}
              </span>
            )}
            <span className="ant-menu-title-content" style={{ flex: 1 }}>
              {labelContent}
            </span>
          </>
        );

        const itemStyle: React.CSSProperties = {
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          borderRadius: compact ? 4 : 8,
          margin: compact ? '1px 4px' : '3px 8px',
          color: isSelected ? 'var(--color-accent, #009688)' : 'var(--antd-text)',
          background: isSelected ? 'rgba(0, 150, 136, 0.08)' : 'transparent',
          transition: 'all 0.15s ease',
          padding: 0,
        };

        const linkStyle: React.CSSProperties = {
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          padding: compact ? '4px 12px' : '7px 16px',
          textDecoration: 'none',
          color: 'inherit',
          gap: compact ? 8 : 12,
          fontSize: compact ? 13 : 14,
        };

        return (
          <li
            key={item.key}
            className={`ant-menu-item ${isSelected ? 'ant-menu-item-selected' : ''} ${item.danger ? 'ant-menu-item-danger' : ''}`}
            onClick={handleItemClick}
            style={itemStyle}
          >
            {linkTo ? (
              <Link to={linkTo} style={linkStyle}>
                {innerContent}
              </Link>
            ) : linkHref ? (
              <a href={linkHref} style={linkStyle}>
                {innerContent}
              </a>
            ) : (
              <div style={linkStyle}>
                {innerContent}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
};


// ==========================================
// 7. Avatar
// ==========================================
export const Avatar: React.FC<{ size?: number | 'small' | 'large' | 'default'; icon?: React.ReactNode; src?: string; style?: React.CSSProperties }> = ({ size = 'default', icon, src, style }) => {
  let sizePx = 32;
  if (typeof size === 'number') sizePx = size;
  else if (size === 'small') sizePx = 24;
  else if (size === 'large') sizePx = 40;

  return (
    <span
      className="ant-avatar"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: sizePx,
        height: sizePx,
        borderRadius: '50%',
        background: '#ccc',
        color: '#fff',
        overflow: 'hidden',
        fontSize: sizePx / 2,
        ...style,
      }}
    >
      {src ? <img src={src} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : icon}
    </span>
  );
};

// ==========================================
// 8. Dropdown
// ==========================================
export const Dropdown: React.FC<{ menu?: MenuProps; placement?: string; children: React.ReactNode; trigger?: ('click' | 'hover')[]; open?: boolean }> = ({ menu, children, open: openProp }) => {
  const [open, setOpen] = useState(false);
  const [computedPlacement, setComputedPlacement] = useState<'bottom' | 'top'>('bottom');
  const containerRef = useRef<HTMLDivElement>(null);

  const isControlled = openProp !== undefined;
  const isDropdownOpen = isControlled ? !!openProp : open;
  const { shouldRender, animClass, overlayRef, closeImmediately: closeDropdownImmediately } = useOverlayAnimation(isDropdownOpen, 140);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  useEffect(() => {
    if (isDropdownOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      if (spaceBelow < 300 && rect.top > 300) {
        setComputedPlacement('top');
      } else {
        setComputedPlacement('bottom');
      }
    }
  }, [isDropdownOpen]);

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-block' }}>
      <div onClick={() => !isControlled && setOpen(!open)} style={{ cursor: 'pointer' }}>
        {children}
      </div>
      {shouldRender && menu && (
        <div
          ref={overlayRef}
          className={`custom-dropdown-menu ${animClass === 'enter' ? 'k-pop-enter' : 'k-pop-exit'}`}
          style={{
            position: 'absolute',
            right: 0,
            ...(computedPlacement === 'top' 
              ? { bottom: '100%', top: 'auto', marginBottom: 4 } 
              : { top: '100%', bottom: 'auto', marginTop: 4 }),
            background: '#fff',
            border: '1px solid var(--antd-border)',
            borderRadius: 6,
            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08)',
            zIndex: 1000,
            minWidth: 150,
          }}
        >
          <Menu
            items={menu.items}
            selectedKeys={menu.selectedKeys}
            onClick={(info) => {
              closeDropdownImmediately();
              setOpen(false);
              menu.onClick && menu.onClick(info);
            }}
            compact={true}
            style={{ margin: 0, padding: '4px 0', maxHeight: menu.style?.maxHeight || 'none', overflowY: menu.style?.overflowY || 'visible' }}
          />
        </div>
      )}
    </div>
  );
};

// ==========================================
// 9. Spin
// ==========================================
export const Spin: React.FC<{ size?: 'small' | 'default' | 'large'; tip?: string; spinning?: boolean; children?: React.ReactNode }> = ({ size = 'default', tip, spinning = true, children }) => {
  if (!spinning) return <>{children}</>;

  return (
    <div style={{ position: 'relative', display: children ? 'block' : 'inline-block' }}>
      {children && <div style={{ opacity: 0.5, pointerEvents: 'none' }}>{children}</div>}
      <div
        className={`ant-spin ant-spin-spinning ant-spin-${size}`}
        style={{
          position: children ? 'absolute' : 'static',
          top: '50%',
          left: '50%',
          transform: children ? 'translate(-50%, -50%)' : 'none',
          zIndex: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        <span className="ant-spin-dot ant-spin-dot-spin">
          <i className="ant-spin-dot-item"></i>
          <i className="ant-spin-dot-item"></i>
          <i className="ant-spin-dot-item"></i>
          <i className="ant-spin-dot-item"></i>
        </span>
        {tip && <div style={{ color: 'var(--antd-primary)', fontSize: 14 }}>{tip}</div>}
      </div>
    </div>
  );
};

// ==========================================
// 10. Button
// ==========================================
interface ButtonProps {
  type?: 'primary' | 'dashed' | 'link' | 'text' | 'default';
  danger?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  shape?: 'circle' | 'round';
  loading?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  style?: React.CSSProperties;
  className?: string;
  htmlType?: 'submit' | 'button' | 'reset';
  children?: React.ReactNode;
  size?: 'small' | 'middle' | 'large';
  block?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  type = 'default',
  danger,
  disabled,
  icon,
  shape,
  loading,
  onClick,
  style,
  className = '',
  htmlType = 'button',
  children,
  size = 'middle',
  block,
}) => {
  const btnTypeClass = type ? `ant-btn-${type}` : '';
  const dangerClass = danger ? 'ant-btn-dangerous' : '';
  const shapeClass = shape ? `ant-btn-${shape}` : '';
  const loadingClass = loading ? 'ant-btn-loading' : '';
  const sizeClass = size ? `ant-btn-${size}` : '';
  const blockClass = block ? 'ant-btn-block' : '';

  return (
    <button
      type={htmlType}
      disabled={disabled || loading}
      onClick={onClick}
      className={`ant-btn ${btnTypeClass} ${dangerClass} ${shapeClass} ${loadingClass} ${sizeClass} ${blockClass} ${className}`}
      style={{
        display: block ? 'flex' : 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        ...style,
      }}
    >
      {loading ? (
        <span className="ant-btn-loading-icon" style={{ display: 'inline-flex', alignItems: 'center' }}>
          <svg viewBox="0 0 50 50" style={{ width: 14, height: 14, animation: 'antSpin 1s linear infinite' }}>
            <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" strokeWidth="5" strokeDasharray="80, 200" strokeDashoffset="0" strokeLinecap="round" />
          </svg>
        </span>
      ) : (
        icon
      )}
      {children}
    </button>
  );
};

export const Divider: React.FC<{
  type?: 'horizontal' | 'vertical';
  orientation?: 'left' | 'right' | 'center';
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
}> = ({ type = 'horizontal', orientation = 'center', style, className = '', children }) => {
  if (type === 'vertical') {
    return <span className={`ant-divider ant-divider-vertical ${className}`} style={{ display: 'inline-block', width: 1, height: '0.9em', margin: '0 8px', verticalAlign: 'middle', background: 'var(--antd-border)', ...style }} />;
  }
  if (!children) {
    return <div className={`ant-divider ant-divider-horizontal ${className}`} style={{ display: 'block', height: 1, width: '100%', margin: '16px 0', background: 'var(--antd-border)', ...style }} />;
  }
  return (
    <div
      className={`ant-divider ant-divider-horizontal ant-divider-with-text ant-divider-with-text-${orientation} ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        margin: '16px 0',
        color: 'var(--antd-text)',
        fontSize: 14,
        ...style,
      }}
    >
      <span className="ant-divider-inner-text" style={{ padding: '0 12px', whiteSpace: 'nowrap' }}>
        {children}
      </span>
    </div>
  );
};

// ==========================================
// 12. Badge
// ==========================================
export const Badge: React.FC<{ status?: 'success' | 'processing' | 'default' | 'error' | 'warning'; text?: React.ReactNode; count?: React.ReactNode; style?: React.CSSProperties; children?: React.ReactNode }> = ({ status, text, count, style, children }) => {
  if (status) {
    return (
      <span className={`ant-badge ant-badge-status ant-badge-status-${status}`} style={style}>
        <span className={`ant-badge-status-dot ant-badge-status-${status}`} />
        {text && <span className="ant-badge-status-text">{text}</span>}
      </span>
    );
  }

  return (
    <span className="ant-badge" style={{ position: 'relative', display: 'inline-block', ...style }}>
      {children}
      {count !== undefined && count !== null && (
        <span
          className="ant-badge-count"
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            transform: 'translate(50%, -50%)',
            background: 'var(--antd-danger)',
            color: '#fff',
            fontSize: 12,
            padding: '0 6px',
            borderRadius: 10,
            lineHeight: '20px',
            height: 20,
            minWidth: 20,
            textAlign: 'center',
            boxShadow: '0 0 0 1px #fff',
          }}
        >
          {count}
        </span>
      )}
    </span>
  );
};

// ==========================================
// 13. Tag
// ==========================================
export const Tag: React.FC<{ color?: string; style?: React.CSSProperties; children?: React.ReactNode; closable?: boolean; onClose?: () => void }> = ({ color, style, children, closable, onClose }) => {
  const isPresetColor = color && ['default', 'success', 'processing', 'error', 'warning', 'blue', 'green', 'orange', 'red', 'cyan', 'purple'].includes(color);
  const colorClass = isPresetColor ? `ant-tag-${color}` : '';
  const customStyle = !isPresetColor && color ? { background: color, color: '#fff', borderColor: color } : {};

  return (
    <span className={`ant-tag ${colorClass}`} style={{ ...customStyle, ...style }}>
      {children}
      {closable && (
        <span
          onClick={(e) => {
            e.stopPropagation();
            onClose && onClose();
          }}
          style={{ marginLeft: 4, cursor: 'pointer', fontWeight: 'bold' }}
        >
          ×
        </span>
      )}
    </span>
  );
};

// ==========================================
// 14. Alert
// ==========================================
export const Alert: React.FC<{ message: React.ReactNode; description?: React.ReactNode; type?: 'success' | 'info' | 'warning' | 'error'; showIcon?: boolean; closable?: boolean; onClose?: () => void; style?: React.CSSProperties }> = ({ message, description, type = 'info', showIcon, closable, onClose, style }) => {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  let bg = '#e0f2f1';
  let border = '#b2dfdb';
  let color = '#00796b';
  if (type === 'success') { bg = '#f6ffed'; border = '#b7eb8f'; color = '#389e0d'; }
  else if (type === 'warning') { bg = '#fffbe6'; border = '#ffe58f'; color = '#d48806'; }
  else if (type === 'error') { bg = '#fff2f0'; border = '#ffccc7'; color = '#d9363e'; }

  return (
    <div
      className={`ant-alert ant-alert-${type}`}
      style={{
        display: 'flex',
        padding: '8px 15px',
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: 6,
        color: 'var(--antd-text)',
        marginBottom: 16,
        alignItems: description ? 'flex-start' : 'center',
        gap: 12,
        ...style,
      }}
    >
      {showIcon && (
        <span style={{ color, fontSize: 16, marginTop: description ? 2 : 0, display: 'inline-flex', alignItems: 'center' }}>
          {type === 'success' && <CheckCircleFilled />}
          {type === 'info' && <InfoCircleFilled />}
          {type === 'warning' && <ExclamationCircleFilled />}
          {type === 'error' && <CloseCircleFilled />}
        </span>
      )}
      <div style={{ flex: 1 }}>
        <div className="ant-alert-message" style={{ fontWeight: 500 }}>
          {Array.isArray(message) ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {message.map((msg, i) => (
                <div key={i}>{msg}</div>
              ))}
            </div>
          ) : typeof message === 'string' && message.includes('\n') ? (
            message.split('\n').map((line, i) => <div key={i}>{line}</div>)
          ) : (
            message
          )}
        </div>
        {description && <div className="ant-alert-description" style={{ fontSize: 13, marginTop: 4, color: 'var(--antd-text-secondary)' }}>{description}</div>}
      </div>
      {closable && (
        <span
          onClick={() => {
            setVisible(false);
            onClose && onClose();
          }}
          style={{ cursor: 'pointer', fontWeight: 'bold', opacity: 0.5 }}
        >
          ×
        </span>
      )}
    </div>
  );
};

// ==========================================
// 15. Statistic
// ==========================================
export const Statistic: React.FC<{ title?: React.ReactNode; value?: number | string; prefix?: React.ReactNode; suffix?: React.ReactNode; valueStyle?: React.CSSProperties; style?: React.CSSProperties }> = ({ title, value, prefix, suffix, valueStyle, style }) => {
  return (
    <div className="ant-statistic" style={style}>
      {title && <div className="ant-statistic-title" style={{ color: 'var(--antd-text-secondary)', marginBottom: 4, fontSize: 14 }}>{title}</div>}
      <div className="ant-statistic-content" style={{ display: 'flex', alignItems: 'baseline', fontSize: 24, fontWeight: 'bold', color: 'var(--antd-text)', ...valueStyle }}>
        {prefix && <span className="ant-statistic-content-prefix" style={{ marginRight: 4 }}>{prefix}</span>}
        <span className="ant-statistic-content-value">{value}</span>
        {suffix && <span className="ant-statistic-content-suffix" style={{ marginLeft: 4 }}>{suffix}</span>}
      </div>
    </div>
  );
};

// ==========================================
// 16. Progress
// ==========================================
export const Progress: React.FC<{ percent?: number; status?: 'success' | 'exception' | 'normal' | 'active'; size?: 'small' | 'default'; type?: 'line' | 'circle' | 'dashboard'; strokeColor?: string; style?: React.CSSProperties }> = ({ percent = 0, status, size, type = 'line', strokeColor, style }) => {
  const isSmall = size === 'small';
  const height = isSmall ? 6 : 8;

  let color = 'var(--antd-primary)';
  if (status === 'success') color = 'var(--antd-success)';
  else if (status === 'exception') color = 'var(--antd-danger)';
  if (strokeColor) color = strokeColor;

  if (type === 'circle' || type === 'dashboard') {
    const radius = 50;
    const strokeWidth = 8;
    const circ = 2 * Math.PI * radius;
    const offset = circ - (percent / 100) * circ;
    return (
      <div className="ant-progress ant-progress-circle" style={{ display: 'inline-block', position: 'relative', width: 120, height: 120, ...style }}>
        <svg viewBox="0 0 120 120" style={{ transform: type === 'dashboard' ? 'rotate(-125deg)' : 'none' }}>
          <circle cx="60" cy="60" r={radius} fill="none" stroke="#f5f5f5" strokeWidth={strokeWidth} />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.3s ease' }}
          />
        </svg>
        <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: 16, fontWeight: 'bold' }}>{percent}%</span>
      </div>
    );
  }

  return (
    <div className="ant-progress ant-progress-line" style={{ display: 'flex', alignItems: 'center', width: '100%', gap: 8, ...style }}>
      <div style={{ flex: 1, background: '#f5f5f5', borderRadius: 100, height, overflow: 'hidden' }}>
        <div style={{ width: `${percent}%`, background: color, height: '100%', borderRadius: 100, transition: 'width 0.3s ease' }} />
      </div>
      <span className="ant-progress-text" style={{ fontSize: 12, minWidth: 32 }}>{percent}%</span>
    </div>
  );
};

// ==========================================
// 17. Checkbox
// ==========================================
export const Checkbox: React.FC<{ checked?: boolean; onChange?: (e: any) => void; disabled?: boolean; children?: React.ReactNode; style?: React.CSSProperties }> = ({ checked, onChange, disabled, children, style }) => {
  const isChecked = !!checked;
  return (
    <label className={`ant-checkbox-wrapper ${disabled ? 'ant-checkbox-wrapper-disabled' : ''}`} style={{ display: 'inline-flex', alignItems: 'center', cursor: disabled ? 'not-allowed' : 'pointer', ...style }}>
      <span className={`ant-checkbox ${isChecked ? 'ant-checkbox-checked' : ''} ${disabled ? 'ant-checkbox-disabled' : ''}`}>
        <input
          type="checkbox"
          checked={isChecked}
          disabled={disabled}
          onChange={(e) => onChange && onChange({ target: { checked: e.target.checked } })}
          className="ant-checkbox-input"
        />
        <span className="ant-checkbox-inner" />
      </span>
      {children !== undefined && <span>{children}</span>}
    </label>
  );
};

// ==========================================
// 18. Switch
// ==========================================
export const Switch: React.FC<{ checked?: boolean; onChange?: (checked: boolean) => void; disabled?: boolean; checkedChildren?: React.ReactNode; unCheckedChildren?: React.ReactNode; style?: React.CSSProperties }> = ({ checked, onChange, disabled, checkedChildren, unCheckedChildren, style }) => {
  const isChecked = !!checked;
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isChecked}
      disabled={disabled}
      onClick={() => onChange && onChange(!isChecked)}
      className={`ant-switch ${isChecked ? 'ant-switch-checked' : ''} ${disabled ? 'ant-switch-disabled' : ''}`}
      style={style}
    >
      <div className="ant-switch-handle" />
      <span className="ant-switch-inner">
        {isChecked ? checkedChildren : unCheckedChildren}
      </span>
    </button>
  );
};

// ==========================================
// 19. Input (Input, Password, Search, TextArea)
// ==========================================
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  allowClear?: boolean;
  onPressEnter?: React.KeyboardEventHandler<HTMLInputElement>;
}

export const Input: React.FC<InputProps> & {
  Password: React.FC<InputProps>;
  Search: React.FC<any>;
  TextArea: React.FC<any>;
} = ({ prefix, suffix, allowClear, value, onChange, onPressEnter, style, className = '', ...props }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onPressEnter) {
      onPressEnter(e);
    }
  };

  const hasAffix = prefix || suffix || allowClear;

  if (!hasAffix) {
    return (
      <input
        ref={inputRef}
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        className={`ant-input ${className}`}
        style={style}
        {...props}
      />
    );
  }

  return (
    <span
      className={`ant-input-affix-wrapper ${className}`}
      style={style}
      onClick={() => inputRef.current?.focus()}
    >
      {prefix && <span style={{ marginRight: 8, display: 'inline-flex', alignItems: 'center' }}>{prefix}</span>}
      <input
        ref={inputRef}
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        {...props}
      />
      {allowClear && value && (
        <span
          onClick={(e) => { e.stopPropagation(); onChange && onChange({ target: { value: '' } } as any); }}
          style={{ cursor: 'pointer', margin: '0 4px', fontWeight: 'bold' }}
        >
          ×
        </span>
      )}
      {suffix && <span style={{ marginLeft: 8, display: 'inline-flex', alignItems: 'center' }}>{suffix}</span>}
    </span>
  );
};

Input.Password = ({ ...props }) => {
  const [visible, setVisible] = useState(false);
  return (
    <Input
      type={visible ? 'text' : 'password'}
      suffix={
        <span
          onClick={(e) => { e.stopPropagation(); setVisible(!visible); }}
          style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', color: 'var(--antd-text-secondary)', fontSize: 16, padding: '0 4px' }}
        >
          {visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
        </span>
      }
      {...props}
    />
  );
};

Input.Search = ({ onSearch, enterButton, ...props }) => {
  const [val, setVal] = useState(props.value || '');
  useEffect(() => {
    if (props.value !== undefined) setVal(props.value);
  }, [props.value]);

  return (
    <div style={{ display: 'flex' }}>
      <Input
        value={val}
        onChange={(e) => {
          setVal(e.target.value);
          props.onChange && props.onChange(e);
        }}
        onPressEnter={() => onSearch && onSearch(val)}
        style={{ borderTopRightRadius: enterButton ? 0 : undefined, borderBottomRightRadius: enterButton ? 0 : undefined, flex: 1 }}
        {...props}
      />
      {enterButton && (
        <Button
          type="primary"
          onClick={() => onSearch && onSearch(val)}
          style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, height: 32 }}
        >
          {enterButton === true ? 'Search' : enterButton}
        </Button>
      )}
    </div>
  );
};

Input.TextArea = ({ rows, style, ...props }) => {
  return (
    <textarea
      className="ant-input"
      rows={rows}
      style={{ width: '100%', resize: 'vertical', minHeight: rows ? rows * 20 : 160, ...style }}
      {...props}
    />
  );
};

// ==========================================
// 20. InputNumber
// ==========================================
export const InputNumber: React.FC<{ value?: number | null; onChange?: (val: number | null) => void; min?: number; max?: number; style?: React.CSSProperties; disabled?: boolean; placeholder?: string; className?: string }> = ({ value, onChange, min, max, style, disabled, placeholder, className = '' }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let num: number | null = e.target.value === '' ? null : Number(e.target.value);
    if (num !== null && !isNaN(num)) {
      if (min !== undefined && num < min) num = min;
      if (max !== undefined && num > max) num = max;
      onChange && onChange(num);
    } else if (e.target.value === '') {
      onChange && onChange(null);
    }
  };

  return (
    <input
      type="number"
      value={value === null || value === undefined ? '' : value}
      onChange={handleChange}
      disabled={disabled}
      placeholder={placeholder}
      className={`ant-input ${className}`}
      style={{ width: 90, ...style }}
      min={min}
      max={max}
    />
  );
};

// ==========================================
// 21. Select
// ==========================================
export const DownOutlined = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transition: 'none', color: 'rgba(0, 0, 0, 0.25)', flexShrink: 0 }}>
    <path d="M1.5 3.5L5 7L8.5 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

interface SelectOption {
  label: React.ReactNode;
  value: any;
}

interface SelectProps {
  value?: any;
  onChange?: (value: any) => void;
  options?: SelectOption[];
  placeholder?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  mode?: 'multiple' | 'tags';
  showSearch?: boolean;
  filterOption?: any;
  className?: string;
  size?: 'small' | 'middle' | 'large';
}

export const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  options = [],
  placeholder = 'Select...',
  style,
  disabled,
  mode,
  className = '',
  size = 'middle',
}) => {
  const [open, setOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    left: number;
    width: number;
    maxHeight: number;
    isFlipped: boolean;
  } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const ITEM_HEIGHT = size === 'small' ? 26 : size === 'large' ? 36 : 32;
  const triggerHeight = size === 'small' ? 24 : size === 'large' ? 40 : 32;
  const isMultiple = mode === 'multiple' || mode === 'tags';
  const hasValue = value !== undefined && value !== null && value !== '';
  const values = isMultiple ? (Array.isArray(value) ? value : (hasValue ? [value] : [])) : (hasValue ? [value] : []);

  const updatePosition = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return;

    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const margin = 8;
    const estimatedHeight = Math.min(options.length * ITEM_HEIGHT + 8, 260);

    const spaceBelow = viewportHeight - rect.bottom - margin;
    const spaceAbove = rect.top - margin;

    // Chuẩn web: mặc định rơi xuống dưới trigger, chỉ flip lên khi bên dưới không đủ chỗ
    const shouldFlip = spaceBelow < Math.min(estimatedHeight, 140) && spaceAbove > spaceBelow;

    const maxHeight = shouldFlip
      ? Math.min(260, Math.max(100, spaceAbove))
      : Math.min(260, Math.max(100, spaceBelow));

    const finalHeight = Math.min(estimatedHeight, maxHeight);

    const top = shouldFlip
      ? Math.round(rect.top - finalHeight - 4)
      : Math.round(rect.bottom + 4);

    let left = Math.round(rect.left);
    const width = Math.round(rect.width);
    if (left + width > viewportWidth - margin) {
      left = Math.max(margin, viewportWidth - width - margin);
    }

    setDropdownPosition({
      top,
      left,
      width,
      maxHeight,
      isFlipped: shouldFlip,
    });
  }, [ITEM_HEIGHT, options.length]);

  useEffect(() => {
    if (open) {
      updatePosition();
    }
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        containerRef.current && !containerRef.current.contains(target) &&
        dropdownRef.current && !dropdownRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleScrollOrResize = (e: Event) => {
      if (dropdownRef.current && (e.target === dropdownRef.current || dropdownRef.current.contains(e.target as Node))) {
        return;
      }
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) {
          setOpen(false);
          return;
        }
      }
      updatePosition();
    };

    window.addEventListener('resize', handleScrollOrResize);
    window.addEventListener('scroll', handleScrollOrResize, true);
    return () => {
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('scroll', handleScrollOrResize, true);
    };
  }, [open, updatePosition]);

  // Tự động cuộn đến item đã chọn khi dropdown mở
  React.useLayoutEffect(() => {
    if (open && dropdownPosition && dropdownRef.current) {
      const selectedElem = dropdownRef.current.querySelector('.ant-select-item-selected') as HTMLElement;
      if (selectedElem) {
        selectedElem.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [open, dropdownPosition]);

  const { shouldRender: shouldRenderSelect, animClass: selectAnimClass, overlayRef: selectOverlayRef, closeImmediately: closeSelectImmediately } = useOverlayAnimation(open, 130);

  const handleSelect = (val: any) => {
    if (disabled) return;
    if (isMultiple) {
      const nextValues = values.includes(val)
        ? values.filter(v => String(v) !== String(val))
        : [...values, val];
      onChange && onChange(nextValues);
    } else {
      const isAlreadySelected = (value !== undefined && value !== null && value !== '') && String(value) === String(val);
      const nextVal = isAlreadySelected ? undefined : val;
      onChange && onChange(nextVal);
      closeSelectImmediately();
      setOpen(false);
    }
  };

  const handleRemove = (e: React.MouseEvent, val: any) => {
    e.stopPropagation();
    if (disabled) return;
    const nextValues = values.filter(v => String(v) !== String(val));
    onChange && onChange(nextValues);
  };

  return (
    <div
      ref={containerRef}
      className={`ant-select ${open ? 'ant-select-open ant-select-focused' : ''} ${disabled ? 'ant-select-disabled' : ''} ${isMultiple ? 'ant-select-multiple' : ''} ${className}`}
      style={{ ...style, position: 'relative' }}
      onClick={() => {
        if (!disabled) {
          setOpen(!open);
        }
      }}
    >
      <div className="ant-select-selector" style={{ display: 'flex', flexWrap: isMultiple ? 'wrap' : 'nowrap', alignItems: 'center', gap: 4, height: isMultiple ? 'auto' : triggerHeight, minHeight: triggerHeight, padding: isMultiple ? '2px 4px' : (size === 'small' ? '0 8px' : undefined) }}>
        {isMultiple ? (
          values.length > 0 ? (
            values.map(val => {
              const opt = options.find(o => String(o.value) === String(val));
              const label = opt ? opt.label : val;
              return (
                <span key={String(val)} className="ant-select-selection-item" style={{ display: 'inline-flex', alignItems: 'center', background: '#f5f5f5', border: '1px solid #f0f0f0', borderRadius: 4, padding: '0 4px 0 8px', fontSize: size === 'small' ? 12 : 12, height: size === 'small' ? 18 : 24, margin: '2px 0', gap: 4 }}>
                  <span className="ant-select-selection-item-content">{label}</span>
                  <span className="ant-select-selection-item-remove" style={{ cursor: 'pointer', color: 'rgba(0,0,0,0.45)', fontWeight: 'bold' }} onClick={(e) => handleRemove(e, val)}>×</span>
                </span>
              );
            })
          ) : (
            <span className="ant-select-selection-placeholder" style={{ paddingLeft: 8, lineHeight: size === 'small' ? '18px' : '26px', fontSize: size === 'small' ? 12 : 14 }}>{placeholder}</span>
          )
        ) : (
          (() => {
            const selectedOption = options.find(o => String(o.value) === String(value));
            return (
              <span 
                className={selectedOption ? "ant-select-selection-item" : "ant-select-selection-placeholder"}
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  flex: 1,
                  display: 'inline-block',
                  textAlign: 'left',
                  fontSize: size === 'small' ? 12 : 14
                }}
              >
                {selectedOption ? (selectedOption.label !== undefined ? selectedOption.label : String(selectedOption.value)) : placeholder}
              </span>
            );
          })()
        )}
        <span className="ant-select-arrow" style={{ marginLeft: 'auto', paddingRight: isMultiple ? 8 : 0, display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}>
          <DownOutlined />
        </span>
      </div>
      {shouldRenderSelect && dropdownPosition && !disabled && typeof document !== 'undefined' && createPortal(
        <div
          ref={(node) => {
            dropdownRef.current = node;
            selectOverlayRef.current = node;
          }}
          className={`ant-select-dropdown ${size === 'small' ? 'ant-select-dropdown-small' : ''} ${selectAnimClass === 'enter' ? 'k-select-enter' : 'k-select-exit'} ${dropdownPosition.isFlipped ? 'ant-select-dropdown-placement-topLeft' : 'ant-select-dropdown-placement-bottomLeft'}`}
          style={{
            position: 'fixed',
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            width: `${dropdownPosition.width}px`,
            maxHeight: `${dropdownPosition.maxHeight}px`,
            overflowY: 'auto',
            overflowX: 'hidden',
            zIndex: 100050,
            background: '#fff',
            border: '1px solid var(--antd-border, #d9d9d9)',
            borderRadius: 'var(--antd-radius-base, 6px)',
            boxShadow: '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
            boxSizing: 'border-box',
            padding: '4px 0',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {options.map((opt) => {
            const isSelected = values.some(v => String(v) === String(opt.value));
            return (
              <div
                key={String(opt.value)}
                className={`ant-select-item ${isSelected ? 'ant-select-item-selected' : ''}`}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  height: ITEM_HEIGHT,
                  lineHeight: `${ITEM_HEIGHT}px`,
                  fontSize: size === 'small' ? '12px' : '14px',
                  padding: size === 'small' ? '0 8px' : '0 12px',
                  boxSizing: 'border-box',
                  cursor: 'pointer'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(opt.value);
                }}
              >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', flex: 1, marginRight: 8 }}>
                  {opt.label !== undefined ? opt.label : String(opt.value)}
                </span>
                {isSelected && (
                  <span className="ant-select-item-option-state-icon" style={{ color: 'var(--antd-primary, #009688)', display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}>
                    <svg width={size === 'small' ? 11 : 12} height={size === 'small' ? 11 : 12} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                )}
              </div>
            );
          })}
        </div>,
        document.body
      )}
    </div>
  );
};

// ==========================================
// 21b. CompactSelect — for small dropdowns (pagination, batch actions, etc.)
//      Opens below trigger; auto-flips up if not enough space below.
//      No overlay math — no jump, no bug.
// ==========================================
export const CompactSelect: React.FC<Omit<SelectProps, 'mode' | 'showSearch' | 'filterOption'>> = ({
  value,
  onChange,
  options = [],
  placeholder = 'Select...',
  style,
  disabled,
  className = '',
  size = 'small',
}) => {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number; width: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { shouldRender: shouldRenderCompact, animClass: compactAnimClass, overlayRef: compactOverlayRef, closeImmediately: closeCompactImmediately } = useOverlayAnimation(open, 130);

  const updateCompactPosition = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return;
    const estimatedDropdownHeight = Math.min(options.length * (size === 'small' ? 24 : 30) + 8, 250);
    const spaceBelow = window.innerHeight - rect.bottom;
    const shouldFlip = spaceBelow < estimatedDropdownHeight && rect.top > estimatedDropdownHeight;
    setCoords({
      top: shouldFlip ? Math.round(rect.top - estimatedDropdownHeight - 2) : Math.round(rect.bottom + 2),
      left: Math.round(rect.left),
      width: Math.round(rect.width),
    });
  }, [options.length, size]);

  useEffect(() => {
    if (open) {
      updateCompactPosition();
    }
  }, [open, updateCompactPosition]);

  useEffect(() => {
    if (!open) return;
    const handleOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        containerRef.current && !containerRef.current.contains(target) &&
        dropdownRef.current && !dropdownRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleScrollOrResize = (e: Event) => {
      if (dropdownRef.current && (e.target === dropdownRef.current || dropdownRef.current.contains(e.target as Node))) {
        return;
      }
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) {
          setOpen(false);
          return;
        }
      }
      updateCompactPosition();
    };
    window.addEventListener('resize', handleScrollOrResize);
    window.addEventListener('scroll', handleScrollOrResize, true);
    return () => {
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('scroll', handleScrollOrResize, true);
    };
  }, [open, updateCompactPosition]);

  const triggerHeight = size === 'small' ? 24 : size === 'large' ? 40 : 32;
  const selectedOption = options.find(o => String(o.value) === String(value));

  const handleSelect = (val: any) => {
    if (disabled) return;
    const isAlreadySelected = value !== undefined && value !== null && value !== '' && String(value) === String(val);
    const nextVal = isAlreadySelected ? undefined : val;
    onChange && onChange(nextVal);
    closeCompactImmediately();
    setOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className={`ant-select compact-select ${open ? 'ant-select-open' : ''} ${disabled ? 'ant-select-disabled' : ''} ${className}`}
      style={style}
      onClick={() => !disabled && setOpen(prev => !prev)}
    >
      <div
        className="ant-select-selector"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          height: triggerHeight,
          minHeight: triggerHeight,
          padding: '0 8px',
        }}
      >
        <span
          className={selectedOption ? 'ant-select-selection-item' : 'ant-select-selection-placeholder'}
          style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'left', fontSize: size === 'small' ? 12 : 14 }}
        >
          {selectedOption
            ? (selectedOption.label !== undefined ? selectedOption.label : String(selectedOption.value))
            : placeholder}
        </span>
        <DownOutlined />
      </div>

      {shouldRenderCompact && coords && !disabled && typeof document !== 'undefined' && createPortal(
        <div
          ref={(node) => {
            dropdownRef.current = node;
            compactOverlayRef.current = node;
          }}
          className={`compact-select-dropdown ${compactAnimClass === 'enter' ? 'k-select-enter' : 'k-select-exit'}`}
          style={{
            position: 'fixed',
            top: `${coords.top}px`,
            left: `${coords.left}px`,
            minWidth: `${coords.width}px`,
            zIndex: 100050,
          }}
          onClick={e => e.stopPropagation()}
        >
          {options.map((opt) => {
            const isSelected = value !== undefined && value !== null && value !== '' && String(opt.value) === String(value);
            return (
              <div
                key={String(opt.value)}
                className={`compact-select-item${isSelected ? ' compact-select-item-selected' : ''}`}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: size === 'small' ? 12 : 13,
                  padding: size === 'small' ? '3px 12px' : '4px 12px',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                }}
                onClick={() => handleSelect(opt.value)}
              >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, marginRight: 8 }}>
                  {opt.label !== undefined ? opt.label : String(opt.value)}
                </span>
                {isSelected && (
                  <span className="compact-select-item-check" style={{ color: 'var(--antd-primary, #009688)', display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}>
                    <svg width={size === 'small' ? 11 : 12} height={size === 'small' ? 11 : 12} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                )}
              </div>
            );
          })}
        </div>,
        document.body
      )}
    </div>
  );
};


// ==========================================
export const DatePicker: React.FC<{ value?: any; onChange?: (val: any) => void; style?: React.CSSProperties; disabled?: boolean }> = ({ value, onChange, style, disabled }) => {
  return (
    <input
      type="date"
      value={value ? String(value).split('T')[0] : ''}
      onChange={(e) => onChange && onChange(e.target.value)}
      disabled={disabled}
      className="ant-input"
      style={style}
    />
  );
};

// ==========================================
// 23. Slider
// ==========================================
export const Slider: React.FC<{ value?: number; onChange?: (val: number) => void; min?: number; max?: number; disabled?: boolean; style?: React.CSSProperties }> = ({ value = 0, onChange, min = 0, max = 100, disabled, style }) => {
  return (
    <input
      type="range"
      value={value}
      min={min}
      max={max}
      onChange={(e) => onChange && onChange(Number(e.target.value))}
      disabled={disabled}
      style={{ width: '100%', cursor: disabled ? 'not-allowed' : 'pointer', ...style }}
    />
  );
};

// ==========================================
// 24. ColorPicker
// ==========================================
export const ColorPicker: React.FC<{ value?: any; onChange?: (val: any) => void; disabled?: boolean; style?: React.CSSProperties }> = ({ value = '#009688', onChange, disabled, style }) => {
  const hexVal = typeof value === 'object' && value?.toHexString ? value.toHexString() : String(value);
  return (
    <input
      type="color"
      value={hexVal}
      onChange={(e) => onChange && onChange({ toHexString: () => e.target.value, _hex: e.target.value })}
      disabled={disabled}
      style={{
        border: '1px solid var(--antd-border)',
        borderRadius: 4,
        width: 32,
        height: 32,
        cursor: disabled ? 'not-allowed' : 'pointer',
        padding: 2,
        background: '#fff',
        ...style,
      }}
    />
  );
};

// ==========================================
// 25. Card
// ==========================================
export const Card: React.FC<any> = ({ title, extra, children, style, className = '', actions, cover, bodyStyle, styles }) => {
  const mergedBodyStyle = { ...bodyStyle, ...(styles?.body || {}) };
  return (
    <div className={`ant-card ${className}`} style={style}>
      {cover && <div className="ant-card-cover">{cover}</div>}
      {(title || extra) && (
        <div className="ant-card-head">
          <div className="ant-card-head-title">{title}</div>
          {extra && <div className="ant-card-extra">{extra}</div>}
        </div>
      )}
      <div className="ant-card-body" style={mergedBodyStyle}>
        {children}
      </div>
      {actions && (
        <ul className="ant-card-actions" style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0, borderTop: '1px solid var(--antd-border)' }}>
          {actions.map((act: any, idx: number) => (
            <li key={idx} style={{ flex: 1, textAlign: 'center', padding: '12px 0', borderRight: idx < actions.length - 1 ? '1px solid var(--antd-border)' : 'none' }}>
              {act}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// ==========================================
// 26. Form & Form.Item
// ==========================================
const FormContext = createContext<{
  values: any;
  setFieldValue: (name: string, value: any) => void;
}>({ values: {}, setFieldValue: () => { } });

class FormStore {
  private values: any = {};
  private initialValues: any = {};
  private listeners: (() => void)[] = [];

  constructor(initialValues = {}) {
    this.values = { ...initialValues };
    this.initialValues = { ...initialValues };
  }

  getFieldsValue() {
    return this.values;
  }

  setFieldsValue(newValues: any) {
    this.values = { ...this.values, ...newValues };
    this.notify();
  }

  resetFields() {
    this.values = { ...this.initialValues };
    this.notify();
  }

  async validateFields() {
    return this.values;
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }
}

export const useForm = (formInstance?: any) => {
  const formRef = useRef<any>(null);
  if (!formRef.current) {
    if (formInstance) {
      formRef.current = formInstance;
    } else {
      formRef.current = new FormStore();
    }
  }
  return [formRef.current];
};

export const Form: React.FC<any> & { Item: React.FC<any>; useForm: typeof useForm } = ({
  layout,
  onFinish,
  initialValues = {},
  form: formProp,
  children,
  autoComplete,
  style,
}) => {
  const [localForm] = useForm();
  const form = formProp || localForm;

  const [, forceUpdate] = useState({});
  useEffect(() => {
    return form.subscribe(() => {
      forceUpdate({});
    });
  }, [form]);

  const setFieldValue = (name: string, value: any) => {
    form.setFieldsValue({ [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFinish && onFinish(form.getFieldsValue());
  };

  return (
    <FormContext.Provider value={{ values: form.getFieldsValue(), setFieldValue }}>
      <form onSubmit={handleSubmit} autoComplete={autoComplete} className={`ant-form ant-form-${layout || 'horizontal'}`} style={style}>
        {children}
      </form>
    </FormContext.Provider>
  );
};

Form.useForm = useForm;

Form.Item = ({ name, label, rules, valuePropName = 'value', children, style }) => {
  const { values, setFieldValue } = useContext(FormContext);

  let child: React.ReactNode = children;
  if (name && React.isValidElement(children)) {
    const childVal = values[name];
    const childProps: any = {
      [valuePropName]: childVal !== undefined ? childVal : '',
      onChange: (e: any) => {
        let newVal = e;
        if (e && e.target) {
          if (e.target.type === 'checkbox') {
            newVal = e.target.checked;
          } else {
            newVal = e.target.value;
          }
        }
        setFieldValue(name, newVal);
        if (children.props.onChange) {
          children.props.onChange(e);
        }
      }
    };
    child = React.cloneElement(children, childProps);
  }

  return (
    <div className="ant-form-item" style={style}>
      <div className="ant-form-item-row">
        {label && (
          <div className="ant-form-item-label">
            <label>{label}</label>
          </div>
        )}
        <div className="ant-form-item-control">
          <div className="ant-form-item-control-input">
            <div className="ant-form-item-control-input-content">
              {child}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TableFilterDropdown: React.FC<{
  isOpen: boolean;
  filterDropdownRef: React.RefObject<HTMLDivElement>;
  filters: any[];
  tempSelectedFilters: any[];
  setTempSelectedFilters: React.Dispatch<React.SetStateAction<any[]>>;
  onApply: (selected: any[]) => void;
}> = ({ isOpen, filterDropdownRef, filters, tempSelectedFilters, setTempSelectedFilters, onApply }) => {
  const { shouldRender, animClass, overlayRef: filterOverlayRef } = useOverlayAnimation(isOpen, 130);
  if (!shouldRender) return null;

  return (
    <div
      ref={(node) => {
        if (typeof filterDropdownRef === 'function') (filterDropdownRef as any)(node);
        else if (filterDropdownRef) (filterDropdownRef as any).current = node;
        filterOverlayRef.current = node;
      }}
      className={`${animClass === 'enter' ? 'k-pop-enter' : 'k-pop-exit'}`}
      style={{
        position: 'absolute',
        right: 0,
        top: '100%',
        marginTop: 8,
        background: '#fff',
        border: '1px solid var(--antd-border)',
        borderRadius: 4,
        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08)',
        padding: 8,
        zIndex: 1000,
        minWidth: 145,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 150, overflowY: 'auto', paddingBottom: 8 }}>
        {filters && filters.map((filterOpt: any) => {
          const isChecked = tempSelectedFilters.includes(filterOpt.value);
          return (
            <Checkbox
              key={String(filterOpt.value)}
              checked={isChecked}
              onChange={(e) => {
                if (e.target.checked) {
                  setTempSelectedFilters([...tempSelectedFilters, filterOpt.value]);
                } else {
                  setTempSelectedFilters(tempSelectedFilters.filter((v: any) => v !== filterOpt.value));
                }
              }}
            >
              {filterOpt.text}
            </Checkbox>
          );
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f0f0f0', paddingTop: 6, gap: 8 }}>
        <Button
          size="small"
          type="link"
          style={{ padding: 0, fontSize: 12, border: 'none', background: 'transparent', color: 'var(--antd-text-secondary)', height: 'auto' }}
          onClick={() => {
            setTempSelectedFilters([]);
            onApply([]);
          }}
        >
          Reset
        </Button>
        <Button
          size="small"
          type="primary"
          style={{ fontSize: 12, height: 22, padding: '0 8px' }}
          onClick={() => {
            onApply(tempSelectedFilters);
          }}
        >
          OK
        </Button>
      </div>
    </div>
  );
};

// ==========================================
// 27. Table
// ==========================================
export interface TableProps<T = any> {
  columns?: any[];
  dataSource?: T[];
  rowKey?: string | ((record: T, index: number) => string | number);
  loading?: boolean;
  pagination?: any;
  rowSelection?: any;
  className?: string;
  style?: React.CSSProperties;
  locale?: any;
  size?: 'large' | 'middle' | 'small';
  onRow?: (record: T, index?: number) => React.HTMLAttributes<any>;
  rowClassName?: (record: T, index: number) => string;
}

export function Table<T = any>({
  columns = [],
  dataSource = [],
  rowKey = 'id',
  loading,
  pagination,
  rowSelection,
  className = '',
  style,
  locale,
  size = 'small',
  onRow,
  rowClassName,
}: TableProps<T>) {
  const [sortColumnKey, setSortColumnKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'ascend' | 'descend' | null>(null);
  const [activeFilters, setActiveFilters] = useState<Record<string, any[]>>({});
  const [openFilterColumnKey, setOpenFilterColumnKey] = useState<string | null>(null);
  const [tempSelectedFilters, setTempSelectedFilters] = useState<any[]>([]);

  const filterDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(e.target as Node)) {
        setOpenFilterColumnKey(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const getRowKey = (record: any, index: number) => {
    if (typeof rowKey === 'function') return rowKey(record, index);
    if (record[rowKey] !== undefined) return record[rowKey];
    if (record.key !== undefined) return record.key;
    if (record.id !== undefined) return record.id;
    return String(index);
  };

  const isPaginationEnabled = pagination !== false;
  const pageSize = pagination?.pageSize || 10;
  const current = pagination?.current || 1;
  const startIdx = isPaginationEnabled ? (current - 1) * pageSize : 0;

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>, pageItems: any[]) => {
    if (!rowSelection) return;
    if (e.target.checked) {
      const pageKeys = pageItems.map((r: any, idx: number) => getRowKey(r, startIdx + idx));
      const allKeys = Array.from(new Set([...(rowSelection.selectedRowKeys || []), ...pageKeys]));
      const allRows = dataSource.filter((r: any, idx: number) => allKeys.includes(getRowKey(r, idx)));
      rowSelection.onChange(allKeys, allRows);
    } else {
      const pageKeys = pageItems.map((r: any, idx: number) => getRowKey(r, startIdx + idx));
      const nextKeys = (rowSelection.selectedRowKeys || []).filter((k: any) => !pageKeys.includes(k));
      const nextRows = dataSource.filter((r: any, idx: number) => nextKeys.includes(getRowKey(r, idx)));
      rowSelection.onChange(nextKeys, nextRows);
    }
  };

  const handleSelectOne = (record: any, index: number, checked: boolean) => {
    if (!rowSelection) return;
    const key = getRowKey(record, index);
    let nextKeys = [...(rowSelection.selectedRowKeys || [])];
    if (checked) {
      nextKeys.push(key);
    } else {
      nextKeys = nextKeys.filter((k) => k !== key);
    }
    const nextRows = dataSource.filter((r: any, idx: number) => nextKeys.includes(getRowKey(r, idx)));
    rowSelection.onChange(nextKeys, nextRows);
  };

  const handleSort = (colKey: string) => {
    if (sortColumnKey !== colKey) {
      setSortColumnKey(colKey);
      setSortOrder('ascend');
    } else if (sortOrder === 'ascend') {
      setSortOrder('descend');
    } else {
      setSortColumnKey(null);
      setSortOrder(null);
    }
  };

  const handleFilterIconClick = (e: React.MouseEvent, colKey: string) => {
    e.stopPropagation();
    if (openFilterColumnKey === colKey) {
      setOpenFilterColumnKey(null);
    } else {
      setOpenFilterColumnKey(colKey);
      setTempSelectedFilters(activeFilters[colKey] || []);
    }
  };

  const handleApplyFilters = (colKey: string, selectedValues: any[]) => {
    setActiveFilters((prev) => ({
      ...prev,
      [colKey]: selectedValues,
    }));
    setOpenFilterColumnKey(null);
  };

  // 1. Apply Filtering
  let processedData = [...dataSource];
  Object.keys(activeFilters).forEach((colKey) => {
    const selectedValues = activeFilters[colKey];
    if (selectedValues && selectedValues.length > 0) {
      const col = columns.find(c => (c.key || c.dataIndex) === colKey);
      if (col && col.onFilter) {
        processedData = processedData.filter((record) => {
          return selectedValues.some((val) => col.onFilter(val, record));
        });
      }
    }
  });

  // 2. Apply Sorting
  if (sortColumnKey && sortOrder) {
    const col = columns.find(c => (c.key || c.dataIndex) === sortColumnKey);
    if (col && typeof col.sorter === 'function') {
      processedData.sort((a, b) => {
        const res = col.sorter(a, b);
        return sortOrder === 'ascend' ? res : -res;
      });
    }
  }

  const total = pagination?.total || processedData.length;
  const pageData = isPaginationEnabled ? processedData.slice(startIdx, startIdx + pageSize) : processedData;

  const isAllSelected = rowSelection && pageData.length > 0 &&
    pageData.every((r: any, idx: number) => (rowSelection.selectedRowKeys || []).includes(getRowKey(r, startIdx + idx)));

  const sizeClass = size ? `ant-table-${size}` : 'ant-table-large';

  const SortCaret = ({ direction, active }: { direction: 'up' | 'down'; active: boolean }) => (
    <svg
      viewBox="0 0 1024 1024"
      width="8"
      height="8"
      style={{
        display: 'block',
        color: active ? 'var(--antd-primary, #009688)' : '#bfbfbf',
        transform: direction === 'down' ? 'rotate(180deg)' : 'none',
        transition: 'color 0.3s',
        marginTop: direction === 'down' ? 1 : 0,
      }}
    >
      <path d="M858.9 689L530.5 308.2c-9.4-10.9-26.3-10.9-35.7 0L165.1 689c-8 9.3-1.4 23.4 10.7 23.4h672.4c12.1 0 18.7-14.1 10.7-23.4z" fill="currentColor" />
    </svg>
  );

  const FilterIcon = ({ active }: { active: boolean }) => (
    <svg
      viewBox="64 64 896 896"
      width="11"
      height="11"
      style={{
        color: active ? 'var(--antd-primary, #009688)' : '#bfbfbf',
        transition: 'color 0.3s',
      }}
    >
      <path d="M880.1 154H143.9c-24.5 0-39.8 26.7-27.5 48L349 597.4V838c0 17.7 14.2 32 31.8 32h262.4c17.6 0 31.8-14.3 31.8-32V597.4L907.7 202c12.2-21.3-3-48-27.6-48zM604 564.9v239.1H420V564.9L228.3 226h567.4L604 564.9z" fill="currentColor" />
    </svg>
  );

  return (
    <div className={`ant-table-wrapper ${sizeClass} ${className}`} style={style}>
      <div className="ant-spin-nested-loading">
        <div className="ant-spin-container">
          <Spin spinning={!!loading}>
            <div className="ant-table">
              <div className="ant-table-container">
                <div className="ant-table-content" style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead className="ant-table-thead">
                      <tr>
                        {rowSelection && (
                          <th className="ant-table-selection-column" style={{ width: 32, padding: 8, textAlign: 'center' }}>
                            <Checkbox checked={isAllSelected} onChange={(e) => handleSelectAll(e, pageData)} />
                          </th>
                        )}
                        {columns.map((col: any, idx: number) => {
                          const colKey = col.key || col.dataIndex || String(idx);
                          const isSorted = sortColumnKey === colKey;
                          const hasFilter = !!col.filters;
                          const isFiltered = hasFilter && activeFilters[colKey] && activeFilters[colKey].length > 0;

                          let tooltipText = 'Nhấp để sắp xếp';
                          if (isSorted) {
                            if (sortOrder === 'ascend') tooltipText = 'Nhấp để sắp xếp giảm dần';
                            else if (sortOrder === 'descend') tooltipText = 'Nhấp để hủy sắp xếp';
                          } else {
                            tooltipText = 'Nhấp để sắp xếp tăng dần';
                          }

                          const headerContent = (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', position: 'relative' }}>
                              {col.sorter ? (
                                <Tooltip title={tooltipText}>
                                  <span
                                    style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', gap: 6, userSelect: 'none' }}
                                    onClick={() => handleSort(colKey)}
                                  >
                                    <span className="ant-table-header-cell-title">{col.title}</span>
                                    <span className="ant-table-column-sorter" style={{ display: 'inline-flex', flexDirection: 'column', justifyContent: 'center' }}>
                                      <SortCaret direction="up" active={isSorted && sortOrder === 'ascend'} />
                                      <SortCaret direction="down" active={isSorted && sortOrder === 'descend'} />
                                    </span>
                                  </span>
                                </Tooltip>
                              ) : (
                                <span className="ant-table-header-cell-title">{col.title}</span>
                              )}

                              {hasFilter && (
                                <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                                  <span
                                    className="ant-table-filter-trigger"
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      padding: '0 4px',
                                      borderRadius: 2,
                                      background: openFilterColumnKey === colKey ? '#e0f2f1' : 'transparent',
                                      cursor: 'pointer',
                                    }}
                                    onClick={(e) => handleFilterIconClick(e, colKey)}
                                  >
                                    <FilterIcon active={isFiltered} />
                                  </span>

                                  <TableFilterDropdown
                                    isOpen={openFilterColumnKey === colKey}
                                    filterDropdownRef={filterDropdownRef}
                                    filters={col.filters}
                                    tempSelectedFilters={tempSelectedFilters}
                                    setTempSelectedFilters={setTempSelectedFilters}
                                    onApply={(selected) => handleApplyFilters(colKey, selected)}
                                  />
                                </div>
                              )}
                            </div>
                          );

                          return (
                            <th
                              key={colKey}
                              style={{
                                textAlign: 'left',
                                background: 'var(--color-bg-sub, #f5f5f5)',
                                borderBottom: '1px solid var(--antd-border)',
                                padding: size === 'small' ? '4px 8px' : size === 'middle' ? '12px 12px' : '16px 16px',
                              }}
                            >
                              {headerContent}
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody className="ant-table-tbody">
                      {pageData.map((record: any, recordIdx: number) => {
                        const absIdx = startIdx + recordIdx;
                        const key = getRowKey(record, absIdx);
                        const isSelected = rowSelection && (rowSelection.selectedRowKeys || []).includes(key);
                        const rowProps = onRow ? onRow(record, absIdx) : {};

                        const customRowClass = rowClassName ? rowClassName(record, absIdx) : '';

                        return (
                          <tr
                            key={key}
                            data-row-key={key}
                            className={`ant-table-row ${isSelected ? 'ant-table-row-selected' : ''} ${customRowClass}`}
                            style={{ borderBottom: '1px solid var(--antd-border)' }}
                            {...rowProps}
                          >
                            {rowSelection && (
                              <td className="ant-table-selection-column" style={{ padding: 8, textAlign: 'center' }}>
                                <Checkbox
                                  checked={isSelected}
                                  onChange={(e) => handleSelectOne(record, absIdx, e.target.checked)}
                                />
                              </td>
                            )}
                            {columns.map((col: any, colIdx: number) => {
                              const text = col.dataIndex ? record[col.dataIndex] : undefined;
                              return (
                                <td
                                  key={col.key || col.dataIndex || colIdx}
                                  style={{
                                    padding: size === 'small' ? '4px 8px' : size === 'middle' ? '12px 12px' : '16px 16px',
                                  }}
                                >
                                  {col.render ? col.render(text, record, absIdx) : text}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                      {pageData.length === 0 && (
                        <tr className="ant-table-placeholder">
                          <td colSpan={columns.length + (rowSelection ? 1 : 0)} style={{ textAlign: 'center', padding: 24 }}>
                            <Empty />
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {isPaginationEnabled && (
              <div className="ant-pagination-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, background: '#fff', borderTop: '1px solid var(--antd-border)' }}>
                <div className="ant-pagination-total-text">
                  {pagination?.showTotal ? pagination.showTotal(total, [startIdx + 1, Math.min(startIdx + pageSize, total)]) : null}
                </div>
                <Pagination
                  current={current}
                  pageSize={pageSize}
                  total={total}
                  showSizeChanger={pagination?.showSizeChanger !== false}
                  onChange={(page, pSize) => pagination.onChange && pagination.onChange(page, pSize)}
                />
              </div>
            )}
          </Spin>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 28. Modal
// ==========================================
export const Modal: React.FC<any> = ({
  title,
  open,
  visible,
  onOk,
  onCancel,
  confirmLoading,
  okText = 'OK',
  cancelText = 'Cancel',
  width = 520,
  children,
  footer,
  closable = true,
  closeIcon,
  bodyStyle,
}) => {
  const isOpen = open !== undefined ? open : visible;
  const { shouldRender, animClass, overlayRef } = useOverlayAnimation(!!isOpen, 220);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel && onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!shouldRender) return null;

  return (
    <div className="ant-modal-root" style={{ position: 'fixed', inset: 0, zIndex: 1000 }}>
      <div
        className={`ant-modal-mask ${animClass === 'enter' ? 'k-mask-enter' : 'k-mask-exit'}`}
        onClick={onCancel}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000 }}
      />
      <div className="ant-modal-wrap" style={{ position: 'fixed', inset: 0, overflow: 'auto', outline: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div
          ref={overlayRef}
          className={`ant-modal ${animClass === 'enter' ? 'k-modal-enter' : 'k-modal-exit'}`}
          style={{
            width,
            background: '#fff',
            borderRadius: 8,
            boxShadow: 'var(--antd-shadow-base)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '90vh',
          }}
        >
          {closable !== false && (
            <button
              type="button"
              className="ant-modal-close custom-modal-close"
              onClick={onCancel}
              aria-label="Close"
              style={{ position: 'absolute', top: -11, right: -11 }}
            >
              {closeIcon ? (
                closeIcon
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              )}
            </button>
          )}

          {title && (
            <div className="ant-modal-header" style={{ padding: '20px 24px 8px 24px', fontWeight: 600, fontSize: 16 }}>
              <div className="ant-modal-title" style={{ color: 'var(--antd-text)', fontSize: 16, fontWeight: 600 }}>{title}</div>
            </div>
          )}

          <div className="ant-modal-body" style={{ padding: '8px 24px 20px 24px', overflowY: 'auto', flex: 1, color: 'var(--antd-text)', fontSize: 14, ...bodyStyle }}>
            {children}
          </div>

          {footer !== null && (
            <div className="ant-modal-footer" style={{ padding: '12px 24px 20px 24px', textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              {footer !== undefined ? (
                footer
              ) : (
                <>
                  <Button onClick={onCancel}>{cancelText}</Button>
                  <Button type="primary" loading={confirmLoading} onClick={onOk}>{okText}</Button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

(Modal as any).confirm = (config: any) => {
  const container = document.createElement('div');
  document.body.appendChild(container);

  const ConfirmModalWrapper = () => {
    const [open, setOpen] = useState(true);

    const handleClose = (isOk: boolean) => {
      setOpen(false);
      setTimeout(() => {
        if (isOk && config.onOk) config.onOk();
        if (!isOk && config.onCancel) config.onCancel();
        if (container.parentNode) {
          container.parentNode.removeChild(container);
        }
      }, 200);
    };

    return (
      <Modal
        open={open}
        title={config.title}
        onOk={() => handleClose(true)}
        onCancel={() => handleClose(false)}
        okText={config.okText || 'OK'}
        cancelText={config.cancelText || 'Cancel'}
        width={config.width || 420}
      >
        {config.content}
      </Modal>
    );
  };

  const root = createRoot(container);
  root.render(<ConfirmModalWrapper />);
};

// ==========================================
// 29. Tooltip
// ==========================================
export const Tooltip: React.FC<any> = ({ title, children, placement = 'top', overlayStyle, style }) => {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const { shouldRender, animClass } = useOverlayAnimation(visible, 100);

  const updateCoords = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;

      let top = rect.top + scrollY;
      let left = rect.left + scrollX + rect.width / 2;

      if (placement === 'top') {
        top = rect.top + scrollY;
      } else if (placement === 'bottom') {
        top = rect.bottom + scrollY;
      } else if (placement === 'left') {
        top = rect.top + scrollY + rect.height / 2;
        left = rect.left + scrollX;
      } else if (placement === 'right') {
        top = rect.top + scrollY + rect.height / 2;
        left = rect.right + scrollX;
      }

      setCoords({ top, left });
    }
  };

  useEffect(() => {
    if (visible) {
      updateCoords();
      window.addEventListener('scroll', updateCoords, true);
      window.addEventListener('resize', updateCoords);
      return () => {
        window.removeEventListener('scroll', updateCoords, true);
        window.removeEventListener('resize', updateCoords);
      };
    }
  }, [visible, placement]);

  const tooltipElement = shouldRender && title && createPortal(
    <div
      className={`ant-tooltip ${animClass === 'enter' ? 'k-tooltip-enter' : 'k-tooltip-exit'}`}
      style={{
        position: 'absolute',
        top: coords.top,
        left: coords.left,
        transform: placement === 'top'
          ? 'translate(-50%, -100%)'
          : placement === 'bottom'
            ? 'translate(-50%, 0)'
            : placement === 'left'
              ? 'translate(-100%, -50%)'
              : 'translate(0, -50%)',
        marginTop: placement === 'top' ? -8 : placement === 'bottom' ? 8 : 0,
        marginLeft: placement === 'left' ? -8 : placement === 'right' ? 8 : 0,
        background: 'rgba(0,0,0,0.85)',
        color: '#fff',
        padding: '6px 10px',
        borderRadius: 4,
        fontSize: 12,
        whiteSpace: 'nowrap',
        zIndex: 2000,
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        pointerEvents: 'none',
        ...overlayStyle
      }}
    >
      {title}
    </div>,
    document.body
  );

  return (
    <div
      ref={triggerRef}
      style={{ position: 'relative', display: 'inline-block', ...style }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {tooltipElement}
    </div>
  );
};

// ==========================================
// 30. Drawer
// ==========================================
export const Drawer: React.FC<any> = ({ title, open, onClose, width = 378, children, footer }) => {
  const { shouldRender, animClass, overlayRef } = useOverlayAnimation(!!open, 220);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose && onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!shouldRender) return null;

  return (
    <div className="ant-drawer-root" style={{ position: 'fixed', inset: 0, zIndex: 1000 }}>
      <div
        className={`ant-drawer-mask ${animClass === 'enter' ? 'k-mask-enter' : 'k-mask-exit'}`}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000 }}
      />
      <div
        ref={overlayRef}
        className={`ant-drawer-content-wrapper ${animClass === 'enter' ? 'k-drawer-enter' : 'k-drawer-exit'}`}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width,
          background: '#fff',
          zIndex: 1000,
          boxShadow: '-6px 0 16px rgba(0, 0, 0, 0.08)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div className="ant-drawer-header" style={{ padding: '16px 24px', borderBottom: '1px solid var(--antd-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="ant-drawer-title" style={{ fontWeight: 600, fontSize: 16 }}>{title}</div>
          <button
            type="button"
            className="ant-drawer-close custom-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="ant-drawer-body" style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
          {children}
        </div>
        {footer && (
          <div className="ant-drawer-footer" style={{ padding: '10px 24px', borderTop: '1px solid var(--antd-border)', background: '#fff' }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 31. Popconfirm
// ==========================================
export const Popconfirm: React.FC<any> = ({
  title,
  onConfirm,
  onCancel,
  okText = 'Yes',
  cancelText = 'No',
  children,
  okButtonProps,
}) => {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [arrowOffset, setArrowOffset] = useState(0);
  const [placement, setPlacement] = useState<'top' | 'bottom' | 'left' | 'right'>('top');
  const triggerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const { shouldRender: shouldRenderPopconfirm, animClass: popconfirmAnimClass, overlayRef: popconfirmOverlayRef } = useOverlayAnimation(open, 140);

  const updateCoords = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      
      const spaceTop = rect.top;
      const spaceBottom = window.innerHeight - rect.bottom;
      const spaceLeft = rect.left;
      const spaceRight = window.innerWidth - rect.right;
      
      let computedPlacement: 'top' | 'bottom' | 'left' | 'right' = 'top';
      
      if (spaceTop < 140) {
        if (spaceBottom >= 140) {
          computedPlacement = 'bottom';
        } else if (spaceLeft >= 280) {
          computedPlacement = 'left';
        } else if (spaceRight >= 280) {
          computedPlacement = 'right';
        } else {
          computedPlacement = 'bottom';
        }
      } else if (spaceRight < 160) {
        if (spaceLeft >= 280) {
          computedPlacement = 'left';
        } else if (spaceBottom >= 140) {
          computedPlacement = 'bottom';
        } else {
          computedPlacement = 'top';
        }
      } else if (spaceLeft < 160) {
        if (spaceRight >= 280) {
          computedPlacement = 'right';
        } else if (spaceBottom >= 140) {
          computedPlacement = 'bottom';
        } else {
          computedPlacement = 'top';
        }
      }
      
      setPlacement(computedPlacement);

      const popWidth = 270;
      const popHeight = popoverRef.current ? popoverRef.current.offsetHeight : 120;

      let top = rect.top + scrollY;
      let left = rect.left + scrollX;
      let calculatedArrowOffset = 0;

      if (computedPlacement === 'top' || computedPlacement === 'bottom') {
        const rawLeft = rect.left + rect.width / 2;
        const clampedLeft = Math.max(popWidth / 2 + 16, Math.min(window.innerWidth - popWidth / 2 - 16, rawLeft));
        left = clampedLeft + scrollX;
        calculatedArrowOffset = rawLeft - clampedLeft;

        if (computedPlacement === 'top') {
          top = rect.top + scrollY;
        } else {
          top = rect.bottom + scrollY;
        }
      } else if (computedPlacement === 'left' || computedPlacement === 'right') {
        const rawTop = rect.top + rect.height / 2;
        const clampedTop = Math.max(popHeight / 2 + 16, Math.min(window.innerHeight - popHeight / 2 - 16, rawTop));
        top = clampedTop + scrollY;
        calculatedArrowOffset = rawTop - clampedTop;

        if (computedPlacement === 'left') {
          left = rect.left + scrollX;
        } else {
          left = rect.right + scrollX;
        }
      }

      setCoords({ top, left });
      setArrowOffset(calculatedArrowOffset);
    }
  };

  useEffect(() => {
    if (open) {
      updateCoords();
      const timer = setTimeout(updateCoords, 10);
      window.addEventListener('scroll', updateCoords, true);
      window.addEventListener('resize', updateCoords);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('scroll', updateCoords, true);
        window.removeEventListener('resize', updateCoords);
      };
    }
  }, [open]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target as Node) &&
        popoverRef.current && !popoverRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const popoverElement = shouldRenderPopconfirm && createPortal(
    <div
      ref={(node) => {
        popoverRef.current = node;
        popconfirmOverlayRef.current = node;
      }}
      className={`ant-popover ${popconfirmAnimClass === 'enter' ? 'k-pop-enter' : 'k-pop-exit'}`}
      style={{
        position: 'absolute',
        top: coords.top,
        left: coords.left,
        transform: 
          placement === 'left' ? 'translate(calc(-100% - 8px), -50%)' : 
          placement === 'right' ? 'translate(8px, -50%)' :
          placement === 'bottom' ? 'translate(-50%, 8px)' :
          'translate(-50%, calc(-100% - 8px))',
        zIndex: 9999,
        width: 270,
        boxSizing: 'border-box',
        pointerEvents: 'auto',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="ant-popover-content"
        style={{
          background: '#ffffff',
          border: '1px solid var(--antd-border)',
          borderRadius: 6,
          boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08)',
          padding: 12,
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div className="ant-popover-inner-content">
          <div style={{ display: 'flex', gap: 8, alignItems: 'start', fontSize: 14 }}>
            <span style={{ color: 'var(--antd-warning)', fontWeight: 'bold' }}>⚠</span>
            <div style={{ color: 'var(--antd-text)', wordBreak: 'break-word', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.4' }}>{title}</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
            <Button size="small" onClick={() => { setOpen(false); onCancel && onCancel(); }}>
              {cancelText}
            </Button>
            <Button type="primary" size="small" onClick={() => { setOpen(false); onConfirm && onConfirm(); }} {...okButtonProps}>
              {okText}
            </Button>
          </div>
        </div>
      </div>
      {/* Dynamic Arrow Pointer */}
      <div
        style={{
          position: 'absolute',
          width: 8,
          height: 8,
          background: '#ffffff',
          transform: 'rotate(45deg)',
          zIndex: 3,
          boxSizing: 'border-box',
          ...(
            placement === 'top' ? {
              bottom: -4,
              left: `calc(50% + ${arrowOffset}px)`,
              marginLeft: -4,
              borderRight: '1px solid var(--antd-border)',
              borderBottom: '1px solid var(--antd-border)',
            } : placement === 'bottom' ? {
              top: -4,
              left: `calc(50% + ${arrowOffset}px)`,
              marginLeft: -4,
              borderLeft: '1px solid var(--antd-border)',
              borderTop: '1px solid var(--antd-border)',
            } : placement === 'left' ? {
              right: -4,
              top: `calc(50% + ${arrowOffset}px)`,
              marginTop: -4,
              borderRight: '1px solid var(--antd-border)',
              borderTop: '1px solid var(--antd-border)',
            } : { // right
              left: -4,
              top: `calc(50% + ${arrowOffset}px)`,
              marginTop: -4,
              borderLeft: '1px solid var(--antd-border)',
              borderBottom: '1px solid var(--antd-border)',
            }
          )
        }}
      />
    </div>,
    document.body
  );

  return (
    <>
      <div
        ref={triggerRef}
        onClick={() => setOpen(!open)}
        style={{ display: 'inline-block', cursor: 'pointer' }}
      >
        {children}
      </div>
      {popoverElement}
    </>
  );
};

// ==========================================
// 32. Skeleton
// ==========================================
export const Skeleton: React.FC<any> = ({ active, children, loading = true }) => {
  if (!loading) return <>{children}</>;
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12, opacity: active ? 0.7 : 1 }}>
      <div style={{ height: 16, background: '#f2f2f2', borderRadius: 4, width: '40%' }} />
      <div style={{ height: 16, background: '#f2f2f2', borderRadius: 4, width: '100%' }} />
      <div style={{ height: 16, background: '#f2f2f2', borderRadius: 4, width: '80%' }} />
    </div>
  );
};

// ==========================================
// 33. List & List.Item & Meta
// ==========================================
export const List: React.FC<any> & { Item: React.FC<any> } = ({ dataSource = [], renderItem, header, footer, style }) => {
  return (
    <div className="ant-list" style={style}>
      {header && <div className="ant-list-header" style={{ padding: '12px 24px', borderBottom: '1px solid var(--antd-border)' }}>{header}</div>}
      <div className="ant-list-items">
        {dataSource.map((item: any, idx: number) => renderItem(item, idx))}
      </div>
      {footer && <div className="ant-list-footer" style={{ padding: '12px 24px', borderTop: '1px solid var(--antd-border)' }}>{footer}</div>}
    </div>
  );
};

List.Item = ({ children, actions, style }) => {
  return (
    <div className="ant-list-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px', borderBottom: '1px solid var(--antd-border)', ...style }}>
      <div className="ant-list-item-content" style={{ flex: 1 }}>{children}</div>
      {actions && (
        <ul className="ant-list-item-action" style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0, gap: 16 }}>
          {actions.map((act: any, idx: number) => (
            <li key={idx}>{act}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

const ListItemMeta: React.FC<any> = ({ avatar, title, description }) => {
  return (
    <div className="ant-list-item-meta" style={{ display: 'flex', gap: 16, alignItems: 'start' }}>
      {avatar && <div className="ant-list-item-meta-avatar">{avatar}</div>}
      <div className="ant-list-item-meta-content" style={{ flex: 1 }}>
        {title && <h4 className="ant-list-item-meta-title" style={{ margin: '0 0 4px 0', fontSize: 14 }}>{title}</h4>}
        {description && <div className="ant-list-item-meta-description" style={{ color: 'var(--antd-text-secondary)', fontSize: 13 }}>{description}</div>}
      </div>
    </div>
  );
};
(List.Item as any).Meta = ListItemMeta;

// ==========================================
// 34. Breadcrumb
// ==========================================
export const Breadcrumb: React.FC<any> = ({ items = [] }) => {
  return (
    <nav className="ant-breadcrumb" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8, fontSize: 14 }}>
      {items.map((item: any, idx: number) => (
        <React.Fragment key={idx}>
          {idx > 0 && <span className="ant-breadcrumb-separator" style={{ color: 'var(--antd-text-secondary)' }}>/</span>}
          <span className="ant-breadcrumb-link" style={{ color: idx === items.length - 1 ? 'var(--antd-text)' : 'var(--color-accent, #009688)' }}>
            {item.title}
          </span>
        </React.Fragment>
      ))}
    </nav>
  );
};

// ==========================================
// 35. Tree
// ==========================================
export const Tree: React.FC<any> = ({
  treeData = [],
  checkedKeys = [],
  expandedKeys = [],
  onCheck,
  onExpand,
  checkable,
  selectable,
  selectedKeys = [],
  onSelect,
}) => {
  const [expanded, setExpanded] = useState<string[]>(expandedKeys);

  const toggleExpand = (key: string) => {
    let nextExpanded = [...expanded];
    if (nextExpanded.includes(key)) {
      nextExpanded = nextExpanded.filter((k) => k !== key);
    } else {
      nextExpanded.push(key);
    }
    setExpanded(nextExpanded);
    onExpand && onExpand(nextExpanded);
  };

  const handleCheck = (key: string, checked: boolean) => {
    if (!onCheck) return;
    let nextChecked = [...checkedKeys];
    if (checked) {
      nextChecked.push(key);
    } else {
      nextChecked = nextChecked.filter((k) => k !== key);
    }
    onCheck(nextChecked);
  };

  const handleSelect = (key: string) => {
    if (!onSelect) return;
    onSelect([key]);
  };

  const renderNode = (node: any, depth = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expanded.includes(node.key);
    const isChecked = checkedKeys.includes(node.key);
    const isSelected = selectedKeys.includes(node.key);

    return (
      <div key={node.key} style={{ paddingLeft: depth * 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', height: 28, gap: 4 }}>
          {hasChildren ? (
            <span
              onClick={() => toggleExpand(node.key)}
              style={{ cursor: 'pointer', width: 16, height: 16, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s', transform: isExpanded ? 'rotate(90deg)' : 'none' }}
            >
              ▶
            </span>
          ) : (
            <span style={{ width: 16 }} />
          )}

          {checkable && (
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => handleCheck(node.key, e.target.checked)}
              style={{ margin: 0 }}
            />
          )}

          <span
            onClick={() => handleSelect(node.key)}
            style={{
              cursor: selectable ? 'pointer' : 'default',
              padding: '2px 6px',
              borderRadius: 4,
              background: isSelected ? 'rgba(22, 119, 255,0.15)' : 'transparent',
              color: isSelected ? 'var(--color-accent, #009688)' : 'inherit',
            }}
          >
            {node.title}
          </span>
        </div>

        {hasChildren && isExpanded && (
          <div>
            {node.children.map((child: any) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return <div className="ant-tree">{treeData.map((node: any) => renderNode(node))}</div>;
};

// ==========================================
// 36. Segmented
// ==========================================
export const Segmented: React.FC<any> = ({ options = [], value, onChange }) => {
  const [localVal, setLocalVal] = useState(options[0]);
  const currentVal = value !== undefined ? value : localVal;

  const handleSelect = (val: any) => {
    if (onChange) onChange(val);
    else setLocalVal(val);
  };

  return (
    <div className="ant-segmented" style={{ display: 'inline-flex', padding: 2, background: 'rgba(0,0,0,0.05)', borderRadius: 6, gap: 2 }}>
      {options.map((opt: any) => {
        const val = typeof opt === 'object' ? opt.value : opt;
        const label = typeof opt === 'object' ? opt.label : opt;
        const isSelected = val === currentVal;
        return (
          <div
            key={String(val)}
            onClick={() => handleSelect(val)}
            style={{
              padding: '4px 12px',
              borderRadius: 4,
              cursor: 'pointer',
              background: isSelected ? '#fff' : 'transparent',
              boxShadow: isSelected ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              fontWeight: isSelected ? 500 : 'normal',
              fontSize: 13,
              transition: 'all 0.15s',
            }}
          >
            {label}
          </div>
        );
      })}
    </div>
  );
};

// ==========================================
// 37. AutoComplete
// ==========================================
export const AutoComplete: React.FC<any> = ({ options = [], value, onChange, placeholder, style }) => {
  const [open, setOpen] = useState(false);
  const [filtered, setFiltered] = useState(options);
  const containerRef = useRef<HTMLDivElement>(null);
  const { shouldRender: shouldRenderAuto, animClass: autoAnimClass, overlayRef: autoOverlayRef } = useOverlayAnimation(open && filtered.length > 0, 130);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange && onChange(val);
    const matched = options.filter((opt: any) => String(opt.value).toLowerCase().includes(val.toLowerCase()));
    setFiltered(matched);
    setOpen(true);
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', ...style }}>
      <Input
        value={value}
        onChange={handleInputChange}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
      />
      {shouldRenderAuto && (
        <div
          ref={autoOverlayRef}
          className={`${autoAnimClass === 'enter' ? 'k-select-enter' : 'k-select-exit'}`}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: '#fff',
            border: '1px solid var(--antd-border)',
            borderRadius: 4,
            boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
            zIndex: 1000,
            maxHeight: 200,
            overflowY: 'auto',
            transformOrigin: 'top center',
          }}
        >
          {filtered.map((opt: any) => (
            <div
              key={opt.value}
              onClick={() => {
                onChange && onChange(opt.value);
                setOpen(false);
              }}
              style={{ padding: '8px 12px', cursor: 'pointer' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#f5f5f5')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              {opt.value}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ==========================================
// 38. Timeline
// ==========================================
export const Timeline: React.FC<any> = ({ items = [] }) => {
  return (
    <div className="ant-timeline" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {items.map((item: any, idx: number) => (
        <li key={idx} style={{ display: 'flex', gap: 16, paddingBottom: 20, position: 'relative' }}>
          {idx < items.length - 1 && (
            <div style={{ position: 'absolute', top: 16, left: 5, bottom: -4, width: 2, background: 'var(--antd-border)' }} />
          )}
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--antd-primary)', border: '2px solid #fff', marginTop: 4, zIndex: 1, flexShrink: 0 }} />
          <div style={{ flex: 1, fontSize: 14 }}>
            {item.children}
          </div>
        </li>
      ))}
    </div>
  );
};

// ==========================================
// 39. Tabs
// ==========================================
export const Tabs: React.FC<any> = ({ items = [], activeKey, onChange, tabPosition = 'top', style, hideHeader }) => {
  const [localActiveKey, setLocalActiveKey] = useState(items[0]?.key);
  const currentKey = activeKey !== undefined ? activeKey : localActiveKey;
  const listRef = useRef<HTMLDivElement>(null);
  const [inkStyle, setInkStyle] = useState<React.CSSProperties>({ opacity: 0 });
  const isFirstRender = useRef(true);

  const handleTabClick = (key: string) => {
    if (onChange) onChange(key);
    else setLocalActiveKey(key);
  };

  const isLeft = tabPosition === 'left';

  useEffect(() => {
    const updateInk = () => {
      const activeEl = listRef.current?.querySelector('.ant-tabs-tab-active') as HTMLElement;
      if (activeEl) {
        if (isLeft) {
          setInkStyle({
            position: 'absolute',
            top: activeEl.offsetTop,
            height: activeEl.offsetHeight,
            right: 0,
            width: 2,
            opacity: 1,
            transition: isFirstRender.current ? 'opacity 0.15s ease' : 'all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)',
          });
        } else {
          setInkStyle({
            position: 'absolute',
            left: activeEl.offsetLeft,
            width: activeEl.offsetWidth,
            bottom: 0,
            height: 2,
            opacity: 1,
            transition: isFirstRender.current ? 'opacity 0.15s ease' : 'all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)',
          });
        }
        if (isFirstRender.current) {
          setTimeout(() => {
            isFirstRender.current = false;
          }, 50);
        }
      }
    };

    updateInk();
    const timer = setTimeout(updateInk, 0); // extra layout recalculation pass

    window.addEventListener('resize', updateInk);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateInk);
    };
  }, [currentKey, isLeft, items]);

  return (
    <div
      className={`ant-tabs ant-tabs-${tabPosition}`}
      style={{
        display: isLeft ? 'flex' : hideHeader ? 'flex' : 'block',
        flexDirection: hideHeader ? 'column' : isLeft ? 'row' : undefined,
        height: hideHeader ? '100%' : undefined,
        ...style
      }}
    >
      {!hideHeader && (
        <div
          className="ant-tabs-nav"
          style={{
            display: 'flex',
            flexDirection: isLeft ? 'column' : 'row',
            borderBottom: 'none',
            borderRight: 'none',
            paddingBottom: isLeft ? 0 : 8,
            paddingRight: isLeft ? 12 : 0,
            marginRight: isLeft ? 16 : 0,
          }}
        >
          <div className="ant-tabs-nav-wrap">
            <div
              ref={listRef}
              className="ant-tabs-nav-list"
              style={{
                display: 'flex',
                gap: 8,
                flexDirection: isLeft ? 'column' : 'row',
                position: 'relative',
              }}
            >
              {items.map((tab: any) => {
                if (!tab) return null;
                const isActive = tab.key === currentKey;
                return (
                  <div
                    key={tab.key}
                    onClick={() => !tab.disabled && handleTabClick(tab.key)}
                    className={`ant-tabs-tab ${isActive ? 'ant-tabs-tab-active' : ''} ${tab.disabled ? 'ant-tabs-tab-disabled' : ''}`}
                  >
                    <button type="button" disabled={tab.disabled} role="tab" className="ant-tabs-tab-btn" style={{ background: 'transparent', border: 'none', cursor: tab.disabled ? 'not-allowed' : 'pointer', outline: 'none' }}>
                      {tab.label}
                    </button>
                  </div>
                );
              })}
              <div className="ant-tabs-ink-bar" style={inkStyle} />
            </div>
          </div>
        </div>
      )}
      <div className="ant-tabs-content-holder" style={hideHeader ? { flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' } : undefined}>
        <div className="ant-tabs-content" style={{ flex: 1, minHeight: 0, padding: hideHeader ? 0 : '6px 0', ...(hideHeader ? { display: 'flex', flexDirection: 'column', height: '100%' } : {}) }}>
          {items.find((tab: any) => tab && tab.key === currentKey)?.children}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 40. Upload
// ==========================================
export const Upload: React.FC<any> = ({ children, customRequest, onChange, beforeUpload, maxCount }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    for (const file of files) {
      if (beforeUpload) {
        const allowed = await beforeUpload(file, files);
        if (allowed === false) continue;
      }

      if (customRequest) {
        customRequest({
          file,
          onSuccess: (res: any) => {
            onChange && onChange({ file, fileList: [file] });
          },
          onError: (err: any) => {
            console.error(err);
          }
        });
      } else {
        onChange && onChange({ file, fileList: [file] });
      }
    }
  };

  return (
    <div onClick={() => fileInputRef.current?.click()} style={{ display: 'inline-block' }}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        multiple={maxCount ? maxCount > 1 : true}
      />
      {children}
    </div>
  );
};

// ==========================================
// 41. message
// ==========================================
let messageContainer: HTMLDivElement | null = null;
const activeMessages = new Map<string | number, HTMLDivElement>();
let msgId = 0;

const createMessage = (content: any, type: 'success' | 'error' | 'warning' | 'info' | 'loading') => {
  let contentText = '';
  let msgKey: string | number | undefined = undefined;
  let duration = 3;

  if (typeof content === 'object' && content !== null) {
    contentText = content.content || '';
    msgKey = content.key;
    if (typeof content.duration === 'number') {
      duration = content.duration;
    }
  } else {
    contentText = String(content);
  }

  if (!messageContainer) {
    messageContainer = document.createElement('div');
    messageContainer.style.position = 'fixed';
    messageContainer.style.top = '16px';
    messageContainer.style.left = '50%';
    messageContainer.style.transform = 'translateX(-50%)';
    messageContainer.style.zIndex = '9999';
    messageContainer.style.display = 'flex';
    messageContainer.style.flexDirection = 'column';
    messageContainer.style.gap = '10px';
    messageContainer.style.pointerEvents = 'none';
    document.body.appendChild(messageContainer);
  }

  let msgEl: HTMLDivElement;
  let isUpdate = false;

  if (msgKey !== undefined && activeMessages.has(msgKey)) {
    msgEl = activeMessages.get(msgKey)!;
    isUpdate = true;
  } else {
    msgEl = document.createElement('div');
    msgEl.style.background = '#fff';
    msgEl.style.padding = '9px 16px';
    msgEl.style.borderRadius = '8px';
    msgEl.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12)';
    msgEl.style.display = 'flex';
    msgEl.style.alignItems = 'center';
    msgEl.style.gap = '8px';
    msgEl.style.fontSize = '14px';
    msgEl.style.pointerEvents = 'auto';
    msgEl.style.transition = 'all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)';
    msgEl.style.transform = 'translateY(-20px)';
    msgEl.style.opacity = '0';
  }

  let iconSvg = '';
  let color = '';

  if (type === 'success') {
    iconSvg = `<svg viewBox="64 64 896 896" width="16" height="16" fill="currentColor" style="display: inline-block; vertical-align: middle;"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 01-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z"></path></svg>`;
    color = 'var(--antd-success, #52c41a)';
  } else if (type === 'error') {
    iconSvg = `<svg viewBox="64 64 896 896" width="16" height="16" fill="currentColor" style="display: inline-block; vertical-align: middle;"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-60.6 60.6L512 638.1 407.2 742.8l-60.6-60.6L451.3 577 346.6 472.2l60.6-60.6L512 515.9l104.8-104.7 60.6 60.6L572.7 577l104.7 104.8z"></path></svg>`;
    color = 'var(--antd-danger, #ff4d4f)';
  } else if (type === 'warning') {
    iconSvg = `<svg viewBox="64 64 896 896" width="16" height="16" fill="currentColor" style="display: inline-block; vertical-align: middle;"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm-32 232c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v328c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V296zm32 440a48.01 48.01 0 010-96 48.01 48.01 0 010 96z"></path></svg>`;
    color = 'var(--antd-warning, #faad14)';
  } else if (type === 'loading') {
    iconSvg = `<svg viewBox="0 0 1024 1024" width="16" height="16" fill="currentColor" style="display: inline-block; vertical-align: middle; animation: spin 1s infinite linear;" class="anticon-spin"><path d="M988 548c-19.9 0-36-16.1-36-36 0-226.2-184-410.2-410.2-410.2-19.9 0-36-16.1-36-36s16.1-36 36-36c265.9 0 482.2 216.3 482.2 482.2 0 19.9-16.1 36-36 36z"></path></svg>`;
    color = 'var(--antd-primary, #009688)';
  } else {
    iconSvg = `<svg viewBox="64 64 896 896" width="16" height="16" fill="currentColor" style="display: inline-block; vertical-align: middle;"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm32 664c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V456c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272zm-32-344a48.01 48.01 0 010-96 48.01 48.01 0 010 96z"></path></svg>`;
    color = 'var(--antd-primary, #009688)';
  }

  msgEl.innerHTML = `
    <span style="color: ${color}; display: inline-flex; align-items: center;">${iconSvg}</span>
    <span style="color: var(--antd-text); font-weight: normal;">${contentText}</span>
  `;

  if (!isUpdate) {
    messageContainer.appendChild(msgEl);
    setTimeout(() => {
      msgEl.style.transform = 'translateY(0)';
      msgEl.style.opacity = '1';
    }, 10);
  } else {
    msgEl.style.transform = 'translateY(0)';
    msgEl.style.opacity = '1';
  }

  if (msgKey !== undefined) {
    activeMessages.set(msgKey, msgEl);
  }

  const oldTimeout = (msgEl as any).timeoutId;
  if (oldTimeout) {
    clearTimeout(oldTimeout);
  }

  const removeMsg = () => {
    msgEl.style.transform = 'translateY(-20px)';
    msgEl.style.opacity = '0';
    setTimeout(() => {
      msgEl.remove();
      if (msgKey !== undefined) {
        activeMessages.delete(msgKey);
      }
    }, 300);
  };

  if (duration > 0) {
    (msgEl as any).timeoutId = setTimeout(removeMsg, duration * 1000);
  }
};

export const message = {
  success: (content: any) => createMessage(content, 'success'),
  error: (content: any) => createMessage(content, 'error'),
  warning: (content: any) => createMessage(content, 'warning'),
  info: (content: any) => createMessage(content, 'info'),
  loading: (content: any) => createMessage(content, 'loading'),
};

// ==========================================
// 42. Row & Col
// ==========================================
export const RowContext = createContext<{ gutter?: [number, number] }>({});

export const Row: React.FC<any> = ({
  children,
  gutter = 0,
  align,
  justify,
  style,
  className = '',
}) => {
  const gutterVal: [number, number] = Array.isArray(gutter)
    ? gutter
    : typeof gutter === 'number'
      ? [gutter, gutter]
      : [0, 0];

  const flexAlign = align === 'middle' ? 'center' : align;
  const flexJustify = justify === 'start' || justify === 'end' ? `flex-${justify}` : justify;

  return (
    <RowContext.Provider value={{ gutter: gutterVal }}>
      <div
        className={`ant-row ${className}`}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          marginLeft: -gutterVal[0] / 2,
          marginRight: -gutterVal[0] / 2,
          rowGap: gutterVal[1],
          alignItems: flexAlign,
          justifyContent: flexJustify,
          ...style,
        }}
      >
        {children}
      </div>
    </RowContext.Provider>
  );
};

export const Col: React.FC<any> = ({
  children,
  span,
  xs,
  sm,
  md,
  lg,
  xl,
  xxl,
  style,
  className = '',
}) => {
  const { gutter } = useContext(RowContext);
  const paddingX = gutter ? gutter[0] / 2 : 0;

  let widthPercent: string | undefined;
  if (span !== undefined) {
    widthPercent = `${(span / 24) * 100}%`;
  } else {
    // Basic media query width detection mock or just 100% width
    const screenVal = xxl || xl || lg || md || sm || xs;
    if (typeof screenVal === 'number') {
      widthPercent = `${(screenVal / 24) * 100}%`;
    }
  }

  return (
    <div
      className={`ant-col ${className}`}
      style={{
        boxSizing: 'border-box',
        paddingLeft: paddingX,
        paddingRight: paddingX,
        flex: widthPercent ? `0 0 ${widthPercent}` : '1',
        maxWidth: widthPercent,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// ==========================================
// 43. Collapse & Collapse.Panel
// ==========================================
interface CollapseProps {
  children?: React.ReactNode;
  activeKey?: string | string[];
  defaultActiveKey?: string | string[];
  onChange?: (key: string | string[]) => void;
  ghost?: boolean;
  style?: React.CSSProperties;
}

export const Collapse: React.FC<CollapseProps> & { Panel: React.FC<any> } = ({
  children,
  activeKey,
  defaultActiveKey,
  onChange,
  ghost,
  style,
}) => {
  const initKeys = activeKey !== undefined
    ? activeKey
    : defaultActiveKey !== undefined
      ? defaultActiveKey
      : [];

  const [keys, setKeys] = useState<string[]>(Array.isArray(initKeys) ? initKeys.map(String) : [String(initKeys)]);

  useEffect(() => {
    if (activeKey !== undefined) {
      setKeys(Array.isArray(activeKey) ? activeKey.map(String) : [String(activeKey)]);
    }
  }, [activeKey]);

  const togglePanel = (key: string) => {
    let nextKeys = [...keys];
    if (nextKeys.includes(key)) {
      nextKeys = nextKeys.filter((k) => k !== key);
    } else {
      nextKeys.push(key);
    }
    if (activeKey === undefined) {
      setKeys(nextKeys);
    }
    onChange && onChange(nextKeys);
  };

  return (
    <div className={`ant-collapse ${ghost ? 'ant-collapse-ghost' : ''}`} style={style}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          const panelKey = String(child.key || '');
          const isActive = keys.includes(panelKey);
          return React.cloneElement(child as React.ReactElement<any>, {
            isActive,
            onToggle: () => togglePanel(panelKey),
            ghost,
          });
        }
        return child;
      })}
    </div>
  );
};

Collapse.Panel = ({ header, children, isActive, onToggle, ghost, style }) => {
  return (
    <div
      className={`ant-collapse-item ${isActive ? 'ant-collapse-item-active' : ''}`}
      style={{
        borderBottom: ghost ? 'none' : '1px solid var(--antd-border)',
        ...style,
      }}
    >
      <div
        className="ant-collapse-header"
        onClick={onToggle}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '12px 16px',
          cursor: 'pointer',
          background: ghost ? 'transparent' : '#fafafa',
          fontWeight: 500,
          gap: 8,
          userSelect: 'none',
        }}
      >
        <span style={{ transition: 'transform 0.2s', transform: isActive ? 'rotate(90deg)' : 'none', fontSize: 10 }}>▶</span>
        <div style={{ flex: 1 }}>{header}</div>
      </div>
      {isActive && (
        <div
          className="ant-collapse-content"
          style={{
            padding: '16px',
            background: '#fff',
            borderTop: ghost ? 'none' : '1px solid var(--antd-border)',
          }}
        >
          <div className="ant-collapse-content-box">{children}</div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 44. Radio & Radio.Group
// ==========================================
export const Radio: React.FC<{ checked?: boolean; onChange?: (e: any) => void; disabled?: boolean; children?: React.ReactNode; style?: React.CSSProperties; value?: any }> = ({ checked, onChange, disabled, children, style, value }) => {
  const isChecked = !!checked;
  return (
    <label className={`ant-radio-wrapper ${disabled ? 'ant-radio-wrapper-disabled' : ''}`} style={{ display: 'inline-flex', alignItems: 'center', cursor: disabled ? 'not-allowed' : 'pointer', ...style }}>
      <span className={`ant-radio ${isChecked ? 'ant-radio-checked' : ''} ${disabled ? 'ant-radio-disabled' : ''}`}>
        <input
          type="radio"
          checked={isChecked}
          disabled={disabled}
          onChange={(e) => onChange && onChange({ target: { checked: e.target.checked, value } })}
          className="ant-radio-input"
        />
        <span className="ant-radio-inner" />
      </span>
      {children !== undefined && <span>{children}</span>}
    </label>
  );
};

const RadioGroupContext = createContext<{ value?: any; onChange?: (e: any) => void; disabled?: boolean }>({});

export const RadioGroup: React.FC<{ value?: any; onChange?: (e: any) => void; disabled?: boolean; children?: React.ReactNode; style?: React.CSSProperties }> = ({ value, onChange, disabled, children, style }) => {
  return (
    <RadioGroupContext.Provider value={{ value, onChange, disabled }}>
      <div className="ant-radio-group" style={{ display: 'inline-flex', gap: 16, ...style }}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            const childProps = child.props as any;
            return React.cloneElement(child, {
              checked: String(value) === String(childProps.value),
              disabled: disabled || childProps.disabled,
              onChange: (e: any) => {
                onChange && onChange(e);
                childProps.onChange && childProps.onChange(e);
              }
            });
          }
          return child;
        })}
      </div>
    </RadioGroupContext.Provider>
  );
};
(Radio as any).Group = RadioGroup;

// ==========================================
// 45. Steps
// ==========================================
interface StepItem {
  title: React.ReactNode;
  description?: React.ReactNode;
  status?: 'finish' | 'process' | 'wait';
}
interface StepsProps {
  current?: number;
  items?: StepItem[];
  style?: React.CSSProperties;
  className?: string;
}

export const Steps: React.FC<StepsProps> = ({ current = 0, items = [], style, className = '' }) => {
  return (
    <div className={`ant-steps ${className}`} style={{ display: 'flex', alignItems: 'center', width: '100%', gap: 16, ...style }}>
      {items.map((item, idx) => {
        let status: 'finish' | 'process' | 'wait' = 'wait';
        if (item.status) {
          status = item.status;
        } else {
          if (idx < current) status = 'finish';
          else if (idx === current) status = 'process';
        }

        const isLast = idx === items.length - 1;

        return (
          <React.Fragment key={idx}>
            <div className={`ant-steps-item ant-steps-item-${status}`} style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <div
                className="ant-steps-item-icon"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  fontWeight: 500,
                  transition: 'all 0.2s',
                  ...(status === 'finish' ? {
                    background: '#e0f2f1',
                    border: '1px solid #b2dfdb',
                    color: '#009688',
                  } : status === 'process' ? {
                    background: '#009688',
                    border: '1px solid #009688',
                    color: '#ffffff',
                  } : {
                    background: '#f5f5f5',
                    border: '1px solid #d9d9d9',
                    color: 'rgba(0, 0, 0, 0.45)',
                  })
                }}
              >
                {status === 'finish' ? (
                  <span style={{ fontSize: 12, fontWeight: 'bold' }}>✓</span>
                ) : (
                  idx + 1
                )}
              </div>
              <div
                className="ant-steps-item-title"
                style={{
                  fontSize: 14,
                  fontWeight: status === 'process' ? 600 : 400,
                  color: status === 'wait' ? 'rgba(0, 0, 0, 0.45)' : 'rgba(0, 0, 0, 0.88)',
                }}
              >
                {item.title}
              </div>
            </div>
            {!isLast && (
              <div
                className="ant-steps-item-tail"
                style={{
                  flex: 1,
                  height: 1,
                  background: status === 'finish' ? '#009688' : '#f0f0f0',
                  transition: 'background 0.2s',
                  minWidth: 40,
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// ==========================================
// 46. Popover
// ==========================================
export const Popover: React.FC<{
  title?: React.ReactNode;
  content?: React.ReactNode;
  open?: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  arrow?: boolean;
}> = ({ title, content, open, onClose, children, style, placement = 'top', arrow = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeOpen = open !== undefined ? open : isOpen;
  const { shouldRender: shouldRenderPopover, animClass: popoverAnimClass, overlayRef: popoverOverlayRef } = useOverlayAnimation(activeOpen, 140);

  useEffect(() => {
    if (open !== undefined) setIsOpen(open);
  }, [open]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        if (open === undefined) setIsOpen(false);
        onClose && onClose();
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [open, onClose]);

  const toggle = () => {
    if (open === undefined) setIsOpen(!isOpen);
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-block' }}>
      <div onClick={toggle} style={{ display: 'inline-block' }}>
        {children}
      </div>
      {shouldRenderPopover && (
        <div
          ref={popoverOverlayRef}
          className={`ant-popover ant-popover-placement-${placement} ${popoverAnimClass === 'enter' ? 'k-pop-enter' : 'k-pop-exit'}`}
          style={{
            position: 'absolute',
            ...(placement === 'top' ? { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: 12 } : {}),
            ...(placement === 'bottom' ? { top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: 12 } : {}),
            background: '#ffffff',
            border: 'none',
            borderRadius: 8,
            boxShadow: '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12)',
            zIndex: 1050,
            minWidth: 180,
            padding: 0,
            color: 'rgba(0, 0, 0, 0.88)',
            ...style,
          }}
        >
          <div className="ant-popover-inner" style={{ padding: '12px 16px' }}>
            {title && (
              <div className="ant-popover-title" style={{ fontWeight: 600, fontSize: 14, marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{title}</span>
                {onClose && (
                  <span onClick={(e) => { e.stopPropagation(); setIsOpen(false); onClose(); }} style={{ cursor: 'pointer', color: 'rgba(0,0,0,0.45)', fontWeight: 'normal', fontSize: 16 }}>×</span>
                )}
              </div>
            )}
            <div className="ant-popover-inner-content" style={{ fontSize: 14 }}>
              {content}
            </div>
          </div>
          {arrow && (
            <div
              className="ant-popover-arrow"
              style={{
                position: 'absolute',
                width: 8,
                height: 8,
                background: '#ffffff',
                transform: 'rotate(45deg)',
                boxShadow: placement === 'top' ? '2px 2px 5px rgba(0,0,0,0.03)' : '-1px -1px 3px rgba(0,0,0,0.03)',
                ...(placement === 'top' ? { bottom: -4, left: 'calc(50% - 4px)', borderRight: '1px solid rgba(0,0,0,0.05)', borderBottom: '1px solid rgba(0,0,0,0.05)' } : {}),
                ...(placement === 'bottom' ? { top: -4, left: 'calc(50% - 4px)', borderLeft: '1px solid rgba(0,0,0,0.05)', borderTop: '1px solid rgba(0,0,0,0.05)' } : {}),
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

// ==========================================
// 47. Tour
// ==========================================
interface TourProps {
  open?: boolean;
  current?: number;
  onClose?: () => void;
  onChange?: (current: number) => void;
  steps: {
    title: React.ReactNode;
    description: React.ReactNode;
    cover?: React.ReactNode;
  }[];
  style?: React.CSSProperties;
}

export const Tour: React.FC<TourProps> = ({ open, current = 0, onClose, onChange, steps = [], style }) => {
  if (!open || steps.length === 0) return null;
  const step = steps[current] || steps[0];

  const handleNext = () => {
    if (current < steps.length - 1) {
      onChange && onChange(current + 1);
    } else {
      onClose && onClose();
    }
  };

  const handlePrev = () => {
    if (current > 0) {
      onChange && onChange(current - 1);
    }
  };

  return (
    <div className="ant-tour" style={{ position: 'fixed', zIndex: 1100, inset: 0, pointerEvents: 'none' }}>
      <div className="ant-tour-mask" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.15)', pointerEvents: 'auto' }} />
      <div className="ant-tour-step" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'auto' }}>
        <div
          className="ant-tour-inner"
          style={{
            background: '#ffffff',
            borderRadius: 8,
            boxShadow: '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12)',
            width: 350,
            padding: 16,
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            ...style,
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              border: 'none',
              background: 'transparent',
              fontSize: 16,
              cursor: 'pointer',
              color: 'rgba(0, 0, 0, 0.45)',
            }}
          >
            ×
          </button>

          {step.cover && <div className="ant-tour-cover">{step.cover}</div>}

          <div className="ant-tour-title" style={{ fontWeight: 600, fontSize: 16, color: 'rgba(0,0,0,0.88)', paddingRight: 24 }}>
            {step.title}
          </div>

          <div className="ant-tour-description" style={{ fontSize: 14, color: 'rgba(0, 0, 0, 0.88)', lineHeight: 1.57 }}>
            {step.description}
          </div>

          <div className="ant-tour-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
            <div className="ant-tour-sliders" style={{ display: 'flex', gap: 6 }}>
              {steps.map((_, idx) => (
                <div
                  key={idx}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: idx === current ? '#009688' : 'rgba(0, 0, 0, 0.15)',
                    transition: 'all 0.2s',
                  }}
                />
              ))}
            </div>
            <div className="ant-tour-buttons" style={{ display: 'flex', gap: 8 }}>
              {current > 0 && (
                <Button size="small" onClick={handlePrev}>
                  Previous
                </Button>
              )}
              <Button type="primary" size="small" onClick={handleNext}>
                {current === steps.length - 1 ? 'OK' : 'Next'}
              </Button>
            </div>
          </div>
        </div>
        <div
          className="ant-tour-arrow"
          style={{
            position: 'absolute',
            width: 8,
            height: 8,
            background: '#ffffff',
            transform: 'rotate(45deg) translateX(-50%)',
            bottom: -4,
            left: '50%',
          }}
        />
      </div>
    </div>
  );
};

// ==========================================
// 48. Pagination
// ==========================================
export interface PaginationProps {
  current?: number;
  pageSize?: number;
  total?: number;
  onChange?: (page: number, pageSize: number) => void;
  showSizeChanger?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
}

export const Pagination: React.FC<PaginationProps> = ({
  current = 1,
  pageSize = 10,
  total = 0,
  onChange,
  showSizeChanger = true,
  disabled = false,
  style,
}) => {
  const totalPages = Math.ceil(total / pageSize) || 1;

  const handlePageChange = (page: number) => {
    if (disabled) return;
    if (page < 1 || page > totalPages) return;
    onChange && onChange(page, pageSize);
  };

  const handlePageSizeChange = (val: any) => {
    if (disabled) return;
    const newPageSize = Number(val);
    onChange && onChange(1, newPageSize);
  };

  const getPages = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (current <= 3) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (current >= totalPages - 2) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', current - 1, current, current + 1, '...', totalPages);
      }
    }
    return pages;
  };

  const pages = getPages();

  return (
    <div className={`ant-pagination ${disabled ? 'ant-pagination-disabled' : ''}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, ...style }}>
      {/* Previous button */}
      <button
        type="button"
        disabled={disabled || current <= 1}
        onClick={() => handlePageChange(current - 1)}
        className="ant-pagination-item-link"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 26,
          height: 26,
          border: '1px solid var(--antd-border)',
          borderRadius: 4,
          background: '#ffffff',
          cursor: disabled || current <= 1 ? 'not-allowed' : 'pointer',
          color: disabled || current <= 1 ? 'var(--antd-text-disabled)' : 'var(--antd-text)',
          transition: 'all 0.15s',
        }}
      >
        <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 9L1 5L5 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Pages */}
      {pages.map((p, idx) => {
        const isCurrent = p === current;
        const isEllipsis = p === '...';

        return (
          <button
            key={idx}
            type="button"
            disabled={disabled || isEllipsis}
            onClick={() => handlePageChange(p as number)}
            className={`ant-pagination-item ${isCurrent ? 'ant-pagination-item-active' : ''} ${isEllipsis ? 'ant-pagination-item-jump-prev' : ''}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 26,
              height: 26,
              border: isEllipsis ? 'none' : '1px solid var(--antd-border)',
              borderColor: isCurrent ? 'var(--antd-primary)' : 'var(--antd-border)',
              borderRadius: 4,
              background: isCurrent ? 'var(--antd-primary-bg, #ffffff)' : '#ffffff',
              color: isCurrent ? 'var(--antd-primary)' : isEllipsis ? 'rgba(0, 0, 0, 0.25)' : 'var(--antd-text)',
              cursor: disabled || isEllipsis ? 'not-allowed' : 'pointer',
              fontWeight: isCurrent ? 600 : 400,
              fontSize: 13,
              transition: 'all 0.15s',
            }}
          >
            {p}
          </button>
        );
      })}

      {/* Next button */}
      <button
        type="button"
        disabled={disabled || current >= totalPages}
        onClick={() => handlePageChange(current + 1)}
        className="ant-pagination-item-link"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 26,
          height: 26,
          border: '1px solid var(--antd-border)',
          borderRadius: 4,
          background: '#ffffff',
          cursor: disabled || current >= totalPages ? 'not-allowed' : 'pointer',
          color: disabled || current >= totalPages ? 'var(--antd-text-disabled)' : 'var(--antd-text)',
          transition: 'all 0.15s',
        }}
      >
        <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 9L5 5L1 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Size Changer */}
      {showSizeChanger && (
        <Select
          size="small"
          className="ant-pagination-size-changer"
          value={pageSize}
          onChange={handlePageSizeChange}
          disabled={disabled}
          options={[
            { label: `10 / ${typeof window !== 'undefined' && localStorage.getItem('minepanel_lang') === 'vi' ? 'trang' : 'page'}`, value: 10 },
            { label: `20 / ${typeof window !== 'undefined' && localStorage.getItem('minepanel_lang') === 'vi' ? 'trang' : 'page'}`, value: 20 },
            { label: `50 / ${typeof window !== 'undefined' && localStorage.getItem('minepanel_lang') === 'vi' ? 'trang' : 'page'}`, value: 50 },
            { label: `100 / ${typeof window !== 'undefined' && localStorage.getItem('minepanel_lang') === 'vi' ? 'trang' : 'page'}`, value: 100 },
          ]}
          style={{ width: 100, marginLeft: 8 }}
        />
      )}
    </div>
  );
};


