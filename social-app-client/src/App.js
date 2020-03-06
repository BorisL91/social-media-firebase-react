import React from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import "./App.css"
import jwtDecode from "jwt-decode"
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles"
import createMuiTheme from "@material-ui/core/styles/createMuiTheme"
//REDUX
import { Provider } from "react-redux"
import store from "./redux/store"
//components
import Navbar from "./components/Navbar"
import AuthRoute from "./util/AuthRoute"
//pages
import Home from "./pages/home"
import Login from "./pages/login"
import Signup from "./pages/signup"

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

let authenticated
const token = localStorage.FBIdToken
if (token) {
  const decodedToken = jwtDecode(token)
  if (decodedToken.exp * 1000 < Date.now()) {
    window.location.href = "/login"
    authenticated = false
  } else {
    authenticated = true
  }
}

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <Provider store={store}>
        <Router>
          <Navbar />
          <div className='container'>
            <Switch>
              <Route exact path='/' component={Home} />
              <AuthRoute
                exact
                path='/login'
                component={Login}
                authenticated={authenticated}
              />
              <AuthRoute
                exact
                path='/signup'
                component={Signup}
                authenticated={authenticated}
              />
            </Switch>
          </div>
        </Router>
      </Provider>
    </MuiThemeProvider>
  )
}

export default App
