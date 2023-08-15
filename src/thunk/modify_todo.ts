import { createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "../state";
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