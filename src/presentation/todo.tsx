import { useState, useId } from "react";
import { addTodo, modifyTodo, setVisiblity } from "../tasks";
import { AppDispatch, type RootState } from "../store";
import { useSelector, useDispatch } from "react-redux";
import type { DefinedTask } from "../tasks";
import { Redirect } from "wouter";
import type { User } from "firebase/auth";
import { logout } from "../login";

type TodoItemArgs = {
  task: DefinedTask;
};

type UserDisplayArgs = {
  user: User;
};

function UserDisplay({ user }: UserDisplayArgs) {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className={"card text-bg-info border-dark p-2"}>
      <h3 className={"card-title text-center"}>Welcome! {user.email}</h3>
      <div className={"d-flex justify-content-center"}>
        <input
          type="button"
          className={"btn btn-danger"}
          value={"Logout"}
          onClick={(_e) => dispatch(logout())}
        />
      </div>
    </div>
  );
}

function DeleteButton({ task }: TodoItemArgs) {
  const dispatch = useDispatch<AppDispatch>();
  const { databaseId } = task;
  return (
    <input
      type="button"
      name="delete"
      value={"Delete"}
      className={"btn btn-danger me-1"}
      onClick={(_e) => dispatch(modifyTodo({ databaseId, deleteThis: true }))}
    />
  );
}

function CheckBox({ task }: TodoItemArgs) {
  const dispatch = useDispatch<AppDispatch>();
  const { status, databaseId } = task;

  return (
    <input
      className={"form-check-input me-2"}
      type="checkbox"
      checked={Boolean(status)}
      onChange={(e) =>
        dispatch(modifyTodo({ databaseId, newStatus: e.target.checked }))
      }
    />
  );
}

function TodoInput({ task }: TodoItemArgs) {
  const dispatch = useDispatch<AppDispatch>();
  const { databaseId, taskText } = task;
  const [text, setText] = useState(taskText);

  return (
    <input
      onChange={(e) => {
        setText(e.target.value);
      }}
      type="text"
      value={text}
      className={"flex-fill form-control-plaintext"}
      placeholder="Drink water"
      name="edit-task-text"
    />
  );
}

function TodoItem({ task }: TodoItemArgs) {
  return (
    <li className={"list-group-item"}>
      <div className={"d-flex flex-row"}>
        <DeleteButton task={task} />
        <CheckBox task={task} />
        <TodoInput task={task} />
      </div>
    </li>
  );
}

function TodoForm() {
  const [text, setText] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const formId = useId();
  const buttonId = useId();

  const submitForm = () => {
    dispatch(
      addTodo({
        status: false,
        taskText: text,
      })
    );
    setText("");
  };

  return (
    <div className={"text-bg-dark pt-2 pb-2 input-group"} id={formId}>
      <span className={"input-group-text"}> Add Todo </span>
      <input
        onChange={(e) => setText(e.target.value)}
        value={text}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            submitForm();
          }
        }}
        className={"form-control"}
        type="text"
        name="add-task-text"
      />
      <input
        className="btn btn-success"
        id={buttonId}
        type="submit"
        name="add-task"
        value="Add"
        onClick={(_e) => submitForm()}
      />
    </div>
  );
}

function TodoList() {
  const tasks = useSelector((state: RootState) => state.tasks);
  const tasksVisiblity = useSelector(
    (state: RootState) => state.tasksVisiblity
  );
  const showCompleted = tasksVisiblity.showCompleted;

  return (
    <ul className="list-group">
      {tasks.map((task) => {
        if (!(showCompleted === false && task.status === true) && !task.isDeleted) {
          return <TodoItem task={task} key={task.databaseId} />;
        }
      })}
    </ul>
  );
}

function VisiblityCheckbox() {
  const tasksVisiblity = useSelector(
    (state: RootState) => state.tasksVisiblity
  );
  const dispatch = useDispatch<AppDispatch>();

  return (
    <input
      type="checkbox"
      onChange={(e) =>
        dispatch(
          setVisiblity({
            showCompleted: e.target.checked,
          })
        )
      }
      checked={tasksVisiblity.showCompleted}
    />
  );
}

export default function TodoDiv() {
  const user = useSelector((state: RootState) => state.login.user);
  if (!user) {
    return <Redirect to="/login" />;
  }
  return (
    <div className={"card text-bg-dark border-dark p-2"}>
      <UserDisplay user={user} />
      <TodoForm />
      <TodoList />
      <VisiblityCheckbox />
    </div>
  );
}
