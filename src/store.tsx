import { configureStore } from "@reduxjs/toolkit";
import {
  tasksReducer,
  type DatabaseTasks,
  setTodos,
  clearTodos,
  tasksVisiblityReducer,
} from "./tasks";
import { loginReducer, setUser } from "./login";
import { onAuthStateChanged } from "firebase/auth";
import { auth, database } from "./firebase";
import { get, child, ref } from "firebase/database";

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    login: loginReducer,
    tasksVisiblity: tasksVisiblityReducer,
  },
});

export function fetchTasks() {
  const uid = store.getState().login.user?.uid;
  if (!uid) {
    return 0;
  }

  const dbRef = ref(database);
  get(child(dbRef, "users/" + uid)).then((snapshot) => {
    if (snapshot.exists()) {
      const tasks = snapshot.val() as DatabaseTasks;

      store.dispatch(setTodos(tasks));
    } else {
      store.dispatch(clearTodos());
    }
  });
}
// Attach login listener //Not sure if this is right way 
//this method causes flicker between login and tasks page on startup
//would be better if handled in redux
onAuthStateChanged(auth, (user) => {
  store.dispatch(setUser(user));
  fetchTasks();
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
