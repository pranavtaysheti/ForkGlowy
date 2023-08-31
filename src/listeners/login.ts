import { startAppListening } from "../state";
import { fetchTodos } from "../thunk/fetch_todos";

export const unsubscribe_login = startAppListening({
    type: "loginUser/setUser",
    effect: async (_action, listenerApi) => {
      console.log("IN LISTENER...")
      listenerApi.dispatch(fetchTodos())
    }
});