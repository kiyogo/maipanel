import React from 'react';
import { Button, Typography, Space, Table, Alert } from '../../custom-ui';
import { FolderOutlined, FileOutlined, DeleteOutlined, EditOutlined, DownloadOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface FilesManagerProps {
  projectId: string;
}

const FilesManager: React.FC<FilesManagerProps> = ({ projectId }) => {
  const files = [
    { key: '1', name: 'app', type: 'folder', size: '-', modified: '2026-06-20' },
    { key: '2', name: 'public', type: 'folder', size: '-', modified: '2026-06-20' },
    { key: '3', name: 'index.php', type: 'file', size: '2 KB', modified: '2026-06-20' },
    { key: '4', name: '.env', type: 'file', size: '1 KB', modified: '2026-06-20' },
  ];

  const columns = [
    { title: 'Tên', dataIndex: 'name', key: 'name', render: (t: string, r: any) => (
      <Space>
        {r.type === 'folder' ? <FolderOutlined style={{ color: '#1890ff' }} /> : <FileOutlined style={{ color: '#8c8c8c' }} />}
        <Text strong={r.type === 'folder'}>{t}</Text>
      </Space>
    ) },
    { title: 'Kích thước', dataIndex: 'size', key: 'size' },
    { title: 'Chỉnh sửa lần cuối', dataIndex: 'modified', key: 'modified' },
    { title: 'Hành động', key: 'action', render: (t: any, r: any) => (
      <Space>
        {r.type === 'file' && <Button size="small" type="text" icon={<EditOutlined />} />}
        <Button size="small" type="text" icon={<DownloadOutlined />} />
        <Button size="small" danger type="text" icon={<DeleteOutlined />} />
      </Space>
    ) },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={5} style={{ margin: 0 }}>Quản lý Tệp (File Manager)</Title>
        <Space>
          <Button type="primary">Tải lên</Button>
          <Button>Tạo thư mục mới</Button>
          <Button>Tạo file mới</Button>
        </Space>
      </div>
      
      <Alert message="File Manager giúp bạn chỉnh sửa mã nguồn trực tiếp trên máy chủ mà không cần kết nối SSH hoặc FTP." type="info" showIcon style={{ marginBottom: 16 }} />
      
      <Table dataSource={files} columns={columns} pagination={false} size="small" />
    </div>
  );
};

export default FilesManager;
