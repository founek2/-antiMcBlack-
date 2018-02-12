import React, { Component } from 'react';
import Login from "./components/login";
import Main from "./components/main";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import 'typeface-roboto'
import { logIn, getAbsence, rightsAbsence, rightsClassification, getClassification } from './api';
import { path, mergeDeepWith, concat } from 'ramda';
import deepmerge from 'deepmerge';

class App extends Component {
  constructor(props) {
    super(props);

    const cid = sessionStorage.getItem('cid');
    if (cid) {
      this.state = {
        logged: true,
        cid: cid,
      }
    } else {
      this.state = {
        logged: false,
      }
    }
  }

  
  _handleLogin = async (userName, passwd) => {
    const result = await logIn(userName, passwd);
    console.log(result)
    if (path(['login'], result) === 'success') {
      this.setState({ logged: true, cid: path(['cid'], result) });
      sessionStorage.setItem('cid', path(['cid'], result));
      this._lazyLoadContent();
    } else {
      this.setState({ logged: false });
    }
  }
  _handleLogOut = () => {
    this.setState({
      logged: false,
      cid: undefined,
    })
    sessionStorage.removeItem('cid')
  }
  _renderContent = () =>
    this.state.logged ? 
      <Main
         absenceResponse={this.state.absenceResponse} 
         classificationResponse={this.state.classificationResponse}
        handleLogOut={this._handleLogOut}
        cid={this.state.cid}
      /> :
       <Login handleLogin={this._handleLogin} />;

  render() {

    return (
      <MuiThemeProvider>
        {this._renderContent()}
      </MuiThemeProvider>
    );
  }
}

export default App;
