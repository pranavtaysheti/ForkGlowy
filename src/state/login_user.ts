import { createSlice, type  PayloadAction } from "@reduxjs/toolkit";
import { manageUser } from "../thunk/manage_user";
import { UserCredential, type User } from "firebase/auth";
import { type FirebaseError } from "firebase/app";

export enum LoginType {
  Undefined = "UNDEFINED",
  Login = "LOGIN",
  Register = "REGISTER",
  Logout = "LOGOUT",
};


export type LoginUser = {
  user: User | null;
  userCredential: UserCredential | null;
  error: Error | FirebaseError | null;
  loading: boolean;
}

const loginUserInitialState: LoginUser = {
  error: null,
  user: null,
  userCredential: null,
  loading: false
}

const loginUserSlice = createSlice({
  name: "loginUser",
  initialState: loginUserInitialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
        state.user = action.payload
    },
  },
  extraReducers: (builder) => { builder
    .addCase(manageUser.pending, (state) => {
      state.loading = true
    })
    .addCase(manageUser.rejected, (state,action) => {
      state.loading = false
      state.error = action.payload ? action.payload : null
    })
    .addCase(manageUser.fulfilled, (state, action) => {
      state.loading = false
      state.error = null
      state.userCredential = action.payload;
    })
  }
})


export const loginUserReducer = loginUserSlice.reducer
export const { setUser } = loginUserSlice.actions
