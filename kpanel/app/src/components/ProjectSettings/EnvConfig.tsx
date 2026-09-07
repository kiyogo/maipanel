import React from 'react';
import { Form, Input, Button, Typography, Alert, Space } from '../../custom-ui';
import { SaveOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface EnvConfigProps {
  projectId: string;
}

const EnvConfig: React.FC<EnvConfigProps> = ({ projectId }) => {
  return (
    <div>
      <Title level={5}>Biến môi trường (.env)</Title>
      <Alert message="Cấu hình các biến môi trường an toàn tại đây thay vì đẩy lên Git (tránh lộ thông tin nhạy cảm như Mật khẩu DB, API Key)." type="warning" showIcon style={{ marginBottom: 16 }} />
      
      <Form layout="vertical">
        <Form.Item label="Nội dung file .env">
          <Input.TextArea 
            rows={15} 
            placeholder="APP_ENV=production\nAPP_DEBUG=false\nDB_HOST=127.0.0.1\nDB_PASSWORD=secret..." 
            defaultValue={"APP_ENV=production\nAPP_DEBUG=false\nDB_HOST=127.0.0.1\nDB_PORT=3306\nDB_DATABASE=my_project\nDB_USERNAME=root\nDB_PASSWORD=secret"}
            style={{ fontFamily: 'monospace', fontSize: 13, background: '#1e1e1e', color: '#d4d4d4', padding: 12, borderRadius: 6 }}
          />
          <Text type="secondary" style={{ marginTop: 8, display: 'block' }}>Lưu ý: Mọi thay đổi sẽ cần khởi động lại dự án để có hiệu lực.</Text>
        </Form.Item>

        <Button type="primary" icon={<SaveOutlined />}>Lưu biến môi trường</Button>
      </Form>
    </div>
  );
};

export default EnvConfig;
