import { useDispatch } from "react-redux";
import { AppDispatch } from "../../state";
import { type TodoItemArgs } from "./types";
import { modifyTodo } from "../../thunk/modify_todo";

function DeleteButton ({ task }: TodoItemArgs) {
  const dispatch = useDispatch<AppDispatch>()
  const { databaseId } = task

  return (
    <span
      onClick={(_e) => dispatch(modifyTodo({ databaseId, deleteThis: true }))}
    >
      <i className="bi bi-trash"></i>
      {" "}
      Delete
    </span>
  )

}

function AddSubTodo () {
  return (
    <span
    >
      <i className="bi bi-plus-circle-fill"></i>
      {" "}
      Add Sub Task
    </span>
  )
}
export default function OptionsButton({ task }: TodoItemArgs) {
  return (
    <div className={"dropdown"} >
      <button
        type="button"
        name="toggle-todo-dropdown"
        className={"btn btn-dark align-self-center"}
        data-bs-toggle={"dropdown"}
        aria-expanded="false"
      >
        <i className="bi bi-three-dots-vertical"></i>
      </button>

      <ul className={"dropdown-menu dropdown-menu-dark"} >
        <li className={"dropdown-item"}>
          <DeleteButton task={task} />
        </li>
        <li className={"dropdown-item"}>
          <AddSubTodo />
        </li>
      </ul>
    </div>
  );
}