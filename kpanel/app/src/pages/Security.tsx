import React, { useState } from 'react';
import { Row, Col, Card, Typography, Switch, Table, Badge, Tag, Button, Space, Alert, Tabs, Input, Progress, Tooltip, Modal, Form, Select, message, Popconfirm, List, Avatar, Statistic } from '../custom-ui';
import { SafetyOutlined, LockOutlined, FireOutlined, SecurityScanOutlined, PlusOutlined, DeleteOutlined, EditOutlined, EyeOutlined, HistoryOutlined, SearchOutlined, DownloadOutlined, WarningOutlined, CheckCircleOutlined, CloseCircleOutlined, GlobalOutlined, FileProtectOutlined, BugOutlined, ExperimentOutlined } from '@ant-design/icons';
import { KTable } from '../components/KTable';
import { useLanguage } from '../context/LanguageContext';

const { Title, Text } = Typography;

interface FirewallRule { key: string; port: number; protocol: string; action: string; source: string; desc: string; }
interface SslCert { key: string; domain: string; expires: string; status: string; type: string; }
interface IpRule { key: string; ip: string; action: string; desc: string; date: string; }
interface AuditLog { key: string; user: string; action: string; target: string; date: string; ip: string; }

const initialFirewall: FirewallRule[] = [
  { key: '1', port: 22, protocol: 'TCP', action: 'allow', source: '0.0.0.0/0', desc: 'SSH' },
  { key: '2', port: 80, protocol: 'TCP', action: 'allow', source: '0.0.0.0/0', desc: 'HTTP' },
  { key: '3', port: 443, protocol: 'TCP', action: 'allow', source: '0.0.0.0/0', desc: 'HTTPS' },
  { key: '4', port: 5432, protocol: 'TCP', action: 'deny', source: '0.0.0.0/0', desc: 'PostgreSQL' },
  { key: '5', port: 6379, protocol: 'TCP', action: 'deny', source: '0.0.0.0/0', desc: 'Redis' },
];

const initialSsl: SslCert[] = [
  { key: '1', domain: 'example.com', expires: '2026-09-17', status: 'valid', type: "Let's Encrypt" },
  { key: '2', domain: 'api.example.com', expires: '2026-09-17', status: 'valid', type: "Let's Encrypt" },
  { key: '3', domain: 'shop.example.com', expires: '2026-08-01', status: 'expiring', type: "Let's Encrypt" },
];

const Security: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('firewall');
  const [firewall, setFirewall] = useState<FirewallRule[]>(initialFirewall);
  const [sslCerts, setSslCerts] = useState<SslCert[]>(initialSsl);
  const [ipRules, setIpRules] = useState<IpRule[]>([
    { key: '1', ip: '192.168.1.100', action: 'allow', desc: 'Office VPN', date: '2026-06-01' },
    { key: '2', ip: '10.0.0.0/8', action: 'allow', desc: 'Internal network', date: '2026-05-15' },
    { key: '3', ip: '185.220.101.0/24', action: 'deny', desc: 'Known attacker', date: '2026-06-10' },
  ]);
  const [auditLogs] = useState<AuditLog[]>([
    { key: '1', user: 'admin', action: 'Login', target: 'System', date: '2026-06-17 08:30', ip: '192.168.1.100' },
    { key: '2', user: 'admin', action: 'Update', target: 'Firewall rule #4', date: '2026-06-17 07:15', ip: '192.168.1.100' },
    { key: '3', user: 'operator', action: 'Deploy', target: 'blog.example.com', date: '2026-06-16 22:00', ip: '10.0.0.50' },
    { key: '4', user: 'admin', action: 'Create', target: 'User: dev1', date: '2026-06-16 14:30', ip: '192.168.1.100' },
    { key: '5', user: 'system', action: 'Backup', target: 'Database: kpanel_prod', date: '2026-06-16 02:00', ip: '127.0.0.1' },
  ]);
  const [fwOpen, setFwOpen] = useState(false);
  const [sslOpen, setSslOpen] = useState(false);
  const [ipOpen, setIpOpen] = useState(false);
  const [wafEnabled, setWafEnabled] = useState(true);
  const [ddosEnabled, setDdosEnabled] = useState(true);
  const [fail2banEnabled, setFail2banEnabled] = useState(true);
  const [malwareScanOpen, setMalwareScanOpen] = useState(false);
  const [vulnScanOpen, setVulnScanOpen] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [deleteConfirmKey, setDeleteConfirmKey] = useState<string | null>(null);
  const [fwForm] = Form.useForm();
  const [sslForm] = Form.useForm();
  const [ipForm] = Form.useForm();

  const handleAddFw = () => {
    fwForm.validateFields().then(v => {
      const newRule: FirewallRule = { key: String(Date.now()), ...v };
      setFirewall([...firewall, newRule]);
      message.success(t('security.msgSuccessAddFw'));
      fwForm.resetFields(); setFwOpen(false);
    });
  };

  const handleDeleteFw = (key: string) => setFirewall(firewall.filter(r => r.key !== key));

  const handleRenewSsl = (cert: SslCert) => {
    message.loading({ content: t('security.msgLoadingSsl').replace('{domain}', cert.domain), key: 'ssl_renew' });
    setTimeout(() => {
      setSslCerts(sslCerts.map(c => c.key === cert.key ? { ...c, status: 'valid', expires: '2026-12-17' } : c));
      message.success({ content: t('security.msgSuccessSsl').replace('{domain}', cert.domain), key: 'ssl_renew', duration: 2 });
    }, 2000);
  };

  const handleRunScan = (type: 'malware' | 'vuln') => {
    const setOpen = type === 'malware' ? setMalwareScanOpen : setVulnScanOpen;
    setOpen(true);
    setScanProgress(0);
    const interval = setInterval(() => {
      setScanProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          message.success(t('security.msgScanComplete').replace('{type}', type === 'malware' ? t('security.msgScanMalware') : t('security.msgScanVuln')));
          return 100;
        }
        return p + Math.floor(Math.random() * 15 + 5);
      });
    }, 500);
  };

  const fwColumns = [
    { title: t('security.colPort'), dataIndex: 'port', key: 'port', render: (v: number) => <span style={{ fontFamily: 'monospace', background: '#f5f5f5', padding: '2px 4px', borderRadius: 4 }}>{v}</span> },
    { title: t('security.colProtocol'), dataIndex: 'protocol', key: 'protocol' },
    { title: t('security.colAction'), dataIndex: 'action', key: 'action', render: (v: string) => <Tag color={v === 'allow' ? 'green' : 'red'} style={{ borderRadius: 4 }}>{v === 'allow' ? t('security.actionAllow') : t('security.actionDeny')}</Tag> },
    { title: t('security.colSource'), dataIndex: 'source', key: 'source', render: (v: string) => <span style={{ fontFamily: 'monospace', background: '#f5f5f5', padding: '2px 4px', borderRadius: 4 }}>{v}</span> },
    { title: t('security.colDesc'), dataIndex: 'desc', key: 'desc' },
    {
      title: t('security.colActions'), key: 'actions',
      render: (_: any, r: FirewallRule) => (
        <Space>
          <Tooltip title={t('security.tooltipEdit')}><Button size="small" icon={<EditOutlined />} /></Tooltip>
          <Tooltip title={t('security.tooltipDelete')} open={deleteConfirmKey === r.key ? false : undefined}>
            <Popconfirm 
              title={t('security.confirmDelete')} 
              description={t('security.confirmDeleteDesc')}
              onConfirm={() => handleDeleteFw(r.key)} 
              okText={t('common.yes')} 
              cancelText={t('common.no')}
              onOpenChange={(open) => setDeleteConfirmKey(open ? r.key : null)}
            >
              <Button size="small" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const sslColumns = [
    { title: 'Domain', dataIndex: 'domain', key: 'domain', render: (v: string) => <Text strong>{v}</Text> },
    { title: t('security.colType'), dataIndex: 'type', key: 'type', render: (v: string) => <Tag style={{ borderRadius: 4 }}>{v}</Tag> },
    { title: t('security.colExpires'), dataIndex: 'expires', key: 'expires' },
    { title: t('security.colStatus'), dataIndex: 'status', key: 'status', render: (v: string) => <Tag color={v === 'valid' ? 'success' : 'warning'} style={{ borderRadius: 4, margin: 0 }}>{v === 'valid' ? t('security.statusValid') : t('security.statusExpiring')}</Tag> },
    { title: '', key: 'a', render: (_: any, r: SslCert) => <Button size="small" onClick={() => handleRenewSsl(r)}>{t('security.btnRenew')}</Button> },
  ];

  const ipColumns = [
    { title: 'IP / CIDR', dataIndex: 'ip', key: 'ip', render: (v: string) => <span style={{ fontFamily: 'monospace', background: '#f5f5f5', padding: '2px 4px', borderRadius: 4 }}>{v}</span> },
    { title: t('security.colAction'), dataIndex: 'action', key: 'action', render: (v: string) => <Tag color={v === 'allow' ? 'green' : 'red'} style={{ borderRadius: 4 }}>{v === 'allow' ? t('security.actionAllow') : t('security.actionDeny')}</Tag> },
    { title: t('security.colDesc'), dataIndex: 'desc', key: 'desc' },
    { title: t('security.colDate'), dataIndex: 'date', key: 'date' },
    {
      title: t('security.colActions'), key: 'actions',
      render: (_: any, r: IpRule) => (
        <Space>
          <Tooltip title={t('security.tooltipDelete')} open={deleteConfirmKey === `ip-${r.key}` ? false : undefined}>
            <Popconfirm 
              title={t('security.confirmDelete')} 
              onConfirm={() => setIpRules(ipRules.filter(i => i.key !== r.key))} 
              okText={t('common.yes')} 
              cancelText={t('common.no')}
              onOpenChange={(open) => setDeleteConfirmKey(open ? `ip-${r.key}` : null)}
            >
              <Button size="small" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const auditColumns = [
    { title: t('security.colUser'), dataIndex: 'user', key: 'user', render: (v: string) => <Tag style={{ borderRadius: 4 }}>{v}</Tag> },
    { title: t('security.colAction'), dataIndex: 'action', key: 'action' },
    { title: t('security.colTarget'), dataIndex: 'target', key: 'target' },
    { title: 'IP', dataIndex: 'ip', key: 'ip', render: (v: string) => <span style={{ fontFamily: 'monospace', fontSize: 12, background: '#f5f5f5', padding: '2px 4px', borderRadius: 4 }}>{v}</span> },
    { title: t('security.colTime'), dataIndex: 'date', key: 'date' },
  ];

  const toggleFeatures = [
    { label: t('security.firewallRules') + ' (UFW)', icon: <FireOutlined />, enabled: true, key: 'ufw' },
    { label: t('security.tabWaf') + ' (Web App Firewall)', icon: <SafetyOutlined />, enabled: wafEnabled, onChange: setWafEnabled, key: 'waf' },
    { label: t('security.tabDdos') + ' Protection', icon: <WarningOutlined />, enabled: ddosEnabled, onChange: setDdosEnabled, key: 'ddos' },
    { label: t('security.tabFail2ban'), icon: <LockOutlined />, enabled: fail2banEnabled, onChange: setFail2banEnabled, key: 'f2b' },
    { label: t('security.autoSsl'), icon: <SafetyOutlined />, enabled: true, key: 'ssl' },
    { label: t('security.tab2fa'), icon: <LockOutlined />, enabled: false, key: '2fa' },
    { label: t('security.countryBlock'), icon: <GlobalOutlined />, enabled: false, key: 'cb' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <Space>
          <Button icon={<BugOutlined />} onClick={() => handleRunScan('malware')}>{t('security.btnScanMalware')}</Button>
          <Button icon={<SecurityScanOutlined />} onClick={() => handleRunScan('vuln')}>{t('security.btnScanVuln')}</Button>
        </Space>
      </div>

      <Alert message={t('security.alertActive')} type="success" showIcon style={{ marginBottom: 16, borderRadius: 6 }} />

      <Tabs activeKey={activeTab} onChange={setActiveTab} items={[
        {
          key: 'firewall', label: <Space><FireOutlined />{t('security.tabFirewall')}</Space>,
          children: (
            <Row gutter={[16, 16]}>
              <Col xs={24} md={8}>
                {toggleFeatures.map((f, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #F0F0F0' }}>
                    <Space><span style={{ color: '#009688' }}>{f.icon}</span><Text>{f.label}</Text></Space>
                    <Switch size="small" checked={f.enabled} onChange={(v) => f.onChange?.(v)} />
                  </div>
                ))}
              </Col>
              <Col xs={24} md={16}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <Text strong>{t('security.firewallRules')}</Text>
                  <Button type="primary" size="small" icon={<PlusOutlined />} onClick={() => setFwOpen(true)}>{t('security.addFwRule')}</Button>
                </div>
                <KTable viewKeyPrefix="firewall" dataSource={firewall} columns={fwColumns} pagination={false} size="small" locale={{ emptyText: t('security.emptyText') }} />
              </Col>
            </Row>
          ),
        },
        {
          key: 'waf', label: <Space><SafetyOutlined />{t('security.tabWaf')}</Space>,
          children: (
            <Row gutter={[16, 16]}>
              <Col span={24}><Alert message={t('security.wafAlert')} type="info" showIcon style={{ borderRadius: 6 }} /></Col>
              <Col xs={24} md={12}>
                <Card title={<Text strong>{t('security.wafConfig')}</Text>}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F0F0F0' }}><Text>SQL Injection</Text><Switch defaultChecked size="small" /></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F0F0F0' }}><Text>XSS Protection</Text><Switch defaultChecked size="small" /></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F0F0F0' }}><Text>CSRF Protection</Text><Switch defaultChecked size="small" /></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F0F0F0' }}><Text>Path Traversal</Text><Switch defaultChecked size="small" /></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}><Text>Remote File Inclusion</Text><Switch defaultChecked size="small" /></div>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card title={<Text strong>{t('security.wafStats')}</Text>}>
                  <Row gutter={[12, 12]}>
                    <Col span={12}><Statistic title={t('security.statBlocked')} value={1247} valueStyle={{ color: '#F44336' }} /></Col>
                    <Col span={12}><Statistic title={t('security.statSqli')} value={389} valueStyle={{ color: '#FF9800' }} /></Col>
                    <Col span={12}><Statistic title={t('security.statXss')} value={215} valueStyle={{ color: '#FF9800' }} /></Col>
                    <Col span={12}><Statistic title={t('security.statMalBot')} value={643} valueStyle={{ color: '#9C27B0' }} /></Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          ),
        },
        {
          key: 'ddos', label: <Space><WarningOutlined />{t('security.tabDdos')}</Space>,
          children: (
            <Row gutter={[16, 16]}>
              <Col span={24}><Alert message={t('security.ddosAlert')} type="success" showIcon style={{ borderRadius: 6 }} /></Col>
              <Col xs={24} md={12}>
                <Card title={<Text strong>{t('security.ddosSettings')}</Text>}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F0F0F0' }}><Text>Rate Limiting</Text><Switch defaultChecked size="small" /></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F0F0F0' }}><Text>Connection Limit</Text><Switch defaultChecked size="small" /></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F0F0F0' }}><Text>SYN Flood Protection</Text><Switch defaultChecked size="small" /></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}><Text>ICMP Flood Protection</Text><Switch defaultChecked size="small" /></div>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card title={<Text strong>{t('security.trafficOverview')}</Text>}>
                  <div style={{ marginBottom: 12 }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><Text style={{ fontSize: 12 }}>{t('security.trafficNormal')}</Text><Text style={{ fontSize: 12 }}>98.2%</Text></div><Progress percent={98.2} size="small" strokeColor="#009688" /></div>
                  <div style={{ marginBottom: 12 }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><Text style={{ fontSize: 12 }}>{t('security.trafficSuspicious')}</Text><Text style={{ fontSize: 12 }}>1.5%</Text></div><Progress percent={1.5} size="small" strokeColor="#FF9800" /></div>
                  <div><div style={{ display: 'flex', justifyContent: 'space-between' }}><Text style={{ fontSize: 12 }}>{t('security.trafficBlocked')}</Text><Text style={{ fontSize: 12 }}>0.3%</Text></div><Progress percent={0.3} size="small" strokeColor="#F44336" /></div>
                </Card>
              </Col>
            </Row>
          ),
        },
        {
          key: 'ssl', label: <Space><SafetyOutlined />{t('security.tabSsl')}</Space>,
          children: (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <Text strong>{t('security.sslCerts')}</Text>
                <Button type="primary" size="small" icon={<PlusOutlined />} onClick={() => setSslOpen(true)}>{t('security.addSsl')}</Button>
              </div>
              <KTable viewKeyPrefix="ssl" dataSource={sslCerts} columns={sslColumns} pagination={false} size="small" />
            </div>
          ),
        },
        {
          key: 'fail2ban', label: <Space><LockOutlined />{t('security.tabFail2ban')}</Space>,
          children: (
            <Row gutter={[16, 16]}>
              <Col span={24}><Alert message={t('security.f2bAlert')} type="info" showIcon style={{ borderRadius: 6 }} /></Col>
              <Col xs={24} md={12}>
                <Card title={<Text strong>{t('security.jailStatus')}</Text>}>
                  {[
                    ['sshd', 'Active', 5],
                    ['nginx-http-auth', 'Active', 2],
                    ['nginx-botsearch', 'Active', 8],
                    ['recidive', 'Active', 1],
                  ].map(([jail, status, banned], i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F0F0F0' }}>
                      <Space><Text code style={{ fontSize: 12 }}>{String(jail)}</Text><Badge status={status === 'Active' ? 'success' : 'default'} /></Space>
                      <Text>{String(banned)} {t('security.bannedSuffix')}</Text>
                    </div>
                  ))}
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card title={<Text strong>{t('security.jailConfig')}</Text>}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F0F0F0' }}><Text>{t('security.maxRetry')}</Text><Tag style={{ borderRadius: 4 }}>5</Tag></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F0F0F0' }}><Text>{t('security.banTime')}</Text><Tag style={{ borderRadius: 4 }}>3600s</Tag></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}><Text>{t('security.findTime')}</Text><Tag style={{ borderRadius: 4 }}>600s</Tag></div>
                </Card>
              </Col>
            </Row>
          ),
        },
        {
          key: 'iprules', label: <Space><GlobalOutlined />{t('security.tabIpRules')}</Space>,
          children: (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <Text strong>{t('security.ipRulesCountryBlock')}</Text>
                <Button type="primary" size="small" icon={<PlusOutlined />} onClick={() => setIpOpen(true)}>{t('security.addIpRule')}</Button>
              </div>
              <KTable viewKeyPrefix="iprules" dataSource={ipRules} columns={ipColumns} pagination={false} size="small" />
            </div>
          ),
        },
        {
          key: 'audit', label: <Space><HistoryOutlined />{t('security.tabAudit')}</Space>,
          children: (
            <KTable viewKeyPrefix="audit" dataSource={auditLogs} columns={auditColumns} pagination={{ pageSize: 10 }} size="small" />
          ),
        },
        {
          key: 'malware', label: <Space><BugOutlined />{t('security.tabMalware')}</Space>,
          children: (
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Alert message={t('security.malwareAlert')} type="warning" showIcon style={{ borderRadius: 6 }} />
              </Col>
              <Col xs={24} md={12}>
                <Card title={<Text strong>{t('security.scanResults')}</Text>}>
                  <Statistic title={t('security.filesScanned')} value={15420} suffix={t('security.filesSuffix')} />
                  <Statistic title={t('security.threatsFound')} value={0} valueStyle={{ color: '#009688' }} style={{ marginTop: 16 }} />
                  <Button type="primary" icon={<BugOutlined />} onClick={() => handleRunScan('malware')} style={{ marginTop: 12 }}>{t('security.scanNow')}</Button>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card title={<Text strong>{t('security.scanSchedule')}</Text>}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F0F0F0' }}><Text>{t('security.autoScan')}</Text><Switch defaultChecked size="small" /></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F0F0F0' }}><Text>{t('security.scheduleLabel')}</Text><Tag style={{ borderRadius: 4 }}>{t('security.scheduleDaily')}</Tag></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}><Text>{t('security.lastScanLabel')}</Text><Text style={{ color: '#999', fontSize: 12 }}>2026-06-17 02:00</Text></div>
                </Card>
              </Col>
            </Row>
          ),
        },
        {
          key: 'vuln', label: <Space><SecurityScanOutlined />{t('security.tabVuln')}</Space>,
          children: (
            <Row gutter={[16, 16]}>
              <Col span={24}><Alert message={t('security.vulnAlert')} type="info" showIcon style={{ borderRadius: 6 }} /></Col>
              <Col xs={24} md={12}>
                <Card title={<Text strong>{t('security.vulnReport')}</Text>}>
                  <Row gutter={[12, 12]}>
                    <Col span={8}><Statistic title={t('security.vulnCritical')} value={0} valueStyle={{ color: '#F44336' }} /></Col>
                    <Col span={8}><Statistic title={t('security.vulnHigh')} value={1} valueStyle={{ color: '#FF9800' }} /></Col>
                    <Col span={8}><Statistic title={t('security.vulnMedium')} value={3} valueStyle={{ color: '#FFC107' }} /></Col>
                  </Row>
                  <Button type="primary" icon={<SecurityScanOutlined />} onClick={() => handleRunScan('vuln')} style={{ marginTop: 16 }}>{t('security.scanNow')}</Button>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card title={<Text strong>{t('security.foundIssues')}</Text>}>
                  <List size="small" dataSource={[
                    { name: 'TLS 1.0 enabled', severity: 'High', host: 'example.com' },
                    { name: 'Missing X-Frame-Options', severity: 'Medium', host: 'api.example.com' },
                    { name: 'Open MySQL port (3306)', severity: 'Medium', host: 'db.example.com' },
                    { name: 'Cookie without Secure flag', severity: 'Medium', host: 'shop.example.com' },
                  ]} renderItem={item => <List.Item><List.Item.Meta title={<Space><Tag color={item.severity === 'High' ? 'orange' : 'gold'} style={{ borderRadius: 4 }}>{item.severity === 'High' ? t('security.vulnHigh') : t('security.vulnMedium')}</Tag><Text>{item.name}</Text></Space>} description={<Text style={{ fontSize: 11 }}>{item.host}</Text>} /></List.Item>} />
                </Card>
              </Col>
            </Row>
          ),
        },
      ]} />

      <Modal title={t('security.modalAddFw')} open={fwOpen} onOk={handleAddFw} onCancel={() => setFwOpen(false)} okText={t('security.btnSave')} cancelText={t('security.btnCancel')}>
        <Form form={fwForm} layout="vertical" style={{ marginTop: 12 }}>
          <Form.Item name="port" label={t('security.fieldPort')} rules={[{ required: true, message: t('security.validationPort') }]}><Input placeholder="80" type="number" /></Form.Item>
          <Form.Item name="protocol" label={t('security.colProtocol')} rules={[{ required: true }]}><Select options={[{ label: 'TCP', value: 'TCP' }, { label: 'UDP', value: 'UDP' }, { label: 'BOTH', value: 'BOTH' }]} /></Form.Item>
          <Form.Item name="action" label={t('security.colAction')} rules={[{ required: true }]}><Select options={[{ label: t('security.actionAllow'), value: 'allow' }, { label: t('security.actionDeny'), value: 'deny' }]} /></Form.Item>
          <Form.Item name="source" label={t('security.colSource')}><Input placeholder="0.0.0.0/0" /></Form.Item>
          <Form.Item name="desc" label={t('security.colDesc')}><Input placeholder={t('security.colDesc') + '...'} /></Form.Item>
        </Form>
      </Modal>

      <Modal title={t('security.modalAddSsl')} open={sslOpen} onCancel={() => setSslOpen(false)} footer={null}>
        <Form form={sslForm} layout="vertical" style={{ marginTop: 12 }}>
          <Form.Item name="domain" label="Domain" rules={[{ required: true, message: t('security.validationDomain') }]}><Input placeholder="example.com" /></Form.Item>
          <Form.Item name="type" label={t('security.colType')}><Select options={[{ label: "Let's Encrypt", value: 'letsencrypt' }, { label: 'Custom', value: 'custom' }]} /></Form.Item>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => { sslForm.validateFields().then(v => { setSslCerts([...sslCerts, { key: String(Date.now()), domain: v.domain, expires: '2026-12-17', status: 'valid', type: v.type || "Let's Encrypt" }]); message.success(t('security.msgSuccessAddSsl')); setSslOpen(false); }); }}>{t('security.btnSave')}</Button>
        </Form>
      </Modal>

      <Modal title={t('security.modalAddIp')} open={ipOpen} onCancel={() => setIpOpen(false)} footer={null}>
        <Form form={ipForm} layout="vertical" style={{ marginTop: 12 }}>
          <Form.Item name="ip" label="IP / CIDR" rules={[{ required: true }]}><Input placeholder="192.168.1.0/24" /></Form.Item>
          <Form.Item name="action" label={t('security.colAction')}><Select options={[{ label: t('security.actionAllow'), value: 'allow' }, { label: t('security.actionDeny'), value: 'deny' }]} /></Form.Item>
          <Form.Item name="desc" label={t('security.colDesc')}><Input placeholder="Office VPN" /></Form.Item>
          <Button type="primary" onClick={() => { ipForm.validateFields().then(v => { setIpRules([...ipRules, { key: String(Date.now()), ...v, date: new Date().toISOString().split('T')[0] }]); message.success(t('security.msgSuccessAddIp')); setIpOpen(false); }); }}>{t('security.btnSave')}</Button>
        </Form>
      </Modal>

      <Modal title={t('security.modalScanning')} open={malwareScanOpen || vulnScanOpen} onCancel={() => { setMalwareScanOpen(false); setVulnScanOpen(false); }} footer={null}>
        <Progress percent={scanProgress} status={scanProgress >= 100 ? 'success' : 'active'} />
        <Text style={{ display: 'block', marginTop: 12, color: '#757575' }}>
          {scanProgress < 100 ? t('security.scanningStatus').replace('{progress}', String(scanProgress)) : t('security.scanCompleteStatus')}
        </Text>
      </Modal>
    </div>
  );
};

export default Security;
