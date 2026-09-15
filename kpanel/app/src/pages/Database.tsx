import React, { useEffect, useState, useMemo } from 'react';
import { Button, Modal, Form, Input, Select, CompactSelect, Space, Typography, Tag, Badge, message, InputNumber, Row, Col, Tabs, Tooltip, Checkbox, Popconfirm } from '../custom-ui';
import { DatabaseOutlined, EditOutlined, DeleteOutlined, DownloadOutlined, SearchOutlined, PlusOutlined, HistoryOutlined, CloudUploadOutlined, ReloadOutlined, EyeOutlined, SaveOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { databasesApi, serversApi } from '../api/endpoints';
import { KTable } from '../components/KTable';
import { useLanguage } from '../context/LanguageContext';

const { Text } = Typography;

const dbTypes = [
  { key: 'MySQL', color: 'orange' },
  { key: 'SQL Server', color: 'red' },
  { key: 'MongoDB', color: 'green' },
  { key: 'Redis', color: 'red' },
  { key: 'PostgreSQL', color: 'blue' },
  { key: 'MariaDB', color: 'cyan' },
  { key: 'Elasticsearch', color: 'volcano' },
  { key: 'ClickHouse', color: 'purple' },
  { key: 'SQLite', color: 'default' },
];

const dbSlugToTypeMap: Record<string, string> = {
  all: 'all',
  mysql: 'MySQL',
  mariadb: 'MariaDB',
  postgres: 'PostgreSQL',
  postgresql: 'PostgreSQL',
  redis: 'Redis',
  mongodb: 'MongoDB',
  sqlite: 'SQLite',
  clickhouse: 'ClickHouse',
  elasticsearch: 'Elasticsearch',
  'sql-server': 'SQL Server',
  sqlserver: 'SQL Server'
};

const dbTypeToSlugMap: Record<string, string> = {
  all: 'all',
  MySQL: 'mysql',
  MariaDB: 'mariadb',
  PostgreSQL: 'postgres',
  Redis: 'redis',
  MongoDB: 'mongodb',
  SQLite: 'sqlite',
  ClickHouse: 'clickhouse',
  Elasticsearch: 'elasticsearch',
  'SQL Server': 'sql-server'
};

const typeColors: Record<string, string> = Object.fromEntries(dbTypes.map(t => [t.key, t.color]));
const typeOptions = dbTypes.map(t => ({ label: t.key, value: t.key }));
const defaultPorts: Record<string, number> = { MySQL: 3306, 'SQL Server': 1433, MongoDB: 27017, Redis: 6379, PostgreSQL: 5432, MariaDB: 3307, Elasticsearch: 9200, ClickHouse: 8123, SQLite: 0 };

interface DbData {
  id: string; name: string; type: string; server: string; port: number; size: string;
  status: 'online' | 'stopped'; version: string; lastBackup: string; createdAt: string;
}

const initialMockDatabases: DbData[] = [
  { id: 'db1', name: 'shop_db_mysql_prod', type: 'MySQL', server: 'VPS-TYO-02', port: 3306, size: '1.1 GB', status: 'online', version: '8.0.36', lastBackup: '2026-08-16 02:00', createdAt: '2026-05-01T10:00:00Z' },
  { id: 'db2', name: 'wordpress_db_mysql', type: 'MySQL', server: 'VPS-SG-01', port: 3306, size: '420 MB', status: 'online', version: '8.0.36', lastBackup: '2026-08-15 02:00', createdAt: '2026-05-03T11:00:00Z' },
  { id: 'db3', name: 'mssql_enterprise_erp', type: 'SQL Server', server: 'VPS-FRA-03', port: 1433, size: '18.5 GB', status: 'online', version: '2022', lastBackup: '2026-08-17 00:00', createdAt: '2026-04-10T08:00:00Z' },
  { id: 'db4', name: 'finance_reporting_mssql', type: 'SQL Server', server: 'VPS-US-04', port: 1433, size: '9.2 GB', status: 'stopped', version: '2019', lastBackup: '2026-08-14 02:00', createdAt: '2026-04-15T09:30:00Z' },
  { id: 'db5', name: 'analytics_mongo_cluster', type: 'MongoDB', server: 'VPS-FRA-03', port: 27017, size: '8.7 GB', status: 'online', version: '7.0.5', lastBackup: '2026-08-16 02:00', createdAt: '2026-04-20T14:00:00Z' },
  { id: 'db6', name: 'user_sessions_mongo', type: 'MongoDB', server: 'VPS-SG-01', port: 27017, size: '1.4 GB', status: 'online', version: '6.0.12', lastBackup: 'Chưa có', createdAt: '2026-04-22T16:15:00Z' },
  { id: 'db7', name: 'cache_redis_main_cluster', type: 'Redis', server: 'VPS-SG-01', port: 6379, size: '120 MB', status: 'online', version: '7.2.4', lastBackup: 'Chưa có', createdAt: '2026-05-02T12:00:00Z' },
  { id: 'db8', name: 'session_redis_store', type: 'Redis', server: 'VPS-TYO-02', port: 6379, size: '45 MB', status: 'online', version: '7.0.11', lastBackup: 'Chưa có', createdAt: '2026-05-04T15:20:00Z' },
  { id: 'db9', name: 'kpanel_main_postgres', type: 'PostgreSQL', server: 'VPS-SG-01', port: 5432, size: '2.3 GB', status: 'online', version: '16.1', lastBackup: '2026-08-17 02:00', createdAt: '2026-04-01T08:00:00Z' },
  { id: 'db10', name: 'auth_postgres_service', type: 'PostgreSQL', server: 'VPS-TYO-02', port: 5432, size: '850 MB', status: 'online', version: '15.4', lastBackup: '2026-08-16 02:00', createdAt: '2026-04-05T10:30:00Z' },
  { id: 'db11', name: 'mariadb_forum_cluster', type: 'MariaDB', server: 'VPS-US-04', port: 3307, size: '3.1 GB', status: 'online', version: '10.11.6', lastBackup: '2026-08-17 01:00', createdAt: '2026-04-18T11:00:00Z' },
  { id: 'db12', name: 'legacy_app_mariadb', type: 'MariaDB', server: 'VPS-SG-01', port: 3307, size: '1.5 GB', status: 'stopped', version: '10.6.15', lastBackup: '2026-08-10 02:00', createdAt: '2026-04-25T13:40:00Z' },
  { id: 'db13', name: 'es_logging_cluster_prod', type: 'Elasticsearch', server: 'VPS-FRA-03', port: 9200, size: '42.0 GB', status: 'online', version: '8.12.1', lastBackup: '2026-08-17 02:00', createdAt: '2026-03-15T09:00:00Z' },
  { id: 'db14', name: 'es_search_catalog_index', type: 'Elasticsearch', server: 'VPS-SG-01', port: 9200, size: '15.6 GB', status: 'online', version: '8.12.1', lastBackup: '2026-08-16 02:00', createdAt: '2026-03-20T14:15:00Z' },
  { id: 'db15', name: 'clickhouse_olap_events', type: 'ClickHouse', server: 'VPS-US-04', port: 8123, size: '68.4 GB', status: 'online', version: '24.1.2', lastBackup: '2026-08-17 03:00', createdAt: '2026-03-10T10:00:00Z' },
  { id: 'db16', name: 'telemetry_clickhouse_db', type: 'ClickHouse', server: 'VPS-FRA-03', port: 8123, size: '24.1 GB', status: 'online', version: '24.1.2', lastBackup: '2026-08-16 03:00', createdAt: '2026-03-12T16:30:00Z' },
  { id: 'db17', name: 'sqlite_local_cache.db', type: 'SQLite', server: 'Dev-Machine', port: 0, size: '48 MB', status: 'stopped', version: '3.45.1', lastBackup: 'Chưa có', createdAt: '2026-05-10T08:00:00Z' },
  { id: 'db18', name: 'testing_mock_data.sqlite', type: 'SQLite', server: 'Dev-Machine', port: 0, size: '12 MB', status: 'stopped', version: '3.45.1', lastBackup: 'Chưa có', createdAt: '2026-05-12T10:00:00Z' }
];

const Database: React.FC = () => {
  const navigate = useNavigate();
  const { type } = useParams<{ type?: string }>();
  const { t, language } = useLanguage();
  const [dbs, setDbs] = useState<DbData[]>(initialMockDatabases);
  const [servers, setServers] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [logOpen, setLogOpen] = useState(false);
  const [selectedDb, setSelectedDb] = useState<DbData | null>(null);
  const [batchAction, setBatchAction] = useState<string>('');
  const [activeTab, setActiveTab] = useState(type && dbSlugToTypeMap[type.toLowerCase()] ? dbSlugToTypeMap[type.toLowerCase()] : 'all');

  useEffect(() => {
    if (type && dbSlugToTypeMap[type.toLowerCase()]) {
      setActiveTab(dbSlugToTypeMap[type.toLowerCase()]);
    }
  }, [type]);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    if (key === 'all') {
      navigate('/database');
    } else {
      const slug = dbTypeToSlugMap[key] || key.toLowerCase();
      navigate(`/database/${slug}`);
    }
  };
  const [editTab, setEditTab] = useState(t('database.editOverview'));
  const [search, setSearch] = useState('');
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [deleteConfirmKey, setDeleteConfirmKey] = useState<string | null>(null);
  const [hoverKey, setHoverKey] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [dbsRes, servRes] = await Promise.all([databasesApi.getAll(), serversApi.getAll()]);
      const dbsList = Array.isArray(dbsRes?.data) ? dbsRes.data : (Array.isArray(dbsRes?.data?.data) ? dbsRes.data.data : []);
      const servList = Array.isArray(servRes?.data) ? servRes.data : (Array.isArray(servRes?.data?.data) ? servRes.data.data : []);
      
      const combined = [...dbsList];
      for (const m of initialMockDatabases) {
        if (!combined.some(d => d.name === m.name)) {
          combined.push(m);
        }
      }
      setDbs(combined);
      setServers(servList);
    } catch {
      setDbs(initialMockDatabases);
      message.error(t('database.msgErrorLoad'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleAdd = () => {
    form.validateFields().then(async (values: any) => {
      try {
        setActionLoading('add');
        await databasesApi.create({
          ...values,
          port: values.port ? parseInt(values.port) : (defaultPorts[values.type] || 5432),
          status: 'online',
          size: `${(Math.random() * 200).toFixed(1)} MB`,
          version: values.type === 'PostgreSQL' ? '16' : values.type === 'MySQL' ? '8.0' : values.type === 'MongoDB' ? '7.0' : 'latest',
          lastBackup: t('database.noBackup'),
        });
        message.success(t('database.msgSuccessCreate'));
        form.resetFields();
        setOpen(false);
        loadData();
      } catch (err: any) {
        message.error(err.response?.data?.message || t('database.msgErrorCreate'));
      } finally {
        setActionLoading(null);
      }
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await databasesApi.remove(id);
      message.success(t('database.msgSuccessDelete'));
      loadData();
    } catch {
      message.error(t('database.msgErrorDelete'));
    }
  };

  const handleBackup = (record: DbData) => {
    message.loading({ content: t('database.msgBackingUp').replace('{name}', record.name), key: 'backup_db' });
    setTimeout(() => {
      message.success({ content: t('database.msgBackedUp').replace('{name}', record.name), key: 'backup_db', duration: 3 });
    }, 1500);
  };

  const handleRestore = (record: DbData) => {
    message.loading({ content: t('database.msgRestoring').replace('{name}', record.name), key: 'restore_db' });
    setTimeout(() => {
      message.success({ content: t('database.msgRestored').replace('{name}', record.name), key: 'restore_db', duration: 3 });
    }, 2000);
  };

  const handleOptimize = (record: DbData) => {
    message.loading({ content: t('database.msgOptimizing').replace('{name}', record.name), key: 'opt_db' });
    setTimeout(() => message.success({ content: t('database.msgOptimized').replace('{name}', record.name), key: 'opt_db', duration: 2 }), 1500);
  };

  const handleExport = (format: 'excel' | 'csv') => {
    message.success(t('database.msgExporting').replace('{format}', format.toUpperCase()));
    setTimeout(() => message.success(t('database.msgExported').replace('{format}', format.toUpperCase())), 1000);
  };

  const safeServers = Array.isArray(servers) ? servers : [];
  const serverOptions = safeServers.map(s => ({ label: s.name, value: s.name }));

  const safeDbs = Array.isArray(dbs) ? dbs : [];
  const filteredDbs = useMemo(() => safeDbs.filter(d => {
    if (activeTab !== 'all' && d.type !== activeTab) return false;
    if (search && !d.name.toLowerCase().includes(search.toLowerCase()) && !d.type.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [safeDbs, activeTab, search]);

  const localeMap: Record<string, string> = { vi: 'vi-VN', en: 'en-US', ja: 'ja-JP', zh: 'zh-CN' };

  const columns = [
    { title: t('database.colName'), dataIndex: 'name', key: 'name', render: (v: string) => <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><DatabaseOutlined style={{ color: '#009688' }} /><span style={{ fontWeight: 600 }}>{v}</span></div>, sorter: (a: DbData, b: DbData) => a.name.localeCompare(b.name) },
    { title: t('database.colServer'), dataIndex: 'server', key: 'server', render: (v: string) => (v || '—') },
    { title: t('database.colPort'), dataIndex: 'port', key: 'port', render: (v: number) => <code>{v}</code> },
    { title: t('database.colSize'), dataIndex: 'size', key: 'size', sorter: (a: DbData, b: DbData) => parseFloat(a.size) - parseFloat(b.size) },
    { title: t('database.colVersion'), dataIndex: 'version', key: 'version', render: (v: string) => <Tag style={{ borderRadius: 4, margin: 0 }}>{v}</Tag> },
    { title: t('database.colStatus'), dataIndex: 'status', key: 'status', render: (v: string) => <Tag color={v === 'online' ? 'success' : 'default'} style={{ borderRadius: 4, margin: 0 }}>{v === 'online' ? t('database.statusOnline') : t('database.statusStopped')}</Tag>, filters: [{ text: t('database.statusOnline'), value: 'online' }, { text: t('database.statusStopped'), value: 'stopped' }], onFilter: (value: any, r: DbData) => r.status === value },
    { title: t('database.colLastBackup'), dataIndex: 'lastBackup', key: 'lastBackup', render: (v: string) => <span style={{ color: v === t('database.noBackup') ? '#F44336' : '#999', fontSize: 12 }}>{v}</span> },
    {
      title: t('database.colActions'), key: 'actions', width: 340,
      render: (_: any, r: DbData) => (
        <Space>
          <Tooltip title={t('database.tooltipView')}><Button size="small" icon={<EyeOutlined />} onClick={() => { setSelectedDb(r); setDetailOpen(true); }} /></Tooltip>
          <Tooltip title={t('database.tooltipEdit')}><Button size="small" icon={<EditOutlined />} onClick={() => { setSelectedDb(r); setEditTab(t('database.editOverview')); editForm.setFieldsValue(r); setEditOpen(true); }} /></Tooltip>
          <Tooltip title={t('database.tooltipLogs')}><Button size="small" icon={<HistoryOutlined />} onClick={() => { setSelectedDb(r); setLogOpen(true); }} /></Tooltip>
          <Tooltip title={t('database.tooltipBackup')}><Button size="small" icon={<DownloadOutlined />} onClick={() => handleBackup(r)} /></Tooltip>
          <Tooltip title={t('database.tooltipRestore')}><Button size="small" icon={<CloudUploadOutlined />} onClick={() => handleRestore(r)} /></Tooltip>
          <Tooltip title={t('database.tooltipOptimize')}><Button size="small" icon={<ReloadOutlined />} onClick={() => handleOptimize(r)} /></Tooltip>
            <Tooltip title={t('database.tooltipDelete')} open={hoverKey === r.id && deleteConfirmKey !== r.id}>
              <Popconfirm 
                title={t('database.confirmDelete')} 
                description={t('database.confirmDeleteDesc')}
                placement="left"
                onConfirm={() => handleDelete(r.id)} 
                okText={t('common.yes')} 
                cancelText={t('common.no')}
                onOpenChange={(open) => { if (open) setDeleteConfirmKey(r.id); }}
                afterOpenChange={(open) => {
                  if (!open) { setDeleteConfirmKey(null); setHoverKey(null); }
                }}
              >
                <Button 
                  size="small" 
                  danger 
                  icon={<DeleteOutlined />}
                  onMouseEnter={() => setHoverKey(r.id)}
                  onMouseLeave={() => setHoverKey(null)}
                />
              </Popconfirm>
            </Tooltip>
        </Space>
      ),
    },
  ];

  const handleExecuteBatch = () => {
    if (!batchAction) {
      message.warning(t('database.msgSelectAction'));
      return;
    }
    if (selectedRowKeys.length === 0) {
      message.warning(t('database.msgSelectAtLeast'));
      return;
    }
    if (batchAction === 'delete') {
      Modal.confirm({
        title: t('database.batchDeleteTitle'),
        content: t('database.batchDeleteContent').replace('{count}', String(selectedRowKeys.length)),
        okText: t('common.yes'), cancelText: t('common.no'),
        onOk: async () => {
          for (const k of selectedRowKeys) await databasesApi.remove(k as string);
          message.success(t('database.msgSuccessBatchDelete'));
          setSelectedRowKeys([]);
          loadData();
        }
      });
    } else if (batchAction === 'backup') {
      message.loading({ content: t('database.msgBackupBatch').replace('{count}', String(selectedRowKeys.length)), key: 'backup_batch' });
      setTimeout(() => {
        message.success({ content: t('database.msgBackupBatchDone'), key: 'backup_batch', duration: 2 });
        setSelectedRowKeys([]);
      }, 1500);
    }
  };

  return (
    <div>
      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        items={[
          { key: 'all', label: t('database.tabAll') },
          ...dbTypes.map(t => ({ key: t.key, label: t.key }))
        ]}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 0 }}>
        <Input prefix={<SearchOutlined style={{ color: '#bbb' }} />} placeholder={t('database.searchPlaceholder')} value={search} onChange={e => setSearch(e.target.value)} style={{ width: 320, borderRadius: 6 }} allowClear />
        <Space>
          <Button icon={<DownloadOutlined />} onClick={() => handleExport('excel')}>{t('database.exportExcel')}</Button>
          <Button icon={<DownloadOutlined />} onClick={() => handleExport('csv')}>{t('database.exportCsv')}</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => { form.resetFields(); setOpen(true); }}>{t('database.addDb')}</Button>
        </Space>
      </div>

      <KTable
        viewKeyPrefix={`db-${activeTab}-${search}`}
        rowKey="id"
        dataSource={filteredDbs}
        columns={columns}
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: () => {
            const isAllSelected = filteredDbs.length > 0 && selectedRowKeys.length === filteredDbs.length;
            const isIndeterminate = selectedRowKeys.length > 0 && selectedRowKeys.length < filteredDbs.length;
            return (
              <Space>
                <Checkbox
                  style={{ marginLeft: 0, marginRight: 10 }}
                  indeterminate={isIndeterminate}
                  checked={isAllSelected}
                  onChange={(e) => setSelectedRowKeys(e.target.checked ? filteredDbs.map(d => d.id) : [])}
                />
                <Select
                  size="small"
                  value={batchAction || undefined}
                  onChange={(val) => setBatchAction(val || '')}
                  style={{ width: 140 }}
                  placeholder={t('database.batchPlaceholder')}
                  options={[
                    { value: 'delete', label: <Space><DeleteOutlined /> {t('database.batchDelete')}</Space> },
                    { value: 'backup', label: <Space><CloudUploadOutlined /> {t('database.batchBackup')}</Space> }
                  ]}
                />
                <Button size="small" type={batchAction && selectedRowKeys.length > 0 ? "primary" : "default"} onClick={handleExecuteBatch}>{t('database.batchExecute')}</Button>
              </Space>
            );
          }
        }}
        size="middle"
        locale={{ emptyText: t('database.emptyText') }}
        rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
      />

      <Modal title={t('database.addModalTitle')} open={open} onOk={handleAdd} onCancel={() => setOpen(false)} confirmLoading={actionLoading === 'add'} okText={t('database.addModalOk')} cancelText={t('common.cancel')}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label={t('database.fieldName')} rules={[{ required: true, message: t('database.fieldNameRequired') }]}><Input placeholder="my_database" /></Form.Item>
          <Form.Item name="type" label={t('database.fieldType')} rules={[{ required: true, message: t('database.fieldTypeRequired') }]}><Select options={typeOptions} /></Form.Item>
          <Form.Item name="server" label={t('database.fieldServer')}><Select options={serverOptions} placeholder={t('database.fieldServerPlaceholder')} notFoundContent={t('database.fieldServerNotFound')} /></Form.Item>
          <Form.Item name="port" label={t('database.fieldPort')}><Input placeholder={t('database.fieldPortPlaceholder')} type="number" /></Form.Item>
        </Form>
      </Modal>

      <Modal title={t('database.detailTitle').replace('{name}', selectedDb?.name || '')} open={detailOpen} onCancel={() => setDetailOpen(false)} footer={null} width={600}>
        {selectedDb && (
          <Row gutter={[16, 16]}>
            <Col span={12}><Text strong>{t('database.detailType')}</Text><Tag color={typeColors[selectedDb.type]}>{selectedDb.type}</Tag></Col>
            <Col span={12}><Text strong>{t('database.detailStatus')}</Text><Badge status={selectedDb.status === 'online' ? 'success' : 'default'} text={selectedDb.status === 'online' ? t('database.statusOnline') : t('database.statusStopped')} /></Col>
            <Col span={12}><Text strong>{t('database.detailServer')}</Text><Text>{selectedDb.server || '—'}</Text></Col>
            <Col span={12}><Text strong>{t('database.detailPort')}</Text><Text code>{selectedDb.port}</Text></Col>
            <Col span={12}><Text strong>{t('database.detailSize')}</Text><Text>{selectedDb.size}</Text></Col>
            <Col span={12}><Text strong>{t('database.detailVersion')}</Text><Text>{selectedDb.version}</Text></Col>
            <Col span={12}><Text strong>{t('database.detailLastBackup')}</Text><Text>{selectedDb.lastBackup}</Text></Col>
            <Col span={12}><Text strong>{t('database.detailCreated')}</Text><Text>{new Date(selectedDb.createdAt).toLocaleString(localeMap[language] || 'vi-VN')}</Text></Col>
          </Row>
        )}
      </Modal>

      <Modal title={t('database.editTitle').replace('{name}', selectedDb?.name || '')} open={editOpen} onCancel={() => setEditOpen(false)} footer={null} width={700}>
        {selectedDb && (
          <Tabs activeKey={editTab} onChange={setEditTab} tabPosition="left" style={{ minHeight: 400 }} items={[t('database.editOverview'), t('database.editUsers'), t('database.editPermissions'), 'Backup', 'Replication', 'Logs', 'Monitoring', 'Performance', 'Security', 'Connection'].map(tab => ({
            key: tab, label: tab,
            children: (
              <Form form={editForm} layout="vertical" style={{ marginTop: 0, padding: '0' }}>
                {tab === t('database.editOverview') && (
                  <>
                    <Form.Item name="name" label={t('database.editFieldName')}><Input /></Form.Item>
                    <Form.Item name="server" label={t('database.editFieldServer')}><Select options={serverOptions} /></Form.Item>
                    <Form.Item name="port" label={t('database.editFieldPort')}><InputNumber style={{ width: '100%' }} /></Form.Item>
                    <Form.Item name="status" label={t('database.editFieldStatus')}><Select options={[{ label: t('database.statusOnline'), value: 'online' }, { label: t('database.statusStopped'), value: 'stopped' }]} /></Form.Item>
                    <Button type="primary" icon={<SaveOutlined />} onClick={() => { editForm.validateFields().then(v => { databasesApi.update(selectedDb.id, v); message.success(t('database.msgUpdated')); setEditOpen(false); loadData(); }); }}>{t('database.editSaveBtn')}</Button>
                  </>
                )}
                {tab !== t('database.editOverview') && <Text style={{ color: '#757575' }}>{t('database.editComingSoon').replace('{tab}', tab.toLowerCase())}</Text>}
              </Form>
            ),
          }))} />
        )}
      </Modal>

      <Modal title={t('database.logTitle').replace('{name}', selectedDb?.name || '')} open={logOpen} onCancel={() => setLogOpen(false)} footer={null} width={600}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid #F0F0F0' }}>
            <Tag color="blue" style={{ borderRadius: 4 }}>Backup</Tag>
            <Text>{t('database.logAutoBackup')}</Text>
            <div><Text style={{ color: '#999', fontSize: 12 }}>{t('database.logDaysAgo').replace('{n}', String(i))}</Text></div>
          </div>
        ))}
      </Modal>
    </div>
  );
};

export default Database;
