import { createAsyncThunk } from "@reduxjs/toolkit";
import { type AppDispatch, type RootState } from "../state";
import { database } from "../firebase";
import { ref, update, remove } from "firebase/database";
import { FirebaseError } from "firebase/app";

type ModifyTodoArgs = {
  databaseId: string;
  newStatus?: boolean;
  newTaskText?: string;
  deleteThis?: boolean;
};

export const modifyTodo = createAsyncThunk<
  void,
  ModifyTodoArgs,
  {
    state: RootState
    dispatch: AppDispatch,
    serializedErrorType: FirebaseError
  }
>(
  "tasks/modifyTodo",
  async (actionData, thunkAPI) => {
    const { databaseId, newStatus, newTaskText, deleteThis } = actionData;
    const state = thunkAPI.getState();
    const user = state.loginUser.user;
    const task = state.tasks.tasks.find((task) => task.databaseId === databaseId)

    if (!user || !task) {
      console.log("REJECTED LOL!")
      return thunkAPI.rejectWithValue(new Error("User or Task not found"))
    }

    const uid = user.uid;
    const taskRef = ref(database, "users/" + uid + "/" + databaseId);
    if (newStatus) {
      return update(taskRef, { status: newStatus });
    }
    if (newTaskText) {
      return update(taskRef, { taskText: newTaskText })
    }
    if (deleteThis) {
      return remove(taskRef);
    }
  },
);