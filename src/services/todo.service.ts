import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Define interfaces for your Todo data structure
interface Todo {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// Interface for API responses
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

class TodoService {
  private getAuthHeader(token: string | null): { Authorization?: string } {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async createTodo(
    title: string,
    description: string | undefined,
    token: string | null
  ): Promise<Todo> {
    try {
      const response = await axios.post<ApiResponse<Todo>>(
        `${API_BASE_URL}/api/todos`,
        { title, description },
        { headers: this.getAuthHeader(token) }
      );
      return response.data.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data?.message || "Failed to create todo";
      }
      throw "Failed to create todo";
    }
  }

  async getTodos(token: string | null): Promise<Todo[]> {
    try {
      const response = await axios.get<ApiResponse<Todo[]>>(
        `${API_BASE_URL}/api/todos`,
        {
          headers: this.getAuthHeader(token),
        }
      );
      return response.data.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data?.message || "Failed to fetch todos";
      }
      throw "Failed to fetch todos";
    }
  }

  async getTodoById(id: string, token: string | null): Promise<Todo> {
    try {
      const response = await axios.get<ApiResponse<Todo>>(
        `${API_BASE_URL}/api/todos/${id}`,
        {
          headers: this.getAuthHeader(token),
        }
      );
      return response.data.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data?.message || "Failed to fetch todo";
      }
      throw "Failed to fetch todo";
    }
  }

  async updateTodo(
    id: string,
    title: string,
    description: string | undefined,
    completed: boolean,
    token: string | null
  ): Promise<Todo> {
    try {
      const response = await axios.put<ApiResponse<Todo>>(
        `${API_BASE_URL}/api/todos/${id}`,
        { title, description, completed },
        { headers: this.getAuthHeader(token) }
      );
      return response.data.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data?.message || "Failed to update todo";
      }
      throw "Failed to update todo";
    }
  }

  async deleteTodo(id: string, token: string | null): Promise<void> {
    try {
      await axios.delete<ApiResponse<null>>(
        `${API_BASE_URL}/api/todos/${id}`,
        {
          headers: this.getAuthHeader(token),
        }
      );
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data?.message || "Failed to delete todo";
      }
      throw "Failed to delete todo";
    }
  }
}

export default new TodoService();