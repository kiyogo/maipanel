import React from 'react';
import { Button, Typography, Space, Alert, Card } from '../../custom-ui';
import { PlayCircleOutlined, SyncOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface ComposerManagerProps {
  projectId: string;
}

const ComposerManager: React.FC<ComposerManagerProps> = ({ projectId }) => {
  return (
    <div>
      <Title level={5}>Quản lý Composer</Title>
      <Alert message="Composer là trình quản lý gói (package manager) cho PHP. Bạn có thể chạy các lệnh phổ biến tại đây." type="info" showIcon style={{ marginBottom: 16 }} />
      
      <Space direction="vertical" style={{ width: '100%' }}>
        <Card size="small" title="composer install">
          <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>Cài đặt các gói phụ thuộc dựa trên file composer.lock. Sử dụng khi vừa clone source code hoặc deploy mới.</Text>
          <Button type="primary" icon={<PlayCircleOutlined />}>Chạy lệnh Install</Button>
        </Card>
        
        <Card size="small" title="composer update">
          <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>Cập nhật các gói phụ thuộc lên phiên bản mới nhất cho phép trong composer.json.</Text>
          <Button icon={<SyncOutlined />}>Chạy lệnh Update</Button>
        </Card>

        <Card size="small" title="composer dump-autoload">
          <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>Tạo lại danh sách autoload files. Thường dùng khi thêm class mới mà không dùng namespace chuẩn.</Text>
          <Button icon={<ReloadOutlined />}>Chạy lệnh Dump Autoload</Button>
        </Card>
        
        <Card size="small" title="Xóa thư mục vendor">
          <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>Xóa hoàn toàn thư mục vendor để cài đặt lại từ đầu.</Text>
          <Button danger icon={<DeleteOutlined />}>Xóa thư mục vendor</Button>
        </Card>
      </Space>
    </div>
  );
};

export default ComposerManager;
