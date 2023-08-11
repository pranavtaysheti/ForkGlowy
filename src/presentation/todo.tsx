import { useState, useId } from "react";
import { addTodo, setVisiblity } from "../tasks";
import { AppDispatch, type RootState } from "../store";
import { useSelector, useDispatch } from "react-redux";
import TodoItem from "../components/todo_item/todo_item";
import { Redirect } from "wouter";
import type { User } from "firebase/auth";
import { logout } from "../login";


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
    <div className="card text-bg-dark">
      <ul className="list-group list-group-flush bg-transparent">
        {tasks.map((task) => {
          if (!(showCompleted === false && task.status === true) && !task.isDeleted) {
            return <TodoItem task={task} key={task.databaseId} />;
          }
        })}
      </ul>
    </div>
  );
}

function VisiblityCheckbox() {
  const tasksVisiblity = useSelector(
    (state: RootState) => state.tasksVisiblity
  );
  const dispatch = useDispatch<AppDispatch>();
  const checkboxId = useId()

  return (
    <div className="form-check">
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
        className="form-check-input"
        id={checkboxId}
      />

      <label className="form-check-label" htmlFor={checkboxId} >
        Show Completed
      </label>

    </div>
  );
}

export default function TodoDiv() {
  const user = useSelector((state: RootState) => state.login.user);
  if (!user) {
    return <Redirect to="/login" />;
  }
  return (
    <>
      <div className={"card text-bg-dark border-dark p-2 mt-2 mb-2"}>
        <UserDisplay user={user} />
        <TodoForm />
        <VisiblityCheckbox />
      </div>
        <TodoList />
    </>
  );
}
