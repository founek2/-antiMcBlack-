import React, { Component } from 'react';
import Login from "./components/login";
import Main from "./components/main";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Snackbar from 'material-ui/Snackbar';
import 'typeface-roboto'
import ApiHandler from './api';
import { path } from 'ramda';

class App extends Component {
  _apiErrorCallback = (e) => {
    this.setState({ errorState: { fetchError: e.message, fetchErrorMsg: 'Bez připojení k internetu', errorOpen: true } })
  }
  _closeError = () => {
    this.setState({ errorState: { errorOpen: false }});
  }
  constructor(props) {
    super(props);

    const cid = sessionStorage.getItem('cid');
    const userName = sessionStorage.getItem('userName');
    const loginMessage = sessionStorage.getItem('loginMessage');
    if (cid) {
      this.state = {
        logged: true,
        cid: cid,
        userName,
        loginMessage,
        errorState: {

        }
      }
    } else {
      this.state = {
        logged: false,
        errorState: {

        }
      }
    }
    this.apiHandler = new ApiHandler(this._apiErrorCallback);
  }


  _handleLogin = (userName, passwd) => {
    this.setState({ logInProggres: true })
    this.apiHandler.logIn(userName, passwd)
      .then((result) => {
        console.log(result)
        if (path(['login'], result) === 'success') {
          this.setState({ logged: true, cid: path(['cid'], result), userName: userName, loginMessage: path(['message'], result), logError: '' });
          sessionStorage.setItem('cid', path(['cid'], result), );
          sessionStorage.setItem('userName', userName);
          sessionStorage.setItem('loginMessage', path(['message'], result));
        } else if (path(['login'], result) === 'denied') {
          this.setState({ logged: false, logError: 'Špatné jméno nebo heslo' });
        }
        this.setState({ logInProggres: false })
      })

  }
  _handleLogOut = () => {
    this.setState({
      logged: false,
      cid: undefined,
    })
    sessionStorage.clear();
    logOut(this.state.cid);
  }
  _renderContent = () =>
    this.state.logged ?
      <Main
        absenceResponse={this.state.absenceResponse}
        classificationResponse={this.state.classificationResponse}
        handleLogOut={this._handleLogOut}
        cid={this.state.cid}
        userName={this.state.userName}
        class={this.state.loginMessage.split(' ')[2]}
      /> :
      <Login handleLogin={this._handleLogin} logInProggres={this.state.logInProggres} logError={this.state.logError} />;

  render() {

    return (
      <MuiThemeProvider>
        {this._renderContent()}
        <Snackbar
          open={this.state.errorState.errorOpen}
          message={this.state.errorState.fetchErrorMsg}
          autoHideDuration={3000}
          action='Zavřít'
          onActionClick={this._closeError}
        />
      </MuiThemeProvider>
    );
  }
}

export default App;
