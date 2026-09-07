import React from 'react';
import { Form, Switch, Button, Typography, Space, Input, Alert, Select, Table, Tag } from '../../custom-ui';
import { SaveOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface SecurityConfigProps {
  projectId: string;
  type: 'security' | 'access';
}

const SecurityConfig: React.FC<SecurityConfigProps> = ({ projectId, type }) => {
  return (
    <div>
      <Title level={5}>{type === 'security' ? 'Cài đặt Bảo mật' : 'Quyền truy cập (Access Control)'}</Title>
      
      {type === 'security' ? (
        <>
          <Alert message="Bảo vệ ứng dụng của bạn khỏi các cuộc tấn công phổ biến như DDoS, XSS, SQL Injection." type="warning" showIcon style={{ marginBottom: 16 }} />
          <Form layout="vertical">
            <Form.Item label="Web Application Firewall (WAF)">
              <Switch defaultChecked />
              <Text type="secondary" style={{ display: 'block', marginTop: 4 }}>Bật tường lửa WAF (ModSecurity) cho dự án này.</Text>
            </Form.Item>
            
            <Form.Item label="Chặn IP độc hại (Fail2Ban)">
              <Switch defaultChecked />
            </Form.Item>

            <Form.Item label="Danh sách Blacklist IP (Cấm truy cập)">
              <Input.TextArea rows={4} placeholder="Nhập mỗi IP một dòng, vd: 192.168.1.1" />
            </Form.Item>

            <Space>
              <Button type="primary" icon={<SaveOutlined />}>Lưu cấu hình bảo mật</Button>
            </Space>
          </Form>
        </>
      ) : (
        <>
          <Alert message="Thiết lập mật khẩu bảo vệ thư mục hoặc giới hạn quyền truy cập theo địa chỉ IP." type="info" showIcon style={{ marginBottom: 16 }} />
          
          <Title level={5} style={{ marginTop: 24 }}>Bảo vệ thư mục bằng mật khẩu (Basic Auth)</Title>
          <Form layout="inline" style={{ marginBottom: 16 }}>
            <Form.Item><Input placeholder="Đường dẫn (vd: /admin)" style={{ width: 180 }} /></Form.Item>
            <Form.Item><Input placeholder="Tài khoản" style={{ width: 120 }} /></Form.Item>
            <Form.Item><Input.Password placeholder="Mật khẩu" style={{ width: 120 }} /></Form.Item>
            <Form.Item><Button type="primary" icon={<PlusOutlined />}>Thêm</Button></Form.Item>
          </Form>
          
          <Table 
            dataSource={[{ key: '1', path: '/wp-admin', user: 'admin' }]} 
            columns={[
              { title: 'Đường dẫn', dataIndex: 'path', key: 'path' },
              { title: 'Tài khoản', dataIndex: 'user', key: 'user' },
              { title: 'Hành động', key: 'action', render: () => <Button size="small" danger type="text" icon={<DeleteOutlined />} /> }
            ]} 
            pagination={false} size="small" 
          />
        </>
      )}
    </div>
  );
};

export default SecurityConfig;
