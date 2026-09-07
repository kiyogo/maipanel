import React from 'react';
import { Form, Input, Button, Typography, Space, Divider, Alert, InputNumber, Select } from '../../custom-ui';
import { SaveOutlined, ReloadOutlined, StopOutlined, PlayCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface PythonWsgiConfigProps {
  projectId: string;
}

const PythonWsgiConfig: React.FC<PythonWsgiConfigProps> = ({ projectId }) => {
  return (
    <div>
      <Title level={5}>Cấu hình WSGI/ASGI (Gunicorn/Uvicorn)</Title>
      <Alert message="Cấu hình này dành cho các web framework Python (Django, Flask, FastAPI) chạy qua Gunicorn hoặc Uvicorn." type="info" showIcon style={{ marginBottom: 16 }} />
      
      <Form layout="vertical">
        <Space size="large" style={{ display: 'flex', width: '100%', flexWrap: 'wrap' }}>
          <Form.Item label="WSGI/ASGI Application Path" style={{ minWidth: 300 }}>
            <Input defaultValue="app.main:app" placeholder="module:app" />
          </Form.Item>
          
          <Form.Item label="Server Type" style={{ minWidth: 200 }}>
            <Select defaultValue="gunicorn" options={[{label: 'Gunicorn (WSGI)', value: 'gunicorn'}, {label: 'Uvicorn (ASGI)', value: 'uvicorn'}]} />
          </Form.Item>

          <Form.Item label="Số lượng Workers" style={{ minWidth: 200 }}>
            <InputNumber min={1} max={32} defaultValue={4} style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item label="Timeout (giây)">
            <InputNumber min={10} max={300} defaultValue={30} style={{ width: '100%' }} />
          </Form.Item>
        </Space>

        <Form.Item label="Lệnh cài đặt thư viện (requirements.txt)">
          <div style={{ display: 'flex', gap: 8 }}>
            <Input defaultValue="pip install -r requirements.txt" />
            <Button>Chạy lệnh Pip</Button>
          </div>
        </Form.Item>

        <Divider />
        <Space>
          <Button type="primary" icon={<SaveOutlined />}>Lưu cấu hình</Button>
          <Button icon={<PlayCircleOutlined />} style={{ color: '#52c41a', borderColor: '#52c41a' }}>Start Service</Button>
          <Button icon={<ReloadOutlined />}>Restart Service</Button>
          <Button icon={<StopOutlined />} danger>Stop Service</Button>
        </Space>
      </Form>
    </div>
  );
};

export default PythonWsgiConfig;
