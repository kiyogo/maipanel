import React from 'react';
import { Form, Input, Button, Typography, Space, Divider, Alert, InputNumber, Switch } from '../../custom-ui';
import { SaveOutlined, ReloadOutlined, StopOutlined, PlayCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface NodePm2ConfigProps {
  projectId: string;
}

const NodePm2Config: React.FC<NodePm2ConfigProps> = ({ projectId }) => {
  return (
    <div>
      <Title level={5}>Cấu hình Node.js & PM2</Title>
      <Alert message="PM2 là trình quản lý tiến trình (Process Manager) giúp giữ cho ứng dụng Node.js của bạn luôn chạy 24/7." type="info" showIcon style={{ marginBottom: 16 }} />
      
      <Form layout="vertical">
        <Space size="large" style={{ display: 'flex', width: '100%', flexWrap: 'wrap' }}>
          <Form.Item label="Script Khởi chạy (Entry File)" style={{ minWidth: 300 }}>
            <Input defaultValue="npm run start" />
          </Form.Item>
          
          <Form.Item label="Tên tiến trình PM2 (Process Name)" style={{ minWidth: 300 }}>
            <Input defaultValue="my-node-app" />
          </Form.Item>

          <Form.Item label="Số lượng Instance (Cluster Mode)" style={{ minWidth: 300 }}>
            <InputNumber min={1} max={32} defaultValue={1} style={{ width: '100%' }} />
            <Text type="secondary" style={{ display: 'block', marginTop: 4, fontSize: 12 }}>Nhập "max" để dùng toàn bộ nhân CPU.</Text>
          </Form.Item>
          
          <Form.Item label="Giới hạn RAM tự khởi động lại (Max Memory Restart)">
            <Input defaultValue="1G" />
          </Form.Item>
        </Space>

        <Form.Item label="Tự động khởi động cùng hệ thống (Watch & Restart)">
          <Switch />
        </Form.Item>

        <Divider />
        <Space>
          <Button type="primary" icon={<SaveOutlined />}>Lưu cấu hình</Button>
          <Button icon={<PlayCircleOutlined />} style={{ color: '#52c41a', borderColor: '#52c41a' }}>Start PM2</Button>
          <Button icon={<ReloadOutlined />}>Restart PM2</Button>
          <Button icon={<StopOutlined />} danger>Stop PM2</Button>
        </Space>
      </Form>
    </div>
  );
};

export default NodePm2Config;
