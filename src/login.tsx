import { createSlice } from "@reduxjs/toolkit"
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
}

const loginInitialState: LoginPayload = {
  error: undefined,
  user: null
}

const loginSlice = createSlice({
  name: "login",
  initialState: loginInitialState,
  reducers: {
    login: {
      reducer: (state, action: PayloadAction<FirebaseError | undefined>) => {
        state.error = action.payload
      },
      prepare: (email: string, password: string, loginType: LoginType) => {
        let result: FirebaseError | undefined = undefined
        switch (loginType) {
          case LoginType.Login:
            signInWithEmailAndPassword(auth, email, password)
            .catch((error: FirebaseError) => result = error)
            break;
          case LoginType.Register:
            createUserWithEmailAndPassword(auth, email, password)
            .catch((error: FirebaseError) => result = error)
            break;
        }
        return { payload: result }
      }
    },
    logout: {
      reducer: (state, action: PayloadAction<FirebaseError | undefined>) => {
        state.error = action.payload
      },
      prepare: () => {
        let result: FirebaseError | undefined = undefined
        signOut(auth)
        .catch((error: FirebaseError) => (result = error))
        return ({payload: result})
      }
    },
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
})

export const loginReducer = loginSlice.reducer
export const { login, logout, setUser } = loginSlice.actions
