//Import Bootstrap CSS
import './scss/styles.scss'

//Import bootstrap icons
import "bootstrap-icons/font/bootstrap-icons.min.css"

//Import libraries
import { Provider } from 'react-redux'
import { Redirect, Route, Switch } from 'wouter'

//Import State Tools
import { store } from './state'

//Import listeners 
import "./observers/firebase_auth"
import "./listeners/login"

//Import Pages
import TodoDiv from './presentation/todo'
import LoginForm from './presentation/login'


export default function App() {
  return (
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
  )
}
