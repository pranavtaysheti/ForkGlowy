import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { AuthError, UserCredential } from "firebase/auth"

export enum LoginType {
  Login = "LOGIN",
  Register = "REGISTER",
};

type LoginInfo = {
  username: string | undefined,
  password: string | undefined
}

const loginInfoInitialState: LoginInfo = {
  username: undefined,
  password: undefined
}

const loginInfoSlice = createSlice({
  name: "loginInfo",
  initialState: loginInfoInitialState,
  reducers: {
    setUsername(state, action: PayloadAction<string>) {
      state.username = action.payload
      console.log(state.username)
    },
    setPassword(state, action: PayloadAction<string>) {
      state.password = action.payload
      console.log(state.password)
    }
  }
})

export type LoginPayload = {
  user: UserCredential | undefined
  error: AuthError | undefined
}

enum LoginStatus {
  Loading = "LOADING",
  LoggedIn = "LOGGED_IN",
  LoggedOut = "LOGGED_OUT",
}

const loginInitialState: LoginPayload = {
  error: undefined,
  user: undefined
}

const loginSlice = createSlice({
  name: "login",
  initialState: loginInitialState,
  reducers: {
    login: (_state, action: PayloadAction<LoginPayload>) => {
        return action.payload
    },
    logout: (_state) => {
        return loginInitialState
    },
  },
  
})

export const loginInfoReducer = loginInfoSlice.reducer
export const { setUsername, setPassword } = loginInfoSlice.actions

export const loginReducer = loginSlice.reducer
export const { login, logout } = loginSlice.actions
