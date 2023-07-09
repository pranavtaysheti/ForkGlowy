import { store } from "./store";
import type { AuthError } from "firebase/auth";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { app } from "./firebase";
import { LoginType, LoginPayload, login } from "./login";

export function loginUser(loginType: LoginType) {
  const { username: email, password } = store.getState().loginInfo
  console.log("In login user")
  if (!email || !password) {
    console.log("Missing login info")
    return 0;
  }

  const auth = getAuth(app)
  console.log("GOT AUTH SUCCESSFULLY")
  let result: LoginPayload = { user: undefined, error: undefined}

  switch (loginType) {
    case LoginType.Login:
      console.log("IN LOGIN BLOCK")
      signInWithEmailAndPassword(auth, email, password)
      .then((user) => {result.user = user; console.log(user.user.email)})
      .catch((error: AuthError) => {result.error = error; console.log(error)});
      console.log("EXITTING LOGIN BLOCK")
      break;
    case LoginType.Register:
      createUserWithEmailAndPassword(auth, email, password)
      .then((user) => (result.user = user))
      .catch((error: AuthError) => (result.error = error));
      break;
  }
  login(result)
}