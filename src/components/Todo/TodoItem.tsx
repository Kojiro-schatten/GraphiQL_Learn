import * as React from 'react';
import { Todos } from '../../generated/graphql';

interface TodoItemType {
  index: number,
  todo: Pick<Todos, "id" | "title" | "is_completed">
};

const TodoItem = ({index, todo}: TodoItemType) => {

  const removeTodo = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const toggleTodo = () => {
  };

  return (
    <li key={index}>
      <div className="view">
        <div className="round">
          <input
            checked={todo.is_completed}
            type="checkbox"
            id={todo.id!.toString()}
            onChange={() => toggleTodo()}
          />
          <label htmlFor={todo.id!.toString()}/>
        </div>
      </div>

      <div className={"labelContent" + (todo.is_completed ? " completed" : '')}>
        <div>
          {todo.title}
        </div>
      </div>

      <button className="closeBtn" onClick={(e) => removeTodo(e)}>
        x
      </button>
    </li>
  );
};

export default TodoItem;
