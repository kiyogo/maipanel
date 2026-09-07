import React from 'react';
import { Typography, Row, Col, Card, Statistic, Alert } from '../../custom-ui';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface MonitoringProps {
  projectId: string;
}

const Monitoring: React.FC<MonitoringProps> = ({ projectId }) => {
  return (
    <div>
      <Title level={5}>Giám sát Hiệu suất (Monitoring)</Title>
      <Alert message="Dữ liệu giám sát được cập nhật mỗi phút. Cảnh báo sẽ được gửi qua Telegram hoặc Email nếu vượt ngưỡng." type="success" showIcon style={{ marginBottom: 16 }} />
      
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic
              title="Sử dụng CPU"
              value={11.28}
              precision={2}
              valueStyle={{ color: '#cf1322' }}
              prefix={<ArrowUpOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic
              title="Sử dụng RAM"
              value={45}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix={<ArrowDownOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic
              title="Lượt truy cập (24h)"
              value={5241}
              valueStyle={{ color: '#1890ff' }}
              prefix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Biểu đồ tài nguyên (24h)" style={{ marginTop: 16 }} bordered={false}>
        <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', borderRadius: 8 }}>
          <Text type="secondary">Đồ thị giám sát sẽ được hiển thị bằng thư viện Chart.js hoặc Recharts</Text>
        </div>
      </Card>
    </div>
  );
};

export default Monitoring;
