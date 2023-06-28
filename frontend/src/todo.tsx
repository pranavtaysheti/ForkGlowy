import { useState, useContext, useReducer } from "react";


import {
  TaskStatus,
  taskSeed,
  TaskActionType,
  tasksDispatchContext,
  tasksContext,
  taskReducer,
} from "./task";

import type { DefinedTask } from "./task";

function TodoItem(task: DefinedTask) {
  enum ItemMode {
    Display = "DISPLAY",
    Input = "INPUT",
  }

  const { id, status, taskText } = task;
  const setTask = useContext(tasksDispatchContext);
  const [mode, setMode] = useState(ItemMode.Display);
  const [inputText, setInputText] = useState("");

  const dispatchEdit = () => {
    setTask({
      type: TaskActionType.Edit,
      id: id,
      task: { status, taskText: inputText },
    });
    setInputText("");
    setMode(ItemMode.Display);
  };

  type listParams = {
    name: string;
    onClick?: any;
  };

  const ListButton = (params: listParams) => {
    return (<button className={"rounded border-solid bg-blue-500 hover:bg-blue-700 font-bold"} onClick={params.onClick} >{params.name}</button>)
  }

  const itemChild = () => {
    switch (mode) {
      case ItemMode.Display:
        return (
          <>
            <span>{taskText}</span>
            <ListButton
              name="Edit"
              onClick={(_e: MouseEvent) => {
                setMode(ItemMode.Input);
              }}
            />
          </>
        )
      case ItemMode.Input:
        return (
          <>
            <input
              onChange={(e) => setInputText(e.target.value)}
              value={inputText}
              onKeyDown={(e) => (e.key === "Enter" ? dispatchEdit() : null)}
              autoFocus
            />
            <ListButton
              name="Save"
              onClick={(_e: MouseEvent) => ( dispatchEdit())}
            />
          </>
        );
    }
  };

  return (
    <li className={"text-left opacity-100"} >
      
      {itemChild()}
      

      <ListButton
        name = "Delete"
        onClick={(_e: MouseEvent) => setTask({ type: TaskActionType.Delete, id: id })}
      />

    </li>
  );
}

function TodoForm() {
  const [text, setText] = useState<string>("");
  const setTasks = useContext(tasksDispatchContext);

  const addTask = (): void => {
    setTasks({
      type: TaskActionType.Add,
      task: { status: TaskStatus.Todo, taskText: text },
    });
    setText("");
  };

  return (
    <>
      <input
        onChange={(e) => setText(e.target.value)}
        value={text}
        onKeyDown={(e) => (e.key === "Enter" ? addTask() : null)}
      />
      <button className="newTodo" onClick={(_e) => addTask()}>
        Add
      </button>
    </>
  );
}
function TodoList() {
  const taskContainer = useContext(tasksContext);

  return (
    <>
      <ul className="todoList">
        {taskContainer.tasks.map((task) => (
          <TodoItem {...task} />
        ))}
      </ul>
    </>
  );
}

export default function TodoDiv() {
  const [tasks, tasksDispatch] = useReducer(taskReducer, taskSeed);
  return (
    <>
      <tasksContext.Provider value={tasks}>
        <tasksDispatchContext.Provider value={tasksDispatch}>
          <TodoForm />
          <TodoList />
        </tasksDispatchContext.Provider>
      </tasksContext.Provider>
    </>
  );
}
