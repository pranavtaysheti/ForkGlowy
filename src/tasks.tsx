import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";

export enum TaskStatus {
  Todo = "TODO",
  Done = "DONE",
}

export type Task = {
  status: TaskStatus;
  taskText: string;
};

export type DefinedTask = {
  id: string;
  status: TaskStatus;
  taskText: string;
};

export type TaskContainer = Array<DefinedTask>;

export type DatabaseTasks = {
  [key: string]: Task
}

export const taskSeed: TaskContainer = [
  { id: "0", status: TaskStatus.Todo, taskText: "Hit the Gym!" },
  { id: "1", status: TaskStatus.Todo, taskText: "Cook Dinner." },
  {
    id: "2",
    status: TaskStatus.Todo,
    taskText: "Get the car puncture repaired.",
  },
];

const tasksSlice = createSlice({
  name: "tasks",
  initialState: taskSeed,
  reducers: {
    addTodo: {
      reducer: (state, action: PayloadAction<DefinedTask>) => {
        state.push(action.payload);
      },
      prepare: (task: Task) => {
        const id = nanoid();
        return { payload: { id, ...task } };
      },
    },
    setTodos: (state, action: PayloadAction<DatabaseTasks>) => {
      for (const id in action.payload) {
        state.push({
          id: id,
          taskText: action.payload[id].taskText,
          status: action.payload[id].status,
        })
      }
    },
    deleteTodo: (state, action: PayloadAction<string>) => {
      for (const i in state) {
        if (state[i].id === action.payload) {
          state.splice(parseInt(i),1)
          break;
        }
      }
    },
    editTodo: (state, action: PayloadAction<DefinedTask>) => {
      for (const i in state) {
        if (state[i].id === action.payload.id) {
          state[i] = action.payload;
          break;
        }
      }
    },
    clearTodos: (_state) => {
      return []
    }
  },
});

export const tasksReducer = tasksSlice.reducer
export const { addTodo, deleteTodo, editTodo, clearTodos, setTodos } = tasksSlice.actions;
