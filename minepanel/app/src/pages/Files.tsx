import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Button, Tag, Space, Typography, Breadcrumb, message, Modal, Form, Input, Select, Popconfirm, Dropdown, Tree, Segmented, Tooltip, InputNumber, Upload, Row, Col, Checkbox, Card, AutoComplete } from '../custom-ui';
import { FolderOutlined, FileOutlined, UploadOutlined, DownloadOutlined, DeleteOutlined, HomeOutlined, PlusOutlined, EditOutlined, CopyOutlined, ScissorOutlined, FileZipOutlined, UnlockOutlined, EyeOutlined, SearchOutlined, AppstoreOutlined, UnorderedListOutlined, ColumnWidthOutlined, FileAddOutlined, FolderAddOutlined, ReloadOutlined, InfoCircleOutlined, ArrowLeftOutlined, ArrowRightOutlined, ArrowUpOutlined, SnippetsOutlined, CheckOutlined, RightOutlined, SaveOutlined, DatabaseOutlined, UserOutlined, DownOutlined } from '@ant-design/icons';
import { KTable } from '../components/KTable';
import type { UploadProps } from '../custom-ui';
import Selecto from 'react-selecto';
import { useLanguage } from '../context/LanguageContext';

const { Title, Text } = Typography;

interface FileItem {
  key: string; name: string; type: 'dir' | 'file'; size: string; modified: string;
  owner?: string; group?: string; permission?: string; mime?: string;
}

const mockFileSystem: Record<string, FileItem[]> = {
  '/': [
    // Directories
    { key: 'm01', name: 'plugins', type: 'dir', size: '48.5 MB', modified: '2026-06-21 10:15', owner: 'minepanel', group: 'minepanel', permission: '755' },
    { key: 'm02', name: 'world', type: 'dir', size: '1.8 GB', modified: '2026-06-21 11:30', owner: 'minepanel', group: 'minepanel', permission: '755' },
    { key: 'm03', name: 'world_nether', type: 'dir', size: '640.2 MB', modified: '2026-06-21 11:28', owner: 'minepanel', group: 'minepanel', permission: '755' },
    { key: 'm04', name: 'world_the_end', type: 'dir', size: '210.5 MB', modified: '2026-06-21 11:20', owner: 'minepanel', group: 'minepanel', permission: '755' },
    { key: 'm05', name: 'logs', type: 'dir', size: '85.4 MB', modified: '2026-06-21 11:32', owner: 'minepanel', group: 'minepanel', permission: '755' },
    { key: 'm06', name: 'config', type: 'dir', size: '4.2 MB', modified: '2026-06-20 18:00', owner: 'minepanel', group: 'minepanel', permission: '755' },
    { key: 'm07', name: 'backups', type: 'dir', size: '12.4 GB', modified: '2026-06-21 04:00', owner: 'minepanel', group: 'minepanel', permission: '750' },

    // Core Minecraft files
    { key: 'f01', name: 'server.properties', type: 'file', size: '3.4 KB', modified: '2026-06-21 09:00', owner: 'minepanel', group: 'minepanel', permission: '644', mime: 'text/plain' },
    { key: 'f02', name: 'paper-global.yml', type: 'file', size: '8.2 KB', modified: '2026-06-20 14:10', owner: 'minepanel', group: 'minepanel', permission: '644', mime: 'text/yaml' },
    { key: 'f03', name: 'spigot.yml', type: 'file', size: '4.8 KB', modified: '2026-06-20 14:05', owner: 'minepanel', group: 'minepanel', permission: '644', mime: 'text/yaml' },
    { key: 'f04', name: 'bukkit.yml', type: 'file', size: '2.9 KB', modified: '2026-06-20 14:00', owner: 'minepanel', group: 'minepanel', permission: '644', mime: 'text/yaml' },
    { key: 'f05', name: 'eula.txt', type: 'file', size: '160 B', modified: '2026-06-01 10:00', owner: 'minepanel', group: 'minepanel', permission: '644', mime: 'text/plain' },
    { key: 'f06', name: 'paper-1.20.4.jar', type: 'file', size: '68.4 MB', modified: '2026-06-15 08:30', owner: 'minepanel', group: 'minepanel', permission: '755', mime: 'application/java-archive' },
    { key: 'f07', name: 'ops.json', type: 'file', size: '420 B', modified: '2026-06-21 10:00', owner: 'minepanel', group: 'minepanel', permission: '644', mime: 'application/json' },
    { key: 'f08', name: 'usercache.json', type: 'file', size: '15.8 KB', modified: '2026-06-21 11:30', owner: 'minepanel', group: 'minepanel', permission: '644', mime: 'application/json' },
    { key: 'f09', name: 'banned-players.json', type: 'file', size: '2 B', modified: '2026-06-01 10:00', owner: 'minepanel', group: 'minepanel', permission: '644', mime: 'application/json' },
    { key: 'f10', name: 'banned-ips.json', type: 'file', size: '2 B', modified: '2026-06-01 10:00', owner: 'minepanel', group: 'minepanel', permission: '644', mime: 'application/json' },
  ],
  '/plugins': [
    { key: 'p01', name: 'Essentials', type: 'dir', size: '1.2 MB', modified: '2026-06-20 16:00', owner: 'minepanel', group: 'minepanel', permission: '755' },
    { key: 'p02', name: 'LuckPerms', type: 'dir', size: '2.5 MB', modified: '2026-06-20 16:05', owner: 'minepanel', group: 'minepanel', permission: '755' },
    { key: 'p03', name: 'EssentialsX.jar', type: 'file', size: '3.2 MB', modified: '2026-06-20 15:50', owner: 'minepanel', group: 'minepanel', permission: '644', mime: 'application/java-archive' },
    { key: 'p04', name: 'LuckPerms.jar', type: 'file', size: '6.4 MB', modified: '2026-06-20 15:52', owner: 'minepanel', group: 'minepanel', permission: '644', mime: 'application/java-archive' },
    { key: 'p05', name: 'WorldEdit.jar', type: 'file', size: '5.8 MB', modified: '2026-06-20 15:55', owner: 'minepanel', group: 'minepanel', permission: '644', mime: 'application/java-archive' },
    { key: 'p06', name: 'Vault.jar', type: 'file', size: '420 KB', modified: '2026-06-20 15:40', owner: 'minepanel', group: 'minepanel', permission: '644', mime: 'application/java-archive' },
    { key: 'p07', name: 'Geyser-Spigot.jar', type: 'file', size: '14.5 MB', modified: '2026-06-20 16:10', owner: 'minepanel', group: 'minepanel', permission: '644', mime: 'application/java-archive' },
  ],
  '/plugins/Essentials': [
    { key: 'pe01', name: 'userdata', type: 'dir', size: '850 KB', modified: '2026-06-21 11:30', owner: 'minepanel', group: 'minepanel', permission: '755' },
    { key: 'pe02', name: 'config.yml', type: 'file', size: '32.4 KB', modified: '2026-06-20 16:00', owner: 'minepanel', group: 'minepanel', permission: '644', mime: 'text/yaml' },
    { key: 'pe03', name: 'spawn.yml', type: 'file', size: '1.2 KB', modified: '2026-06-20 16:02', owner: 'minepanel', group: 'minepanel', permission: '644', mime: 'text/yaml' },
    { key: 'pe04', name: 'warps.yml', type: 'file', size: '4.8 KB', modified: '2026-06-21 09:15', owner: 'minepanel', group: 'minepanel', permission: '644', mime: 'text/yaml' },
  ],
  '/logs': [
    { key: 'l01', name: 'latest.log', type: 'file', size: '1.4 MB', modified: '2026-06-21 11:33', owner: 'minepanel', group: 'minepanel', permission: '644', mime: 'text/plain' },
    { key: 'l02', name: '2026-06-20-1.log.gz', type: 'file', size: '240 KB', modified: '2026-06-20 23:59', owner: 'minepanel', group: 'minepanel', permission: '644', mime: 'application/gzip' },
    { key: 'l03', name: '2026-06-21-1.log.gz', type: 'file', size: '310 KB', modified: '2026-06-21 06:00', owner: 'minepanel', group: 'minepanel', permission: '644', mime: 'application/gzip' },
  ],
  '/world': [
    { key: 'w01', name: 'region', type: 'dir', size: '1.5 GB', modified: '2026-06-21 11:30', owner: 'minepanel', group: 'minepanel', permission: '755' },
    { key: 'w02', name: 'playerdata', type: 'dir', size: '120.4 MB', modified: '2026-06-21 11:30', owner: 'minepanel', group: 'minepanel', permission: '755' },
    { key: 'w03', name: 'stats', type: 'dir', size: '15.2 MB', modified: '2026-06-21 11:30', owner: 'minepanel', group: 'minepanel', permission: '755' },
    { key: 'w04', name: 'level.dat', type: 'file', size: '8.4 KB', modified: '2026-06-21 11:30', owner: 'minepanel', group: 'minepanel', permission: '644', mime: 'application/octet-stream' },
    { key: 'w05', name: 'session.lock', type: 'file', size: '3 B', modified: '2026-06-21 10:00', owner: 'minepanel', group: 'minepanel', permission: '644', mime: 'text/plain' },
  ],
};

const Files: React.FC = () => {
  const { t } = useLanguage();
  const [path, setPath] = useState<string[]>(['/']);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [showExtensions, setShowExtensions] = useState(true);

  const isDraggingRef = useRef(false);
  const [boundEl, setBoundEl] = useState<HTMLDivElement | null>(null);


  const formatName = (name: string, type: 'dir' | 'file') => {
    if (type === 'dir' || showExtensions) return name;
    const lastDot = name.lastIndexOf('.');
    return lastDot > 0 ? name.substring(0, lastDot) : name;
  };

  const viewMenuProps = {
    items: [
      { key: 'checkboxes', label: <span>{showCheckboxes ? <CheckOutlined style={{ marginRight: 8 }} /> : <span style={{ width: 22, display: 'inline-block' }} />}{t('files.menuCheckboxes')}</span>, onClick: () => setShowCheckboxes(!showCheckboxes) },
      { key: 'extensions', label: <span>{showExtensions ? <CheckOutlined style={{ marginRight: 8 }} /> : <span style={{ width: 22, display: 'inline-block' }} />}{t('files.menuExtensions')}</span>, onClick: () => setShowExtensions(!showExtensions) }
    ]
  };
  const [fs, setFs] = useState<Record<string, FileItem[]>>(mockFileSystem);
  const [open, setOpen] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [permOpen, setPermOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [search, setSearch] = useState('');
  const [form] = Form.useForm();
  const [renameForm] = Form.useForm();
  const [permForm] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [batchAction, setBatchAction] = useState<string>('');
  const [clipboard, setClipboard] = useState<{ action: 'copy' | 'cut'; items: FileItem[] } | null>(null);
  const [contextMenuState, setContextMenuState] = useState<{ visible: boolean, x: number, y: number, isContainer?: boolean } | null>(null);
  const [deleteConfirmKey, setDeleteConfirmKey] = useState<string | null>(null);
  const [tooltipOpenKey, setTooltipOpenKey] = useState<string | null>(null);

  const [isEditingPath, setIsEditingPath] = useState(false);
  const [pathInput, setPathInput] = useState('');
  const [recentPaths, setRecentPaths] = useState<string[]>(() => {
    const saved = localStorage.getItem('minepanel_recent_paths');
    return saved ? JSON.parse(saved) : ['/', '/var/www', '/etc/nginx'];
  });

  // Update invisible bound div: top=thead top, bottom=win11-main bottom
  useEffect(() => {
    if (!boundEl) return;
    const mainEl = document.querySelector('.win11-main');
    const update = () => {
      const thead = document.querySelector('.win11-table .ant-table-thead tr th');
      if (!thead || !mainEl) return;
      const theadRect = thead.getBoundingClientRect();
      const mainRect = mainEl.getBoundingClientRect();
      // selection top boundary must not go above the table header's bottom
      const top = Math.max(theadRect.bottom, mainRect.top);
      boundEl.style.top = `${top}px`;
      boundEl.style.left = `${mainRect.left}px`;
      boundEl.style.width = `${mainRect.width}px`;
      boundEl.style.height = `${Math.max(0, mainRect.bottom - top)}px`;
    };
    update();
    window.addEventListener('resize', update);
    if (mainEl) {
      mainEl.addEventListener('scroll', update);
    }
    return () => {
      window.removeEventListener('resize', update);
      if (mainEl) {
        mainEl.removeEventListener('scroll', update);
      }
    };
  }, [boundEl, viewMode]);


  const handlePathInputSubmit = (val: string) => {
    let cleanPath = val.trim();
    if (!cleanPath.startsWith('/')) cleanPath = '/' + cleanPath;
    if (cleanPath.endsWith('/') && cleanPath !== '/') cleanPath = cleanPath.slice(0, -1);

    const parts = cleanPath === '/' ? ['Root'] : ['Root', ...cleanPath.split('/').filter(Boolean)];

    const newRecent = [cleanPath, ...recentPaths.filter(p => p !== cleanPath)].slice(0, 10);
    setRecentPaths(newRecent);
    localStorage.setItem('minepanel_recent_paths', JSON.stringify(newRecent));

    setPath(parts);
    setIsEditingPath(false);
  };

  useEffect(() => {
    const closeContextMenu = () => setContextMenuState(null);
    window.addEventListener('click', closeContextMenu);
    return () => window.removeEventListener('click', closeContextMenu);
  }, []);

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      if (isDraggingRef.current) return;
      const target = e.target as HTMLElement;
      if (!target) return;

      // Exclude interactive containers from deselecting items
      if (
        target.closest('.ant-table-row') ||
        target.closest('.win11-grid-item') ||
        target.closest('.win11-cmd-bar') ||
        target.closest('.win11-address-bar') ||
        target.closest('.win11-footer') ||
        target.closest('.ant-modal') ||
        target.closest('.ant-popover') ||
        target.closest('.ant-tooltip') ||
        target.closest('.ant-dropdown') ||
        target.closest('.ant-select') ||
        target.closest('.ant-select-dropdown') ||
        target.closest('.ant-checkbox-wrapper') ||
        target.closest('.ant-table-thead') ||
        target.closest('.ant-pagination')
      ) {
        return;
      }

      // Check if click was on the scrollbar of win11-main
      const mainEl = document.querySelector('.win11-main');
      if (mainEl) {
        const rect = mainEl.getBoundingClientRect();
        const isClickOnScrollbar = e.clientX > rect.left + mainEl.clientWidth ||
                                   e.clientY > rect.top + mainEl.clientHeight;
        if (isClickOnScrollbar && mainEl.contains(target)) return;
      }

      setSelectedRowKeys([]);
      setLastSelectedKey(null);
    };

    window.addEventListener('mousedown', handleGlobalClick);
    return () => window.removeEventListener('mousedown', handleGlobalClick);
  }, []);

  const getCurrentPathString = () => path.length <= 1 ? '/' : '/' + path.slice(1).join('/');
  const currentPathStr = getCurrentPathString();
  const currentFiles = (fs[currentPathStr] || []).filter(f => !search || f.name.toLowerCase().includes(search.toLowerCase()));

  const [lastSelectedKey, setLastSelectedKey] = useState<React.Key | null>(null);

  const handleRowClick = (e: React.MouseEvent, record: FileItem) => {
    const { ctrlKey, metaKey, shiftKey } = e;

    if (shiftKey && lastSelectedKey) {
      const nodes = document.querySelectorAll('.win11-main .ant-table-row, .win11-main .win11-grid-item');
      const keysInView = Array.from(nodes).map(el => (el as HTMLElement).dataset.rowKey || (el as HTMLElement).dataset.key).filter(Boolean) as string[];

      const startIndex = keysInView.indexOf(String(lastSelectedKey));
      const endIndex = keysInView.indexOf(String(record.key));

      if (startIndex !== -1 && endIndex !== -1) {
        const min = Math.min(startIndex, endIndex);
        const max = Math.max(startIndex, endIndex);
        const rangeKeys = keysInView.slice(min, max + 1);

        if (ctrlKey || metaKey) {
          const newKeys = new Set([...selectedRowKeys, ...rangeKeys]);
          setSelectedRowKeys(Array.from(newKeys));
        } else {
          setSelectedRowKeys(rangeKeys);
        }
      }
      return;
    }

    if (ctrlKey || metaKey) {
      if (selectedRowKeys.includes(record.key)) {
        setSelectedRowKeys(selectedRowKeys.filter(k => k !== record.key));
      } else {
        setSelectedRowKeys([...selectedRowKeys, record.key]);
      }
    } else {
      setSelectedRowKeys([record.key]);
    }
    setLastSelectedKey(record.key);
  };

  const handleNavigate = (dirName: string) => setPath(prev => [...prev, dirName]);
  const handleBreadcrumbClick = (index: number) => setPath(prev => prev.slice(0, index + 1));
  const handleGoBack = () => { if (path.length > 1) setPath(prev => prev.slice(0, -1)); };

  const handleDelete = (key: string) => {
    setFs(prev => ({ ...prev, [currentPathStr]: (prev[currentPathStr] || []).filter(item => item.key !== key) }));
    message.success(t('files.msgSuccessDelete'));
  };

  const handleDeleteBatch = () => {
    if (!selectedRowKeys.length) return;
    setFs(prev => ({ ...prev, [currentPathStr]: (prev[currentPathStr] || []).filter(item => !selectedRowKeys.includes(item.key)) }));
    message.success(t('files.msgSuccessDeleteBatch').replace('{count}', String(selectedRowKeys.length)));
    setSelectedRowKeys([]);
  };

  const handleDownload = (name: string) => {
    message.loading({ content: t('files.msgLoadingDownload').replace('{name}', name), key: 'dl_file' });
    setTimeout(() => message.success({ content: t('files.msgSuccessDownload').replace('{name}', name), key: 'dl_file', duration: 2 }), 1000);
  };

  const handleUpload = () => {
    form.validateFields().then(values => {
      const newItem: FileItem = { key: String(Date.now()), name: values.name, type: values.type, size: values.type === 'file' ? '12.4 KB' : '—', modified: new Date().toLocaleString(), owner: 'minepanel', group: 'minepanel', permission: values.type === 'dir' ? '755' : '644', mime: 'application/octet-stream' };
      setFs(prev => ({ ...prev, [currentPathStr]: [...(prev[currentPathStr] || []), newItem] }));
      message.success(values.type === 'file' ? t('files.msgSuccessCreateFile') : t('files.msgSuccessCreateDir'));
      form.resetFields(); setOpen(false);
    });
  };

  const handleRename = () => {
    renameForm.validateFields().then(values => {
      if (!selectedFile) return;
      setFs(prev => ({
        ...prev,
        [currentPathStr]: (prev[currentPathStr] || []).map(f => f.key === selectedFile.key ? { ...f, name: values.newName } : f),
      }));
      message.success(t('files.msgSuccessRename'));
      setRenameOpen(false);
    });
  };

  const handlePermission = () => {
    permForm.validateFields().then(values => {
      if (!selectedFile) return;
      setFs(prev => ({
        ...prev,
        [currentPathStr]: (prev[currentPathStr] || []).map(f => f.key === selectedFile.key ? { ...f, permission: values.permission, owner: values.owner, group: values.group } : f),
      }));
      message.success(t('files.msgSuccessPermission'));
      setPermOpen(false);
    });
  };

  const handleCompress = () => {
    if (!selectedRowKeys.length && !selectedFile) { message.warning(t('files.msgSelectAtLeastOne')); return; }
    message.loading({ content: t('files.msgLoadingCompress'), key: 'compress' });
    setTimeout(() => message.success({ content: t('files.msgSuccessCompress'), key: 'compress', duration: 2 }), 1500);
  };

  const handleExtract = () => {
    if (!selectedFile) return;
    message.loading({ content: t('files.msgLoadingExtract').replace('{name}', selectedFile.name), key: 'extract' });
    setTimeout(() => message.success({ content: t('files.msgSuccessExtract'), key: 'extract', duration: 2 }), 1500);
  };

  const handleCopy = () => {
    if (selectedRowKeys.length) { setClipboard({ action: 'copy', items: selectedRowKeys.map(k => currentFiles.find(f => f.key === k)!).filter(Boolean) }); message.success(t('files.msgClipboardCopied')); }
  };

  const handleCut = () => {
    if (selectedRowKeys.length) { setClipboard({ action: 'cut', items: selectedRowKeys.map(k => currentFiles.find(f => f.key === k)!).filter(Boolean) }); message.success(t('files.msgClipboardCut')); }
  };

  const handleExecuteBatch = () => {
    if (!batchAction) {
      message.warning(t('files.msgSelectAction'));
      return;
    }
    if (selectedRowKeys.length === 0) {
      message.warning(t('files.msgSelectAtLeastOne'));
      return;
    }
    if (batchAction === 'copy') handleCopy();
    else if (batchAction === 'cut') handleCut();
    else if (batchAction === 'compress') handleCompress();
    else if (batchAction === 'delete') handleDeleteBatch();
  };

  const handlePaste = () => {
    if (!clipboard) return;
    const newItems = clipboard.items.map(item => ({ ...item, key: String(Date.now()) + Math.random(), modified: new Date().toLocaleString() }));
    setFs(prev => ({ ...prev, [currentPathStr]: [...(prev[currentPathStr] || []), ...newItems] }));
    if (clipboard.action === 'cut') {
      setFs(prev => ({ ...prev, [currentPathStr]: (prev[currentPathStr] || []).filter(f => !clipboard.items.find(c => c.key === f.key)) }));
    }
    setClipboard(null);
    message.success(t('files.msgSuccessPaste'));
  };

  const handlePreview = (file: FileItem) => {
    if (file.type === 'dir') return;
    setPreviewFile(file);
    setPreviewOpen(true);
  };

  function handleContextMenu(e: React.MouseEvent, record: FileItem) {
    e.preventDefault();
    e.stopPropagation();
    setSelectedFile(record);
    setContextMenuState({ visible: true, x: e.clientX, y: e.clientY, isContainer: false });
  }

  function handleContainerContextMenu(e: React.MouseEvent) {
    e.preventDefault();
    setContextMenuState({ visible: true, x: e.clientX, y: e.clientY, isContainer: true });
    setSelectedFile(null);
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA' || open || renameOpen || permOpen || previewOpen) return;
      const cmdOrCtrl = navigator.platform.toUpperCase().indexOf('MAC') >= 0 ? e.metaKey : e.ctrlKey;

      if (cmdOrCtrl && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setSelectedRowKeys(currentFiles.map(f => f.key));
      } else if (cmdOrCtrl && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        handleCopy();
      } else if (cmdOrCtrl && e.key.toLowerCase() === 'x') {
        e.preventDefault();
        handleCut();
      } else if (cmdOrCtrl && e.key.toLowerCase() === 'v') {
        e.preventDefault();
        handlePaste();
      } else if (e.key === 'Delete') {
        e.preventDefault();
        if (selectedRowKeys.length) {
          Modal.confirm({ title: t('files.msgDeleteBatchConfirm').replace('{count}', String(selectedRowKeys.length)), onOk: handleDeleteBatch, okText: t('common.yes'), cancelText: t('common.no'), okButtonProps: { danger: true } });
        } else if (selectedFile) {
          Modal.confirm({ title: t('files.msgDeleteSingleConfirm').replace('{name}', selectedFile.name), onOk: () => handleDelete(selectedFile.key), okText: t('common.yes'), cancelText: t('common.no'), okButtonProps: { danger: true } });
        }
      } else if (e.key === 'F2') {
        e.preventDefault();
        const item = selectedFile || currentFiles.find(f => f.key === selectedRowKeys[0]);
        if (item && selectedRowKeys.length <= 1) { setSelectedFile(item); renameForm.setFieldsValue({ newName: item.name }); setRenameOpen(true); }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const columns = [
    {
      title: t('files.columnName'), dataIndex: 'name', key: 'name', render: (v: string, r: FileItem) => (
        <Space style={{ cursor: 'default' }} onContextMenu={(e) => handleContextMenu(e, r)}>
          {r.type === 'dir' ? <FolderOutlined style={{ color: '#FF9800', fontSize: 16 }} /> : <FileOutlined style={{ color: '#999', fontSize: 16 }} />}
          <Text style={{ color: r.type === 'dir' ? '#009688' : '#333', fontWeight: r.type === 'dir' ? 600 : 400 }}>{formatName(v, r.type)}</Text>
        </Space>
      ), sorter: (a: FileItem, b: FileItem) => a.name.localeCompare(b.name)
    },
    { title: t('files.columnType'), dataIndex: 'type', key: 'type', render: (v: string) => <Tag color={v === 'dir' ? 'orange' : 'default'} style={{ borderRadius: 4 }}>{v === 'dir' ? t('files.typeDir') : t('files.typeFile')}</Tag> },
    { title: t('files.columnSize'), dataIndex: 'size', key: 'size', sorter: (a: FileItem, b: FileItem) => parseInt(a.size) - parseInt(b.size) || 0 },
    { title: t('files.columnOwner'), dataIndex: 'owner', key: 'owner', render: (v: string) => <Text style={{ fontSize: 12 }}>{v}</Text> },
    { title: t('files.columnGroup'), dataIndex: 'group', key: 'group', render: (v: string) => <Text style={{ fontSize: 12 }}>{v}</Text> },
    { title: t('files.columnPermission'), dataIndex: 'permission', key: 'permission', render: (v: string) => <Text code style={{ fontSize: 12 }}>{v}</Text> },
    {
      title: t('files.columnFormat'), dataIndex: 'mime', key: 'mime', render: (v: string, r: FileItem) => {
        if (r.type === 'dir') return <Text style={{ fontSize: 12, color: '#999' }}>File folder</Text>;
        const lastDot = r.name.lastIndexOf('.');
        let typeStr = 'File';
        if (lastDot >= 0 && r.name.length > lastDot + 1) {
          typeStr = `${r.name.substring(lastDot + 1).toUpperCase()} File`;
        }
        return <Text style={{ fontSize: 12, color: '#999' }}>{typeStr}</Text>;
      }
    },
    { title: t('files.columnModified'), dataIndex: 'modified', key: 'modified', sorter: (a: FileItem, b: FileItem) => a.modified.localeCompare(b.modified) },
    {
      title: t('files.columnActions'), key: 'actions', width: 280,
      render: (_: any, r: FileItem) => (
        <Space size="small">
          <Dropdown menu={{
            items: [
              { key: 'preview', icon: <EyeOutlined />, label: t('files.preview'), onClick: () => handlePreview(r) },
              { key: 'rename', icon: <EditOutlined />, label: t('files.rename'), onClick: () => { setSelectedFile(r); renameForm.setFieldsValue({ newName: r.name }); setRenameOpen(true); } },
              { key: 'copy', icon: <CopyOutlined />, label: t('files.copy'), onClick: handleCopy },
              { key: 'cut', icon: <ScissorOutlined />, label: t('files.cut'), onClick: handleCut },
              { key: 'compress', icon: <FileZipOutlined />, label: t('files.compress'), onClick: () => { setSelectedFile(r); handleCompress(); } },
              r.name.endsWith('.zip') ? { key: 'extract', icon: <UnlockOutlined />, label: t('files.extract'), onClick: () => { setSelectedFile(r); handleExtract(); } } : null,
              { key: 'permission', icon: <InfoCircleOutlined />, label: t('files.modalPermTitle'), onClick: () => { setSelectedFile(r); permForm.setFieldsValue({ permission: r.permission, owner: r.owner, group: r.group }); setPermOpen(true); } },
              { key: 'download', icon: <DownloadOutlined />, label: t('files.download'), onClick: () => handleDownload(r.name), disabled: r.type === 'dir' },
            ].filter(Boolean) as any
          }}>
            <Button size="small">{t('common.action')} <span style={{ fontSize: 10 }}>▼</span></Button>
          </Dropdown>
          <Popconfirm
            title={t('files.msgDeleteSingleConfirm').replace('{name}', r.name)}
            placement="left"
            onConfirm={() => handleDelete(r.key)}
            okText={t('common.yes')}
            cancelText={t('common.no')}
          >
            <Tooltip title={t('common.delete')}>
              <Button size="small" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const uploadProps: UploadProps = {
    beforeUpload: (file) => {
      const newItem: FileItem = { key: String(Date.now()), name: file.name, type: 'file', size: `${(file.size / 1024).toFixed(1)} KB`, modified: new Date().toLocaleString(), owner: 'minepanel', group: 'minepanel', permission: '644', mime: file.type || 'application/octet-stream' };
      setFs(prev => ({ ...prev, [currentPathStr]: [...(prev[currentPathStr] || []), newItem] }));
      message.success(t('files.msgSuccessUpload').replace('{name}', file.name));
      return false;
    },
    showUploadList: false,
  };

  return (
    <div className="win11-frame">
      {/* Command Bar */}
      <div className="win11-cmd-bar">
        <div className="win11-cmd-group">
          <button className="win11-cmd-btn" onClick={() => { form.resetFields(); setOpen(true); }}><PlusOutlined style={{ color: '#0078d4' }} /> {t('files.new')}</button>
        </div>
        <div className="win11-cmd-group">
          <button className={`win11-cmd-btn ${!selectedRowKeys.length && !selectedFile ? 'disabled' : ''}`} onClick={handleCut}><ScissorOutlined /> {t('files.cut')}</button>
          <button className={`win11-cmd-btn ${!selectedRowKeys.length && !selectedFile ? 'disabled' : ''}`} onClick={handleCopy}><CopyOutlined /> {t('files.copy')}</button>
          <button className={`win11-cmd-btn ${!clipboard ? 'disabled' : ''}`} onClick={handlePaste}><SnippetsOutlined /> {t('files.paste')}</button>
        </div>
        <div className="win11-cmd-group">
          <button className={`win11-cmd-btn ${selectedRowKeys.length !== 1 && !selectedFile ? 'disabled' : ''}`} onClick={() => {
            const item = selectedFile || currentFiles.find(f => f.key === selectedRowKeys[0]);
            if (item) { setSelectedFile(item); renameForm.setFieldsValue({ newName: item.name }); setRenameOpen(true); }
          }}><EditOutlined /> {t('files.rename')}</button>
          <Popconfirm
            title={selectedRowKeys.length > 0 ? t('files.msgDeleteBatchConfirm').replace('{count}', String(selectedRowKeys.length)) : t('files.msgDeleteSingleConfirm').replace('{name}', selectedFile?.name || '')}
            description={t('files.msgDeleteBatchDesc')}
            onConfirm={() => {
              if (selectedRowKeys.length) handleDeleteBatch();
              else if (selectedFile) handleDelete(selectedFile.key);
            }}
            okText={t('common.delete')}
            cancelText={t('common.cancel')}
            okButtonProps={{ danger: true, style: { color: 'black' } }}
            disabled={!selectedRowKeys.length && !selectedFile}
          >
            <button className={`win11-cmd-btn ${!selectedRowKeys.length && !selectedFile ? 'disabled' : ''}`}>
              <DeleteOutlined style={{ color: '#d13438' }} /> {t('files.delete')}
            </button>
          </Popconfirm>
        </div>
        <div className="win11-cmd-group" style={{ borderRight: 'none', marginLeft: 'auto' }}>
          <Dropdown menu={viewMenuProps} trigger={['click']}>
            <button className="win11-cmd-btn"><EyeOutlined style={{ color: '#0078d4' }} /> {t('files.display')}</button>
          </Dropdown>
          <Segmented options={[{ label: <><UnorderedListOutlined /> {t('files.viewModeList')}</>, value: 'list' }, { label: <><AppstoreOutlined /> {t('files.viewModeGrid')}</>, value: 'grid' }]} value={viewMode} onChange={(v) => setViewMode(v as 'list' | 'grid')} />
        </div>
      </div>

      {/* Address Bar */}
      <div className="win11-address-bar">
        <button className="win11-nav-btn" onClick={handleGoBack} disabled={path.length <= 1}><ArrowLeftOutlined /></button>
        <button className="win11-nav-btn" disabled><ArrowRightOutlined /></button>

        <div
          className="win11-path-container"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setPathInput(currentPathStr);
              setIsEditingPath(true);
            }
          }}
        >
          {isEditingPath ? (
            <>
              <FolderOutlined style={{ color: '#FF9800', marginRight: 8 }} />
              <AutoComplete
                autoFocus
                value={pathInput}
                options={recentPaths.map(p => ({ value: p }))}
                onChange={setPathInput}
                onBlur={() => setIsEditingPath(false)}
                onSelect={handlePathInputSubmit}
                style={{ width: '100%' }}
              >
                <Input autoFocus bordered={false} style={{ padding: '4px 0', background: 'transparent' }} onKeyDown={(e) => {
                  if (e.key === 'Enter') handlePathInputSubmit(pathInput);
                  else if (e.key === 'Escape') setIsEditingPath(false);
                }} />
              </AutoComplete>
            </>
          ) : (
            <>
              <FolderOutlined style={{ color: '#FF9800', marginRight: 8 }} />
              <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                {path.map((p, i) => {
                  const stepPathStr = i === 0 ? '/' : '/' + path.slice(1, i + 1).join('/');
                  const subdirs = (fs[stepPathStr] || []).filter(f => f.type === 'dir');
                  const menuItems = subdirs.map(d => ({
                    key: d.name,
                    label: d.name,
                    onClick: (e: any) => {
                      e.domEvent.stopPropagation();
                      setPath([...path.slice(0, i + 1), d.name]);
                    }
                  }));

                  return (
                    <React.Fragment key={i}>
                      <span
                        className="win11-breadcrumb-item"
                        onClick={(e) => { e.stopPropagation(); handleBreadcrumbClick(i); }}
                      >
                        {i === 0 ? 'Root' : p}
                      </span>
                      {i < path.length - 1 || menuItems.length > 0 ? (
                        <Dropdown menu={{ items: menuItems, style: { maxHeight: '300px', overflowY: 'auto' } }} trigger={['click']} disabled={menuItems.length === 0}>
                          <span
                            className="win11-breadcrumb-separator"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <RightOutlined style={{ fontSize: 10, strokeWidth: 4 }} />
                          </span>
                        </Dropdown>
                      ) : null}
                    </React.Fragment>
                  );
                })}
              </div>
              {/* Flex spacer to allow clicking empty space to edit */}
              <div style={{ flex: 1, height: '100%', cursor: 'text' }} onClick={() => {
                setPathInput(currentPathStr);
                setIsEditingPath(true);
              }} />
            </>
          )}
        </div>

        <input
          type="text"
          className="win11-search-input"
          placeholder={t('files.searchPlaceholder').replace('{path}', path[path.length - 1] || 'Root')}
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ paddingLeft: 8, outline: 'none' }}
        />
      </div>

      {/* Main Area */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Content */}
        <div
          className="win11-main"
          onDragStart={(e) => e.preventDefault()}
          onContextMenu={handleContainerContextMenu}
        >
          {viewMode === 'grid' ? (
            <div style={{ padding: '10px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(13, 1fr)', gap: '12px' }}>
                {currentFiles.map(item => (
                  <div key={item.key}>
                    <Card size="small" hoverable styles={{ body: { padding: '16px', textAlign: 'center' as const } }}
                      className={`win11-grid-item ${selectedRowKeys.includes(item.key) ? 'selected' : ''}`}
                      data-key={item.key}
                      onMouseDown={(e) => {
                        if (e.button !== 0) return; // Left click only
                        handleRowClick(e, item);
                      }}
                      onDoubleClick={() => item.type === 'dir' ? handleNavigate(item.name) : handlePreview(item)}
                      onContextMenu={(e) => handleContextMenu(e, item)}
                    >
                      {item.type === 'dir' ? <FolderOutlined style={{ fontSize: 32, color: '#FF9800' }} /> : <FileOutlined style={{ fontSize: 32, color: '#999' }} />}
                      <div style={{ marginTop: 8, fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{formatName(item.name, item.type)}</div>
                      <div style={{ fontSize: 11, color: '#999' }}>{item.type === 'dir' ? t('files.typeDir') : item.size}</div>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <KTable
                className="win11-table"
                viewKeyPrefix={`files-${currentPathStr}`}
                dataSource={currentFiles.filter(f => search ? f.name.toLowerCase().includes(search.toLowerCase()) : true)}
                columns={columns}
                pagination={false}
                size="middle"
                locale={{ emptyText: t('common.emptyFolder') }}
                rowSelection={showCheckboxes ? { selectedRowKeys, onChange: setSelectedRowKeys, columnWidth: 24 } : undefined}
                rowClassName={(record: FileItem) => selectedRowKeys.includes(record.key) ? 'ant-table-row-selected' : ''}
                onRow={(record: FileItem) => ({
                  onMouseDown: (e) => {
                    if (e.button !== 0) return; // Left click only
                    const target = e.target as HTMLElement;
                    if (
                      target.closest('.ant-checkbox-wrapper') ||
                      target.closest('.ant-checkbox') ||
                      target.closest('button') ||
                      target.closest('.ant-dropdown') ||
                      target.closest('.ant-table-selection-column')
                    ) {
                      return;
                    }
                    handleRowClick(e, record);
                  },
                  onDoubleClick: () => record.type === 'dir' ? handleNavigate(record.name) : handlePreview(record),
                  onContextMenu: (e: React.MouseEvent) => handleContextMenu(e, record)
                })}
              />
            </>
          )}
          {/* Invisible bound div: top=thead top, bottom=win11-main bottom */}
          <div
            ref={setBoundEl}
            style={{ position: 'fixed', pointerEvents: 'none', opacity: 0, zIndex: -1 }}
          />
          <Selecto
            dragContainer={".win11-main"}
            boundContainer={viewMode === 'list' ? (boundEl ?? undefined) : ".win11-main"}
            dragCondition={(e) => {
              const target = e.inputEvent.target as HTMLElement;
              // Do not start drag selection on table header, buttons, checkboxes, dropdowns or inputs
              if (
                target.closest('.ant-table-thead') ||
                target.closest('button') ||
                target.closest('.ant-select') ||
                target.closest('.ant-dropdown') ||
                target.closest('.ant-checkbox-wrapper') ||
                target.closest('.ant-table-selection-column') ||
                target.closest('input')
              ) {
                return false;
              }
              const mainEl = document.querySelector('.win11-main');
              return mainEl ? mainEl.contains(target) : false;
            }}
            scrollOptions={{
              container: () => document.querySelector('.win11-main') as HTMLElement,
              threshold: 30,
              throttleTime: 30,
              getScrollPosition: () => {
                const el = document.querySelector('.win11-main') as HTMLElement;
                return [el?.scrollLeft ?? 0, el?.scrollTop ?? 0];
              }
            }}
            onScroll={({ direction }) => {
              const el = document.querySelector('.win11-main') as HTMLElement;
              if (el) el.scrollBy(direction[0] * 10, direction[1] * 10);
            }}
            selectableTargets={[".ant-table-row", ".win11-grid-item"]}
            hitRate={0}
            selectByClick={false}
            selectFromInside={true}
            toggleContinueSelect={["shift"]}
            onDragStart={() => {
              isDraggingRef.current = false;
              // Lock body & layout scroll so ONLY win11-main scrolls
              document.body.style.overflow = 'hidden';
              document.documentElement.style.overflow = 'hidden';
            }}
            onDrag={() => {
              isDraggingRef.current = true;
            }}
            onDragEnd={() => {
              // Restore scroll
              document.body.style.overflow = '';
              document.documentElement.style.overflow = '';
              setTimeout(() => {
                isDraggingRef.current = false;
              }, 100);
            }}
            onSelect={(e) => {
              if (!isDraggingRef.current) return;
              const keys = e.selected.map(el => {
                if (el.classList.contains('win11-grid-item')) return el.getAttribute('data-key');
                return el.getAttribute('data-row-key');
              }).filter(Boolean) as React.Key[];
              setSelectedRowKeys(keys);
            }}
          />
        </div>
      </div>

      {/* Batch Actions Footer always at the bottom */}
      <div className="win11-footer" style={{ padding: '12px 16px', borderTop: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', background: '#ffffff' }}>
        <Space size={4}>
          <Checkbox
            style={{ marginLeft: 0, marginRight: 10 }}
            indeterminate={selectedRowKeys.length > 0 && selectedRowKeys.length < currentFiles.length}
            checked={currentFiles.length > 0 && selectedRowKeys.length === currentFiles.length}
            onChange={(e) => setSelectedRowKeys(e.target.checked ? currentFiles.map(d => d.key) : [])}
          />
          <Select
            size="small"
            value={batchAction || undefined}
            onChange={setBatchAction}
            style={{ width: 140 }}
            placeholder={t('files.batchPlaceholder')}
            options={[
              { value: 'copy', label: <Space><CopyOutlined /> {t('files.copy')}</Space> },
              { value: 'cut', label: <Space><ScissorOutlined /> {t('files.cut')}</Space> },
              { value: 'compress', label: <Space><FileZipOutlined /> {t('files.compress')}</Space> },
              { value: 'delete', label: <Space><DeleteOutlined /> {t('files.delete')}</Space> }
            ]}
          />
          <Button size="small" type={batchAction && selectedRowKeys.length > 0 ? "primary" : "default"} onClick={handleExecuteBatch}>{t('files.batchExecute')}</Button>
        </Space>
      </div>

      <Modal title={t('files.modalNewTitle')} open={open} onOk={handleUpload} onCancel={() => setOpen(false)} okText={t('files.new')} cancelText={t('common.cancel')}>
        <Form form={form} layout="vertical" style={{ marginTop: 12 }} initialValues={{ type: 'file' }}>
          <Form.Item name="type" label={t('files.modalNewType')} rules={[{ required: true }]}>
            <Select options={[{ label: t('files.modalNewTypeFile'), value: 'file' }, { label: t('files.modalNewTypeDir'), value: 'dir' }]} />
          </Form.Item>
          <Form.Item name="name" label={t('files.modalNewName')} rules={[{ required: true, message: t('files.validationNameRequired') }]}>
            <Input placeholder={t('files.modalNewNamePlaceholder')} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal title={t('files.modalRenameTitle')} open={renameOpen} onOk={handleRename} onCancel={() => setRenameOpen(false)} okText={t('common.save')} cancelText={t('common.cancel')}>
        <Form form={renameForm} layout="vertical" style={{ marginTop: 12 }}>
          <Form.Item name="newName" label={t('files.modalRenameNewName')} rules={[{ required: true, message: t('files.validationNewNameRequired') }]}>
            <Input placeholder={t('files.modalRenamePlaceholder')} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal title={t('files.modalPermTitle')} open={permOpen} onOk={handlePermission} onCancel={() => setPermOpen(false)} okText={t('common.save')} cancelText={t('common.cancel')}>
        <Form form={permForm} layout="vertical" style={{ marginTop: 12 }}>
          <Form.Item name="permission" label={`${t('files.columnPermission')} (ex: 755, 644)`}><Input placeholder="755" /></Form.Item>
          <Form.Item name="owner" label={t('common.owner')}><Input placeholder="www-data" /></Form.Item>
          <Form.Item name="group" label={t('common.group')}><Input placeholder="www-data" /></Form.Item>
        </Form>
      </Modal>
      <Modal 
        title={<Space><FileOutlined style={{ color: '#1890ff' }} /> <Text strong>{previewFile?.name}</Text></Space>}
        open={previewOpen} 
        onCancel={() => setPreviewOpen(false)} 
        footer={[
          <Button key="close" onClick={() => setPreviewOpen(false)}>{t('common.close')}</Button>,
          <Button key="save" type="primary" icon={<SaveOutlined />} onClick={() => { message.success(t('files.msgSuccessSaveFile')); setPreviewOpen(false); }}>{t('common.saveChanges')}</Button>
        ]} 
        width={900}
        style={{ top: 20 }}
      >
        {previewFile && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '65vh', marginTop: 12 }}>
            <div style={{ flex: 1, background: '#1e1e1e', borderRadius: 8, padding: 2, display: 'flex', flexDirection: 'column', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)' }}>
              <div style={{ display: 'flex', background: '#2d2d2d', padding: '6px 16px', borderTopLeftRadius: 8, borderTopRightRadius: 8, color: '#9cdcfe', fontSize: 13, fontFamily: 'Consolas, Monaco, monospace' }}>
                {previewFile.name}
              </div>
              <textarea 
                style={{ flex: 1, padding: 16, border: 'none', outline: 'none', resize: 'none', fontFamily: 'Consolas, Monaco, monospace', fontSize: 14, lineHeight: '1.6', color: '#d4d4d4', background: '#1e1e1e', borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }}
                defaultValue={
                  previewFile.name.endsWith('.json') ? '{\n  "name": "Minepanel",\n  "version": "1.0.0",\n  "description": "Premium Control Panel"\n}' :
                  previewFile.name.endsWith('.js') ? 'console.log("Minepanel is awesome!");\n\nfunction startServer() {\n  // Start logic here\n  app.listen(3000);\n}' :
                  previewFile.name.endsWith('.css') ? 'body {\n  background-color: #f0f2f5;\n  font-family: Inter, sans-serif;\n}' :
                  previewFile.name.endsWith('.html') ? '<!DOCTYPE html>\n<html>\n<head>\n  <title>Minepanel Sandbox</title>\n</head>\n<body>\n  <h1>Hello from Minepanel Sandbox!</h1>\n</body>\n</html>' :
                  '// Script content here\n\nconsole.log("Running script...");'
                }
              />
            </div>
          </div>
        )}
      </Modal>

      {contextMenuState?.visible && (contextMenuState.isContainer || selectedFile) && (
        <Dropdown
          key={`${contextMenuState.x}-${contextMenuState.y}-${contextMenuState.isContainer ? 'container' : 'file'}`}
          open={true}
          menu={{
            items: contextMenuState.isContainer ? [
              { key: 'new', icon: <PlusOutlined />, label: t('files.new'), onClick: () => { form.resetFields(); setOpen(true); } },
              { key: 'paste', icon: <SnippetsOutlined />, label: t('files.paste'), disabled: !clipboard, onClick: handlePaste },
              { type: 'divider' },
              { key: 'refresh', icon: <ReloadOutlined />, label: t('files.refresh'), onClick: () => message.success(t('files.msgSuccessRefresh')) }
            ] : selectedFile ? [
              { key: 'preview', icon: <EyeOutlined />, label: t('files.preview'), onClick: () => handlePreview(selectedFile) },
              { key: 'rename', icon: <EditOutlined />, label: t('files.rename'), onClick: () => { renameForm.setFieldsValue({ newName: selectedFile.name }); setRenameOpen(true); } },
              { key: 'copy', icon: <CopyOutlined />, label: t('files.copy'), onClick: handleCopy },
              { key: 'cut', icon: <ScissorOutlined />, label: t('files.cut'), onClick: handleCut },
              { key: 'compress', icon: <FileZipOutlined />, label: t('files.compress'), onClick: handleCompress },
              selectedFile.name.endsWith('.zip') ? { key: 'extract', icon: <UnlockOutlined />, label: t('files.extract'), onClick: handleExtract } : null,
              { key: 'permission', icon: <InfoCircleOutlined />, label: t('files.modalPermTitle'), onClick: () => { permForm.setFieldsValue({ permission: selectedFile.permission, owner: selectedFile.owner, group: selectedFile.group }); setPermOpen(true); } },
              { type: 'divider' },
              { key: 'download', icon: <DownloadOutlined />, label: t('files.download'), onClick: () => handleDownload(selectedFile.name), disabled: selectedFile.type === 'dir' },
              { key: 'delete', icon: <DeleteOutlined />, danger: true, label: t('files.delete'), onClick: () => { Modal.confirm({ title: t('files.msgDeleteSingleConfirm').replace('{name}', selectedFile.name), onOk: () => handleDelete(selectedFile.key), okText: t('common.yes'), cancelText: t('common.no') }); } },
            ].filter(Boolean) as any : []
          }}
        >
          <div style={{ position: 'fixed', left: contextMenuState.x, top: contextMenuState.y, width: 1, height: 1, zIndex: 9999 }} />
        </Dropdown>
      )}
    </div>
  );
};

export default Files;
