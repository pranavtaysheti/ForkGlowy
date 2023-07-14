import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, type User } from "firebase/auth"
import { FirebaseError } from "firebase/app"
import { auth } from "./firebase"

export enum LoginType {
  Login = "LOGIN",
  Register = "REGISTER",
};


export type LoginPayload = {
  user: User | null
  error: FirebaseError | undefined
  loading: boolean
}

const loginInitialState: LoginPayload = {
  error: undefined,
  user: null,
  loading: false
}

export type LoginData = {
  email: string;
  password: string;
  loginType: LoginType;
}
export const login = createAsyncThunk(
  "login/loginUser",
  async (loginData: LoginData) => {

    const { email, password, loginType} = loginData

    switch (loginType) {
      case LoginType.Login:
        return signInWithEmailAndPassword(auth, email, password)
      case LoginType.Register:
        return createUserWithEmailAndPassword(auth, email, password)
    }
  }
)

export const logout = createAsyncThunk(
  "login/logoutUser",
  async () => {
    return signOut(auth)
  }
)

const loginSlice = createSlice({
  name: "login",
  initialState: loginInitialState,
  reducers: {
    setUser: {
      reducer: (state, action: PayloadAction<User | null>) => {
        state.user = action.payload
      },
      prepare: (action: User | null) => {
        let result = action
        if (action) {
          result = result?.toJSON() as User
        }
        return {payload: result}
      }
    }
  },
  extraReducers: (builder) => builder
    .addCase(login.pending, (state) => {
      state.loading = true
    })
    .addCase(login.rejected, (state,action) => {
      state.loading = false
      state.error = action.error as FirebaseError
    })
    .addCase(login.fulfilled, (state) => {
      state.loading = false
      state.error = undefined
    })
    .addCase(logout.fulfilled, (state) => {
      state.loading = false
      state.error = undefined
    })
    .addCase(logout.pending, (state) => {
      state.loading = true
    })
    .addCase(logout.rejected, (state, action) => {
      state.loading = false
      state.error = action.error as FirebaseError
    })

})

export const loginReducer = loginSlice.reducer
export const { setUser } = loginSlice.actions
