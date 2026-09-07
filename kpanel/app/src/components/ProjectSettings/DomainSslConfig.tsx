import React from 'react';
import { Form, Input, Button, Switch, Table, Tag, Typography, Alert, Divider } from '../../custom-ui';
import { PlusOutlined, DeleteOutlined, SafetyCertificateOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

interface DomainSslConfigProps {
  projectId: string;
}

const DomainSslConfig: React.FC<DomainSslConfigProps> = ({ projectId }) => {
  const domains = [
    { key: '1', domain: 'example.com', type: 'Primary', ssl: 'Active', expiry: '2027-01-01' },
    { key: '2', domain: 'www.example.com', type: 'Alias', ssl: 'Active', expiry: '2027-01-01' },
  ];

  const columns = [
    { title: 'Tên miền', dataIndex: 'domain', key: 'domain', render: (t: string) => <Text strong>{t}</Text> },
    { title: 'Loại', dataIndex: 'type', key: 'type', render: (t: string) => <Tag color={t === 'Primary' ? 'blue' : 'default'}>{t}</Tag> },
    { title: 'SSL', dataIndex: 'ssl', key: 'ssl', render: (t: string) => <Tag color={t === 'Active' ? 'success' : 'error'} icon={<SafetyCertificateOutlined />}>{t}</Tag> },
    { title: 'Ngày hết hạn SSL', dataIndex: 'expiry', key: 'expiry' },
    { title: 'Hành động', key: 'action', render: () => <Button danger type="text" icon={<DeleteOutlined />} /> },
  ];

  return (
    <div>
      <Title level={5}>Quản lý Tên miền</Title>
      <Alert message="Tên miền chính (Primary) được dùng làm địa chỉ gốc của dự án. Bạn có thể thêm các tên miền phụ (Alias) để trỏ về cùng một mã nguồn." type="info" showIcon style={{ marginBottom: 16 }} />
      
      <Form layout="inline" style={{ marginBottom: 16 }}>
        <Form.Item><Input placeholder="Thêm tên miền mới..." style={{ width: 300 }} /></Form.Item>
        <Form.Item><Button type="primary" icon={<PlusOutlined />}>Thêm Tên miền</Button></Form.Item>
      </Form>

      <Table dataSource={domains} columns={columns} pagination={false} size="small" />

      <Divider />

      <Title level={5}>Cấu hình SSL / HTTPS</Title>
      <Form layout="vertical">
        <Form.Item label="Tự động gia hạn chứng chỉ Let's Encrypt">
          <Switch defaultChecked />
          <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>Hệ thống sẽ tự động đăng ký và gia hạn SSL miễn phí cho tất cả tên miền được trỏ IP về máy chủ này.</Text>
        </Form.Item>
        <Form.Item label="Bắt buộc HTTPS (Force HTTPS)">
          <Switch defaultChecked />
          <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>Tự động chuyển hướng mọi truy cập từ HTTP sang HTTPS để tăng cường bảo mật.</Text>
        </Form.Item>
        <Button type="default" icon={<SafetyCertificateOutlined />}>Cấp lại chứng chỉ SSL ngay lập tức</Button>
      </Form>
    </div>
  );
};

export default DomainSslConfig;
