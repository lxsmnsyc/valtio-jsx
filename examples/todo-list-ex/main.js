import {
  get,
  map,
  render,
  effect,
  cleanup,
} from 'valtio-jsx';
import {
  proxy,
  subscribe,
} from 'valtio/vanilla';
import {
  watch,
} from 'valtio/utils';

import './style.css';

const list = proxy([]);

function TodoListItem(props) {
  const { item } = props;


  function onToggle() {
    item.done = !item.done;
  }

  function onRemove() {
    const index = list.findIndex((value) => value.id === item.id);

    list.splice(index, 1);
  }

  return (
    <div
      className={`todo-item ${get(item).done ? 'complete' : 'pending'}`}
    >
      <div className="todo-item-content">
        {item.message}
      </div>
      <div className="todo-item-actions">
        <button
          className={`todo-item-toggle ${get(item).done ? 'complete' : 'pending'}`}
          onClick={onToggle}
        >
          {get(item).done ? 'Completed' : 'Pending'}
        </button>
        <button className="todo-item-delete" onClick={onRemove}>
          Delete
        </button>
      </div>
    </div>
  );
}

let index = 0;

function TodoListForm() {
  const message = proxy({ value: '' });

  function onSubmit(e) {
    e.preventDefault();

    list.unshift(
      proxy({
        done: false,
        message: message.value,
        id: index,
      })
    );
    index += 1;
    message.value = '';
  }

  return (
    <form className="todo-list-form" onSubmit={onSubmit}>
      <input
        type="text"
        value={get(message).value}
        onInput={(e) => {
          message.value = e.target.value;
        }}
      />
      <button
        type="submit"
        disabled={get(message).value === ''}
      >
        Add
      </button>
    </form>
  );
}

function TodoList() {
  return (
    <>
      <TodoListForm />
      <div className="todo-list">
        {map(() => get(list), (item) => <TodoListItem item={item} />)}
      </div>
    </>
  );
}

function App() {
  return (
    <div className="app">
      <h1>Todo List</h1>
      <TodoList />
    </div>
  );
}

const root = document.getElementById('app');

if (root) {
  render(() => <App />, root);
}
