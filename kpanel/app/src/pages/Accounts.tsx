import React, { useEffect, useState } from 'react';
import { Button, Tag, Space, Typography, Modal, Form, Input, Select, Card, Avatar, Badge, message, Popconfirm, Spin, Tooltip, Switch, Tabs, Row, Col, Divider, Statistic, Alert, Checkbox, Table } from '../custom-ui';
import { PlusOutlined, DeleteOutlined, UserOutlined, EditOutlined, EyeOutlined, HistoryOutlined, KeyOutlined, SafetyOutlined, GroupOutlined, ApiOutlined, LockOutlined, SnippetsOutlined, SaveOutlined, CopyOutlined, SearchOutlined, CheckCircleOutlined, SafetyCertificateOutlined, TeamOutlined } from '@ant-design/icons';
import { usersApi } from '../api/endpoints';
import { KTable } from '../components/KTable';
import { useLanguage } from '../context/LanguageContext';

const { Title, Text } = Typography;

const roleColor: Record<string, string> = { Administrator: 'red', Operator: 'blue', Viewer: 'default', 'Super Admin': 'volcano' };
const roleOptions = ['Super Admin', 'Administrator', 'Operator', 'Viewer'].map(r => ({ label: r, value: r }));

interface AccountData {
  id: string; name: string; email: string; role: string; isActive: boolean; lastLoginAt: string | null; createdAt: string;
}

const rolePermissions: Record<string, string[]> = {
  'Super Admin': ['allAccess', 'manageUsers', 'manageSystem', 'manageSecurity', 'manageBilling'],
  Administrator: ['manageProjects', 'manageServers', 'manageDatabases', 'viewLogs', 'manageFiles'],
  Operator: ['viewDashboard', 'manageProjects', 'viewServers', 'viewLogs'],
  Viewer: ['viewDashboard', 'viewProjects', 'viewServers'],
};

const initialRoles = ['Super Admin', 'Administrator', 'Operator', 'Viewer'];
const initialGroups = [
  { key: '1', name: 'Developers', members: 5, descKey: 'devs' },
  { key: '2', name: 'DevOps', members: 3, descKey: 'devops' },
  { key: '3', name: 'Admins', members: 2, descKey: 'admins' },
];

const Accounts: React.FC = () => {
  const { t, language } = useLanguage();
  const [accounts, setAccounts] = useState<AccountData[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [logOpen, setLogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AccountData | null>(null);
  const [activeTab, setActiveTab] = useState('users');
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [batchAction, setBatchAction] = useState<string>('');
  const [search, setSearch] = useState('');
  const [deleteConfirmKey, setDeleteConfirmKey] = useState<string | null>(null);
  const [hoverKey, setHoverKey] = useState<string | null>(null);

  const loadAccounts = async () => {
    try {
      setLoading(true);
      const res = await usersApi.getAll();
      const list = Array.isArray(res?.data) ? res.data : (Array.isArray(res?.data?.data) ? res.data.data : []);
      setAccounts(list);
    } catch {
      message.error(t('accounts.msgErrorLoad'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAccounts(); }, []);

  const handleAdd = () => {
    form.validateFields().then(async (values: any) => {
      try {
        setActionLoading('add');
        await usersApi.create(values);
        message.success(t('accounts.msgSuccessAdd'));
        form.resetFields(); setOpen(false); loadAccounts();
      } catch (err: any) {
        message.error(err.response?.data?.message || t('accounts.msgErrorAdd'));
      } finally {
        setActionLoading(null);
      }
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await usersApi.remove(id);
      message.success(t('accounts.msgSuccessDelete'));
      loadAccounts();
    } catch { message.error(t('accounts.msgErrorDelete')); }
  };

  const handleToggleStatus = async (record: AccountData) => {
    try {
      await usersApi.update(record.id, { isActive: !record.isActive });
      message.success(record.isActive ? t('accounts.msgSuccessDisable') : t('accounts.msgSuccessEnable'));
      loadAccounts();
    } catch { message.error(t('accounts.msgErrorToggle')); }
  };

  const safeAccounts = Array.isArray(accounts) ? accounts : [];
  const filteredAccounts = safeAccounts.filter(a => !search || a.name?.toLowerCase().includes(search.toLowerCase()) || a.email?.toLowerCase().includes(search.toLowerCase()));

  const handleExecuteBatch = () => {
    if (!batchAction) {
      message.warning(t('accounts.validationWarningSelect'));
      return;
    }
    if (selectedRowKeys.length === 0) {
      message.warning(t('accounts.validationWarningAtLeast'));
      return;
    }
    if (batchAction === 'delete') {
      Modal.confirm({
        title: t('accounts.confirmBatchDelete'),
        content: t('accounts.confirmBatchDeleteDesc').replace('{count}', selectedRowKeys.length.toString()),
        okText: t('common.yes'),
        cancelText: t('common.no'),
        okButtonProps: { danger: true },
        onOk: () => {
          setAccounts(prev => prev.filter(a => !selectedRowKeys.includes(a.id)));
          setSelectedRowKeys([]);
          message.success(t('accounts.msgBatchDeleted').replace('{count}', selectedRowKeys.length.toString()));
        }
      });
    }
  };

  const userColumns = [
    { title: t('accounts.colUser'), dataIndex: 'name', key: 'name', render: (v: string) => <Space><Avatar size={28} icon={<UserOutlined />} style={{ background: '#009688' }} /><Text strong>{v}</Text></Space>, sorter: (a: AccountData, b: AccountData) => a.name.localeCompare(b.name) },
    { title: t('accounts.colEmail'), dataIndex: 'email', key: 'email', render: (v: string) => <span style={{ color: '#757575' }}>{v}</span> },
    { title: t('accounts.colRole'), dataIndex: 'role', key: 'role', render: (v: string) => <Tag color={roleColor[v] || 'default'} style={{ borderRadius: 4 }}>{v}</Tag>, filters: initialRoles.map(r => ({ text: r, value: r })), onFilter: (value: any, record: AccountData) => record.role === value },
    { title: t('accounts.colStatus'), dataIndex: 'isActive', key: 'isActive', render: (isActive: boolean, record: AccountData) => <Space><Switch size="small" checked={isActive} onChange={() => handleToggleStatus(record)} /><Badge status={isActive ? 'success' : 'default'} text={isActive ? t('accounts.statusActive') : t('accounts.statusStopped')} /></Space> },
    { title: t('accounts.colLastLogin'), dataIndex: 'lastLoginAt', key: 'lastLoginAt', render: (v: string | null) => <span style={{ color: '#bbb', fontSize: 12 }}>{v ? new Date(v).toLocaleString() : t('accounts.neverLogin')}</span>, sorter: (a: AccountData, b: AccountData) => { if (!a.lastLoginAt) return 1; if (!b.lastLoginAt) return -1; return new Date(a.lastLoginAt).getTime() - new Date(b.lastLoginAt).getTime(); } },
    {
      title: t('accounts.colActions'), key: 'actions',
      render: (_: any, r: AccountData) => (
        <Space>
          <Tooltip title={t('accounts.tooltipView')}><Button size="small" icon={<EyeOutlined />} onClick={() => { setSelectedUser(r); setDetailOpen(true); }} /></Tooltip>
          <Tooltip title={t('accounts.tooltipEdit')}><Button size="small" icon={<EditOutlined />} onClick={() => { setSelectedUser(r); editForm.setFieldsValue(r); setEditOpen(true); }} /></Tooltip>
          <Tooltip title={t('accounts.tooltipLogs')}><Button size="small" icon={<HistoryOutlined />} onClick={() => { setSelectedUser(r); setLogOpen(true); }} /></Tooltip>
            <Tooltip title={t('accounts.tooltipDelete')} open={hoverKey === r.id && deleteConfirmKey !== r.id}>
              <Popconfirm 
                title={t('accounts.confirmDelete')} 
                description={t('accounts.confirmDeleteDesc')}
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

  return (
    <div>


      <Tabs activeKey={activeTab} onChange={setActiveTab} items={[
        {
          key: 'users', label: <Space><UserOutlined />{t('accounts.tabUsers')}</Space>,
          children: (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <Input prefix={<SearchOutlined style={{ color: '#bbb' }} />} placeholder={t('accounts.searchPlaceholder')} value={search} onChange={e => setSearch(e.target.value)} style={{ width: 320, borderRadius: 6 }} allowClear />
                <Button type="primary" icon={<PlusOutlined />} onClick={() => { form.resetFields(); setOpen(true); }}>{t('accounts.addAccount')}</Button>
              </div>
              <KTable 
                viewKeyPrefix="accounts" 
                dataSource={filteredAccounts} 
                columns={userColumns} 
                loading={loading} 
                pagination={{ 
                  pageSize: 10, 
                  showSizeChanger: true,
                  showTotal: () => {
                    const isAllSelected = filteredAccounts.length > 0 && selectedRowKeys.length === filteredAccounts.length;
                    const isIndeterminate = selectedRowKeys.length > 0 && selectedRowKeys.length < filteredAccounts.length;
                    return (
                      <Space size={4}>
                        <Checkbox 
                          style={{ marginLeft: 0, marginRight: 10 }}
                          indeterminate={isIndeterminate}
                          checked={isAllSelected}
                          onChange={(e) => setSelectedRowKeys(e.target.checked ? filteredAccounts.map(d => d.id) : [])}
                        />
                        <Select
                          size="small"
                          value={batchAction || undefined}
                          onChange={setBatchAction}
                          style={{ width: 140 }}
                          placeholder={t('accounts.batchPlaceholder')}
                          options={[
                            { value: 'delete', label: <Space><DeleteOutlined /> {t('common.delete')}</Space> }
                          ]}
                        />
                        <Button size="small" type={batchAction && selectedRowKeys.length > 0 ? "primary" : "default"} onClick={handleExecuteBatch}>{t('accounts.batchExecute')}</Button>
                      </Space>
                    );
                  }
                }} 
                size="middle" 
                locale={{ emptyText: t('accounts.emptyText') }} 
                rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }} 
              />
            </div>
          ),
        },
        {
          key: 'roles', label: <Space><SafetyOutlined />{t('accounts.tabRoles')}</Space>,
          children: (
            <Row gutter={[16, 16]}>
              {initialRoles.map(role => (
                <Col xs={24} sm={12} key={role}>
                  <Card title={<Space><Tag color={roleColor[role] || 'default'} style={{ borderRadius: 4 }}>{role}</Tag><Text strong>{role}</Text></Space>}>
                    <Text style={{ color: '#757575', marginBottom: 8, display: 'block' }}>{t('accounts.permissionsLabel')}</Text>
                    {(rolePermissions[role] || []).map((perm, i) => (
                      <div key={i} style={{ padding: '4px 0' }}><CheckCircleOutlined style={{ color: '#009688', marginRight: 8 }} /><Text>{t('accounts.permissions.' + perm)}</Text></div>
                    ))}
                    <Divider style={{ margin: '12px 0' }} />
                    <Text style={{ color: '#999', fontSize: 12 }}>{t('accounts.membersCount').replace('{count}', accounts.filter(a => a.role === role).length.toString())}</Text>
                  </Card>
                </Col>
              ))}
            </Row>
          ),
        },
        {
          key: 'groups', label: <Space><GroupOutlined />{t('accounts.tabGroups')}</Space>,
          children: (
            <Row gutter={[16, 16]}>
              {initialGroups.map(g => (
                <Col xs={24} sm={12} md={8} key={g.key}>
                  <Card title={<Text strong>{g.name}</Text>} actions={[<Tooltip title={t('accounts.tooltipEdit')}><EditOutlined key="edit" /></Tooltip>, <Tooltip title={t('accounts.tooltipDelete')} open={deleteConfirmKey === `group-${g.key}` ? false : undefined}><Popconfirm title={t('accounts.confirmDelete')} okText={t('common.yes')} cancelText={t('common.no')} onOpenChange={(open) => setDeleteConfirmKey(open ? `group-${g.key}` : null)}><DeleteOutlined key="delete" /></Popconfirm></Tooltip>]}>
                    <Text style={{ color: '#757575' }}>{t('accounts.groups.' + g.descKey)}</Text>
                    <div style={{ marginTop: 8 }}><Tag style={{ borderRadius: 4 }}>{t('accounts.membersCount').replace('{count}', g.members.toString())}</Tag></div>
                  </Card>
                </Col>
              ))}
            </Row>
          ),
        },
        {
          key: 'apikeys', label: <Space><ApiOutlined />{t('accounts.tabApikeys')}</Space>,
          children: (
            <div>
              <Alert message={t('accounts.apiAlert')} type="info" showIcon style={{ marginBottom: 16, borderRadius: 6 }} />
              <Card styles={{ body: { padding: 0 } }}>
                <Table dataSource={[
                  { key: '1', name: 'Production API Key', key_value: 'kp_prod_8a7d...3f2b', created: '2026-06-01', lastUsed: '2026-06-17', status: 'active' },
                  { key: '2', name: 'Staging API Key', key_value: 'kp_stag_2c4e...9a1d', created: '2026-05-15', lastUsed: '2026-06-16', status: 'active' },
                ]} columns={[
                  { title: t('files.columnName'), dataIndex: 'name', key: 'name', render: (v: string) => <Text strong>{v}</Text> },
                  { title: t('accounts.colKey'), dataIndex: 'key_value', key: 'key_value', render: (v: string) => <Space><Text code style={{ fontSize: 12 }}>{v}</Text><Tooltip title={t('files.copy')}><Button size="small" icon={<CopyOutlined />} onClick={() => { navigator.clipboard.writeText(v); message.success(t('accounts.copySuccess')); }} /></Tooltip></Space> },
                  { title: t('accounts.colCreated'), dataIndex: 'created', key: 'created' },
                  { title: t('accounts.colLastUsed'), dataIndex: 'lastUsed', key: 'lastUsed' },
                  { title: t('common.status'), dataIndex: 'status', key: 'status', render: (v: string) => <Badge status={v === 'active' ? 'success' : 'default'} text={v === 'active' ? t('accounts.statusActive') : 'Blocked'} /> },
                  { title: t('common.action'), key: 'actions', render: (_: any, r: any) => <Space><Button size="small" icon={<EditOutlined />} /><Tooltip title={t('accounts.tooltipDelete')} open={deleteConfirmKey === `apikey-${r.key}` ? false : undefined}><Popconfirm title={t('accounts.confirmRevokeKey')} okText={t('common.yes')} cancelText={t('common.no')} onOpenChange={(open) => setDeleteConfirmKey(open ? `apikey-${r.key}` : null)}><Button size="small" icon={<DeleteOutlined />} danger /></Popconfirm></Tooltip></Space> },
                ]} pagination={false} size="small" />
              </Card>
            </div>
          ),
        },
        {
          key: 'sshkeys', label: <Space><KeyOutlined />{t('accounts.tabSshkeys')}</Space>,
          children: (
            <div>
              <Alert message={t('accounts.sshAlert')} type="info" showIcon style={{ marginBottom: 16, borderRadius: 6 }} />
              <Card styles={{ body: { padding: 0 } }}>
                <Table dataSource={[
                  { key: '1', name: 'Main Workstation', fingerprint: 'SHA256:abc...xyz', added: '2026-01-15' },
                  { key: '2', name: 'Laptop', fingerprint: 'SHA256:def...uvw', added: '2026-03-20' },
                ]} columns={[
                  { title: t('files.columnName'), dataIndex: 'name', key: 'name', render: (v: string) => <Text strong>{v}</Text> },
                  { title: t('accounts.colFingerprint'), dataIndex: 'fingerprint', key: 'fingerprint', render: (v: string) => <Text code style={{ fontSize: 12 }}>{v}</Text> },
                  { title: t('accounts.colAdded'), dataIndex: 'added', key: 'added' },
                  { title: t('common.action'), key: 'actions', render: (_: any, r: any) => <Tooltip title={t('accounts.tooltipDelete')} open={deleteConfirmKey === `sshkey-${r.key}` ? false : undefined}><Popconfirm title={t('accounts.confirmDeleteSsh')} okText={t('common.yes')} cancelText={t('common.no')} onOpenChange={(open) => setDeleteConfirmKey(open ? `sshkey-${r.key}` : null)}><Button size="small" icon={<DeleteOutlined />} danger /></Popconfirm></Tooltip> },
                ]} pagination={false} size="small" />
              </Card>
            </div>
          ),
        },
        {
          key: 'sessions', label: <Space><LockOutlined />{t('accounts.tabSessions')}</Space>,
          children: (
            <Card styles={{ body: { padding: 0 } }}>
              <Table dataSource={[
                { key: '1', ip: '192.168.1.100', device: 'Chrome / Windows', lastActive: t('accounts.statusActive'), created: '2026-06-17 08:30' },
                { key: '2', ip: '10.0.0.50', device: 'Safari / macOS', lastActive: t('dashboard.hoursAgo').replace('{n}', '2'), created: '2026-06-17 06:00' },
                { key: '3', ip: '185.220.101.23', device: 'Unknown', lastActive: t('projects.logDaysAgo').replace('{n}', '1'), created: '2026-06-16 14:00' },
              ]} columns={[
                { title: 'IP', dataIndex: 'ip', key: 'ip', render: (v: string) => <Text code style={{ fontSize: 12 }}>{v}</Text> },
                { title: t('accounts.colDevice'), dataIndex: 'device', key: 'device' },
                { title: t('accounts.colLastActive'), dataIndex: 'lastActive', key: 'lastActive' },
                { title: t('accounts.colStart'), dataIndex: 'created', key: 'created' },
                { title: t('common.action'), key: 'actions', render: (_: any, r: any) => <Popconfirm title={t('accounts.confirmRevokeSession')} okText={t('common.yes')} cancelText={t('common.no')}><Button size="small" danger>{t('accounts.btnRevokeSession')}</Button></Popconfirm> },
              ]} pagination={false} size="small" />
            </Card>
          ),
        },
        {
          key: '2fa', label: <Space><SafetyOutlined />{t('accounts.tab2fa')}</Space>,
          children: (
            <Row gutter={[16, 16]}>
              <Col span={24}><Alert message={t('accounts.alert2fa')} type="warning" showIcon style={{ borderRadius: 6 }} /></Col>
              <Col xs={24} md={12}>
                <Card title={<Text strong>2FA Status</Text>}>
                  <Statistic title={t('accounts.stat2faActive')} value={accounts.filter(a => a.role === 'Administrator').length} suffix={`/ ${accounts.length}`} />
                  <Divider />
                  <Button type="primary" icon={<SafetyOutlined />}>{t('accounts.btnRequire2fa')}</Button>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card title={<Text strong>{t('accounts.methods2fa')}</Text>}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F0F0F0' }}><Text>Google Authenticator</Text><Switch defaultChecked size="small" /></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F0F0F0' }}><Text>Email OTP</Text><Switch size="small" /></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}><Text>SMS OTP</Text><Switch size="small" /></div>
                </Card>
              </Col>
            </Row>
          ),
        },
        {
          key: 'permissions', label: <Space><SafetyOutlined />{t('accounts.tabPermissions')}</Space>,
          children: (
            <Card styles={{ body: { padding: 0 } }}>
              <Table dataSource={[
                { key: '1', module: 'Dashboard', view: true, create: false, edit: false, del: false },
                { key: '2', module: 'Projects', view: true, create: true, edit: true, del: true },
                { key: '3', module: 'Servers', view: true, create: true, edit: true, del: true },
                { key: '4', module: 'Database', view: true, create: true, edit: true, del: true },
                { key: '5', module: 'Security', view: true, create: false, edit: false, del: false },
                { key: '6', module: 'Accounts', view: true, create: false, edit: false, del: false },
                { key: '7', module: 'Settings', view: true, create: false, edit: false, del: false },
              ]} columns={[
                { title: t('accounts.colModule'), dataIndex: 'module', key: 'module', render: (v: string) => <Text strong>{v}</Text> },
                { title: t('accounts.colView'), dataIndex: 'view', key: 'view', render: (v: boolean) => <Switch size="small" checked={v} /> },
                { title: t('accounts.colCreate'), dataIndex: 'create', key: 'create', render: (v: boolean) => <Switch size="small" checked={v} /> },
                { title: t('accounts.colEdit'), dataIndex: 'edit', key: 'edit', render: (v: boolean) => <Switch size="small" checked={v} /> },
                { title: t('accounts.colDelete'), dataIndex: 'del', key: 'del', render: (v: boolean) => <Switch size="small" checked={v} /> },
              ]} pagination={false} size="small" />
            </Card>
          ),
        },
        {
          key: 'audit', label: <Space><HistoryOutlined />{t('accounts.tabAudit')}</Space>,
          children: (
            <Card styles={{ body: { padding: 0 } }}>
              <Table dataSource={[
                { key: '1', user: 'admin', action: 'Login', target: 'System', ip: '192.168.1.100', date: '2026-06-17 08:30' },
                { key: '2', user: 'admin', action: 'Create user', target: 'dev1', ip: '192.168.1.100', date: '2026-06-16 14:30' },
                { key: '3', user: 'admin', action: 'Update role', target: 'operator -> Administrator', ip: '192.168.1.100', date: '2026-06-15 11:00' },
              ]} columns={[
                { title: t('accounts.colUser'), dataIndex: 'user', key: 'user', render: (v: string) => <Tag style={{ borderRadius: 4 }}>{v}</Tag> },
                { title: t('common.action'), dataIndex: 'action', key: 'action' },
                { title: t('accounts.colTarget'), dataIndex: 'target', key: 'target' },
                { title: 'IP', dataIndex: 'ip', key: 'ip', render: (v: string) => <Text code style={{ fontSize: 12 }}>{v}</Text> },
                { title: t('logs.titleTime'), dataIndex: 'date', key: 'date' },
              ]} pagination={{ pageSize: 10 }} size="small" />
            </Card>
          ),
        },
      ]} />

      <Modal title={t('accounts.modalAddTitle')} open={open} onOk={handleAdd} onCancel={() => setOpen(false)} confirmLoading={actionLoading === 'add'} okText={t('accounts.btnSave')} cancelText={t('common.cancel')}>
        <Form form={form} layout="vertical" style={{ marginTop: 12 }}>
          <Form.Item name="name" label={t('accounts.fieldDisplayName')} rules={[{ required: true, message: t('accounts.validationDisplayName') }]}><Input placeholder={t('accounts.fieldDisplayNamePlaceholder')} /></Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: t('accounts.validationEmail') }]}><Input placeholder="username@example.com" /></Form.Item>
          <Form.Item name="role" label={t('accounts.colRole')} rules={[{ required: true, message: t('accounts.validationRole') }]}><Select options={roleOptions} placeholder={t('accounts.validationRole')} /></Form.Item>
          <Form.Item name="password" label={t('accounts.fieldPassword')} rules={[{ required: true, message: t('accounts.validationPassword') }]}><Input.Password placeholder={t('accounts.fieldPasswordPlaceholder')} /></Form.Item>
        </Form>
      </Modal>

      <Modal title={t('accounts.modalEditTitle').replace('{name}', selectedUser?.name || '')} open={editOpen} onCancel={() => setEditOpen(false)} footer={null}>
        <Form form={editForm} layout="vertical" style={{ marginTop: 12 }}>
          <Form.Item name="name" label={t('accounts.fieldDisplayName')}><Input /></Form.Item>
          <Form.Item name="email" label="Email"><Input /></Form.Item>
          <Form.Item name="role" label={t('accounts.colRole')}><Select options={roleOptions} /></Form.Item>
          <Button type="primary" icon={<SaveOutlined />} onClick={() => { editForm.validateFields().then(v => { if (selectedUser) { usersApi.update(selectedUser.id, v); message.success(t('projects.msgUpdated')); setEditOpen(false); loadAccounts(); } }); }}>{t('accounts.btnSaveChange')}</Button>
        </Form>
      </Modal>

      <Modal title={t('accounts.modalDetailTitle').replace('{name}', selectedUser?.name || '')} open={detailOpen} onCancel={() => setDetailOpen(false)} footer={null}>
        {selectedUser && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <Avatar size={64} icon={<UserOutlined />} style={{ background: '#009688' }} />
              <Title level={5} style={{ marginTop: 8 }}>{selectedUser.name}</Title>
              <Tag color={roleColor[selectedUser.role]} style={{ borderRadius: 4 }}>{selectedUser.role}</Tag>
            </div>
            <Row gutter={[16, 12]}>
              <Col span={12}><Text strong>Email:</Text></Col><Col span={12}><Text>{selectedUser.email}</Text></Col>
              <Col span={12}><Text strong>{t('common.status')}:</Text></Col><Col span={12}><Badge status={selectedUser.isActive ? 'success' : 'default'} text={selectedUser.isActive ? t('accounts.statusActive') : t('accounts.statusStopped')} /></Col>
              <Col span={12}><Text strong>{t('accounts.colLastLogin')}:</Text></Col><Col span={12}><Text>{selectedUser.lastLoginAt ? new Date(selectedUser.lastLoginAt).toLocaleString() : t('accounts.neverLogin')}</Text></Col>
              <Col span={12}><Text strong>{t('accounts.colCreated')}:</Text></Col><Col span={12}><Text>{new Date(selectedUser.createdAt).toLocaleString(language === 'vi' ? 'vi-VN' : language === 'ja' ? 'ja-JP' : language === 'zh' ? 'zh-CN' : 'en-US')}</Text></Col>
            </Row>
          </div>
        )}
      </Modal>

      <Modal title={t('accounts.modalLogsTitle').replace('{name}', selectedUser?.name || '')} open={logOpen} onCancel={() => setLogOpen(false)} footer={null} width={600}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid #F0F0F0', display: 'flex', justifyContent: 'space-between' }}>
            <div><Tag color="blue" style={{ borderRadius: 4 }}>{t('accounts.logActionChange')}</Tag><Text>{t('accounts.logActionChangeDesc')}</Text></div><Text style={{ color: '#999', fontSize: 12 }}>{t('accounts.logDaysAgo').replace('{n}', i.toString())}</Text>
          </div>
        ))}
      </Modal>
    </div>
  );
};

export default Accounts;
