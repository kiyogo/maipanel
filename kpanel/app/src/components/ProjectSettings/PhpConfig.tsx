import React from 'react';
import { Form, Select, InputNumber, Button, Typography, Space, Divider, Alert } from '../../custom-ui';
import { SaveOutlined, ReloadOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface PhpConfigProps {
  projectId: string;
}

const PhpConfig: React.FC<PhpConfigProps> = ({ projectId }) => {
  return (
    <div>
      <Title level={5}>Cấu hình PHP (php.ini)</Title>
      <Alert message="Các thông số này sẽ ghi đè cấu hình mặc định của PHP-FPM cho riêng dự án này." type="info" showIcon style={{ marginBottom: 16 }} />
      
      <Form layout="vertical">
        <Space size="large" style={{ display: 'flex', width: '100%', flexWrap: 'wrap' }}>
          <Form.Item label="Phiên bản PHP" style={{ minWidth: 200 }}>
            <Select defaultValue="8.2" options={[{label: 'PHP 8.3', value: '8.3'}, {label: 'PHP 8.2', value: '8.2'}, {label: 'PHP 8.1', value: '8.1'}, {label: 'PHP 8.0', value: '8.0'}, {label: 'PHP 7.4', value: '7.4'}]} />
          </Form.Item>
          
          <Form.Item label="memory_limit" style={{ minWidth: 200 }}>
            <Select defaultValue="256M" options={[{label: '128M', value: '128M'}, {label: '256M', value: '256M'}, {label: '512M', value: '512M'}, {label: '1G', value: '1G'}]} />
          </Form.Item>

          <Form.Item label="upload_max_filesize" style={{ minWidth: 200 }}>
            <Select defaultValue="64M" options={[{label: '16M', value: '16M'}, {label: '64M', value: '64M'}, {label: '128M', value: '128M'}, {label: '512M', value: '512M'}, {label: '1G', value: '1G'}]} />
          </Form.Item>

          <Form.Item label="post_max_size" style={{ minWidth: 200 }}>
            <Select defaultValue="64M" options={[{label: '16M', value: '16M'}, {label: '64M', value: '64M'}, {label: '128M', value: '128M'}, {label: '512M', value: '512M'}, {label: '1G', value: '1G'}]} />
          </Form.Item>

          <Form.Item label="max_execution_time (giây)" style={{ minWidth: 200 }}>
            <InputNumber min={30} max={3600} defaultValue={300} style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item label="max_input_vars" style={{ minWidth: 200 }}>
            <InputNumber min={1000} max={100000} defaultValue={10000} style={{ width: '100%' }} />
          </Form.Item>
        </Space>

        <Divider />
        <Space>
          <Button type="primary" icon={<SaveOutlined />}>Lưu cấu hình & Khởi động lại PHP-FPM</Button>
          <Button icon={<ReloadOutlined />}>Khởi động lại PHP-FPM</Button>
        </Space>
      </Form>
    </div>
  );
};

export default PhpConfig;
