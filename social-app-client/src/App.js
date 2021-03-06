import React from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import "./App.css"
import jwtDecode from "jwt-decode"
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles"
import createMuiTheme from "@material-ui/core/styles/createMuiTheme"
import axios from "axios"
//REDUX
import { Provider } from "react-redux"
import store from "./redux/store"
import { SET_AUTHENTICATED } from "./redux/types"
import { logoutUser, getUserData } from "./redux/actions/userActions"
//components
import Navbar from "./components/layout/Navbar"
import AuthRoute from "./util/AuthRoute"
//pages
import Home from "./pages/home"
import Login from "./pages/login"
import Signup from "./pages/signup"
import User from "./pages/user"

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#33c9dc",
      main: "#00bcd4",
      dark: "#008394",
      contrastText: "#fff"
    },
    secondary: {
      light: "#ff6333",
      main: "#ff3900",
      dark: "#008394",
      contrastText: "#fff"
    }
  },
  typography: {
    useNextVariants: true
  }
})

const token = localStorage.FBIdToken
if (token) {
  const decodedToken = jwtDecode(token)
  if (decodedToken.exp * 1000 < Date.now()) {
    store.dispatch(logoutUser())
    window.location.href = "/login"
  } else {
    store.dispatch({ type: SET_AUTHENTICATED })
    axios.defaults.headers.common["Authorization"] = token
    store.dispatch(getUserData())
  }
}

axios.defaults.baseURL =
  "https://us-central1-social-media-app-73241.cloudfunctions.net/api"

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <Provider store={store}>
        <Router>
          <Navbar />
          <div className='container'>
            <Switch>
              <Route exact path='/' component={Home} />
              <AuthRoute exact path='/login' component={Login} />
              <AuthRoute exact path='/signup' component={Signup} />
              <Route exact path='/users/:handle' component={User} />
              <Route
                exact
                path='/users/:handle/scream/:screamId'
                component={User}
              />
            </Switch>
          </div>
        </Router>
      </Provider>
    </MuiThemeProvider>
  )
}

export default App
