import React, { Component } from "react";
import Login from "./components/login";
import Main from "./components/main";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Snackbar from "material-ui/Snackbar";
import "typeface-roboto";
import ApiHandler from "./api";
import { path, assoc } from "ramda";
import mobileCheck from "./utils/mobilecheck";
import appDefaultState from "./constants/appDefaultState";

const getStorage = () => (mobileCheck() ? localStorage : sessionStorage);

class App extends Component {
      constructor(props) {
            super(props);
            const cid = getStorage().getItem("cid");
            const userName = getStorage().getItem("userName");
            const loginMessage = getStorage().getItem("loginMessage");

            this.state = appDefaultState(cid, userName, loginMessage);
            this.apiHandler = new ApiHandler(this._apiErrorCallback);
      }

      _handleLogin = (userName, passwd) => {
            this.setState({ logInProggres: true });
            this.apiHandler.logIn(userName, passwd).then(result => {
                  if (path(["login"], result) === "success") {
                        const newErrorState = this.state.errorState;
                        newErrorState.duration = 3000;
                        newErrorState.errorOpen = false;

                        this.setState({
                              logged: true,
                              cid: path(["cid"], result),
                              userName: userName,
                              loginMessage: path(["message"], result),
                              logError: "",
                              errorState: newErrorState,
                        });
                        getStorage().setItem("cid", path(["cid"], result));
                        getStorage().setItem("userName", userName);
                        getStorage().setItem("loginMessage", path(["message"], result));
                  } else if (path(["login"], result) === "denied") {
                        this.setState({ logged: false, logError: "Špatné jméno nebo heslo" });
                  }
                  this.setState({ logInProggres: false });
            });
      };

      _handleLogOut = () => {
            this.setState({
                  logged: false,
                  cid: undefined
            });
            getStorage().clear();
            this.apiHandler.logOut(this.state.cid);
      };

      _apiErrorCallback = e => {
            let duration = 3000;
            if (e.message === "Černoch zablokoval náš server :'(") duration = 999999;
            this.setState({
                  errorState: {
                        fetchErrorMsg: e.message,
                        errorOpen: true,
                        autoHideDuration: duration
                  }
            });
      };

      _closeError = () => {
            const errorState = this.state.errorState;
            const newErrorState = assoc("errorOpen", false, errorState)
            this.setState({ errorState: newErrorState });
      };

      _renderContent = () =>
            this.state.logged ? (
                  <Main
                        absenceResponse={this.state.absenceResponse}
                        classificationResponse={this.state.classificationResponse}
                        handleLogOut={this._handleLogOut}
                        cid={this.state.cid}
                        userName={this.state.userName}
                        class={this.state.loginMessage ? this.state.loginMessage.split(" ")[2] : ""}
                        handleError={this._apiErrorCallback}
                  />
            ) : (
                  <Login
                        handleLogin={this._handleLogin}
                        logInProggres={this.state.logInProggres}
                        logError={this.state.logError}
                  />
            );
            _checkSnackbarCloseOpt = (event) =>{
                  //ignoring clickAway await
                  if(event === "timeout") this._closeError();
            }
      render() {
            return (
                  <MuiThemeProvider>
                        <div>
                              {this._renderContent()}
                              <Snackbar
                                    open={this.state.errorState.errorOpen}
                                    message={this.state.errorState.fetchErrorMsg}
                                    autoHideDuration={this.state.errorState.autoHideDuration}
                                    action="Zavřít"
                                    onActionClick={this._closeError}
                                    onRequestClose={this._checkSnackbarCloseOpt}
                              />
                        </div>
                  </MuiThemeProvider>
            );
      }
}

export default App;
