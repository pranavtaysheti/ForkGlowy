import { createAsyncThunk } from "@reduxjs/toolkit";
import { LoginType } from "../state/login_user";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  type UserCredential,
} from "firebase/auth";
import { auth } from "../firebase";
import { type AppDispatch, type RootState } from "../state";

export const manageUser = createAsyncThunk<
  UserCredential | void,
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
    const { username, password } = state.loginData;
    let user;
    try {
      switch (loginType) {
        case LoginType.Login:
          user = await signInWithEmailAndPassword(auth, username, password);
          break;
        case LoginType.Register:
          user = await createUserWithEmailAndPassword(auth, username, password);
          break;
        case LoginType.Logout:
          user = await signOut(auth);
          break;
        default:
          return thunkAPI.rejectWithValue(new Error("Unrecognized LoginType"))
      }
      return thunkAPI.fulfillWithValue(user);

    } catch (e) {
      return thunkAPI.rejectWithValue(e as Error)
    }
  });
