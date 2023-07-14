import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { push, ref, remove, set } from "firebase/database";
import { database } from "./firebase";
import type { RootState } from "./store";
import { nanoid } from "nanoid";

export enum TaskStatus {
  Todo = "TODO",
  Done = "DONE",
}

export type Task = {
  status: TaskStatus;
  taskText: string;
};

enum SyncStatus {
  Local = "LOCAL",
  Synced = "SYNCED",
  Syncing = "SYNCING",
}

export type DefinedTask = {
  databaseId: string;
  requestId: string;
  status?: TaskStatus;
  taskText?: string;
  isDeleted: boolean;
  syncStatus: SyncStatus;
};

export type TaskContainer = Array<DefinedTask>;

export type DatabaseTasks = {
  [key: string]: Task;
};

export const taskSeed: TaskContainer = [];

export const addTodo = createAsyncThunk(
  "tasks/addTodo",
  async (task: Task, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const { status, taskText } = task;
    const user = state.login.user;

    if (user) {
      const uid = user.uid;
      const userTasksRef = ref(database, "users/" + uid);
      const newTaskRef = push(userTasksRef);
      if (newTaskRef.key) {
        return set(newTaskRef, { status, taskText })
        .then(() => thunkAPI.fulfillWithValue(newTaskRef.key))
      }
    }
  }
);

/*
export const editTodo = createAsyncThunk(
  "tasks/editTodo",
  async (databaseId: string, thunkAPI) => {
    //TODO: Think if it makes sense to merge it with delete Todo
  }
)
*/
export const deleteTodo = createAsyncThunk(
  "tasks/deletoTodo",
  async (databaseId: string, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const user = state.login.user;

    if (user) {
      const uid = user.uid;
      const taskRef = ref(database, "users/" + uid + "/" + databaseId);
      return remove(taskRef);
    }
  }
);

const tasksSlice = createSlice({
  name: "tasks",
  initialState: taskSeed,
  reducers: {
    setTodos: (state, action: PayloadAction<DatabaseTasks>) => {
      state.splice(0);
      const tasks = action.payload;
      for (const databaseId in tasks) {
        const { taskText, status } = tasks[databaseId];
        state.push({
          databaseId,
          taskText,
          status,
          isDeleted: false,
          syncStatus: SyncStatus.Synced,
          requestId: "0",
        });
      }
    },
    clearTodos: state => state.splice(0)
  },
  extraReducers: (builder) => builder
      .addCase(addTodo.pending, (state, action) => {
        const { status, taskText } = action.meta.arg;
        state.push({
          syncStatus: SyncStatus.Syncing,
          taskText,
          status,
          isDeleted: false,
          requestId: action.meta.requestId,
          databaseId: nanoid()
        })
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        for (const i in state) {
          if (state[i].requestId === action.meta.requestId) {
            state[i].syncStatus = SyncStatus.Synced;
            state[i].databaseId = action.payload as string
            break;
          }
        }
      })
      .addCase(addTodo.rejected, (state, action) => {
        for (const i in state) {
          if (state[i].requestId === action.meta.requestId) {
            state.splice(parseInt(i), 1);
            break;
          }
        }
      })
      .addCase(deleteTodo.pending, (state, action) => {
        for (const i in state) {
          if (state[i].databaseId === action.meta.arg) {
            state[i].isDeleted = true;
            break;
          }
        }
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        for (const i in state) {
          if (state[i].databaseId === action.meta.arg) {
            state.splice(parseInt(i), 1);
            break;
          }
        }
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        for (const i in state) {
          if (state[i].databaseId === action.meta.arg) {
            state[i].isDeleted = false;
            break;
          }
        }
      }),
});

export const tasksReducer = tasksSlice.reducer;
export const { setTodos, clearTodos } = tasksSlice.actions;
