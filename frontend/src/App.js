import React, { Component } from 'react';
import Login from "./components/login";
import Main from "./components/main";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import 'typeface-roboto'
import { logIn, getAbsence, rightsAbsence } from './api';
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
      this._lazyLoadContent()
    } else {
      this.state = {
        logged: false,
      }
    }
  }

  _lazyLoadContent = async () => {
    await rightsAbsence(this.state.cid);
    const absenceResp = await getAbsence(this.state.cid, 2, 1);
    const absenceResp2 = await getAbsence(this.state.cid, 2, 2);

    this.setState({absenceResponse: deepmerge( absenceResp, absenceResp2)})

  }
  handleLogin = async (userName, passwd) => {
    const result = await logIn(userName, passwd);
    console.log(result)
    if (path(['login'], result) === 'success') {
      this.setState({ logged: true, cid: path(['cid'], result) });
      sessionStorage.setItem('cid', path(['cid'], result));
    } else {
      this.setState({ logged: false });
    }
  }

  _renderContent = () =>
    this.state.logged ? <Main absenceResponse={this.state.absenceResponse}/> : <Login handleLogin={this.handleLogin} />;

  render() {

    return (
      <MuiThemeProvider>
        {this._renderContent()}
      </MuiThemeProvider>
    );
  }
}

export default App;
