import { AppDispatch, RootState } from "../state";
import { database } from "../firebase";
import { ref, child, get } from "firebase/database";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { FirebaseError } from "firebase/app";
import { setTodos } from "../state/tasks";

export const fetchTodos = createAsyncThunk<
  null,
  undefined,
  {
    state: RootState,
    dispatch: AppDispatch;
    serializedErrorType: FirebaseError
    rejectValue: Error
  }
>(
  "tasks/fetchTodos",
  async (_,thunkAPI) => {
    const state = thunkAPI.getState()
    const user = state.loginUser.user
    if (!user) {
        return thunkAPI.rejectWithValue(new Error("User not found in state."))      
    }
    const uid = user.uid
    const dbRef = ref(database);
    try {
      const snapshot = await get(child(dbRef, "users/" + uid))
      const tasks = snapshot.val()
      thunkAPI.dispatch(setTodos(tasks))
      return thunkAPI.fulfillWithValue(null)
    } catch (e) {
      return thunkAPI.rejectWithValue(e as FirebaseError)
    }
  }
);