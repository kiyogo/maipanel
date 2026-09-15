import React, { useEffect, useState } from 'react';
import { Button, Tag, Space, Typography, Card, Input, message, Popconfirm, Spin } from '../custom-ui';
import { SearchOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import { logsApi } from '../api/endpoints';
import { KTable } from '../components/KTable';
import { useLanguage } from '../context/LanguageContext';

const { Title, Text } = Typography;

interface LogData {
  id: string;
  level: 'INFO' | 'WARNING' | 'ERROR' | 'DEBUG';
  service: string;
  message: string;
  createdAt: string;
}

const levelColors: Record<string, string> = {
  INFO:    'cyan',
  WARNING: 'orange',
  ERROR:   'red',
  DEBUG:   'default',
};

const Logs: React.FC = () => {
  const { t } = useLanguage();
  const [logs, setLogs] = useState<LogData[]>([]);
  const [loading, setLoading] = useState(true);
  const [levelFilter, setLevelFilter] = useState('');
  const [search, setSearch] = useState('');

  const loadLogs = async () => {
    try {
      setLoading(true);
      const res = await logsApi.getAll(150); // limit 150 logs gần nhất
      const list = Array.isArray(res?.data) ? res.data : (Array.isArray(res?.data?.data) ? res.data.data : []);
      setLogs(list);
    } catch (err: any) {
      console.error(err);
      message.error(t('logs.msgErrorLoad'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const handleClear = async () => {
    try {
      await logsApi.clear();
      message.success(t('logs.msgSuccessClear'));
      setLogs([]);
    } catch (err: any) {
      console.error(err);
      message.error(t('logs.msgErrorClear'));
    }
  };

  const safeLogs = Array.isArray(logs) ? logs : [];
  const filtered = safeLogs.filter(l => {
    const matchL = !levelFilter || l.level === levelFilter;
    const matchS = !search ||
      l.message.toLowerCase().includes(search.toLowerCase()) ||
      (l.service && l.service.toLowerCase().includes(search.toLowerCase()));
    return matchL && matchS;
  });

  const columns = [
    {
      title: t('logs.titleTime'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      render: (v: string) => (
        <Text style={{ fontSize: 12, color: '#999', fontFamily: 'monospace' }}>
          {new Date(v).toLocaleString()}
        </Text>
      ),
    },
    {
      title: t('logs.titleLevel'),
      dataIndex: 'level',
      key: 'level',
      width: 100,
      render: (v: string) => <Tag color={levelColors[v] || 'default'} style={{ borderRadius: 4, fontSize: 11 }}>{v}</Tag>,
    },
    {
      title: t('logs.titleService'),
      dataIndex: 'service',
      key: 'service',
      width: 110,
      render: (v: string) => <Tag style={{ borderRadius: 4 }}>{v || 'system'}</Tag>,
    },
    { title: t('logs.titleMessage'), dataIndex: 'message', key: 'message' },
  ];

  return (
    <div>


      <Space style={{ marginBottom: 0, flexWrap: 'wrap', width: '100%', justifyContent: 'space-between' }}>
        <Space style={{ flexWrap: 'wrap' }}>
          {['', 'INFO', 'WARNING', 'ERROR', 'DEBUG'].map(l => (
            <Tag
              key={l || 'all'}
              color={levelFilter === l ? (l ? levelColors[l] : '#009688') : undefined}
              onClick={() => setLevelFilter(l)}
              style={{
                padding: '4px 12px',
                borderRadius: 4,
                cursor: 'pointer',
                fontSize: 13,
                background: levelFilter === l && !l ? '#009688' : undefined,
                color: levelFilter === l && !l ? '#fff' : undefined,
              }}
            >
              {l || t('logs.allFilter')}
            </Tag>
          ))}
        </Space>
        <Space>
          <Input
            prefix={<SearchOutlined />}
            placeholder={t('logs.searchPlaceholder')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: 260 }}
            allowClear
          />
          <Button icon={<ReloadOutlined />} onClick={loadLogs} disabled={loading}>{t('logs.refresh')}</Button>
          <Popconfirm
            title={t('logs.msgClearConfirm')}
            onConfirm={handleClear}
            okText={t('logs.clearOkText')}
            cancelText={t('common.cancel')}
            okButtonProps={{ danger: true }}
          >
            <Button type="primary" danger icon={<DeleteOutlined />}>{t('logs.clearLogs')}</Button>
          </Popconfirm>
        </Space>
      </Space>

      <KTable
        viewKeyPrefix="logs"
        dataSource={filtered}
        columns={columns}
        loading={loading}
        pagination={{ pageSize: 15 }}
        size="small"
        scroll={{ x: 600 }}
        locale={{ emptyText: t('logs.msgNoLogs') }}
      />
    </div>
  );
};

export default Logs;
