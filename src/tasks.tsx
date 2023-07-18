import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { push, ref, remove, set, update } from "firebase/database";
import { database } from "./firebase";
import type { RootState } from "./store";
import { nanoid } from "nanoid";

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
  requestId: string;
  status?: boolean;
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
        return set(newTaskRef, { status, taskText }).then(() =>
          thunkAPI.fulfillWithValue(newTaskRef.key)
        );
      }
    }
  }
);

type ModifyTodoArgs = {
  databaseId: string;
  newStatus?: boolean;
  newTaskText?: string;
  deleteThis?: boolean;
};
export const modifyTodo = createAsyncThunk(
  "tasks/modifyTodo",
  async (actionData: ModifyTodoArgs, thunkAPI) => {
    const { databaseId, newStatus, newTaskText, deleteThis } = actionData;
    const state = thunkAPI.getState() as RootState;
    const user = state.login.user;

    if (user) {
      const uid = user.uid;
      const taskRef = ref(database, "users/" + uid + "/" + databaseId);
      if (newStatus) {
        return update(taskRef, { status: newStatus });
      }
      if (newTaskText) {
        // return update(taskRef, {taskText: newTaskText})
        // TODO: Impliment redux listeners
      }
      if (deleteThis) {
        return remove(taskRef);
      }
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
    clearTodos: (state) => state.splice(0),
  },
  extraReducers: (builder) =>
    builder
      .addCase(addTodo.pending, (state, action) => {
        const { status, taskText } = action.meta.arg;
        state.push({
          syncStatus: SyncStatus.Syncing,
          taskText,
          status,
          isDeleted: false,
          requestId: action.meta.requestId,
          databaseId: nanoid(),
        });
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        for (const i in state) {
          if (state[i].requestId === action.meta.requestId) {
            state[i].syncStatus = SyncStatus.Synced;
            state[i].databaseId = action.payload as string;
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
      .addCase(modifyTodo.pending, (state, action) => {
        const { databaseId, deleteThis, newStatus } = action.meta.arg;
        for (const i in state) {
          if (state[i].databaseId === databaseId) {
            if (deleteThis) {
              state[i].isDeleted = true;
            }
            if (typeof newStatus === "boolean") {
              state[i].status = newStatus;
            }
            break;
          }
        }
      })
      .addCase(modifyTodo.fulfilled, (state, action) => {
        const { databaseId, deleteThis } = action.meta.arg;
        for (const i in state) {
          if (state[i].databaseId === databaseId) {
            if (deleteThis) {
              state.splice(parseInt(i), 1);
            }
            break;
          }
        }
      })
      .addCase(modifyTodo.rejected, (state, action) => {
        const { databaseId, deleteThis, newStatus } = action.meta.arg;
        for (const i in state) {
          if (state[i].databaseId === databaseId) {
            if (deleteThis) {
              state[i].isDeleted = false;
            }
            if (typeof newStatus === "boolean") {
              state[i].status = !newStatus;
            }
            break;
          }
        }
      }),
});

type TasksVisiblity = {
  showCompleted: boolean
}
const tasksVisiblityInitial = {
  showCompleted: false
}
const tasksVisiblitySlice = createSlice({
  name: "tasksVisiblity",
  initialState: tasksVisiblityInitial,
  reducers: {
    setVisiblity: (state, action: PayloadAction<TasksVisiblity>) => {
      state.showCompleted = action.payload.showCompleted
    }
  }
}

)

export const tasksVisiblityReducer = tasksVisiblitySlice.reducer
export const tasksReducer = tasksSlice.reducer;

export const { setTodos, clearTodos } = tasksSlice.actions;
export const { setVisiblity } = tasksVisiblitySlice.actions;
