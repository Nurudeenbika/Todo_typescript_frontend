// src/services/auth.service.ts

import axios from 'axios';

// Ensure your .env file includes: VITE_API_BASE_URL=http://localhost:5000
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

class AuthService {
  async register(username: string, email: string, password: string): Promise<{
    token: any; userId: string; username: string; email: string 
}> {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        username,
        email,
        password,
      });
      return response.data.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        // Forward full Axios error to allow UI to show it
        throw new Error(error.response?.data?.message || 'Registration failed');
      }
      throw new Error('Registration failed');
    }
  }

  async login(email: string, password: string): Promise<{ token: string; userId: string }> {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });
      return response.data.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Login failed');
      }
      throw new Error('Login failed');
    }
  }
}

export default new AuthService();
