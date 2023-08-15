import { configureStore } from "@reduxjs/toolkit";
import { tasksReducer } from "./state/tasks";
import { tasksVisiblityReducer } from "./state/tasks_visiblity";
import { loginUserReducer } from "./state/login_user";
import { loginDataReducer } from "./state/login_data";

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    loginUser: loginUserReducer,
    loginData: loginDataReducer,
    tasksVisiblity: tasksVisiblityReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: ["loginUser/manageUser/fulfilled", "loginUser/setUser"],
      ignoredPaths: ["loginUser.user", "loginUser.userCredential"],
    }
  })
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
