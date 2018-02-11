import React, { Component } from 'react';
import  Login from "./components/login";
import  Main from "./components/main";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import 'typeface-roboto'
import { logIn } from './api';
import {path} from 'ramda';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      logged: false,
    }
  }
  handleLogin = async (userName, passwd) => {
    const result = await logIn(userName, passwd);
    console.log(result)
    path(['login'], result) === 'success' ? this.setState({logged: true}) : this.setState({logged: false});
  }

  _renderContent = () => 
    this.state.logged ? <Main /> : <Login handleLogin={this.handleLogin} />;
  
  render() {

    return (
      <MuiThemeProvider>
        {this._renderContent()}
      </MuiThemeProvider>
    );
  }
}

export default App;
