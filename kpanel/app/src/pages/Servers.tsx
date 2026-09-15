import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Typography, Tag, Card, Modal, Input, Badge, Tooltip, Form, Select, InputNumber, Switch, Drawer, message, Checkbox, Popconfirm, Spin, Tabs, Row, Col, Progress, Skeleton, Statistic } from '../custom-ui';
import { PlayCircleOutlined, StopOutlined, DeleteOutlined, ReloadOutlined, DatabaseOutlined, HistoryOutlined, SearchOutlined, EditOutlined, DownloadOutlined, CloudUploadOutlined, PlusOutlined, UploadOutlined, EyeOutlined, PoweroffOutlined, CloudServerOutlined } from '@ant-design/icons';
import { serversApi } from '../api/endpoints';
import { KTable } from '../components/KTable';
import { useLanguage } from '../context/LanguageContext';

const { Title, Text } = Typography;

interface ServerData {
  id: string;
  name: string;
  ip: string;
  region: string;
  status: 'online' | 'offline' | 'warning';
  cpu: number;
  ram: number;
  disk: number;
  os: string;
}

// Os and Region options remain in English (international standard)
const regionOptions = ['Singapore', 'Tokyo', 'Frankfurt', 'N. Virginia', 'Local'].map(r => ({ label: r, value: r }));
const osOptions = ['Ubuntu 22.04', 'Ubuntu 20.04', 'Debian 11', 'CentOS 7'].map(o => ({ label: o, value: o }));

const cpuColor = (v: number) => v > 70 ? '#F44336' : v > 50 ? '#FF9800' : '#009688';

const Servers: React.FC = () => {
  const { t } = useLanguage();
  const statusMap: Record<string, { color: string; text: string }> = {
    online: { color: '#009688', text: t('servers.statusOnline') },
    offline: { color: '#bbb', text: t('servers.statusOffline') },
    warning: { color: '#FF9800', text: t('servers.statusWarning') },
  };

  const [servers, setServers] = useState<ServerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [deleteConfirmKey, setDeleteConfirmKey] = useState<string | null>(null);
  const [actionConfirmKey, setActionConfirmKey] = useState<string | null>(null);
  const [hoverKey, setHoverKey] = useState<string | null>(null);
  const [form] = Form.useForm();

  const safeServers = Array.isArray(servers) ? servers : [];
  const filteredServers = safeServers.filter(s => !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.ip.includes(search));

  const loadServers = async () => {
    try {
      setLoading(true);
      const res = await serversApi.getAll();
      const list = Array.isArray(res?.data) ? res.data : (Array.isArray(res?.data?.data) ? res.data.data : []);
      setServers(list);
    } catch (err: any) {
      console.error(err);
      message.error(t('servers.msgErrorLoad'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServers();
  }, []);

  const handleAdd = () => {
    form.validateFields().then(async (values: any) => {
      try {
        setActionLoading('add');
        // Tạo máy chủ mới sẽ mặc định offline, RAM/CPU/Disk = 0 hoặc random
        const dataToPost = {
          ...values,
          cpu: values.status === 'online' ? Math.floor(Math.random() * 40) + 10 : 0,
          ram: values.status === 'online' ? Math.floor(Math.random() * 40) + 30 : 0,
          disk: values.status === 'online' ? Math.floor(Math.random() * 50) + 10 : 0,
          status: 'offline', // Mặc định tạo mới sẽ offline
        };
        await serversApi.create(dataToPost);
        message.success(t('servers.msgSuccessAdd'));
        form.resetFields();
        setOpen(false);
        loadServers();
      } catch (err: any) {
        console.error(err);
        message.error(err.response?.data?.message || t('servers.msgErrorAdd'));
      } finally {
        setActionLoading(null);
      }
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await serversApi.remove(id);
      message.success(t('servers.msgSuccessDelete'));
      loadServers();
    } catch (err: any) {
      console.error(err);
      message.error(t('servers.msgErrorDelete'));
    }
  };

  const handlePowerAction = async (record: ServerData, action: 'restart' | 'stop') => {
    try {
      let updatedStatus: 'online' | 'offline' = 'online';
      let cpu = 0;
      let ram = 0;
      let disk = record.disk || 15;

      if (action === 'restart') {
        updatedStatus = 'online';
        cpu = Math.floor(Math.random() * 45) + 15;
        ram = Math.floor(Math.random() * 30) + 40;
        message.loading({ content: t('servers.msgLoadingRestart'), key: 'power_act' });
      } else {
        updatedStatus = 'offline';
        cpu = 0;
        ram = 0;
        message.loading({ content: t('servers.msgLoadingStop'), key: 'power_act' });
      }

      await serversApi.update(record.id, {
        status: updatedStatus,
        cpu,
        ram,
        disk,
      });

      message.success({ content: action === 'restart' ? t('servers.msgSuccessRestart') : t('servers.msgSuccessStop'), key: 'power_act', duration: 2 });
      loadServers();
    } catch (err: any) {
      console.error(err);
      message.error({ content: t('servers.msgErrorPower'), key: 'power_act' });
    }
  };

  const columns = [
    {
      title: t('servers.colName'),
      dataIndex: 'name',
      key: 'name',
      render: (v: string, r: ServerData) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: r.status === 'online' ? '#009688' : '#bbb' }}>●</span>
          <span style={{ fontWeight: 600 }}>{v}</span>
        </div>
      ),
    },
    { title: 'IP', dataIndex: 'ip', key: 'ip', render: (v: string) => <span>{v}</span> },
    { title: t('servers.colRegion'), dataIndex: 'region', key: 'region', render: (v: string) => v || '—' },
    { title: t('servers.colOs'), dataIndex: 'os', key: 'os', render: (v: string) => v || '—' },
    {
      title: t('servers.colCpu'),
      dataIndex: 'cpu',
      key: 'cpu',
      render: (v: number, r: ServerData) => r.status === 'offline' ? <span>—</span> : <span>{v}%</span>,
    },
    {
      title: t('servers.colRam'),
      dataIndex: 'ram',
      key: 'ram',
      render: (v: number, r: ServerData) => r.status === 'offline' ? <span>—</span> : <span>{v}%</span>,
    },
    {
      title: t('servers.colStatus'),
      dataIndex: 'status',
      key: 'status',
      render: (v: string) => {
        let tagColor = 'default';
        if (v === 'online') tagColor = 'success';
        else if (v === 'warning') tagColor = 'warning';
        return (
          <Tag color={tagColor} style={{ borderRadius: 4, margin: 0 }}>
            {statusMap[v]?.text || v}
          </Tag>
        );
      },
    },
    {
      title: t('servers.colActions'),
      key: 'actions',
      render: (_: any, r: ServerData) => (
        <Space>
          <Popconfirm 
            title={t('servers.confirmRestart')} 
            onConfirm={() => handlePowerAction(r, 'restart')} okText={t('servers.btnRestart')} cancelText={t('common.cancel')}
            onOpenChange={(open) => { if (open) setActionConfirmKey(`${r.id}-restart`); }}
            afterOpenChange={(open) => {
              if (!open) { setActionConfirmKey(null); setHoverKey(null); }
            }}
          >
            <Tooltip title={t('servers.tooltipRestart')} open={hoverKey === `${r.id}-restart` && actionConfirmKey !== `${r.id}-restart`}>
              <Button 
                size="small" 
                icon={<ReloadOutlined />}
                onMouseEnter={() => setHoverKey(`${r.id}-restart`)}
                onMouseLeave={() => setHoverKey(null)}
              />
            </Tooltip>
          </Popconfirm>
          <Popconfirm 
            title={t('servers.confirmStop')} 
            onConfirm={() => handlePowerAction(r, 'stop')} okText={t('servers.btnStop')} cancelText={t('common.cancel')} okButtonProps={{ danger: true, style: { color: 'black' } }}
            onOpenChange={(open) => { if (open) setActionConfirmKey(`${r.id}-stop`); }}
            afterOpenChange={(open) => {
              if (!open) { setActionConfirmKey(null); setHoverKey(null); }
            }}
          >
            <Tooltip title={t('servers.tooltipStop')} open={hoverKey === `${r.id}-stop` && actionConfirmKey !== `${r.id}-stop`}>
              <Button 
                size="small" 
                danger 
                icon={<PoweroffOutlined />}
                onMouseEnter={() => setHoverKey(`${r.id}-stop`)}
                onMouseLeave={() => setHoverKey(null)}
              />
            </Tooltip>
          </Popconfirm>
          <Tooltip title={t('servers.tooltipDelete')} open={hoverKey === `${r.id}-delete` && deleteConfirmKey !== r.id}>
            <Popconfirm 
              title={t('servers.confirmDelete')} 
              description={t('servers.confirmDeleteDesc')}
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
                onMouseEnter={() => setHoverKey(`${r.id}-delete`)}
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


      <Row gutter={[16, 16]} style={{ marginBottom: 8 }}>
        {[
          { label: t('servers.statTotal'), value: safeServers.length },
          { label: t('servers.statActive'), value: safeServers.filter(s => s.status === 'online').length },
          { label: t('servers.statOffline'), value: safeServers.filter(s => s.status === 'offline').length },
          { label: t('servers.statWarning'), value: safeServers.filter(s => s.status === 'warning').length },
        ].map((s, i) => (
          <Col xs={12} sm={6} key={i}>
            <Card>
              <Statistic title={s.label} value={s.value} loading={loading} />
            </Card>
          </Col>
        ))}
      </Row>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 0 }}>
        <Input prefix={<SearchOutlined style={{ color: '#bbb' }} />} placeholder={t('servers.searchPlaceholder')} value={search} onChange={e => setSearch(e.target.value)} style={{ width: 320, borderRadius: 6 }} allowClear />
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>{t('servers.addServer')}</Button>
      </div>

      <KTable
        viewKeyPrefix={`servers-${search}`}
        rowKey="id"
        dataSource={filteredServers}
        columns={columns}
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true
        }}
        size="middle"
        locale={{ emptyText: t('servers.emptyText') }}
      />

      <Modal
        title={t('servers.modalTitle')}
        open={open}
        onOk={handleAdd}
        onCancel={() => setOpen(false)}
        confirmLoading={actionLoading === 'add'}
        okText={t('database.addModalOk')}
        cancelText={t('common.cancel')}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label={t('servers.colName')} rules={[{ required: true, message: t('servers.validationNameRequired') }]}>
            <Input placeholder={t('servers.fieldNamePlaceholder')} />
          </Form.Item>
          <Form.Item name="ip" label={t('servers.fieldIp')} rules={[{ required: true, message: t('servers.validationIpRequired') }]}>
            <Input placeholder={t('servers.fieldIpPlaceholder')} />
          </Form.Item>
          <Form.Item name="region" label={t('servers.colRegion')}>
            <Select options={regionOptions} placeholder={t('servers.colRegion')} />
          </Form.Item>
          <Form.Item name="os" label={t('servers.colOs')}>
            <Select options={osOptions} placeholder={t('servers.colOs')} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Servers;
