import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import { Card, CardContent, CardDescription, CardTitle } from '../ui/card';

interface Todo {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
}

interface TodoItemProps {
  todo: Todo;
  onUpdate: (id: string, updatedTodo: Partial<Todo>) => void;
  onDelete: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');
  const [isCompleted, setIsCompleted] = useState(todo.completed);

  const handleSave = () => {
    onUpdate(todo._id, { title: editTitle, description: editDescription, completed: isCompleted });
    setIsEditing(false);
  };

  return (
    <Card className="bg-white/5 border-white/10 shadow-lg">
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor={`edit-title-${todo._id}`} className="text-white">Title</Label>
              <Input
                id={`edit-title-${todo._id}`}
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="bg-black/20 text-white border-white/20"
              />
            </div>
            <div>
              <Label htmlFor={`edit-description-${todo._id}`} className="text-white">Description</Label>
              <Textarea
                id={`edit-description-${todo._id}`}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="bg-black/20 text-white border-white/20"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`edit-completed-${todo._id}`}
                checked={isCompleted}
                onCheckedChange={(checked) => setIsCompleted(!!checked)}
                className="border-white/20"
              />
              <Label htmlFor={`edit-completed-${todo._id}`} className="text-green">Completed</Label>
            </div>
            <div className="flex justify-end space-x-2">
              <Button onClick={handleSave} className="bg-green-500/20 text-green-400 hover:bg-green-500/30 hover:text-green-300">Save</Button>
              <Button onClick={() => setIsEditing(false)} className="bg-gray-500/20 text-gray-400 hover:bg-gray-500/30 hover:text-gray-300">Cancel</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <CardTitle className="text-lg text-white">{todo.title}</CardTitle>
            {todo.description && <CardDescription className="text-gray-300">{todo.description}</CardDescription>}
            <p className="text-sm text-gray-400">Completed: <span className={todo.completed ? 'text-green-400' : 'text-red-400'}>{todo.completed ? 'Yes' : 'No'}</span></p>
            <div className="flex justify-end space-x-2">
              <Button onClick={() => setIsEditing(true)} className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 hover:text-blue-300">Edit</Button>
              <Button onClick={() => onDelete(todo._id)} className="bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300">Delete</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TodoItem;