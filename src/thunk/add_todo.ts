import { createAsyncThunk } from "@reduxjs/toolkit";
import { Task } from "../state/tasks";
import { type RootState } from "../state";
import { ref, push, set } from "firebase/database";
import { database } from "../firebase";
import { type FirebaseError } from "firebase/app";

export const addTodo = createAsyncThunk<
  null,
  Task,
  {
    state: RootState;
    rejectValue: Error;
    fulfilledMeta: {
      key: string;
    };
  }
>("tasks/addTodo", async function (task, thunkAPI) {
  const state = thunkAPI.getState();
  const { status, taskText } = task;
  const user = state.loginUser.user;
  if (!user) {
    return thunkAPI.rejectWithValue(Error("User not logged in"));
  }
  const uid = user.uid;
  const userTasksRef = ref(database, "users/" + uid);
  const newTaskRef = push(userTasksRef);
  const taskRefKey = newTaskRef.key;
  if (!taskRefKey) {
    return thunkAPI.rejectWithValue(Error("Error generating new key"));
  }
  try {
    await set(newTaskRef, { status, taskText });
    return thunkAPI.fulfillWithValue(null, {
      key: taskRefKey,
    });
  } catch (err) {
    return thunkAPI.rejectWithValue(err as FirebaseError);
  }
});