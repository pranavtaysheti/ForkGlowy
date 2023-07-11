import { child, get, ref, set } from "firebase/database";
import { store } from "./store";
import { database } from "./firebase";
import { FirebaseError } from "firebase/app";
import { DatabaseTasks, setTodos, clearTodos } from "./tasks";

export function uploadTasks() {
  const tasks = store.getState().tasks
  const uid = store.getState().login.user?.uid
  if (!uid) { return 0 }

  for (const i in tasks) {
    set(ref(database, 'users/'+uid+'/'+tasks[i].id), {
      status: tasks[i].status,
      taskText: tasks[i].taskText,
    })
    .then(() => console.log("UPLOAD SUCCESSFUL!!!"))
    .catch((error: FirebaseError) => console.log(error))
  }
}

export function fetchTasks() {
  const uid = store.getState().login.user?.uid
  if (!uid) { return 0 }

  const dbRef = ref(database)
  get(child(dbRef, 'users/'+uid)).then((snapshot) => {
    if (snapshot.exists()) {
      store.dispatch(clearTodos())
      const tasks = snapshot.val() as DatabaseTasks

      store.dispatch(setTodos(tasks))

    } else {
      store.dispatch(clearTodos())
    }
  })
}