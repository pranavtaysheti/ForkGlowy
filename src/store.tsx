import { configureStore } from '@reduxjs/toolkit'
import { tasksReducer } from './tasks';
import { loginReducer, setUser } from './login';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

export const store = configureStore({
  reducer: { tasks: tasksReducer, login: loginReducer },
});

// Attach login listener
onAuthStateChanged(auth, (user) => {
  store.dispatch(setUser(user))
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;