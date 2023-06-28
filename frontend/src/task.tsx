import { createContext } from "react";

export enum TaskStatus {
  Todo = "TODO",
  Done = "DONE",
}

export type Task = {
  status: TaskStatus;
  taskText: string;
};

export type DefinedTask = {
  id: number
  status: TaskStatus;
  taskText: string;

}

export type TaskContainer = {
  next_id: number;
  tasks: Array<DefinedTask>;
};
export const taskSeed: TaskContainer = {
  next_id: 3,
  tasks: [
    { id: 0, status: TaskStatus.Todo, taskText: "Hit the Gym!" },
    { id: 1, status: TaskStatus.Todo, taskText: "Cook Dinner." },
    {
      id: 2,
      status: TaskStatus.Todo,
      taskText: "Get the car puncture repaired.",
    },
  ],
};

export enum TaskActionType {
  Add = "ADD",
  Delete = "DELETE",
  Edit = "EDIT",
}

export type TaskAction =
  | {
      type: TaskActionType.Add;
      task: Task;
    }
  | {
      type: TaskActionType.Edit;
      id: number;
      task: Task;
    }
  | {
      type: TaskActionType.Delete;
      id: number;
    };

export const tasksContext = createContext(taskSeed);
export const tasksDispatchContext = createContext((_taskAction: TaskAction) => {});

export function taskReducer(
  taskContainer: TaskContainer,
  action: TaskAction
): TaskContainer {
  switch (action.type) {
    case TaskActionType.Add:
      return {
        next_id: taskContainer.next_id + 1,
        tasks: [
          ...taskContainer.tasks,
          { id: taskContainer.next_id, ...action.task },
        ],
      };

    case TaskActionType.Delete:
      return {
        next_id: taskContainer.next_id,
        tasks: taskContainer.tasks.filter((task) =>
          task.id !== action.id),
      };

    case TaskActionType.Edit:
      return {
        next_id: taskContainer.next_id,
        tasks: taskContainer.tasks.map((task) =>
          task.id === action.id ? {"id": action.id,...action.task} : task),
      };
  }
}
