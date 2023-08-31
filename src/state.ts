import { type TypedStartListening, type TypedAddListener, configureStore, createListenerMiddleware, addListener } from "@reduxjs/toolkit";
import { tasksReducer } from "./state/tasks";
import { tasksVisiblityReducer } from "./state/tasks_visiblity";
import { loginUserReducer } from "./state/login_user";
import { loginDataReducer } from "./state/login_data";
import { useDispatch } from "react-redux";

const listenerMiddleware = createListenerMiddleware()

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
  }).prepend(listenerMiddleware.middleware)
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch: () => AppDispatch = useDispatch;
export type AppStartListening = TypedStartListening<RootState, AppDispatch>;
export const startAppListening = listenerMiddleware.startListening as AppStartListening;
export const addAppListener = addListener as TypedAddListener<RootState, AppDispatch>;

