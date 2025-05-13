import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent } from "../components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { AlertCircle } from "lucide-react";
import TodoList from "../components/Todo/TodoList";
import { useAuth } from "../contexts/AuthContext";
import todoService from "../services/todo.service";
import { AxiosError } from "axios";

interface Todo {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
}

const TodoPage: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [newTodoDescription, setNewTodoDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { token, logout, userId } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/auth/login");
      return;
    }

    const fetchTodos = async () => {
      try {
        const fetchedTodos = await todoService.getTodos(token);
        setTodos(fetchedTodos);
      } catch (err: unknown) {
        if (err instanceof AxiosError) {
          setError(err.response?.data?.message || "Failed to fetch todos");
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    };

    fetchTodos();
  }, [token, navigate, userId]);

  const handleCreateTodo = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!newTodoTitle.trim()) return;
    try {
      const newTodo = await todoService.createTodo(
        newTodoTitle,
        newTodoDescription,
        token
      );
      setTodos([...todos, newTodo]);
      setNewTodoTitle("");
      setNewTodoDescription("");
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || "Failed to create todo");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  const handleUpdateTodo = async (id: string, updatedTodo: Partial<Todo>) => {
    setError(null);
    try {
      const response = await todoService.updateTodo(
        id,
        updatedTodo.title || "",
        updatedTodo.description,
        updatedTodo.completed !== undefined ? updatedTodo.completed : false,
        token
      );
      setTodos(
        todos.map((todo) => (todo._id === id ? { ...todo, ...response } : todo))
      );
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || "Failed to update todo");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  const handleDeleteTodo = async (id: string) => {
    setError(null);
    try {
      await todoService.deleteTodo(id, token);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || "Failed to delete todo");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#f3f4f6",
        padding: "2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <div style={{ maxWidth: "48rem", width: "100%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <h2
            style={{
              fontSize: "1.875rem",
              fontWeight: "bold",
              color: "#4b5563",
            }}
          >
            Todos
          </h2>
          <Button
            onClick={handleLogout}
            className="bg-red-500/90 text-white px-4 py-2 rounded-md transition-colors hover:bg-red-500"
          >
            Logout
          </Button>
        </div>
        {error && (
          <Alert
            variant="destructive"
            style={{
              marginBottom: "2rem",
              backgroundColor: "rgba(248, 113, 113, 0.1)",
              color: "#f87171",
              border: "1px solid rgba(248, 113, 113, 0.2)",
              borderRadius: "0.375rem",
              display: "flex",
              alignItems: "flex-start",
              padding: "1rem",
            }}
          >
            <AlertCircle
              style={{ height: "1rem", width: "1rem", marginRight: "0.75rem" }}
            />
            <div>
              <AlertTitle style={{ fontWeight: "600" }}>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </div>
          </Alert>
        )}
        <Card
          style={{
            marginBottom: "2rem",
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            borderRadius: "0.5rem",
          }}
        >
          <CardContent>
            <form onSubmit={handleCreateTodo} className="space-y-4">
              <div>
                <Label htmlFor="new-todo-title" style={{ color: "#4b5563" }}>
                  Title
                </Label>
                <Input
                  type="text"
                  id="new-todo-title"
                  placeholder="Enter todo title"
                  value={newTodoTitle}
                  onChange={(e) => setNewTodoTitle(e.target.value)}
                  required
                  style={{
                    backgroundColor: "white",
                    color: "#4b5563",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "0.375rem",
                  }}
                />
              </div>
              <div>
                <Label
                  htmlFor="new-todo-description"
                  style={{ color: "#4b5563" }}
                >
                  Description (optional)
                </Label>
                <Textarea
                  id="new-todo-description"
                  placeholder="Enter todo description"
                  value={newTodoDescription}
                  onChange={(e) => setNewTodoDescription(e.target.value)}
                  style={{
                    backgroundColor: "white",
                    color: "#4b5563",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "0.375rem",
                    minHeight: "4rem",
                  }}
                />
              </div>
              <Button
                type="submit"
                style={{
                  width: "100%",
                  backgroundColor: "rgba(52, 211, 153, 0.9)",
                  color: "#4b5563",
                  padding: "0.75rem 1rem",
                  borderRadius: "0.375rem",
                  transition: "background-color 0.2s ease",
                  cursor: "pointer",
                }}
              >
                Add Todo
              </Button>
            </form>
          </CardContent>
        </Card>
        <TodoList
          todos={todos}
          onUpdate={handleUpdateTodo}
          onDelete={handleDeleteTodo}
        />
      </div>
    </div>
  );
};

export default TodoPage;
