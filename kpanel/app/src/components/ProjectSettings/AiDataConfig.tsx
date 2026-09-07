import React from 'react';
import { Form, Input, Button, Typography, Space, Alert, Select, Switch } from '../../custom-ui';
import { SaveOutlined, RocketOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface AiDataConfigProps {
  projectId: string;
  type: string; // 'Model' | 'GPU' | 'Inference' | 'Vector Database' | 'Embedding'
}

const AiDataConfig: React.FC<AiDataConfigProps> = ({ projectId, type }) => {
  return (
    <div>
      <Title level={5}>{type}</Title>

      {type === 'Model' && (
        <Form layout="vertical">
          <Alert message="Cấu hình Model AI (LLM, Vision, Audio...)" type="info" showIcon style={{ marginBottom: 16 }} />
          <Form.Item label="Model Name (HuggingFace ID)">
            <Input defaultValue="meta-llama/Llama-2-7b-chat-hf" style={{ width: 400 }} />
          </Form.Item>
          <Form.Item label="Quantization (Lượng tử hóa)">
            <Select defaultValue="4bit" options={[{label: 'None', value: 'none'}, {label: '8-bit', value: '8bit'}, {label: '4-bit (AWQ/GPTQ)', value: '4bit'}]} style={{ width: 200 }} />
          </Form.Item>
          <Form.Item label="HuggingFace Token">
            <Input.Password placeholder="hf_..." style={{ width: 400 }} />
          </Form.Item>
          <Button type="primary" icon={<SaveOutlined />}>Lưu Model Config</Button>
        </Form>
      )}

      {type === 'GPU' && (
        <Form layout="vertical">
          <Alert message="Phân bổ tài nguyên GPU cho tiến trình Inference." type="warning" showIcon style={{ marginBottom: 16 }} />
          <Form.Item label="Chỉ định GPU IDs (CUDA_VISIBLE_DEVICES)">
            <Input defaultValue="0,1" style={{ width: 200 }} />
          </Form.Item>
          <Form.Item label="Giới hạn VRAM (GB)">
            <Input defaultValue="24" style={{ width: 200 }} />
          </Form.Item>
          <Button type="primary" icon={<SaveOutlined />}>Áp dụng</Button>
        </Form>
      )}

      {type === 'Inference' && (
        <Form layout="vertical">
          <Alert message="Cấu hình API Server (vLLM, TGI, Ollama)" type="info" showIcon style={{ marginBottom: 16 }} />
          <Form.Item label="Inference Engine">
            <Select defaultValue="vllm" options={[{label: 'vLLM', value: 'vllm'}, {label: 'Text Generation Inference (TGI)', value: 'tgi'}, {label: 'Ollama', value: 'ollama'}]} style={{ width: 300 }} />
          </Form.Item>
          <Form.Item label="Max Model Len">
            <Input defaultValue="4096" style={{ width: 200 }} />
          </Form.Item>
          <Form.Item label="Bật OpenAI-compatible API Server">
            <Switch defaultChecked />
          </Form.Item>
          <Space>
            <Button type="primary" icon={<SaveOutlined />}>Lưu cấu hình</Button>
            <Button icon={<RocketOutlined />} style={{ color: '#52c41a', borderColor: '#52c41a' }}>Khởi động Inference Server</Button>
          </Space>
        </Form>
      )}

      {(type === 'Vector Database' || type === 'Embedding') && (
        <Alert message={`Cấu hình cho ${type} sẽ được tích hợp với Qdrant, ChromaDB hoặc Milvus.`} type="info" showIcon />
      )}

    </div>
  );
};

export default AiDataConfig;
