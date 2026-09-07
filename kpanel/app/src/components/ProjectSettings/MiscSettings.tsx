import React from 'react';
import { Form, Input, Button, Typography, Space, Alert, Select, Switch } from '../../custom-ui';
import { SaveOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface MiscSettingsProps {
  projectId: string;
  type: string; // 'Go Version' | 'Java Version' | 'Rate Limit' | 'Settings' | 'Version' | 'Build'
}

const MiscSettings: React.FC<MiscSettingsProps> = ({ projectId, type }) => {
  return (
    <div>
      <Title level={5}>{type}</Title>

      {(type === 'Go Version' || type === 'Java Version' || type === 'Version') && (
        <Form layout="vertical">
          <Alert message={`Chọn phiên bản runtime cho dự án ${type.split(' ')[0]}.`} type="info" showIcon style={{ marginBottom: 16 }} />
          <Form.Item label="Phiên bản (Version)" style={{ width: 300 }}>
            <Select defaultValue="latest" options={[{label: 'Mới nhất (Latest)', value: 'latest'}, {label: 'Phiên bản ổn định (LTS)', value: 'lts'}, {label: 'Phiên bản cũ hơn (Legacy)', value: 'legacy'}]} />
          </Form.Item>
          <Button type="primary" icon={<SaveOutlined />}>Lưu cấu hình</Button>
        </Form>
      )}

      {type === 'Build' && (
        <Form layout="vertical">
          <Alert message="Cấu hình lệnh Build (Compile) trước khi chạy dự án." type="info" showIcon style={{ marginBottom: 16 }} />
          <Form.Item label="Build Command">
            <Input.TextArea rows={3} defaultValue="npm run build" style={{ fontFamily: 'monospace' }} />
          </Form.Item>
          <Form.Item label="Thư mục chứa file build (Build Output Directory)">
            <Input defaultValue="dist" />
          </Form.Item>
          <Button type="primary" icon={<SaveOutlined />}>Lưu lệnh Build</Button>
        </Form>
      )}

      {type === 'Rate Limit' && (
        <Form layout="vertical">
          <Alert message="Giới hạn số lượng request API / Proxy để chống Spam và DDoS." type="warning" showIcon style={{ marginBottom: 16 }} />
          <Form.Item label="Kích hoạt Rate Limiting">
            <Switch defaultChecked />
          </Form.Item>
          <Form.Item label="Max Requests per IP (trong 1 phút)">
            <Input defaultValue="60" style={{ width: 200 }} />
          </Form.Item>
          <Button type="primary" icon={<SaveOutlined />}>Lưu giới hạn</Button>
        </Form>
      )}

      {type === 'Settings' && (
        <Form layout="vertical">
          <Alert message="Các cài đặt khác của dự án." type="info" showIcon style={{ marginBottom: 16 }} />
          <Form.Item label="Mô tả dự án">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Button type="primary" icon={<SaveOutlined />}>Lưu cài đặt</Button>
        </Form>
      )}

    </div>
  );
};

export default MiscSettings;
