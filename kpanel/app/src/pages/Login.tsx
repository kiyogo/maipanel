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
    try {
      await login(values.email, values.password);
      navigate('/');
    } catch (err: any) {
      console.error(err);
      let rawMsg = err.response?.data?.message;
      if (Array.isArray(rawMsg)) {
        rawMsg = rawMsg.join(', ');
      }
      let finalMsg = rawMsg || t('login.errorAuth');
      if (typeof finalMsg === 'string') {
        const lowerMsg = finalMsg.toLowerCase();
        if (lowerMsg.includes('password must be longer than or equal to 6') || lowerMsg.includes('must be longer than or equal to 6')) {
          finalMsg = 'Mật khẩu phải chứa ít nhất 6 ký tự.';
        } else if (lowerMsg.includes('email must be an email') || lowerMsg.includes('valid email')) {
          finalMsg = 'Địa chỉ email không hợp lệ.';
        } else if (lowerMsg.includes('unauthorized') || lowerMsg.includes('invalid credentials') || lowerMsg.includes('incorrect')) {
          finalMsg = 'Email hoặc mật khẩu không đúng.';
        }
      }
      setError(finalMsg);
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
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>K</span>
          </div>
          <Title level={4} style={{ margin: 0, fontWeight: 700 }}>Kpanel</Title>
        </div>

        <Text style={{ color: '#757575', fontSize: 13, display: 'block', marginBottom: 20 }}>
          {t('login.title')}
        </Text>

        {error && (
          <Alert message={error} type="error" showIcon style={{ marginBottom: 16, borderRadius: 5 }} />
        )}

        <Form layout="vertical" onFinish={onFinish} autoComplete="off">
          <Form.Item name="email" rules={[{ required: true, type: 'email', message: t('login.validationEmail') }]}>
            <Input
              prefix={<UserOutlined style={{ color: '#bbb' }} />}
              placeholder={t('login.placeholderEmail')}
              size="middle"
            />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true, message: t('login.validationPassword') }]}>
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
          Kpanel v0.1.0 · © 2026
        </Text>
      </div>
    </div>
  );
};

export default Login;

