import { useState, useId } from "react";
import { TaskStatus, addTodo, deleteTodo } from "../tasks";
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
  user: User
}
function UserDisplay({user}: UserDisplayArgs) {
  const dispatch = useDispatch<AppDispatch>()

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
  const dispatch = useDispatch<AppDispatch>();
  const { databaseId, taskText } = task;
  const [inputText, setInputText] = useState(taskText);

  const DeleteButton = () => {
    return (
      <input
        type="button"
        name="delete"
        value={"Delete"}
        className={"btn btn-danger me-2"}
        onClick={(_e) => dispatch(deleteTodo(databaseId))}
      />
    );
  };

  const CheckBox = () => {
    return (
      <input className={"form-check-input me-2 p-3"}
      type="checkbox"
      />
    )
  }
  const TodoInput = () => {
    return (
      <input
        onChange={(e) => setInputText(e.target.value)}
        value={inputText}
        className={"flex-fill form-control-plaintext"}
        placeholder="Drink water"
      />
    );
  };

  return (
    <li className={"list-group-item"}>
      <div className={"d-flex flex-row"}>
        <DeleteButton />
        <CheckBox />
        <TodoInput />
      </div>
    </li>
  )
}

function TodoForm() {
  const [text, setText] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const formId = useId();
  const buttonId = useId();

  const submitForm = () => {
    dispatch(
      addTodo({
        status: TaskStatus.Todo,
        taskText: text,
      })
    )
    setText("");
  };

  return (
    <div className={"text-bg-dark pt-2 pb-2 input-group"} id={formId}>
      <span className={"input-group-text"}> Add Todo </span>
      <input
        onChange={(e) => setText(e.target.value)}
        value={text}
        onKeyDown={(e) => {if (e.key === "Enter") {submitForm()}}}
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

type TodoListArgs = {
  showCompleted: boolean;
};

function TodoList({showCompleted}: TodoListArgs) {
  const tasks = useSelector((state: RootState) => state.tasks);

  return (
    <>
      <ul className="list-group">
        {tasks.map((task) => {
          if (!(showCompleted === false && task.status === TaskStatus.Done)) {
            return (
              <TodoItem task={task} key={task.databaseId} />
            )  
          }
        })}
      </ul>
    </>
  );
}

export default function TodoDiv() {
  const user = useSelector((state: RootState) => state.login.user)
  const [showCompleted, setShowCompleted] = useState<boolean>(true)

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
        <TodoList showCompleted={showCompleted}/>
        <div>
          <input type="checkbox" onChange={(e) => setShowCompleted(e.target.checked)} />
        </div>
      </div>
    </>
  );
}
