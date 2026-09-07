import React from 'react';
import { Typography, Form, Input, InputNumber, Switch, Button, Space, Table, Alert, Tag } from '../../custom-ui';
import { SaveOutlined, PlusOutlined, PlayCircleOutlined, DeleteOutlined, StopOutlined, ReloadOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface GameServerConfigProps {
  projectId: string;
  type: string; // 'Server Config' | 'Plugins' | 'Mods' | 'Players'
}

const GameServerConfig: React.FC<GameServerConfigProps> = ({ projectId, type }) => {
  return (
    <div>
      <Title level={5}>{type}</Title>
      
      {type === 'Server Config' && (
        <Form layout="vertical">
          <Alert message="Cấu hình máy chủ game (Minecraft, CS:GO, Rust...)" type="info" showIcon style={{ marginBottom: 16 }} />
          <Space size="large" style={{ display: 'flex', flexWrap: 'wrap' }}>
            <Form.Item label="Tên Server (Hostname)" style={{ width: 300 }}>
              <Input defaultValue="My Awesome Game Server" />
            </Form.Item>
            <Form.Item label="Max Players">
              <InputNumber min={1} max={1000} defaultValue={100} />
            </Form.Item>
            <Form.Item label="Port">
              <InputNumber min={1024} max={65535} defaultValue={25565} />
            </Form.Item>
          </Space>
          <Form.Item label="Whitelist">
            <Switch />
          </Form.Item>
          <Form.Item label="Tham số khởi chạy (Startup Arguments)">
            <Input.TextArea rows={3} defaultValue="-Xmx4096M -Xms1024M -jar server.jar nogui" />
          </Form.Item>
          <Space>
            <Button type="primary" icon={<SaveOutlined />}>Lưu cấu hình</Button>
            <Button icon={<PlayCircleOutlined />} style={{ color: '#52c41a', borderColor: '#52c41a' }}>Khởi động Server</Button>
            <Button icon={<StopOutlined />} danger>Dừng Server</Button>
            <Button icon={<ReloadOutlined />}>Khởi động lại</Button>
          </Space>
        </Form>
      )}

      {(type === 'Plugins' || type === 'Mods') && (
        <>
          <Alert message={`Quản lý ${type} cho server game.`} type="info" showIcon style={{ marginBottom: 16 }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <Input.Search placeholder={`Tìm kiếm ${type}...`} style={{ width: 300 }} />
            <Button type="primary" icon={<PlusOutlined />}>Tải lên {type}</Button>
          </div>
          <Table 
            dataSource={[
              { key: '1', name: 'EssentialsX', version: '2.19.0', status: 'Active' },
              { key: '2', name: 'WorldEdit', version: '7.2.10', status: 'Active' }
            ]}
            columns={[
              { title: 'Tên', dataIndex: 'name', key: 'name', render: (t) => <Text strong>{t}</Text> },
              { title: 'Phiên bản', dataIndex: 'version', key: 'version' },
              { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: (t) => <Tag color="success">{t}</Tag> },
              { title: 'Hành động', key: 'action', render: () => (
                <Space>
                  <Button size="small">Vô hiệu hóa</Button>
                  <Button size="small" danger icon={<DeleteOutlined />} />
                </Space>
              )}
            ]}
            pagination={false} size="small"
          />
        </>
      )}

      {type === 'Players' && (
        <>
          <Alert message="Quản lý người chơi trực tuyến, Ban/Kick." type="info" showIcon style={{ marginBottom: 16 }} />
          <Table 
            dataSource={[
              { key: '1', name: 'PlayerOne', ping: '45ms', playtime: '2h 15m' },
              { key: '2', name: 'GamerDude', ping: '120ms', playtime: '45m' }
            ]}
            columns={[
              { title: 'Người chơi', dataIndex: 'name', key: 'name', render: (t) => <Text strong>{t}</Text> },
              { title: 'Ping', dataIndex: 'ping', key: 'ping' },
              { title: 'Thời gian chơi', dataIndex: 'playtime', key: 'playtime' },
              { title: 'Hành động', key: 'action', render: () => (
                <Space>
                  <Button size="small" danger>Kick</Button>
                  <Button size="small" danger type="primary">Ban</Button>
                </Space>
              )}
            ]}
            pagination={false} size="small"
          />
        </>
      )}
    </div>
  );
};

export default GameServerConfig;
