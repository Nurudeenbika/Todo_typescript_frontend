import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/auth.service';
import { AxiosError } from 'axios';
// Remove shadcn/ui imports since we're now using PrimeReact completely

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const data = await authService.login(email, password);
      login(data.token, data.userId);
      
      toast.current?.show({
        severity: 'success',
        summary: 'Login Successful',
        detail: 'Redirecting to todos...',
        life: 3000,
      });
      
      setTimeout(() => navigate('/todos'), 3000);
    } catch (err: unknown) {
      let message = 'An unknown error occurred';
      if (err instanceof AxiosError) {
        message = err.response?.data?.message || 'Failed to login';
      } else if (err instanceof Error) {
        message = err.message;
      }
      
      toast.current?.show({
        severity: 'error',
        summary: 'Login Failed',
        detail: message,
        life: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#111827',
        padding: '1rem',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <Toast ref={toast} />
      <Card
        title="Login"
        subTitle="Enter your credentials to access your account"
        style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: '#1f2937',
          color: 'white',
          border: '1px solid #374151',
        }}
      >
        <form onSubmit={handleSubmit} className="p-fluid" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label htmlFor="email" style={{ color: 'white', marginBottom: '0.5rem', display: 'block' }}>
              Email
            </label>
            <InputText
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className="p-inputtext-sm"
            />
          </div>
          <div>
            <label htmlFor="password" style={{ color: 'white', marginBottom: '0.5rem', display: 'block' }}>
              Password
            </label>
            <Password
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              toggleMask
              feedback={false}
              required
              placeholder="Enter your password"
              className="p-inputtext-sm"
            />
          </div>
          <Button
            label={loading ? 'Logging in...' : 'Login'}
            icon="pi pi-sign-in"
            type="submit"
            loading={loading}
            className="p-button-primary"
          />
          <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
            Don't have an account?{' '}
            <a href="/auth/register" style={{ color: '#60a5fa', textDecoration: 'underline' }}>
              Register
            </a>
          </p>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;