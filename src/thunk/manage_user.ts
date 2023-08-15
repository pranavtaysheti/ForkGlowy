import { createAsyncThunk } from "@reduxjs/toolkit";
import { LoginType, setUser } from "../state/login_user";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  UserCredential,
} from "firebase/auth";
import { auth } from "../firebase";
import { type AppDispatch, type RootState } from "../state";
import { fetchTodos } from "./fetch_todos";

export const manageUser = createAsyncThunk<
  UserCredential | null,
  LoginType,
  {
    dispatch: AppDispatch,
    state: RootState,
    rejectValue: Error
  }
  >(
  "loginUser/manageUser",
  async (loginType, thunkAPI) => {
    const state = thunkAPI.getState();
    const { username, password }= state.loginData;
    let user = null;
    try {
      switch (loginType) {
        case LoginType.Login:
          user = await signInWithEmailAndPassword(auth, username, password);
          break;
        case LoginType.Register:
          user = await createUserWithEmailAndPassword(auth, username, password);
          break;
        case LoginType.Logout:
          await signOut(auth);
          user = null;
          break;
        default:
          return thunkAPI.rejectWithValue(new Error("Unrecognized LoginType"))
      }
      thunkAPI.dispatch(setUser(user ? user.user : null))
      try {
        thunkAPI.dispatch(fetchTodos())
      } catch (e) {
        return thunkAPI.rejectWithValue(e as Error)
      }
      return thunkAPI.fulfillWithValue(user)

    } catch (e) {
      return thunkAPI.rejectWithValue(e as Error)
  }
});
