import React from 'react';
import { Form, Input, Button, Typography, Space, Table, Tag, Switch, Alert } from '../../custom-ui';
import { PlusOutlined, DeleteOutlined, PlayCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface CronManagerProps {
  projectId: string;
}

const CronManager: React.FC<CronManagerProps> = ({ projectId }) => {
  const jobs = [
    { key: '1', schedule: '0 0 * * *', command: 'php artisan schedule:run', status: 'Active', lastRun: '1 giờ trước' },
    { key: '2', schedule: '*/5 * * * *', command: 'node script.js', status: 'Paused', lastRun: '5 phút trước' },
  ];

  const columns = [
    { title: 'Lịch trình (Cron)', dataIndex: 'schedule', key: 'schedule', render: (t: string) => <Text code>{t}</Text> },
    { title: 'Lệnh thực thi', dataIndex: 'command', key: 'command' },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: (t: string) => <Tag color={t === 'Active' ? 'success' : 'default'}>{t}</Tag> },
    { title: 'Lần chạy cuối', dataIndex: 'lastRun', key: 'lastRun' },
    { title: 'Hành động', key: 'action', render: () => (
      <Space>
        <Button size="small" type="text" icon={<PlayCircleOutlined />}>Chạy ngay</Button>
        <Button size="small" danger type="text" icon={<DeleteOutlined />} />
      </Space>
    ) },
  ];

  return (
    <div>
      <Title level={5}>Cron Jobs (Tác vụ định kỳ)</Title>
      <Alert message="Lưu ý: Các lệnh sẽ được thực thi dưới quyền của user sở hữu dự án này." type="info" showIcon style={{ marginBottom: 16 }} />
      
      <Form layout="inline" style={{ marginBottom: 16 }}>
        <Form.Item><Input placeholder="* * * * *" style={{ width: 120 }} /></Form.Item>
        <Form.Item><Input placeholder="Lệnh cần chạy (vd: php artisan schedule:run)" style={{ width: 350 }} /></Form.Item>
        <Form.Item><Button type="primary" icon={<PlusOutlined />}>Thêm tác vụ</Button></Form.Item>
      </Form>

      <Table dataSource={jobs} columns={columns} pagination={false} size="small" />
    </div>
  );
};

export default CronManager;
