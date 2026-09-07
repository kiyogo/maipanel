import React from 'react';
import { Button, Typography, Space, Select } from '../../custom-ui';
import { ReloadOutlined, DownloadOutlined, ClearOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface LogViewerProps {
  projectId: string;
}

const LogViewer: React.FC<LogViewerProps> = ({ projectId }) => {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={5} style={{ margin: 0 }}>Nhật ký hệ thống (Logs)</Title>
        <Space>
          <Select defaultValue="access" style={{ width: 150 }} options={[{label: 'Access Logs', value: 'access'}, {label: 'Error Logs', value: 'error'}, {label: 'App Logs', value: 'app'}]} />
          <Button icon={<ReloadOutlined />}>Tải lại</Button>
          <Button icon={<ClearOutlined />} danger>Xóa Logs</Button>
          <Button icon={<DownloadOutlined />}>Tải về</Button>
        </Space>
      </div>
      
      <div style={{ background: '#1e1e1e', borderRadius: 8, padding: 16, height: 400, overflowY: 'auto' }}>
        <pre style={{ color: '#00ff00', fontFamily: 'monospace', margin: 0, whiteSpace: 'pre-wrap', fontSize: 13 }}>
          {`[2026-06-20 10:15:30] INFO: Application started successfully.
[2026-06-20 10:15:35] INFO: Listening on port 3000
[2026-06-20 10:16:01] GET /api/status 200 15ms
[2026-06-20 10:16:12] GET /api/users 200 45ms
[2026-06-20 10:17:44] POST /api/login 401 20ms
[2026-06-20 10:18:02] GET / 200 12ms
`}
        </pre>
      </div>
    </div>
  );
};

export default LogViewer;
