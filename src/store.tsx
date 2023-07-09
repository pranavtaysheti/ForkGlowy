import { configureStore } from '@reduxjs/toolkit'
import { tasksReducer } from './tasks';
import { loginInfoReducer, loginReducer } from './login';

export const store = configureStore({
  reducer: { tasks: tasksReducer, login: loginReducer, loginInfo: loginInfoReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;