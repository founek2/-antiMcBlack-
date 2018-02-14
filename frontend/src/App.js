import React, { Component } from 'react';
import Login from "./components/login";
import Main from "./components/main";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import 'typeface-roboto'
import { logIn, logOut } from './api';
import { path } from 'ramda';

class App extends Component {
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
      }
    } else {
      this.state = {
        logged: false,
      }
    }
  }


  _handleLogin = (userName, passwd) => {
    this.setState({ logInProggres: true })
    logIn(userName, passwd)
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
    sessionStorage.removeItem('cid');
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
      </MuiThemeProvider>
    );
  }
}

export default App;
