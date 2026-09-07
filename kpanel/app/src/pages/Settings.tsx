import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Input, Select, Switch, Button, Typography, Divider, Space, Tabs, Upload, InputNumber, message, Tag, Slider, ColorPicker, Statistic, Alert } from '../custom-ui';
import { SaveOutlined, UploadOutlined, PlusOutlined, DeleteOutlined, EyeOutlined, KeyOutlined, MailOutlined, BellOutlined, SafetyOutlined, CloudOutlined, ApiOutlined, MonitorOutlined, GlobalOutlined, ExperimentOutlined, RocketOutlined, DatabaseOutlined, WifiOutlined, PictureOutlined, BgColorsOutlined, ToolOutlined, AppstoreOutlined, ShoppingCartOutlined, DollarOutlined, SettingOutlined, FileTextOutlined, ThunderboltOutlined, CheckCircleOutlined, LinkOutlined, TeamOutlined } from '@ant-design/icons';
import { KTable } from '../components/KTable';
import { useLanguage } from '../context/LanguageContext';
import { settingsContentTranslations } from '../context/settingsTranslations';

const { Title, Text } = Typography;

const langOptions = [{label:'Tiếng Việt',value:'vi'},{label:'English',value:'en'},{label:'日本語',value:'ja'},{label:'中文',value:'zh'}];
const tzOptions = ['Asia/Ho_Chi_Minh','Asia/Tokyo','UTC','America/New_York','Europe/London','Asia/Singapore','Australia/Sydney'].map(t=>({label:t,value:t}));

const Settings: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [activeTab, setActiveTab] = useState('general');
  const [form] = Form.useForm();
  const [notifForm] = Form.useForm();

  // Helper to get settings content translation
  const sc = (key: string): string => {
    const lang = language as keyof typeof settingsContentTranslations;
    const dict = settingsContentTranslations[lang] || settingsContentTranslations.vi;
    return (dict as any)[key] || key;
  };

  useEffect(() => {
    form.setFieldsValue({ language });
  }, [language, form]);

  const showSaveMessage = () => {
    message.success(t('settings.successSave'));
  };

  const settingsTabs = [
    {
      key: 'general', label: <Space><SettingOutlined />{t('settings.general')}</Space>,
      children: (
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card title={<Text strong>{t('settings.generalTitle')}</Text>}>
              <div>
                <Form.Item label={t('settings.sysName')} name="systemName" initialValue="Kpanel"><Input /></Form.Item>
                <Form.Item label={t('settings.domainName')} name="domain" initialValue="panel.example.com"><Input /></Form.Item>
                <Form.Item label={t('settings.langLabel')} name="language" initialValue={language}><Select options={langOptions} onChange={(val) => setLanguage(val as any)} /></Form.Item>
                <Form.Item label={t('settings.timezoneLabel')} name="timezone" initialValue="Asia/Ho_Chi_Minh"><Select options={tzOptions} /></Form.Item>
                <Button type="primary" icon={<SaveOutlined />} onClick={showSaveMessage}>{t('settings.saveBtn')}</Button>
              </div>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title={<Text strong>{sc('sysInfo')}</Text>}>
              <div style={{ padding: '6px 0', display: 'flex', justifyContent: 'space-between' }}><Text>{sc('version')}</Text><Tag style={{ borderRadius: 4 }}>v2.0.0</Tag></div>
              <div style={{ padding: '6px 0', display: 'flex', justifyContent: 'space-between' }}><Text>{sc('environment')}</Text><Tag color="green" style={{ borderRadius: 4 }}>Production</Tag></div>
              <div style={{ padding: '6px 0', display: 'flex', justifyContent: 'space-between' }}><Text>Node.js</Text><Tag style={{ borderRadius: 4 }}>20.11.0</Tag></div>
              <div style={{ padding: '6px 0', display: 'flex', justifyContent: 'space-between' }}><Text>Database</Text><Tag style={{ borderRadius: 4 }}>PostgreSQL 16</Tag></div>
              <div style={{ padding: '6px 0', display: 'flex', justifyContent: 'space-between' }}><Text>{sc('uptime')}</Text><Text style={{ color: '#009688' }}>12d 8h 32m</Text></div>
            </Card>
          </Col>
        </Row>
      ),
    },
    {
      key: 'system', label: <Space><ThunderboltOutlined />{t('settings.system')}</Space>,
      children: (
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card title={<Text strong>{sc('systemConfig')}</Text>}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F0F0F0' }}><Text>{sc('maintenanceMode')}</Text><Switch /></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F0F0F0' }}><Text>{sc('debugMode')}</Text><Switch /></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}><Text>{sc('autoUpdates')}</Text><Switch defaultChecked /></div>
              <Divider style={{ margin: '12px 0' }} />
              <Form.Item label={sc('maxProcesses')}><InputNumber min={100} max={10000} defaultValue={1024} style={{ width: '100%' }} /></Form.Item>
              <Form.Item label={sc('maxUploadSize')}><InputNumber min={1} max={2048} defaultValue={256} style={{ width: '100%' }} /></Form.Item>
              <Button type="primary" icon={<SaveOutlined />} onClick={showSaveMessage}>{sc('saveBtn')}</Button>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title={<Text strong>{sc('systemResources')}</Text>}>
              <Statistic title={sc('cpuCores')} value={8} suffix="cores" />
              <Statistic title={sc('ramMemory')} value={32} suffix="GB" style={{ marginTop: 12 }} />
              <Statistic title={sc('diskStorage')} value={512} suffix="GB SSD" style={{ marginTop: 12 }} />
            </Card>
          </Col>
        </Row>
      ),
    },
    {
      key: 'server', label: <Space><MonitorOutlined />{t('settings.server')}</Space>,
      children: (
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card title={<Text strong>{sc('defaultServer')}</Text>}>
              <Form.Item label={sc('defaultSshPort')}><InputNumber min={1} max={65535} defaultValue={22} style={{ width: '100%' }} /></Form.Item>
              <Form.Item label={sc('defaultRegion')}><Select options={[{label:'Singapore',value:'sg'},{label:'Tokyo',value:'jp'},{label:'Frankfurt',value:'de'},{label:'US East',value:'us'}]} /></Form.Item>
              <Form.Item label={sc('defaultOs')}><Select options={[{label:'Ubuntu 22.04',value:'ubuntu22'},{label:'Debian 11',value:'debian11'},{label:'CentOS 9',value:'centos9'}]} /></Form.Item>
              <Button type="primary" icon={<SaveOutlined />} onClick={showSaveMessage}>{sc('saveBtn')}</Button>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title={<Text strong>{sc('autoScaling')}</Text>}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F0F0F0' }}><Text>{sc('enableAutoScaling')}</Text><Switch /></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F0F0F0' }}><Text>{sc('maxServers')}</Text><Tag style={{ borderRadius: 4 }}>10</Tag></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}><Text>{sc('minServers')}</Text><Tag style={{ borderRadius: 4 }}>2</Tag></div>
            </Card>
          </Col>
        </Row>
      ),
    },
    {
      key: 'website', label: <Space><GlobalOutlined />{t('settings.website')}</Space>,
      children: (
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card title={<Text strong>{sc('defaultWebSettings')}</Text>}>
              <Form.Item label={sc('defaultPhpVersion')}><Select options={[{label:'8.3',value:'8.3'},{label:'8.2',value:'8.2'},{label:'8.1',value:'8.1'}]} /></Form.Item>
              <Form.Item label={sc('defaultDocRoot')}><Input defaultValue="/var/www/html" /></Form.Item>
              <Form.Item label={sc('autoSsl')}><Switch defaultChecked /></Form.Item>
              <Button type="primary" icon={<SaveOutlined />} onClick={showSaveMessage}>{sc('saveBtn')}</Button>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title={<Text strong>{sc('nginxConfig')}</Text>}>
              <Form.Item label={sc('workerProcesses')}><InputNumber min={1} max={64} defaultValue={4} style={{ width: '100%' }} /></Form.Item>
              <Form.Item label={sc('keepaliveTimeout')}><InputNumber min={10} max={300} defaultValue={65} style={{ width: '100%' }} suffix={sc('seconds')} /></Form.Item>
              <Form.Item label={sc('maxBodySize')}><InputNumber min={1} max={1024} defaultValue={128} style={{ width: '100%' }} suffix="MB" /></Form.Item>
            </Card>
          </Col>
        </Row>
      ),
    },
    {
      key: 'database', label: <Space><DatabaseOutlined />{t('settings.database')}</Space>,
      children: (
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card title={<Text strong>{sc('defaultDbSettings')}</Text>}>
              <Form.Item label={sc('defaultDbPort')}><InputNumber min={1} max={65535} defaultValue={5432} style={{ width: '100%' }} /></Form.Item>
              <Form.Item label={sc('maxConnections')}><InputNumber min={10} max={500} defaultValue={100} style={{ width: '100%' }} /></Form.Item>
              <Form.Item label={sc('autoBackup')}><Switch defaultChecked /></Form.Item>
              <Button type="primary" icon={<SaveOutlined />} onClick={showSaveMessage}>{sc('saveBtn')}</Button>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title={<Text strong>{sc('dbLimits')}</Text>}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F0F0F0' }}><Text>{sc('maxDbCount')}</Text><Tag style={{ borderRadius: 4 }}>{sc('unlimited')}</Tag></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F0F0F0' }}><Text>{sc('storageLimit')}</Text><Tag style={{ borderRadius: 4 }}>50 GB</Tag></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}><Text>{sc('backupRetention')}</Text><Tag style={{ borderRadius: 4 }}>30 {sc('days')}</Tag></div>
            </Card>
          </Col>
        </Row>
      ),
    },
    {
      key: 'email', label: <Space><MailOutlined />{t('settings.email')}</Space>,
      children: (
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card title={<Text strong>{sc('smtpConfig')}</Text>}>
              <Form.Item label={sc('smtpHost')}><Input placeholder="smtp.example.com" /></Form.Item>
              <Form.Item label={sc('smtpPort')}><InputNumber min={1} max={65535} defaultValue={587} style={{ width: '100%' }} /></Form.Item>
              <Form.Item label={sc('smtpUsername')}><Input placeholder="admin@example.com" /></Form.Item>
              <Form.Item label={sc('smtpPassword')}><Input.Password placeholder={sc('smtpPassword')} /></Form.Item>
              <Form.Item label={sc('encryption')}><Select options={[{label:'TLS',value:'tls'},{label:'SSL',value:'ssl'},{label:sc('noEncryption'),value:'none'}]} /></Form.Item>
              <Button type="primary" icon={<SaveOutlined />} onClick={showSaveMessage}>{sc('saveBtn')}</Button>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title={<Text strong>{sc('testEmail')}</Text>}>
              <Form.Item label={sc('testEmailTo')}><Input placeholder="test@example.com" /></Form.Item>
              <Button icon={<MailOutlined />}>{sc('sendTestEmail')}</Button>
            </Card>
          </Col>
        </Row>
      ),
    },
    {
      key: 'storage', label: <Space><CloudOutlined />{t('settings.storage')}</Space>,
      children: (
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card title={<Text strong>{sc('storageConfig')}</Text>}>
              <Form.Item label={sc('storagePath')}><Input defaultValue="/data/storage" /></Form.Item>
              <Form.Item label={sc('maxStorage')}><InputNumber min={10} max={100000} defaultValue={100} style={{ width: '100%' }} suffix="GB" /></Form.Item>
              <Form.Item label={sc('backupPath')}><Input defaultValue="/backups" /></Form.Item>
              <Button type="primary" icon={<SaveOutlined />} onClick={showSaveMessage}>{sc('saveBtn')}</Button>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title={<Text strong>{sc('storageUsage')}</Text>}>
              <Statistic title={sc('usedStorage')} value={324} suffix="GB / 1 TB" />
              <Divider />
              <Statistic title={sc('availableStorage')} value={700} suffix="GB" valueStyle={{ color: '#009688' }} />
            </Card>
          </Col>
        </Row>
      ),
    },
    {
      key: 'network', label: <Space><WifiOutlined />{t('settings.network')}</Space>,
      children: (
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card title={<Text strong>{sc('networkConfig')}</Text>}>
              <Form.Item label={sc('dnsServer')}><Input defaultValue="8.8.8.8" /></Form.Item>
              <Form.Item label={sc('defaultGateway')}><Input defaultValue="192.168.1.1" /></Form.Item>
              <Form.Item label={sc('bandwidthLimit')}><InputNumber min={1} max={10000} defaultValue={1000} style={{ width: '100%' }} /></Form.Item>
              <Button type="primary" icon={<SaveOutlined />} onClick={showSaveMessage}>{sc('saveBtn')}</Button>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title={<Text strong>{sc('networkPorts')}</Text>}>
              <div style={{ padding: '8px 0', borderBottom: '1px solid #F0F0F0', display: 'flex', justifyContent: 'space-between' }}><Text>eth0</Text><Tag color="green" style={{ borderRadius: 4 }}>1 Gbps</Tag></div>
              <div style={{ padding: '8px 0', display: 'flex', justifyContent: 'space-between' }}><Text>eth1</Text><Tag color="blue" style={{ borderRadius: 4 }}>10 Gbps</Tag></div>
            </Card>
          </Col>
        </Row>
      ),
    },
    {
      key: 'ai', label: <Space><ExperimentOutlined />{t('settings.ai')}</Space>,
      children: (
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card title={<Text strong>{sc('aiConfig')}</Text>}>
              <Form.Item label={sc('defaultModel')}><Select options={[{label:'GPT-4o',value:'gpt4o'},{label:'Llama 3',value:'llama3'},{label:'Mistral',value:'mistral'}]} /></Form.Item>
              <Form.Item label={sc('gpuAllocation')}><InputNumber min={0} max={8} defaultValue={2} style={{ width: '100%' }} /></Form.Item>
              <Form.Item label={sc('apiEndpoint')}><Input placeholder="https://api.openai.com/v1" /></Form.Item>
              <Form.Item label={sc('apiKey')}><Input.Password placeholder="sk-..." /></Form.Item>
              <Button type="primary" icon={<SaveOutlined />} onClick={showSaveMessage}>{sc('saveBtn')}</Button>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title={<Text strong>{sc('gpuStatus')}</Text>}>
              <Statistic title="GPU 0 (NVIDIA A100)" value={45} suffix={sc('gpuUsage')} valueStyle={{ color: '#009688' }} />
              <Statistic title={sc('gpuMemory')} value={32} suffix="GB / 80 GB" style={{ marginTop: 12 }} />
              <Statistic title={sc('temperature')} value={62} suffix="°C" style={{ marginTop: 12 }} />
            </Card>
          </Col>
        </Row>
      ),
    },
    {
      key: 'game', label: <Space><RocketOutlined />{t('settings.game')}</Space>,
      children: (
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card title={<Text strong>{sc('gameConfig')}</Text>}>
              <Form.Item label={sc('defaultGamePort')}><InputNumber min={1000} max={65535} defaultValue={25565} style={{ width: '100%' }} /></Form.Item>
              <Form.Item label={sc('autoRestart')}><Switch defaultChecked /></Form.Item>
              <Form.Item label={sc('backupSchedule')}><Input defaultValue="0 */6 * * *" /></Form.Item>
              <Button type="primary" icon={<SaveOutlined />} onClick={showSaveMessage}>{sc('saveBtn')}</Button>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title={<Text strong>{sc('gameOverview')}</Text>}>
              <Statistic title={sc('activeServers')} value={8} />
              <Statistic title={sc('onlinePlayers')} value={47} style={{ marginTop: 12 }} />
              <Statistic title={sc('totalGameBackups')} value={156} style={{ marginTop: 12 }} />
            </Card>
          </Col>
        </Row>
      ),
    },
    {
      key: 'backup', label: <Space><CloudOutlined />{t('settings.backup')}</Space>,
      children: (
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card title={<Text strong>{sc('backupConfig')}</Text>}>
              <Form.Item label={sc('backupCron')}><Input defaultValue="0 2 * * *" /></Form.Item>
              <Form.Item label={sc('retentionDays')}><InputNumber min={1} max={365} defaultValue={30} style={{ width: '100%' }} /></Form.Item>
              <Form.Item label={sc('backupStoragePath')}><Input defaultValue="/backups" /></Form.Item>
              <Form.Item label={sc('compressionFormat')}><Select options={[{label:'gzip',value:'gzip'},{label:'bzip2',value:'bzip2'},{label:sc('noCompression'),value:'none'}]} /></Form.Item>
              <Button type="primary" icon={<SaveOutlined />} onClick={showSaveMessage}>{sc('saveBtn')}</Button>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title={<Text strong>{sc('backupStatus')}</Text>}>
              <Statistic title={sc('lastBackup')} value="2026-06-17 02:00" />
              <Statistic title={sc('totalBackups')} value={48} style={{ marginTop: 12 }} />
              <Statistic title={sc('backupUsed')} value={128} suffix="GB" style={{ marginTop: 12 }} />
            </Card>
          </Col>
        </Row>
      ),
    },
    {
      key: 'notification', label: <Space><BellOutlined />{t('settings.notification')}</Space>,
      children: (
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card title={<Text strong>{sc('notifChannels')}</Text>}>
              {[
                {label:sc('emailAlert'),icon:<MailOutlined />},
                {label:sc('telegramAlert'),icon:<BellOutlined />},
                {label:sc('discordAlert'),icon:<BellOutlined />},
                {label:sc('slackAlert'),icon:<BellOutlined />},
                {label:sc('webhookAlert'),icon:<LinkOutlined />},
              ].map((n,i)=>(
                <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:'1px solid #F0F0F0'}}>
                  <Space><span style={{color:'#009688'}}>{n.icon}</span><Text>{n.label}</Text></Space>
                  <Switch size="small" />
                </div>
              ))}
              <Divider style={{margin:'8px 0'}}/>
              <Form.Item label={sc('alertEmail')}><Input placeholder="admin@example.com" /></Form.Item>
              <Button type="primary" icon={<SaveOutlined />} onClick={showSaveMessage}>{sc('saveBtn')}</Button>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title={<Text strong>{sc('alertTriggers')}</Text>}>
              <div style={{display:'flex',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid #F0F0F0'}}><Text>{sc('serverDown')}</Text><Switch defaultChecked size="small" /></div>
              <div style={{display:'flex',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid #F0F0F0'}}><Text>{sc('cpuHigh')}</Text><Switch defaultChecked size="small" /></div>
              <div style={{display:'flex',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid #F0F0F0'}}><Text>{sc('diskFull')}</Text><Switch defaultChecked size="small" /></div>
              <div style={{display:'flex',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid #F0F0F0'}}><Text>{sc('sslExpiring')}</Text><Switch defaultChecked size="small" /></div>
              <div style={{display:'flex',justifyContent:'space-between',padding:'10px 0'}}><Text>{sc('loginFailed')}</Text><Switch defaultChecked size="small" /></div>
            </Card>
          </Col>
        </Row>
      ),
    },
    {
      key: 'security', label: <Space><SafetyOutlined />{t('settings.security')}</Space>,
      children: (
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card title={<Text strong>{sc('securityPolicy')}</Text>}>
              <div style={{display:'flex',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid #F0F0F0'}}><Text>{sc('forceHttps')}</Text><Switch defaultChecked size="small" /></div>
              <div style={{display:'flex',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid #F0F0F0'}}><Text>{sc('rateLimiting')}</Text><Switch defaultChecked size="small" /></div>
              <div style={{display:'flex',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid #F0F0F0'}}><Text>{sc('allowRegistration')}</Text><Switch size="small" /></div>
              <div style={{display:'flex',justifyContent:'space-between',padding:'10px 0'}}><Text>{sc('bruteForce')}</Text><Switch defaultChecked size="small" /></div>
              <Divider style={{margin:'8px 0'}}/>
              <Form.Item label={sc('sessionTimeout')}><InputNumber min={5} max={1440} defaultValue={60} style={{ width: '100%' }} /></Form.Item>
              <Form.Item label={sc('minPasswordLength')}><InputNumber min={6} max={64} defaultValue={8} style={{ width: '100%' }} /></Form.Item>
              <Button type="primary" icon={<SaveOutlined />} onClick={showSaveMessage}>{sc('saveBtn')}</Button>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title={<Text strong>{sc('securityScore')}</Text>}>
              <Statistic title={sc('overallSafety')} value={85} suffix="%" valueStyle={{ color: '#009688' }} />
              <Statistic title={sc('openPorts')} value={3} suffix="ports" style={{ marginTop: 12 }} />
              <Statistic title={sc('failedLogins')} value={12} style={{ marginTop: 12 }} />
            </Card>
          </Col>
        </Row>
      ),
    },
    {
      key: 'api', label: <Space><ApiOutlined />{t('settings.api')}</Space>,
      children: (
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card title={<Text strong>{sc('apiConfig')}</Text>}>
              <Form.Item label={sc('apiRateLimit')}><InputNumber min={10} max={100000} defaultValue={1000} style={{ width: '100%' }} suffix={sc('requestsPerMin')} /></Form.Item>
              <Form.Item label={sc('requireApiKey')}><Switch defaultChecked /></Form.Item>
              <Form.Item label={sc('corsOrigins')}><Input placeholder="https://example.com" /></Form.Item>
              <Button type="primary" icon={<SaveOutlined />} onClick={showSaveMessage}>{sc('saveBtn')}</Button>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title={<Text strong>{sc('apiEndpoints')}</Text>}>
              <div style={{padding:'6px 0'}}><Text code style={{fontSize:12}}>GET /api/v1/...</Text><Text style={{float:'right',fontSize:12,color:'#999'}}>{sc('publicApi')}</Text></div>
              <div style={{padding:'6px 0'}}><Text code style={{fontSize:12}}>POST /api/v1/...</Text><Text style={{float:'right',fontSize:12,color:'#999'}}>{sc('authRequired')}</Text></div>
            </Card>
          </Col>
        </Row>
      ),
    },
    {
      key: 'theme', label: <Space><BgColorsOutlined />{t('settings.theme')}</Space>,
      children: (
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card title={<Text strong>{sc('themeSettings')}</Text>}>
              <div style={{display:'flex',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid #F0F0F0'}}><Text>{sc('darkMode')}</Text><Switch /></div>
              <div style={{display:'flex',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid #F0F0F0'}}><Text>{sc('primaryColor')}</Text><ColorPicker defaultValue="#009688" /></div>
              <div style={{display:'flex',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid #F0F0F0'}}><Text>{sc('bgColor')}</Text><ColorPicker defaultValue="#FDFDFD" /></div>
              <div style={{display:'flex',justifyContent:'space-between',padding:'10px 0'}}><Text>{sc('fontSize')}</Text><InputNumber min={12} max={20} defaultValue={14} style={{ width: 80 }} /></div>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title={<Text strong>{sc('branding')}</Text>}>
              <Form.Item label={sc('logoUpload')}><Upload><Button icon={<UploadOutlined />}>{sc('uploadLogo')}</Button></Upload></Form.Item>
              <Form.Item label={sc('faviconUpload')}><Upload><Button icon={<UploadOutlined />}>{sc('uploadFavicon')}</Button></Upload></Form.Item>
              <Form.Item label={sc('displayName')}><Input defaultValue="Kpanel" /></Form.Item>
              <Form.Item label={sc('customCss')}><Input.TextArea rows={4} placeholder={sc('customCssPlaceholder')} /></Form.Item>
              <Button type="primary" icon={<SaveOutlined />} onClick={showSaveMessage}>{sc('saveBtn')}</Button>
            </Card>
          </Col>
        </Row>
      ),
    },
    {
      key: 'localization', label: <Space><GlobalOutlined />{t('settings.localization')}</Space>,
      children: (
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card title={<Text strong>{t('settings.localization')}</Text>}>
              <Form.Item label={t('settings.langLabel')}><Select options={langOptions} value={language} onChange={(val) => setLanguage(val as any)} /></Form.Item>
              <Form.Item label={t('settings.timezoneLabel')}><Select options={tzOptions} /></Form.Item>
              <Form.Item label={sc('dateFormat')}><Select options={[{label:sc('dateDmy'),value:'dd/mm/yyyy'},{label:sc('dateMdy'),value:'mm/dd/yyyy'},{label:sc('dateYmd'),value:'yyyy-mm-dd'}]} /></Form.Item>
              <Form.Item label={sc('currency')}><Select options={[{label:sc('currencyVnd'),value:'vnd'},{label:sc('currencyUsd'),value:'usd'},{label:sc('currencyJpy'),value:'jpy'}]} /></Form.Item>
              <Button type="primary" icon={<SaveOutlined />} onClick={showSaveMessage}>{t('settings.saveBtn')}</Button>
            </Card>
          </Col>
        </Row>
      ),
    },
    {
      key: 'performance', label: <Space><ThunderboltOutlined />{t('settings.performance')}</Space>,
      children: (
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card title={<Text strong>{sc('perfOptimization')}</Text>}>
              <div style={{display:'flex',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid #F0F0F0'}}><Text>{sc('opcache')}</Text><Switch defaultChecked /></div>
              <div style={{display:'flex',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid #F0F0F0'}}><Text>{sc('pageCache')}</Text><Switch defaultChecked /></div>
              <div style={{display:'flex',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid #F0F0F0'}}><Text>{sc('gzip')}</Text><Switch defaultChecked /></div>
              <div style={{display:'flex',justifyContent:'space-between',padding:'10px 0'}}><Text>{sc('cdn')}</Text><Switch /></div>
              <Button type="primary" icon={<SaveOutlined />} onClick={showSaveMessage} style={{ marginTop: 12 }}>{sc('saveBtn')}</Button>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title={<Text strong>{sc('cacheConfig')}</Text>}>
              <Form.Item label={sc('cacheDriver')}><Select options={[{label:sc('cacheDriverRedis'),value:'redis'},{label:sc('cacheDriverFile'),value:'file'},{label:'Memcached',value:'memcached'}]} /></Form.Item>
              <Form.Item label={sc('cacheTtl')}><InputNumber min={10} max={86400} defaultValue={3600} style={{ width: '100%' }} /></Form.Item>
              <Form.Item label={sc('redisHost')}><Input defaultValue="localhost" /></Form.Item>
              <Form.Item label={sc('redisPort')}><InputNumber min={1} max={65535} defaultValue={6379} style={{ width: '100%' }} /></Form.Item>
            </Card>
          </Col>
        </Row>
      ),
    },
    {
      key: 'cache', label: <Space><ThunderboltOutlined />{t('settings.cache')}</Space>,
      children: (
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card title={<Text strong>{sc('cacheManagement')}</Text>}>
              <Statistic title={sc('hitRate')} value={94.2} suffix="%" valueStyle={{ color: '#009688' }} />
              <Statistic title={sc('cacheRamUsed')} value={128} suffix="MB" style={{ marginTop: 12 }} />
              <Button type="primary" style={{ marginTop: 16 }} icon={<DeleteOutlined />}>{sc('clearCache')}</Button>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title={<Text strong>{sc('cacheDetails')}</Text>}>
              <div style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid #F0F0F0'}}><Text>{sc('totalKeys')}</Text><Tag style={{borderRadius:4}}>12,450</Tag></div>
              <div style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid #F0F0F0'}}><Text>{sc('totalHits')}</Text><Tag color="green" style={{borderRadius:4}}>1,245,890</Tag></div>
              <div style={{display:'flex',justifyContent:'space-between',padding:'8px 0'}}><Text>{sc('totalMisses')}</Text><Tag color="red" style={{borderRadius:4}}>76,210</Tag></div>
            </Card>
          </Col>
        </Row>
      ),
    },
    {
      key: 'updates', label: <Space><ToolOutlined />{t('settings.updates')}</Space>,
      children: (
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card title={<Text strong>{sc('updateSystem')}</Text>}>
              <div style={{display:'flex',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid #F0F0F0'}}><Text>{sc('autoUpdate')}</Text><Switch defaultChecked /></div>
              <div style={{display:'flex',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid #F0F0F0'}}><Text>{sc('currentVersion')}</Text><Tag color="green" style={{borderRadius:4}}>v2.0.0 ({sc('latestTag')})</Tag></div>
              <div style={{display:'flex',justifyContent:'space-between',padding:'10px 0'}}><Text>{sc('lastCheck')}</Text><Text style={{color:'#999',fontSize:12}}>2026-06-17 06:00</Text></div>
              <Button type="primary" icon={<ToolOutlined />} style={{marginTop:12}}>{sc('checkUpdates')}</Button>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title={<Text strong>{sc('changelog')}</Text>}>
              <div style={{padding:'6px 0'}}><Tag color="blue" style={{borderRadius:4}}>v2.0.0</Tag><Text>{sc('changelogV2')}</Text></div>
              <div style={{padding:'6px 0'}}><Tag color="blue" style={{borderRadius:4}}>v1.5.0</Tag><Text>{sc('changelogV15')}</Text></div>
              <div style={{padding:'6px 0'}}><Tag color="blue" style={{borderRadius:4}}>v1.0.0</Tag><Text>{sc('changelogV1')}</Text></div>
            </Card>
          </Col>
        </Row>
      ),
    },
    {
      key: 'marketplace', label: <Space><AppstoreOutlined />{t('settings.marketplace')}</Space>,
      children: (
        <Card>
          <Alert message={sc('marketplaceInfo')} type="info" showIcon style={{marginBottom:16,borderRadius:6}} />
          <Row gutter={[16, 16]}>
            {[
              {name:'Docker Manager',desc:sc('dockerManagerDesc'),installed:true,price:sc('free')},
              {name:'SSL Auto Renew',desc:sc('sslAutoDesc'),installed:true,price:sc('free')},
              {name:'Backup Pro',desc:sc('backupProDesc'),installed:false,price:'$9.99'+sc('perMonth')},
              {name:'AI Assistant',desc:sc('aiAssistantDesc'),installed:false,price:'$14.99'+sc('perMonth')},
              {name:'Monitoring Plus',desc:sc('monitoringPlusDesc'),installed:false,price:'$4.99'+sc('perMonth')},
              {name:'White Label',desc:sc('whiteLabelDesc'),installed:false,price:'$19.99'+sc('perMonth')},
            ].map((p,i)=>(
              <Col xs={24} sm={12} md={8} key={i}>
                <Card size="small" title={<Text strong>{p.name}</Text>} extra={<Tag color={p.installed?'green':'blue'} style={{borderRadius:4}}>{p.installed?sc('installed'):p.price}</Tag>}>
                  <Text style={{color:'#757575',fontSize:12}}>{p.desc}</Text>
                  <div style={{marginTop:8}}><Button size="small" type={p.installed?'default':'primary'}>{p.installed?sc('uninstall'):sc('installNow')}</Button></div>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      ),
    },
    {
      key: 'plugins', label: <Space><AppstoreOutlined />{t('settings.plugins')}</Space>,
      children: (
        <Card styles={{ body: { padding: 0 } }}>
          <div style={{ padding: 16 }}>
            <Alert message={sc('pluginsInfo')} type="info" showIcon style={{borderRadius:6}} />
          </div>
          <KTable viewKeyPrefix="settings-plugins" dataSource={[
            {key:'1',name:'Git Deploy',version:'1.2.0',author:'Kpanel Team',status:'active'},
            {key:'2',name:'Cron Manager',version:'2.0.1',author:'Kpanel Team',status:'active'},
            {key:'3',name:'WebStats',version:'1.0.0',author:'Community Developer',status:'inactive'},
          ]} columns={[
            {title:sc('pluginName'),dataIndex:'name',key:'name',render:(v:string)=><Text strong>{v}</Text>},
            {title:sc('pluginVersion'),dataIndex:'version',key:'version'},
            {title:sc('pluginAuthor'),dataIndex:'author',key:'author'},
            {title:sc('pluginStatus'),dataIndex:'status',key:'status',render:(v:string)=><Tag color={v==='active'?'green':'default'} style={{borderRadius:4}}>{v==='active'?sc('pluginActive'):sc('pluginInactive')}</Tag>},
            {title:'',key:'a',render:(_:any,r:any)=><Switch size="small" checked={r.status==='active'}/>},
          ]} pagination={false} size="small" />
        </Card>
      ),
    },
    {
      key: 'extensions', label: <Space><AppstoreOutlined />{t('settings.extensions')}</Space>,
      children: (
        <Card>
          <Alert message={sc('extensionsInfo')} type="info" showIcon style={{marginBottom:16,borderRadius:6}} />
          <Text style={{color:'#757575'}}>{sc('noExtensions')}</Text>
        </Card>
      ),
    },
    {
      key: 'monitoring', label: <Space><MonitorOutlined />{t('settings.monitoring')}</Space>,
      children: (
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card title={<Text strong>{sc('monitorConfig')}</Text>}>
              <Form.Item label={sc('checkInterval')}><Select options={[{label:sc('sec30'),value:30},{label:sc('min1'),value:60},{label:sc('min5'),value:300}]} /></Form.Item>
              <Form.Item label={sc('dataRetention')}><Select options={[{label:sc('days7'),value:7},{label:sc('days30'),value:30},{label:sc('days90'),value:90}]} /></Form.Item>
              <Form.Item label={sc('alertThreshold')}><InputNumber min={50} max={100} defaultValue={90} style={{width:'100%'}} suffix="%" /></Form.Item>
              <Button type="primary" icon={<SaveOutlined />} onClick={showSaveMessage}>{sc('saveBtn')}</Button>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title={<Text strong>{sc('monitorStatus')}</Text>}>
              <Statistic title={sc('activeChecks')} value={24} />
              <Statistic title={sc('alertsTriggered')} value={3} style={{marginTop:12}} />
              <Statistic title={sc('avgResponseTime')} value={230} suffix="ms" style={{marginTop:12}} />
            </Card>
          </Col>
        </Row>
      ),
    },
    {
      key: 'logging', label: <Space><FileTextOutlined />{t('settings.logging')}</Space>,
      children: (
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card title={<Text strong>{sc('loggingConfig')}</Text>}>
              <Form.Item label={sc('logLevel')}><Select options={[{label:sc('logLevelDebug'),value:'debug'},{label:sc('logLevelInfo'),value:'info'},{label:sc('logLevelWarning'),value:'warning'},{label:sc('logLevelError'),value:'error'}]} /></Form.Item>
              <Form.Item label={sc('logRetention')}><InputNumber min={1} max={365} defaultValue={30} style={{width:'100%'}} suffix={sc('days')} /></Form.Item>
              <Form.Item label={sc('maxLogSize')}><InputNumber min={10} max={10240} defaultValue={512} style={{width:'100%'}} suffix="MB" /></Form.Item>
              <Button type="primary" icon={<SaveOutlined />} onClick={showSaveMessage}>{sc('saveBtn')}</Button>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title={<Text strong>{sc('logStats')}</Text>}>
              <Statistic title={sc('logLinesToday')} value={12540} />
              <Statistic title={sc('errorLinesToday')} value={23} valueStyle={{color:'#F44336'}} style={{marginTop:12}} />
              <Statistic title={sc('totalLogSize')} value={2.4} suffix="GB" style={{marginTop:12}} />
            </Card>
          </Col>
        </Row>
      ),
    },
    {
      key: 'integrations', label: <Space><LinkOutlined />{t('settings.integrations')}</Space>,
      children: (
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card title={<Text strong>{sc('integrationsList')}</Text>}>
              {[
                {label:'GitHub',desc:sc('githubDesc')},
                {label:'GitLab',desc:sc('gitlabDesc')},
                {label:'Slack',desc:sc('slackDesc')},
                {label:'Discord',desc:sc('discordDesc')},
                {label:'Telegram',desc:sc('telegramDesc')},
                {label:'PagerDuty',desc:sc('pagerdutydesc')},
                {label:'Prometheus',desc:sc('prometheusDesc')},
                {label:'Grafana',desc:sc('grafanaDesc')},
              ].map((int,i)=>(
                <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:'1px solid #F0F0F0'}}>
                  <div><Text strong>{int.label}</Text><div><Text style={{color:'#757575',fontSize:12}}>{int.desc}</Text></div></div>
                  <Button size="small">{sc('configure')}</Button>
                </div>
              ))}
            </Card>
          </Col>
        </Row>
      ),
    },
    {
      key: 'billing', label: <Space><DollarOutlined />{t('settings.billing')}</Space>,
      children: (
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card title={<Text strong>{sc('billingConfig')}</Text>}>
              <Form.Item label={sc('billingCurrency')}><Select options={[{label:sc('usdLabel'),value:'usd'},{label:sc('vndLabel'),value:'vnd'}]} /></Form.Item>
              <Form.Item label={sc('defaultTax')}><InputNumber min={0} max={100} defaultValue={10} style={{width:'100%'}} /></Form.Item>
              <Form.Item label={sc('invoicePrefix')}><Input defaultValue="INV-" /></Form.Item>
              <Button type="primary" icon={<SaveOutlined />} onClick={showSaveMessage}>{sc('saveBtn')}</Button>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title={<Text strong>{sc('billingOverview')}</Text>}>
              <Statistic title={sc('monthlyRevenue')} value={2499.99} prefix="$" />
              <Statistic title={sc('activeSubscriptions')} value={12} style={{marginTop:12}} />
              <Statistic title={sc('pendingInvoices')} value={3} style={{marginTop:12}} />
            </Card>
          </Col>
        </Row>
      ),
    },
    {
      key: 'advanced', label: <Space><ToolOutlined />{t('settings.advanced')}</Space>,
      children: (
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card title={<Text strong>{sc('advancedConfig')}</Text>}>
              <Form.Item label={sc('customJson')}><Input.TextArea rows={6} placeholder={sc('customJsonPlaceholder')} /></Form.Item>
              <Form.Item label={sc('serverEnv')}><Select options={[{label:sc('envDev'),value:'dev'},{label:sc('envStaging'),value:'staging'},{label:sc('envProd'),value:'prod'}]} /></Form.Item>
              <Button type="primary" icon={<SaveOutlined />} onClick={showSaveMessage}>{sc('saveBtn')}</Button>
              <Divider />
              <Button danger icon={<DeleteOutlined />}>{sc('resetDefaults')}</Button>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title={<Text strong>{sc('recentSysLogs')}</Text>}>
              <pre style={{fontSize:11,color:'#757575',maxHeight:200,overflow:'auto'}}>
{`[2026-06-17 08:30:12] INFO: System started
[2026-06-17 08:30:13] INFO: Database connected
[2026-06-17 08:30:14] INFO: Redis connected
[2026-06-17 08:30:15] INFO: Server ready on port 3001`}
              </pre>
            </Card>
          </Col>
        </Row>
      ),
    },
  ];

  return (
    <Form layout="vertical" form={form}>

      <Tabs activeKey={activeTab} onChange={setActiveTab} tabPosition="left" style={{minHeight:'60vh'}} items={settingsTabs} />
    </Form>
  );
};

export default Settings;
