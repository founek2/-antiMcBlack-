import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import  Login from "./components/login";
import  Main from "./components/main";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import 'typeface-roboto'

class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <BrowserRouter>
        <Switch>
          <Route path='/' exact component={Login} />
          <Route path='/main' component={Main} />
          </Switch>
        </BrowserRouter>
      </MuiThemeProvider>
    );
  }
}

export default App;
