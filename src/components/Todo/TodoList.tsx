import React from 'react';
    import TodoItem from './TodoItem';

    interface Todo {
      _id: string;
      title: string;
      description?: string;
      completed: boolean;
    }

    interface TodoListProps {
      todos: Todo[];
      onUpdate: (id: string, updatedTodo: Partial<Todo>) => void;
      onDelete: (id: string) => void;
    }

    const TodoList: React.FC<TodoListProps> = ({ todos, onUpdate, onDelete }) => {
      return (
        <ul className="space-y-4">
          {todos.map((todo) => (
            <TodoItem key={todo._id} todo={todo} onUpdate={onUpdate} onDelete={onDelete} />
          ))}
        </ul>
      );
    };

    export default TodoList;