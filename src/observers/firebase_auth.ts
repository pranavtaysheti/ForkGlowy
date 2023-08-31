import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../firebase"
import { store } from "../state"
import { setUser } from "../state/login_user"

export const unsubscribe_auth = onAuthStateChanged(
  auth, (user) => {
    store.dispatch(setUser(user))
  }
)