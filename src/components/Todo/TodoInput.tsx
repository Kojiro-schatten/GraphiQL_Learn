import * as React from 'react';
import { useMutation } from "@apollo/react-hooks";
import { GET_MY_TODOS } from './TodoPrivateList';

import gql from 'graphql-tag';
// todo と $isPublic 変数が渡された状態で、mutationが todos テーブルに挿入されます。
const ADD_TODO = gql`
  insert_todos(objects: {title: $todo, is_public: $isPublic}){
    affected_rows
    returning{
      id
      title
      is_completed
    }
  }
`;

const TodoInput = ({isPublic=false}) => {
  const [todoInput, setTodoInput] = React.useState('');
  const [addTodo] = useMutation(ADD_TODO);

  return (
    <form className="formInput" onSubmit={(e) => {
      e.preventDefault();
      // add todo
      addTodo(
        {
          variables: {todo: todoInput, isPublic},
          update(cache, {data}) {
            // do not updae cache for public feed
            if(isPublic || !data){
              return null;
            }
            // client.queryとは異なり、readQueryは決してGraphQLサーバーにリクエストを行いません。常にキャッシュから読み込みます。
            // そのため、現在のToDoリストを取得するためにキャッシュへの読み込みリクエストを行います。
            const getExistingTodos:any =cache.readQuery({ query: GET_MY_TODOS });
            const existingTodos = getExistingTodos ? getExistingTodos.todos : [];
            const newTodo = data.insert_todos!.returning[0];
            // writeQueryはローカルキャッシュのデータを変更することができますが、サーバ上のデータは変更されないことを覚えておくことが重要です（まさに私たちが必要としていること）。
            // Apollo Clientストアのサブスクライバーは、このアップデートを即座に確認し、それに応じて新しいUIをレンダリングします。
            // これで、TodoPrivateList コンポーネントは、ストアに自動的にサブスクライブされるので、更新された Todo リストを取得する必要があります。
            cache.writeQuery({
              query: GET_MY_TODOS,
              data: {todos: [newTodo, ...existingTodos]}
            });
          }
        }
      );
      setTodoInput('');
    }}>
      <input
        className="input"
        placeholder="What needs to be done?"
        value={todoInput}
        onChange={e => (setTodoInput(e.target.value))}
      />
      <i className="inputMarker fa fa-angle-right" />
    </form>
  );
};

export default TodoInput;
