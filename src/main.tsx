import React  from 'react'
import ReactDOM from 'react-dom/client'
import wallpaper from './assets/default-wallpaper.jpg'
import '../scss/styles.scss'
import TodoDiv from './presentation/todo'
import { Route, Switch } from 'wouter'
import LoginForm from './presentation/login'
import { Provider } from 'react-redux'
import { store } from './store'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <img src={wallpaper} className={"position-absolute z-n1 w-100 h-100"}/>
    <header className={"text-center bg-black text-white bold"}>
      <h1> ForkGlowy </h1>
      <p> Created by <a href={"https://pranavtaysheti.notion.site/"}> Pranav Taysheti </a> </p>
    </header>
    <Switch>
      <Provider store={store}>
        <div className={"d-flex justify-content-center"} >
            <Route path="/login">
              <LoginForm />
            </Route>
            <Route path="/">
              <TodoDiv />
            </Route>
        </div>
      </Provider>
    </Switch>
  </React.StrictMode>
)
