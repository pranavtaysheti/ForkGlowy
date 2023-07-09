import { useState, useId } from "react";
import { TaskStatus, addTodo, deleteTodo, editTodo } from "../tasks";
import type { RootState } from "../store";
import { useSelector, useDispatch } from "react-redux";
import type { DefinedTask } from "../tasks";

enum ItemMode {
  Display = "DISPLAY",
  Input = "INPUT",
}

type TodoItemArgs = {
  task: DefinedTask;
};

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

  const SaveButton = () => {
    return (
      <input
        type="button"
        name="save"
        value="Save"
        className={"btn btn-primary"}
        onClick={(_e) => dispatchEdit()}
      />
    );
  };

  const EditButton = () => {
    return (
      <input
        type="button"
        name="edit"
        value={"Edit"}
        className={"btn btn-warning"}
        onClick={(_e) => setMode(ItemMode.Input)}
      />
    );
  };

  const DeleteButton = () => {
    return (
      <input
        type="button"
        name="delete"
        value={"Delete"}
        className={"btn btn-danger"}
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
      <div className="flex-fill">
        <input
          type="text"
          className={"text-wrap form-control-plaintext"}
          value={taskText}
          readOnly
        />
      </div>
    );
  };

  const result = () => {
    switch (mode) {
      case ItemMode.Display:
        return (
          <div className={"d-flex flex-row input-group"}>
            <TodoText />
            <EditButton />
            <DeleteButton />
          </div>
        );
      case ItemMode.Input:
        return (
          <div className={"d-flex flex-row input-group"}>
            <TodoInput />
            <SaveButton />
            <DeleteButton />
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
    <div className={"text-bg-dark p-2 m-2 input-group"} id={formId}>
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

export default function TodoDiv() {
  return (
    <div className={"card text-bg-dark border-dark p-2"}>
      <TodoForm />
      <TodoList />
    </div>
  );
}
