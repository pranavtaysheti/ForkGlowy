import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type LoginData = {
  username: string;
  password: string;
}

const initialLoginData: LoginData = {
  username: "",
  password: "",
}

const loginDataSlice = createSlice({
  name: "loginData",
  initialState: initialLoginData,
  reducers: {
    setEmail: (state, action: PayloadAction<string>) => {
      state.username = action.payload
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload
    }
  }
})

export const loginDataReducer = loginDataSlice.reducer
export const { setEmail, setPassword }  = loginDataSlice.actions