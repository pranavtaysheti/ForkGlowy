import { useDispatch } from "react-redux";
import { AppDispatch } from "../../state";
import { modifyTodo } from "../../thunk/modify_todo";
import { DefinedTask } from "../../state/tasks";

export type TodoItemArgs = {
  task: DefinedTask;
};


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

function DragHandle ({task}: TodoItemArgs) {
  return (
    <span
      draggable = {true}
      onDragStart={() => console.log("Drag start")}
      onDragEnd={() => console.log("Drag end")}
      className="text-light align-self-center ms-n3"
    >
      <i className="bi bi-three-dots-vertical"></i>
    </span>
  )
}

function DeleteButton ({ task }: TodoItemArgs) {
  const dispatch = useDispatch<AppDispatch>()
  const { databaseId } = task

  return (
    <button
    className="btn btn-danger align-self-center"
      onClick={() => dispatch(modifyTodo({ databaseId, deleteThis: true }))}
    >
      <i className="bi bi-trash"></i>
    </button>
  )

}

function TodoInput({ task }: TodoItemArgs) {
  const { taskText, status, databaseId } = task;
  const baseClass = "text-white flex-fill align-self-center align-middle form-control-plaintext"
  const className = baseClass + " " + (status ? "text-decoration-line-through" : "")
  const dispatch = useDispatch<AppDispatch>()
  const onChange = (newTaskText: string) => {
    dispatch(modifyTodo({databaseId, newTaskText}))
  }

  return (
    <input
      onChange={(e) => onChange(e.target.value)}
      type="text"
      value={taskText}
      className={className}
      placeholder="Drink water"
      name="edit-task-text"
    />
  );
  }
  
export default function TodoItem({ task }: TodoItemArgs) {
  return (
    <li className={"list-group-item bg-transparent d-flex flex-row"}>
        <DragHandle task={task} />
        <DeleteButton task={task} />
        <CheckBox task={task} />
        <TodoInput task={task} />
    </li>
  );
}