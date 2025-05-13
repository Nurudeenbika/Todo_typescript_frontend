import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import authService from '../services/auth.service';
import { AxiosError } from 'axios';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await authService.register(username, email, password);

      // Assuming backend returns a token on successful registration
      if (response?.token) {
        localStorage.setItem('token', response.token);
      }

      toast.current?.show({
        severity: 'success',
        summary: 'Registration Successful',
        detail: 'Redirecting to login...',
        life: 3000,
      });

      setTimeout(() => navigate('/auth/login'), 3000);
    } catch (err: unknown) {
      let message = 'An unknown error occurred';
      if (err instanceof AxiosError) {
        message = err.response?.data?.message || 'Failed to register';
      } else if (err instanceof Error) {
        message = err.message;
      }

      toast.current?.show({
        severity: 'error',
        summary: 'Registration Failed',
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
        title="Register"
        subTitle="Create an account to get started"
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
            <label htmlFor="username" style={{ color: 'white', marginBottom: '0.5rem', display: 'block' }}>
              Username
            </label>
            <InputText
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter your username"
              className="p-inputtext-sm"
            />
          </div>
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
            label={loading ? 'Registering...' : 'Register'}
            icon="pi pi-user-plus"
            type="submit"
            loading={loading}
            className="p-button-success"
          />
          <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
            Already have an account?{' '}
            <a href="/auth/login" style={{ color: '#60a5fa', textDecoration: 'underline' }}>
              Login
            </a>
          </p>
        </form>
      </Card>
    </div>
  );
};

export default RegisterPage;
