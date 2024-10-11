import React from 'react'
import './scss/styles.scss'
import TodoDiv from './presentation/todo'
import { Redirect, Route, Switch } from 'wouter'
import LoginForm from './presentation/login'
import { Provider } from 'react-redux'
import { store } from './state'

//Import bootstrap icons
import "bootstrap-icons/font/bootstrap-icons.min.css"

//Import listeners 
import "./observers/firebase_auth"
import "./listeners/login"

export default () => {
  <React.StrictMode>
    <Switch>
      <Provider store={store}>
        <div className={"d-flex justify-content-center"} >
          <div className={"container-lg"} >
            <Route path="/login">
              <LoginForm />
            </Route>
            <Route path="/app">
              <TodoDiv />
            </Route>
            <Route path="/">
              <Redirect to='/login' />
            </Route>
          </div>
        </div>
      </Provider>
    </Switch>
  </React.StrictMode>
}
