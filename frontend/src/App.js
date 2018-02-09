import React, { Component } from 'react';
import { BrowserRouter, Route } from "react-router-dom";
import  Login from "./components/login";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import 'typeface-roboto'

class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <BrowserRouter>
          <Route path='/' component={Login} />
        </BrowserRouter>
      </MuiThemeProvider>
    );
  }
}

export default App;
