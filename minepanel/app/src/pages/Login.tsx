import React, { useState } from 'react';
import { Form, Input, Button, Typography, Checkbox, Alert } from '../custom-ui';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useLanguage();

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    setError('');
    if (!values.email || !values.password) {
      setError('Tài khoản không hợp lệ');
      setLoading(false);
      return;
    }
    try {
      await login(values.email, values.password);
      navigate('/');
    } catch (err: any) {
      console.error(err);
      setError('Tài khoản không hợp lệ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#F5F5F5',
    }}>
      <div style={{
        width: 360,
        background: '#FFFFFF',
        borderRadius: 8,
        padding: '40px 36px',
        border: '1px solid #E0E0E0',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 7, background: '#009688',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>M</span>
          </div>
          <Title level={4} style={{ margin: 0, fontWeight: 700 }}>Minepanel</Title>
        </div>

        <Text style={{ color: '#757575', fontSize: 13, display: 'block', marginBottom: 20 }}>
          {t('login.title')}
        </Text>

        {error && (
          <Alert message={error} type="error" showIcon style={{ marginBottom: 16, borderRadius: 5 }} />
        )}

        <Form layout="vertical" onFinish={onFinish} autoComplete="off">
          <Form.Item name="email">
            <Input
              prefix={<UserOutlined style={{ color: '#bbb' }} />}
              placeholder={t('login.placeholderEmail')}
              size="middle"
            />
          </Form.Item>

          <Form.Item name="password">
            <Input.Password
              prefix={<LockOutlined style={{ color: '#bbb' }} />}
              placeholder={t('login.placeholderPassword')}
              size="middle"
            />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Checkbox><Text style={{ fontSize: 13 }}>{t('login.rememberMe')}</Text></Checkbox>
            <a href="#" style={{ fontSize: 13, color: '#009688' }}>{t('login.forgotPassword')}</a>
          </div>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            style={{ height: 38 }}
          >
            {t('login.btnSubmit')}
          </Button>
        </Form>

        <Text style={{ display: 'block', textAlign: 'center', marginTop: 20, color: '#bbb', fontSize: 12 }}>
          Minepanel v0.1.0 · © 2026
        </Text>
      </div>
    </div>
  );
};

export default Login;

