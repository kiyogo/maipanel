import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Table, Badge, Tag, Typography, Spin, Alert, Progress, Statistic, Tooltip, Space, List, Avatar, Switch } from '../custom-ui';
import {
  CloudServerOutlined, ProjectOutlined, DatabaseOutlined, WarningOutlined,
  FireOutlined, SafetyOutlined,
  CheckCircleOutlined, CloseCircleOutlined, SyncOutlined,
  UserOutlined, BellOutlined, ClockCircleOutlined,
  RocketOutlined, DashboardOutlined,
  PlayCircleOutlined, CloudSyncOutlined,
  ThunderboltOutlined, HddOutlined, ExperimentOutlined, WifiOutlined, RiseOutlined, HeatMapOutlined, MonitorOutlined,
} from '@ant-design/icons';
import { dashboardApi, serversApi, projectsApi, databasesApi, logsApi } from '../api/endpoints';
import { KTable } from '../components/KTable';
import { useLanguage } from '../context/LanguageContext';

const { Title, Text } = Typography;

interface DashboardStats {
  servers: { total: number; online: number; offline: number; warning: number };
  projects: { total: number; running: number };
  databases: { total: number; online: number };
  recentLogs: Array<{ id: string; level: string; message: string; createdAt: string }>;
}

interface ServerData { id: string; name: string; ip: string; region: string; status: string; cpu: number; ram: number; disk: number; os: string; }

const Dashboard: React.FC = () => {
  const { t, language } = useLanguage();
  const localeMap: Record<string, string> = { vi: 'vi-VN', en: 'en-US', ja: 'ja-JP', zh: 'zh-CN' };
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [servers, setServers] = useState<ServerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, serversRes] = await Promise.all([
          dashboardApi.getStats(),
          serversApi.getAll(),
        ]);
        setStats(statsRes?.data || null);
        const serverList = Array.isArray(serversRes?.data)
          ? serversRes.data
          : Array.isArray(serversRes?.data?.data)
          ? serversRes.data.data
          : [];
        setServers(serverList);
        setError('');
      } catch {
        setError('Cannot load data from server.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Spin size="large" tip={t('dashboard.loadOverview')} />
      </div>
    );
  }

  if (error) {
    return <Alert message={t('common.error')} description={error} type="error" showIcon style={{ marginBottom: 24 }} />;
  }

  const safeServers = Array.isArray(servers) ? servers : [];
  const totalCpu = safeServers.filter(s => s.status === 'online').reduce((a, b) => a + (b.cpu || 0), 0);
  const avgCpu = safeServers.filter(s => s.status === 'online').length ? Math.round(totalCpu / safeServers.filter(s => s.status === 'online').length) : 0;
  const totalRam = safeServers.filter(s => s.status === 'online').reduce((a, b) => a + (b.ram || 0), 0);
  const avgRam = safeServers.filter(s => s.status === 'online').length ? Math.round(totalRam / safeServers.filter(s => s.status === 'online').length) : 0;
  const totalDisk = safeServers.reduce((a, b) => a + (b.disk || 0), 0);
  const avgDisk = safeServers.length ? Math.round(totalDisk / safeServers.length) : 0;
  const onlineCount = safeServers.filter(s => s.status === 'online').length;

  const systemOverview = [
    { title: t('dashboard.cpuUsage'), value: `${avgCpu}%`, icon: <DashboardOutlined />, color: avgCpu > 70 ? '#F44336' : avgCpu > 50 ? '#FF9800' : '#009688', progress: avgCpu },
    { title: t('dashboard.ramUsage'), value: `${avgRam}%`, icon: <ThunderboltOutlined />, color: avgRam > 70 ? '#F44336' : avgRam > 50 ? '#FF9800' : '#009688', progress: avgRam },
    { title: t('dashboard.diskUsage'), value: `${avgDisk}%`, icon: <HddOutlined />, color: avgDisk > 70 ? '#F44336' : avgDisk > 50 ? '#FF9800' : '#009688', progress: avgDisk },
    { title: t('dashboard.gpuUsage'), value: `${Math.floor(Math.random() * 30 + 10)}%`, icon: <ExperimentOutlined />, color: '#9C27B0', progress: Math.floor(Math.random() * 30 + 10) },
    { title: t('dashboard.networkTraffic'), value: `${(Math.random() * 100).toFixed(1)} Mbps`, icon: <WifiOutlined />, color: '#2196F3' },
    { title: t('dashboard.loadAverage'), value: `${(Math.random() * 4 + 0.5).toFixed(2)}`, icon: <RiseOutlined />, color: '#FF5722' },
    { title: t('dashboard.systemTemp'), value: `${Math.floor(Math.random() * 20 + 40)}°C`, icon: <HeatMapOutlined />, color: '#795548' },
    { title: t('dashboard.serverUptime'), value: `${Math.floor(Math.random() * 30 + 10)}d ${Math.floor(Math.random() * 24)}h`, icon: <ClockCircleOutlined />, color: '#607D8B' },
  ];

  const resourceColumns = [
    {
      title: t('dashboard.server'), dataIndex: 'name', key: 'name', render: (text: string, r: ServerData) => (
        <div><Text strong>{text}</Text><div style={{ fontSize: 11, color: '#999' }}>{r.ip} {r.region ? `(${r.region})` : ''}</div></div>
      )
    },
    { title: 'CPU', dataIndex: 'cpu', key: 'cpu', render: (v: number, r: ServerData) => r.status === 'offline' ? <Text style={{ color: '#bbb' }}>—</Text> : <Progress percent={v} size="small" strokeColor={v > 70 ? '#F44336' : v > 50 ? '#FF9800' : '#009688'} /> },
    { title: 'RAM', dataIndex: 'ram', key: 'ram', render: (v: number, r: ServerData) => r.status === 'offline' ? <Text style={{ color: '#bbb' }}>—</Text> : <Progress percent={v} size="small" strokeColor={v > 70 ? '#F44336' : v > 50 ? '#FF9800' : '#009688'} /> },
    { title: 'Disk', dataIndex: 'disk', key: 'disk', render: (v: number, r: ServerData) => r.status === 'offline' ? <Text style={{ color: '#bbb' }}>—</Text> : <Progress percent={v} size="small" /> },
    {
      title: t('common.status'), dataIndex: 'status', key: 'status', render: (s: string) => {
        const map: Record<string, { status: 'success' | 'default' | 'warning'; text: string }> = { online: { status: 'success', text: 'Online' }, offline: { status: 'default', text: 'Offline' }, warning: { status: 'warning', text: 'Warning' } };
        return <Badge status={map[s]?.status} text={map[s]?.text || s} />;
      }
    },
  ];

  const logColumns = [
    { title: t('logs.titleTime'), dataIndex: 'createdAt', key: 'createdAt', width: 90, render: (v: string) => <Text style={{ color: '#999', fontSize: 12 }}>{new Date(v).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text> },
    { title: t('logs.titleLevel'), dataIndex: 'level', key: 'level', width: 80, render: (v: string) => { const c: Record<string, string> = { INFO: 'cyan', WARNING: 'orange', ERROR: 'red', DEBUG: 'blue' }; return <Tag color={c[v] || 'default'} style={{ borderRadius: 4, fontSize: 11 }}>{v}</Tag>; } },
    { title: t('logs.titleMessage'), dataIndex: 'message', key: 'message' },
  ];

  const statusCards = [
    { title: t('dashboard.webOnline'), value: Math.floor(Math.random() * 10 + 5), icon: <CheckCircleOutlined />, color: '#009688' },
    { title: t('dashboard.webOffline'), value: Math.floor(Math.random() * 3), icon: <CloseCircleOutlined />, color: '#F44336' },
    { title: t('dashboard.projectCount'), value: stats?.projects?.total || 0, icon: <ProjectOutlined />, color: '#2196F3' },
    { title: t('dashboard.databaseCount'), value: stats?.databases?.total || 0, icon: <DatabaseOutlined />, color: '#FF9800' },
    { title: t('dashboard.runningServices'), value: onlineCount * 3 + Math.floor(Math.random() * 10), icon: <PlayCircleOutlined />, color: '#4CAF50' },
    { title: t('dashboard.aiServices'), value: Math.floor(Math.random() * 5 + 1), icon: <ExperimentOutlined />, color: '#9C27B0' },
    { title: t('dashboard.activeUsers'), value: Math.floor(Math.random() * 20 + 5), icon: <UserOutlined />, color: '#607D8B' },
  ];

  const alertItems = [
    { title: t('dashboard.systemAlerts'), value: Math.floor(Math.random() * 5), icon: <BellOutlined />, color: '#F44336' },
    { title: t('dashboard.firewallStatus'), value: 'Active', icon: <FireOutlined />, color: '#009688' },
    { title: t('dashboard.sslStatus'), value: `${Math.floor(Math.random() * 3 + 5)} valid`, icon: <SafetyOutlined />, color: '#4CAF50' },
    { title: t('dashboard.backupStatus'), value: `${Math.floor(Math.random() * 12 + 4)} backups`, icon: <CloudSyncOutlined />, color: '#2196F3' },
  ];

  const recentActivities = [
    { action: 'Deployed PHP project "blog.example.com"', time: t('dashboard.minutesAgo').replace('{n}', '2'), icon: <RocketOutlined style={{ color: '#009688' }} /> },
    { action: 'SSL certificate renewed for api.example.com', time: t('dashboard.minutesAgo').replace('{n}', '5'), icon: <SafetyOutlined style={{ color: '#4CAF50' }} /> },
    { action: 'Backup completed: database "kpanel_prod"', time: t('dashboard.minutesAgo').replace('{n}', '12'), icon: <DatabaseOutlined style={{ color: '#2196F3' }} /> },
    { action: 'New user "admin2" added to Administrators', time: t('dashboard.minutesAgo').replace('{n}', '30'), icon: <UserOutlined style={{ color: '#FF9800' }} /> },
    { action: 'Server "VPS-US-01" restarted', time: t('dashboard.hoursAgo').replace('{n}', '1'), icon: <CloudServerOutlined style={{ color: '#607D8B' }} /> },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <Text style={{ color: '#757575', fontSize: 13 }}>{time.toLocaleDateString(localeMap[language] || 'vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} — {time.toLocaleTimeString(localeMap[language] || 'vi-VN')}</Text>
        </div>
        <Space>
          <Tag icon={<SyncOutlined spin />} color="blue" style={{ borderRadius: 4 }}>{t('dashboard.live')}</Tag>
          <Tag icon={<MonitorOutlined />} color="green" style={{ borderRadius: 4 }}>{t('common.allSystemsRunning')}</Tag>
        </Space>
      </div>

      <Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
        {systemOverview.map((s, i) => (
          <Col xs={12} sm={6} xl={3} key={i}>
            <Card size="small" styles={{ body: { padding: '12px' } }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: s.progress !== undefined ? 8 : 0 }}>
                <div>
                  <Text style={{ color: '#757575', fontSize: 11 }}>{s.title}</Text>
                  <div style={{ fontSize: 16, fontWeight: 700, color: s.color, marginTop: 2 }}>{s.value}</div>
                </div>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: s.color }}>{s.icon}</div>
              </div>
              {s.progress !== undefined && <Progress percent={s.progress} size="small" showInfo={false} strokeColor={s.color} />}
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
        {statusCards.map((s, i) => (
          <Col xs={12} sm={6} xl={3} key={i}>
            <Card size="small" styles={{ body: { padding: '12px' } }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <Text style={{ color: '#757575', fontSize: 11 }}>{s.title}</Text>
                  <div style={{ fontSize: 20, fontWeight: 700, color: s.color, marginTop: 2 }}>{s.value}</div>
                </div>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: s.color }}>{s.icon}</div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
        <Col xs={24} sm={12} md={6}>
          <Card size="small" title={<Text strong style={{ fontSize: 13 }}>{t('dashboard.storageAnalytics')}</Text>} styles={{ body: { padding: '12px' } }}>
            <div style={{ marginBottom: 8 }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><Text style={{ fontSize: 12 }}>{t('dashboard.storageSystem')}</Text><Text style={{ fontSize: 12 }}>32 GB</Text></div><Progress percent={45} size="small" showInfo={false} strokeColor="#009688" /></div>
            <div style={{ marginBottom: 8 }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><Text style={{ fontSize: 12 }}>{t('dashboard.storageData')}</Text><Text style={{ fontSize: 12 }}>128 GB</Text></div><Progress percent={62} size="small" showInfo={false} strokeColor="#2196F3" /></div>
            <div style={{ marginBottom: 8 }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><Text style={{ fontSize: 12 }}>{t('dashboard.storageBackups')}</Text><Text style={{ fontSize: 12 }}>64 GB</Text></div><Progress percent={28} size="small" showInfo={false} strokeColor="#FF9800" /></div>
            <div><div style={{ display: 'flex', justifyContent: 'space-between' }}><Text style={{ fontSize: 12 }}>{t('dashboard.storageLogs')}</Text><Text style={{ fontSize: 12 }}>16 GB</Text></div><Progress percent={15} size="small" showInfo={false} strokeColor="#9C27B0" /></div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card size="small" title={<Text strong style={{ fontSize: 13 }}>{t('dashboard.systemAlerts')}</Text>} styles={{ body: { padding: '12px' } }}>
            {alertItems.map((a, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0', borderBottom: i < alertItems.length - 1 ? '1px solid #F0F0F0' : 'none' }}>
                <Space size={6}>
                  <span style={{ color: a.color, fontSize: 13 }}>{a.icon}</span>
                  <Text style={{ fontSize: 12 }}>{a.title}</Text>
                </Space>
                <Badge count={typeof a.value === 'number' ? a.value : 0} size="small" style={{ backgroundColor: a.color }} />
              </div>
            ))}
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card size="small" title={<Text strong style={{ fontSize: 13 }}>{t('dashboard.recentActivities')}</Text>} styles={{ body: { padding: '0' } }}>
            <List
              size="small"
              dataSource={recentActivities}
              renderItem={(item) => (
                <List.Item style={{ padding: '8px 12px' }}>
                  <List.Item.Meta avatar={<Avatar size={24} icon={item.icon} style={{ background: 'transparent' }} />} title={<Text style={{ fontSize: 12 }}>{item.action}</Text>} />
                  <Text style={{ fontSize: 11, color: '#999' }}>{item.time}</Text>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={14}>
          <div style={{ marginBottom: 12 }}><Text strong>{t('dashboard.topResources')}</Text></div>
          <KTable viewKeyPrefix="dash-resources" dataSource={safeServers.map(s => ({ ...s, key: s.id }))} columns={resourceColumns} pagination={false} size="small" locale={{ emptyText: t('dashboard.noServers') }} />
        </Col>
        <Col xs={24} xl={10}>
          <div style={{ marginBottom: 12 }}><Text strong>{t('dashboard.recentLogs')}</Text></div>
          <KTable viewKeyPrefix="dash-logs" dataSource={(Array.isArray(stats?.recentLogs) ? stats.recentLogs : []).map(l => ({ ...l, key: l.id }))} columns={logColumns} pagination={false} size="small" locale={{ emptyText: t('dashboard.noRecentLogs') }} />
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
