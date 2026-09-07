import React from 'react';
import { Form, Input, Button, Switch, Typography, Alert, Card, Space, Select } from '../../custom-ui';
import { GithubOutlined, SyncOutlined, SaveOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

interface GitConfigProps {
  projectId: string;
}

const GitConfig: React.FC<GitConfigProps> = ({ projectId }) => {
  return (
    <div>
      <Title level={5}>Tích hợp Git (Github/Gitlab/Bitbucket)</Title>
      <Alert message="Cấu hình Git cho phép hệ thống tự động triển khai (auto-deploy) mỗi khi bạn đẩy code (push) lên nhánh cấu hình." type="info" showIcon style={{ marginBottom: 16 }} />
      
      <Card title="Cấu hình Repository" bordered={false} style={{ marginBottom: 16 }}>
        <Form layout="vertical">
          <Form.Item label="Đường dẫn Repository (Git URL)">
            <Input placeholder="https://github.com/username/project.git" prefix={<GithubOutlined />} />
          </Form.Item>
          
          <Space size="large" style={{ display: 'flex', width: '100%' }}>
            <Form.Item label="Nhánh triển khai (Branch)" style={{ width: 300 }}>
              <Select defaultValue="main" options={[{label: 'main', value: 'main'}, {label: 'master', value: 'master'}, {label: 'develop', value: 'develop'}]} />
            </Form.Item>
            
            <Form.Item label="Xác thực">
              <Select defaultValue="none" options={[{label: 'Không xác thực (Public Repo)', value: 'none'}, {label: 'Sử dụng SSH Key', value: 'ssh'}, {label: 'Personal Access Token', value: 'token'}]} />
            </Form.Item>
          </Space>

          <Form.Item label="Tự động triển khai (Auto Deploy Webhook)">
            <Switch defaultChecked />
            <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>URL Webhook (Copy và dán vào cài đặt repo của bạn): <Text code>https://kpanel.example.com/api/webhooks/deploy/{projectId}</Text></Text>
          </Form.Item>

          <Space>
            <Button type="primary" icon={<SaveOutlined />}>Lưu cấu hình Git</Button>
            <Button icon={<SyncOutlined />}>Kéo code mới nhất (Manual Pull)</Button>
          </Space>
        </Form>
      </Card>
    </div>
  );
};

export default GitConfig;
