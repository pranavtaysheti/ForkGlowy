import { useState, useId } from "react";
import { TaskStatus, addTodo, deleteTodo, editTodo } from "../tasks";
import { type RootState } from "../store";
import { useSelector, useDispatch } from "react-redux";
import type { DefinedTask } from "../tasks";
import { Redirect } from "wouter";
import type { User } from "firebase/auth";
import { logout } from "../login";
import { uploadTasks, fetchTasks } from "../sync";

enum ItemMode {
  Display = "DISPLAY",
  Input = "INPUT",
}

type TodoItemArgs = {
  task: DefinedTask;
};

type UserDisplayArgs = {
  user: User
}
function UserDisplay({user}: UserDisplayArgs) {
  const dispatch = useDispatch()

  return (
      <div className={"card text-bg-info border-dark p-2"} >
        <h3 className={"card-title text-center"}>Welcome! {user.email}</h3>
        <div className={"d-flex justify-content-center"} >
          <input type="button" className={"btn btn-danger"} value={"Logout"} onClick={(_e) =>dispatch(logout())}/>
        </div>
      </div>
  )
}

function TodoItem({ task }: TodoItemArgs) {
  const dispatch = useDispatch();
  const { id, status, taskText } = task;
  const [mode, setMode] = useState(ItemMode.Display);
  const [inputText, setInputText] = useState("");

  function dispatchEdit() {
    dispatch(
      editTodo({
        id,
        status,
        taskText: inputText,
      })
    );
    setMode(ItemMode.Display);
  }

  const DeleteButton = () => {
    return (
      <input
        type="button"
        name="delete"
        value={"Delete"}
        className={"btn btn-danger me-2"}
        onClick={(_e) => dispatch(deleteTodo(id))}
      />
    );
  };

  const TodoInput = () => {
    return (
      <input
        onChange={(e) => setInputText(e.target.value)}
        value={inputText}
        onKeyDown={(e) => (e.key === "Enter" ? dispatchEdit() : null)}
        autoFocus
        className={"flex-fill form-control"}
        placeholder="Drink water"
      />
    );
  };

  const TodoText = () => {
    return (
        <input
          type="text"
          className={"flex-fill form-control"}
          value={taskText}
          onClick={(_e) => setMode(ItemMode.Input)}
          readOnly
        />
    );
  };

  const result = () => {
    switch (mode) {
      case ItemMode.Display:
        return (
          <div className={"d-flex flex-row"}>
            <DeleteButton />
            <TodoText />
          </div>
        );
      case ItemMode.Input:
        return (
          <div className={"d-flex flex-row"}>
            <DeleteButton />
            <TodoInput />
          </div>
        );
    }
  };

  return <li className={"mb-1 list-group-item"}>{result()}</li>;
}

function TodoForm() {
  const [text, setText] = useState<string>("");
  const dispatch = useDispatch();
  const formId = useId();
  const buttonId = useId();

  const submitForm = () => {
    dispatch(
      addTodo({
        status: TaskStatus.Todo,
        taskText: text,
      })
    ),
      setText("");
  };

  return (
    <div className={"text-bg-dark pt-2 pb-2 input-group"} id={formId}>
      <span className={"input-group-text"}> Add Todo </span>
      <input
        onChange={(e) => setText(e.target.value)}
        value={text}
        onKeyDown={(e) => (e.key === "Enter" ? submitForm() : null)}
        className={"form-control"}
        type="text"
        name="task-text"
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

  return (
    <>
      <ul className="list-group">
        {tasks.map((task) => (
          <TodoItem task={task} key={task.id} />
        ))}
      </ul>
    </>
  );
}

function UploadButton() {
  return (
    <input type="button" value="Upload" className={"btn btn-primary me-2"} onClick={(_e) => uploadTasks()} />
  )
}
function FetchButton() {
  return (
    <input type="button" value="Fetch" className={"btn btn-warning ms-2"} onClick={(_e) => fetchTasks()} />
  )
}
export default function TodoDiv() {
  const user = useSelector((state: RootState) => state.login.user)

  if (!user) {
    return (
      <Redirect to="/login"/>
    )
  }
  return (
    <>
      <div className={"card text-bg-dark border-dark p-2"}>
        <UserDisplay user={user} />
        <TodoForm />
        <TodoList />
        <div className={"d-flex justify-content-center"}>
          <UploadButton />
          <FetchButton />
        </div>
      </div>
    </>
  );
}
