import {  createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";
import { fetchTodos } from "../thunk/fetch_todos";
import { FirebaseError } from "firebase/app";
import { addTodo } from "../thunk/add_todo";
import { modifyTodo } from "../thunk/modify_todo";

export type Task = {
  status: boolean;
  taskText: string;
};

enum SyncStatus {
  Local = "LOCAL",
  Synced = "SYNCED",
  Syncing = "SYNCING",
}

export type DefinedTask = {
  databaseId: string;
  requestId: string | null;
  status?: boolean;
  taskText?: string;
  isDeleted: boolean;
  syncStatus: SyncStatus;
};

export type TaskContainer = {
  tasks: Array<DefinedTask>;
  loading: boolean;
  error: FirebaseError | null;
};

export type DatabaseTasks = {
  [key: string]: Task;
};

export const taskSeed: TaskContainer = {
  tasks: [],
  loading: false,
  error: null,
};



const tasksSlice = createSlice({
  name: "tasks",
  initialState: taskSeed,
  reducers: {
    setTodos: (state, action: PayloadAction<DatabaseTasks>) => {
      state.tasks.splice(0);
      const tasks = action.payload;
      for (const databaseId in tasks) {
        const { taskText, status } = tasks[databaseId];
        state.tasks.push({
          databaseId,
          taskText,
          status,
          isDeleted: false,
          syncStatus: SyncStatus.Synced,
          requestId: null,
        });
      }
    },
    clearTodos: (state) => {
      state.tasks.splice(0);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addTodo.pending, (state, action) => {
        const { status, taskText } = action.meta.arg;
        state.tasks.push({
          syncStatus: SyncStatus.Syncing,
          taskText,
          status,
          isDeleted: false,
          requestId: action.meta.requestId,
          databaseId: nanoid(),
        });
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        const tasks = state.tasks;
        for (const i in tasks) {
          if (tasks[i].requestId === action.meta.requestId) {
            tasks[i].syncStatus = SyncStatus.Synced;
            tasks[i].databaseId = action.meta.key;
            tasks[i].requestId = null;
            break;
          }
        }
      })
      .addCase(addTodo.rejected, (state, action) => {
        const tasks = state.tasks;
        for (const i in tasks) {
          if (tasks[i].requestId === action.meta.requestId) {
            tasks.splice(parseInt(i), 1);
            break;
          }
        }
      })
      .addCase(modifyTodo.pending, (state, action) => {
        const { databaseId, deleteThis, newStatus } = action.meta.arg;
        const tasks = state.tasks;
        for (const i in tasks) {
          if (tasks[i].databaseId === databaseId) {
            if (deleteThis) {
              tasks[i].isDeleted = true;
            }
            if (typeof newStatus === "boolean") {
              tasks[i].status = newStatus;
            }
            break;
          }
        }
      })
      .addCase(modifyTodo.fulfilled, (state, action) => {
        const { databaseId, deleteThis } = action.meta.arg;
        const tasks = state.tasks;
        for (const i in tasks) {
          if (tasks[i].databaseId === databaseId) {
            if (deleteThis) {
              tasks.splice(parseInt(i), 1);
            }
            break;
          }
        }
      })
      .addCase(modifyTodo.rejected, (state, action) => {
        const { databaseId, deleteThis, newStatus } = action.meta.arg;
        const tasks = state.tasks;
        for (const i in tasks) {
          if (tasks[i].databaseId === databaseId) {
            if (deleteThis) {
              tasks[i].isDeleted = false;
            }
            if (typeof newStatus === "boolean") {
              tasks[i].status = !newStatus;
            }
            break;
          }
        }
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTodos.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      });
  },
});


export const tasksReducer = tasksSlice.reducer;
export const { setTodos, clearTodos } = tasksSlice.actions;
