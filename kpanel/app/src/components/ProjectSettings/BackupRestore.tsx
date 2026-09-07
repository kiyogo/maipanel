import React from 'react';
import { Form, Button, Typography, Space, Table, Tag, Select, Alert } from '../../custom-ui';
import { DownloadOutlined, ReloadOutlined, DeleteOutlined, CloudUploadOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface BackupRestoreProps {
  projectId: string;
}

const BackupRestore: React.FC<BackupRestoreProps> = ({ projectId }) => {
  const backups = [
    { key: '1', name: 'backup-20260620-1000.zip', size: '150 MB', type: 'Full', date: '2026-06-20 10:00', status: 'Success' },
    { key: '2', name: 'backup-20260619-1000.zip', size: '148 MB', type: 'Database', date: '2026-06-19 10:00', status: 'Success' },
  ];

  const columns = [
    { title: 'Tên file', dataIndex: 'name', key: 'name', render: (t: string) => <Text strong>{t}</Text> },
    { title: 'Loại', dataIndex: 'type', key: 'type' },
    { title: 'Kích thước', dataIndex: 'size', key: 'size' },
    { title: 'Thời gian', dataIndex: 'date', key: 'date' },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: (t: string) => <Tag color="success">{t}</Tag> },
    { title: 'Hành động', key: 'action', render: () => (
      <Space>
        <Button size="small" type="text" icon={<DownloadOutlined />} />
        <Button size="small" type="text" icon={<ReloadOutlined />}>Restore</Button>
        <Button size="small" danger type="text" icon={<DeleteOutlined />} />
      </Space>
    ) },
  ];

  return (
    <div>
      <Title level={5}>Sao lưu & Khôi phục</Title>
      <Alert message="Dữ liệu sao lưu sẽ được nén lại và có thể đẩy lên Google Drive hoặc AWS S3." type="info" showIcon style={{ marginBottom: 16 }} />
      
      <Form layout="inline" style={{ marginBottom: 16 }}>
        <Form.Item label="Lịch sao lưu tự động">
          <Select defaultValue="daily" options={[{label: 'Hàng ngày', value: 'daily'}, {label: 'Hàng tuần', value: 'weekly'}, {label: 'Tắt', value: 'off'}]} style={{ width: 150 }} />
        </Form.Item>
        <Form.Item label="Nơi lưu trữ">
          <Select defaultValue="local" options={[{label: 'Local Storage', value: 'local'}, {label: 'Google Drive', value: 'gdrive'}, {label: 'S3 Compatible', value: 's3'}]} style={{ width: 150 }} />
        </Form.Item>
        <Form.Item><Button type="primary" icon={<CloudUploadOutlined />}>Sao lưu ngay</Button></Form.Item>
      </Form>

      <Table dataSource={backups} columns={columns} pagination={false} size="small" />
    </div>
  );
};

export default BackupRestore;
