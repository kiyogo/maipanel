import React from 'react';
import { Form, Switch, Button, Typography, Space, Alert, Select, Input } from '../../custom-ui';
import { SaveOutlined, ClearOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface RedisCacheConfigProps {
  projectId: string;
  type: 'redis' | 'cache';
}

const RedisCacheConfig: React.FC<RedisCacheConfigProps> = ({ projectId, type }) => {
  return (
    <div>
      <Title level={5}>{type === 'redis' ? 'Cấu hình Redis' : 'Quản lý Cache'}</Title>
      
      {type === 'redis' ? (
        <>
          <Alert message="Redis in-memory data structure store, dùng làm database, cache và message broker." type="info" showIcon style={{ marginBottom: 16 }} />
          <Form layout="vertical">
            <Form.Item label="Kích hoạt Redis cho dự án này">
              <Switch defaultChecked />
            </Form.Item>
            <Form.Item label="Redis Max Memory" style={{ width: 300 }}>
              <Select defaultValue="256mb" options={[{label: '128 MB', value: '128mb'}, {label: '256 MB', value: '256mb'}, {label: '512 MB', value: '512mb'}, {label: '1 GB', value: '1gb'}]} />
            </Form.Item>
            <Form.Item label="Redis Password (Mật khẩu truy cập)">
              <Input.Password placeholder="Để trống nếu không dùng mật khẩu" style={{ width: 300 }} />
            </Form.Item>
            <Space>
              <Button type="primary" icon={<SaveOutlined />}>Lưu cấu hình</Button>
              <Button icon={<ClearOutlined />} danger>Xóa toàn bộ Redis Cache (FlushAll)</Button>
            </Space>
          </Form>
        </>
      ) : (
        <>
          <Alert message="Cấu hình hệ thống bộ đệm (Cache) như Memcached, Varnish hoặc OPcache để tăng tốc độ tải trang." type="info" showIcon style={{ marginBottom: 16 }} />
          <Form layout="vertical">
            <Form.Item label="Loại Cache">
              <Select defaultValue="opcache" options={[{label: 'PHP OPcache', value: 'opcache'}, {label: 'Memcached', value: 'memcached'}, {label: 'Varnish', value: 'varnish'}, {label: 'Không sử dụng', value: 'none'}]} style={{ width: 300 }} />
            </Form.Item>
            <Form.Item label="Tự động xóa Cache khi Deploy">
              <Switch defaultChecked />
            </Form.Item>
            <Space>
              <Button type="primary" icon={<SaveOutlined />}>Lưu cấu hình</Button>
              <Button icon={<ClearOutlined />} danger>Xóa toàn bộ Cache ngay lập tức</Button>
            </Space>
          </Form>
        </>
      )}
    </div>
  );
};

export default RedisCacheConfig;
