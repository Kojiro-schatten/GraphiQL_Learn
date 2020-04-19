import React, { Fragment, useState } from "react";
import gql from 'graphql-tag';
import { useQuery } from "@apollo/react-hooks";
import TodoItem from "./TodoItem";
import TodoFilters from "./TodoFilters";
import { 
  GetMyTodosQuery,
  Todos
} from '../../generated/graphql';

// この関数は、平文の文字列をgraphqlクエリとしてパースするために使われます。
const GET_MY_TODOS = gql`
  query getMyTodos {
    todos(where: {is_public: {_eq: false}}, order_by: {created_at:desc}){
      id
      title
      is_completed
    }
  }
`;

const TodoPrivateList = () => {

  const [filter, setFilter] = useState<string>("all");
  // useQueryを使うことで、loading,error,dataがGET_MY_TODOSと繋がった。
  // loadingがtrueの場合、リクエストは終了していません。通常、この情報はローディングスピナーを表示するために使われます。
  // graphQLErrors および networkError プロパティを持つランタイムエラー。クエリで何が問題となったかについての情報が含まれます。
  // GraphQL クエリの結果を含むオブジェクト。これには、サーバーからの実際のデータが含まれます。この例では、todo データになります。
  const { loading, error, data } = useQuery<GetMyTodosQuery>(GET_MY_TODOS);

  const filterResults = (filter: string): void => {
    setFilter(filter);
  };

  const clearCompleted = () => {
  };

  if(loading){
    return (<div>Loading...</div>);
  }
  if(error || !data){
    return (<div>Error...</div>);
  }

  // data.という風にしてgraphqlとtodosを繋げた。
  let filteredTodos = data.todos;
  if (filter === "active") {
    filteredTodos = data.todos.filter((todo: Pick<Todos, "id" | "title" | "is_completed">) => todo.is_completed !== true);
  } else if (filter === "completed") {
    filteredTodos = data.todos.filter((todo: Pick<Todos, "id" | "title" | "is_completed">) => todo.is_completed === true);
  }

  const todoList = filteredTodos.map((todo: Pick<Todos, "id" | "title" | "is_completed">, index: number) => (
    <TodoItem
      key={'item'+index}
      index={index}
      todo={todo}
    />
  ));

  return (
    <Fragment>
      <div className="todoListWrapper">
        <ul>
          { todoList }
        </ul>
      </div>

      <TodoFilters
        todos={filteredTodos}
        currentFilter={filter}
        filterResultsFn={filterResults}
        clearCompletedFn={clearCompleted}
      />
    </Fragment>
  );
}

export default TodoPrivateList;
export { GET_MY_TODOS };