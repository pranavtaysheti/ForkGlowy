import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { modifyTodo } from "../../tasks";
import { useState } from "react";
import { type TodoItemArgs } from "./types";
import OptionsButton from "./dropdown"


function CheckBox({ task }: TodoItemArgs) {
    const dispatch = useDispatch<AppDispatch>();
    const { status, databaseId } = task;
  
    return (
      <input
        className={"form-check-input align-self-center m-2"}
        type="checkbox"
        checked={Boolean(status)}
        onChange={(e) =>
          dispatch(modifyTodo({ databaseId, newStatus: e.target.checked }))
        }
      />
    );
  }

function ExpandTodo () {
  return (
    <button
      type="button"
      name="expand-todo"
      className={"btn btn-dark align-self-center"}
    >
      <i className={"bi bi-arrow-up-left-circle-fill"}></i>
    </button>
  )
}

function ShowChildren () {
  return (
    <button 
      type="button"
      name="show-children-todo"
      className={"btn btn-dark align-self-center"}
    >
      <i className={"bi bi-caret-right-fill"}> </i>
    </button>
  )
}

function TodoInput({ task }: TodoItemArgs) {
  const { taskText, status } = task;
  const [text, setText] = useState(taskText);
  const baseClass = "text-white flex-fill align-self-center align-middle form-control-plaintext"
  const className = baseClass + " " + (status ? "text-decoration-line-through" : "")
  return (
    <input
      onChange={(e) => {
        setText(e.target.value);
      }}
      type="text"
      value={text}
      className={className}
      placeholder="Drink water"
      name="edit-task-text"
    />
  );
  }
  
export default function TodoItem({ task }: TodoItemArgs) {
  return (
    <li className={"list-group-item bg-transparent d-flex flex-row"}>
        <OptionsButton task={task} />
        <ExpandTodo />
        <ShowChildren />
        <CheckBox task={task} />
        <TodoInput task={task} />
    </li>
  );
  }