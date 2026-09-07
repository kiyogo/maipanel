import React from 'react';
import { Form, Input, Button, Typography, Space, Table, Alert, Tag, Badge } from '../../custom-ui';
import { PlayCircleOutlined, StopOutlined, ReloadOutlined, DeleteOutlined, SyncOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface DockerManagerProps {
  projectId: string;
  type: string; // 'Containers' | 'Images' | 'Volumes' | 'Networks'
}

const DockerManager: React.FC<DockerManagerProps> = ({ projectId, type }) => {
  return (
    <div>
      <Title level={5}>Docker {type}</Title>

      {type === 'Containers' && (
        <>
          <Alert message="Quản lý các Docker container chạy trong dự án này (thường thông qua docker-compose)." type="info" showIcon style={{ marginBottom: 16 }} />
          <Space style={{ marginBottom: 16 }}>
            <Button type="primary" icon={<PlayCircleOutlined />}>docker-compose up -d</Button>
            <Button icon={<StopOutlined />} danger>docker-compose down</Button>
            <Button icon={<SyncOutlined />}>docker-compose pull</Button>
          </Space>
          <Table 
            dataSource={[
              { key: '1', name: 'app_web_1', image: 'nginx:alpine', status: 'Up 2 hours', ports: '80:80' },
              { key: '2', name: 'app_db_1', image: 'mysql:8', status: 'Up 2 hours', ports: '3306:3306' }
            ]}
            columns={[
              { title: 'Container Name', dataIndex: 'name', key: 'name', render: (t) => <Text strong>{t}</Text> },
              { title: 'Image', dataIndex: 'image', key: 'image', render: (t) => <Tag color="blue">{t}</Tag> },
              { title: 'Status', dataIndex: 'status', key: 'status', render: (t) => <Badge status="success" text={t} /> },
              { title: 'Ports', dataIndex: 'ports', key: 'ports' },
              { title: 'Action', key: 'action', render: () => (
                <Space>
                  <Button size="small" type="text" icon={<ReloadOutlined />} />
                  <Button size="small" danger type="text" icon={<StopOutlined />} />
                </Space>
              )}
            ]}
            pagination={false} size="small"
          />
        </>
      )}

      {type === 'Images' && (
        <Alert message="Danh sách Docker Images được tải về máy chủ." type="info" showIcon />
      )}

      {type === 'Volumes' && (
        <Alert message="Danh sách Docker Volumes đang lưu trữ dữ liệu (Database, Uploads...)" type="info" showIcon />
      )}

      {type === 'Networks' && (
        <Alert message="Danh sách Docker Networks để cô lập bảo mật các container." type="info" showIcon />
      )}
    </div>
  );
};

export default DockerManager;
