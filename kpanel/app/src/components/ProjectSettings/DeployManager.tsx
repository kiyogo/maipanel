import React from 'react';
import { Form, Input, Button, Typography, Space, Timeline, Tag } from '../../custom-ui';
import { RocketOutlined, PlayCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface DeployManagerProps {
  projectId: string;
}

const DeployManager: React.FC<DeployManagerProps> = ({ projectId }) => {
  return (
    <div>
      <Title level={5}>Cấu hình Triển khai (Deploy/CI-CD)</Title>
      
      <Form layout="vertical" style={{ marginBottom: 24 }}>
        <Form.Item label="Kịch bản triển khai (Deploy Script)">
          <Input.TextArea 
            rows={8} 
            defaultValue={"git pull origin main\ncomposer install --no-dev --optimize-autoloader\nphp artisan migrate --force\nphp artisan config:cache\nphp artisan route:cache\nphp artisan view:cache"}
            style={{ fontFamily: 'monospace', fontSize: 13, background: '#1e1e1e', color: '#d4d4d4', padding: 12, borderRadius: 6 }}
          />
        </Form.Item>
        <Space>
          <Button type="primary" icon={<RocketOutlined />}>Lưu kịch bản</Button>
          <Button icon={<PlayCircleOutlined />} style={{ color: '#52c41a', borderColor: '#52c41a' }}>Triển khai ngay (Deploy Now)</Button>
        </Space>
      </Form>

      <Title level={5}>Lịch sử Triển khai</Title>
      <Timeline
        items={[
          { children: <><Text strong>v1.0.4</Text> - <Tag color="success">Thành công</Tag> <Text type="secondary">2 giờ trước (bởi Auto Deploy)</Text></> },
          { children: <><Text strong>v1.0.3</Text> - <Tag color="error">Thất bại</Tag> <Text type="secondary">Hôm qua</Text></> },
          { children: <><Text strong>v1.0.2</Text> - <Tag color="success">Thành công</Tag> <Text type="secondary">3 ngày trước</Text></> },
        ]}
      />
    </div>
  );
};

export default DeployManager;
