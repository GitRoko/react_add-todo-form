import React, { useState } from 'react';
import './App.css';

import users from './api/users';
import todos from './api/todos';

export interface Todo {
  userId: number,
  id: number,
  title: string,
  completed: boolean,
  user: User | null,
}

export interface User {
  id: number,
  name: string,
  username: string,
  email: string,
}

const preparedTodoItems = todos.map((todo) => ({
  ...todo,
  user: users.find((user) => user.id === todo.userId) || null,
}));

const App: React.FC = () => {
  const [title, setTitle] = useState('');
  const [selectUserId, setSelectUserId] = useState('');
  const [newTodos, setNewTodos] = useState([...preparedTodoItems]);

  const [hasTitleError, setTitleError] = useState(false);
  const [hasUserError, setUserError] = useState(false);
  const nextTodoId = todos.length + 1;

  const getSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title) {
      setTitleError(true);
    }

    if (!selectUserId) {
      setUserError(true);
    }

    if (title && selectUserId) {
      const nextTodos = {
        id: nextTodoId,
        userId: +selectUserId,
        title,
        completed: false,
        user: users.find((user) => user.id === +selectUserId) || null,
      };

      setNewTodos([...newTodos, nextTodos]);
      setTitle('');
      setSelectUserId('');
    }
  };

  const getSelectedUser = (event: React.ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault();
    setSelectUserId(event.target.value);
    setUserError(false);
  };

  const getChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setTitleError(false);
  };

  const getChangeCompleted = (event: React.ChangeEvent<HTMLInputElement>, todo1: Todo) => {
    const { checked } = event.target;
    const changeCompleted = newTodos.map((todo) => {
      if (todo.id === todo1.id) {
        return {
          ...todo,
          completed: checked,
        };
      }

      return todo;
    });

    setNewTodos([...changeCompleted]);
  };

  return (
    <div className="App">
      <h1>Add todo form</h1>

      <form
        onSubmit={getSubmit}
      >
        <div>
          <select
            name="user"
            value={selectUserId}
            onChange={getSelectedUser}
          >
            <option value="">Select user</option>

            {users.map(user => (

              <option
                value={user.id}
                key={user.id}
              >
                {user.name}
              </option>

            ))}
          </select>

          {hasUserError && <span className="error">Please choose a user</span>}

        </div>

        <div>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={getChangeTitle}
          />

          {hasTitleError && <span className="error">Please enter a title</span>}
        </div>

        <button type="submit">Add</button>
      </form>

      <ul className="todo">

        {newTodos.map(todoItem => (
          <li className="todo__item" key={todoItem.id}>
            <div className="todo_todoInfo">
              <h3 className="todo__title">
                {todoItem.title}
              </h3>
              <p className="todo__status">
                {'Status: '}
                <input
                  type="checkbox"
                  name="completed"
                  checked={todoItem.completed}
                  onChange={
                    (event: React.ChangeEvent<HTMLInputElement>, newTodo = todoItem) => {
                      return getChangeCompleted(event, newTodo);
                    }
                  }
                />
                {(todoItem.completed) ? ' Done! ' : ' In progress... '}
              </p>
              <div className="todo__userInfo">
                <>
                  <p className="todo__userName">
                    {'Author: '}
                    {todoItem.user?.name}
                  </p>
                  <p className="todo__userEmail">
                    {'Email: '}
                    {todoItem.user?.email}
                  </p>
                </>
              </div>
            </div>
          </li>
        ))}

      </ul>
    </div>
  );
};

export default App;
