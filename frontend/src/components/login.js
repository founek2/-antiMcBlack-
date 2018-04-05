import React, { Component } from "react";
import TextField from "material-ui/TextField";
import { Card, CardActions, CardTitle, CardText } from "material-ui/Card";
import RaisedButton from "material-ui/RaisedButton";
import { styles } from "../styles/styles";
import { pink500 } from "material-ui/styles/colors";
import { path, assocPath, prop, length } from "ramda";
import PandaFace from "./pandaFace";
import ClickOutside from "react-click-outside";
import getCursorXY from '../utils/getCursorXY'

const getNameFromEvent = path(["target", "name"]);
const getValueFromEvent = path(["target", "value"]);

const setInput = (name, value) => (state, props) =>
      assocPath(["inputs", name, "value"], value, state);

const getActiveInputNum = (username, password) => {
      if (prop("focus", username)) return 0;
      if (prop("focus", password)) return 1;
};
const getCharNum = (username, password) => {
      if (prop("focus", username)) {
            return length(prop("value", username));
      } else if (prop("focus", password)) {
            return length(prop("value", password));
      }
};
const getCursorPosition = (username, password) => {
      if (prop("focus", username)) {
            return prop("cursorPosition", username);
      } else if (prop("focus", password)) {
            return prop("cursorPosition", password);
      }
}
class Login extends Component {
      constructor(props) {
            super(props);
            this.state = {
                  inputs: {
                        password: {
                              value: "",
                              valid: true,
                              errorMessage: "Password musí mít min. délku 5 znaků",
                              focus: false,
                              hidden: true,
                              cursorPosition: 0,
                        },
                        username: {
                              value: "",
                              valid: true,
                              errorMessage: "Username musí mít min. délku 3 znaky",
                              focus: false,
                              cursorPosition: 0,
                        }
                  }
            };
      }

      _handleOnChange = e => {
            const val = getValueFromEvent(e);
            const name = getNameFromEvent(e);
            const len = length(val);
            if (len <= 25) this.setState(setInput(name, val));

            const input = this[name].input;
            console.log(input.selectionStart)
            const values = getCursorXY(input, input.selectionStart);
            console.log(values, name)
            this.setState(prevState => assocPath(["inputs", name, "cursorPosition"], values.x, prevState));
      };
      _handleClickSelection = e => {
            const name = getNameFromEvent(e);
            const input = this[name].input;

            const values = getCursorXY(input, input.selectionStart);
            this.setState(prevState => assocPath(["inputs", name, "cursorPosition"], values.x, prevState));
      }

      _handleLogin = () => {
            const userName = path(["inputs", "username", "value"], this.state);
            const passwd = path(["inputs", "password", "value"], this.state);
            let newState = this.state;

            if (passwd.length < 5) {
                  newState = assocPath(["inputs", "password", "valid"], false, newState);
            } else {
                  newState = assocPath(["inputs", "password", "valid"], true, newState);
            }
            if (userName.length < 3) {
                  newState = assocPath(["inputs", "username", "valid"], false, newState);
            } else {
                  newState = assocPath(["inputs", "username", "valid"], true, newState);
            }
            this.setState(newState);

            const inputsState = newState.inputs;
            inputsState.username.valid &&
                  inputsState.password.valid &&
                  this.props.handleLogin(userName, passwd);
      };
      _changeFocus = (input, val) => {
            this.setState(prevState => assocPath(["inputs", input, "focus"], val, prevState));
      };
      _changeHidden = input => {
            this.setState(prevState => {
                  const pat = ["inputs", input, "hidden"];
                  const prevVal = path(pat, prevState);
                  return assocPath(pat, !prevVal, prevState);
            });
      };
      render() {
            const { username, password } = this.state.inputs;

            return (
                  <div>
                        <Card className="loginCard">
                              <CardTitle title="- McWhite -" titleColor={pink500} />
                              <CardText>
                                    <div class="window">
                                          <PandaFace
                                                handsUp={password.focus}
                                                inputNum={getActiveInputNum(username, password)}
                                                charNum={getCharNum(username, password)}
                                                cursorPosition={getCursorPosition(username, password)}
                                                seeking={!password.hidden}
                                          />
                                    </div>
                                    <TextField
                                          onClick={this._handleClickSelection}
                                          ref={(el) => this.username = el}
                                          type="username"
                                          name="username"
                                          floatingLabelText="Username"
                                          floatingLabelStyle={styles.textColor}
                                          floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                                          underlineStyle={styles.underlineStyle}
                                          underlineFocusStyle={styles.underlineFocusStyle}
                                          onChange={this._handleOnChange}
                                          value={path(["inputs", "username", "value"], this.state)}
                                          onKeyPress={e => e.key === "Enter" && this._handleLogin()}
                                          errorText={
                                                !path(
                                                      ["inputs", "username", "valid"],
                                                      this.state
                                                ) &&
                                                path(
                                                      ["inputs", "username", "errorMessage"],
                                                      this.state
                                                )
                                          }
                                          onFocus={() => this._changeFocus("username", true)}
                                          onBlur={() => this._changeFocus("username", false)}
                                    />
                                    <div className="relative">
                                          <ClickOutside
                                                onClickOutside={() =>
                                                      this._changeFocus("password", false)
                                                }
                                          >
                                                <TextField
                                                      onClick={this._handleClickSelection}
                                                      ref={(el) => this.password = el}
                                                      type={password.hidden ? "password" : "text"}
                                                      name="password"
                                                      floatingLabelText="Password"
                                                      floatingLabelStyle={styles.textColor}
                                                      floatingLabelFocusStyle={
                                                            styles.floatingLabelFocusStyle
                                                      }
                                                      underlineStyle={styles.underlineStyle}
                                                      underlineFocusStyle={
                                                            styles.underlineFocusStyle
                                                      }
                                                      onChange={this._handleOnChange}
                                                      value={path(
                                                            ["inputs", "password", "value"],
                                                            this.state
                                                      )}
                                                      onKeyPress={e =>
                                                            e.key === "Enter" && this._handleLogin()
                                                      }
                                                      errorText={
                                                            (!path(
                                                                  ["inputs", "password", "valid"],
                                                                  this.state
                                                            ) &&
                                                                  path(
                                                                        [
                                                                              "inputs",
                                                                              "password",
                                                                              "errorMessage"
                                                                        ],
                                                                        this.state
                                                                  )) ||
                                                            this.props.logError
                                                      }
                                                      onFocus={() =>
                                                            this._changeFocus("password", true)
                                                      }
                                                />
                                                <div
                                                      className={
                                                            "eye" +
                                                            (password.hidden
                                                                  ? " eye-on"
                                                                  : " eye-off")
                                                      }
                                                      onClick={() => this._changeHidden("password")}
                                                />
                                          </ClickOutside>
                                    </div>
                              </CardText>
                              <CardActions>
                                    <RaisedButton
                                          label="Login"
                                          onClick={this._handleLogin}
                                          icon={
                                                this.props.logInProggres ? (
                                                      <div className="loader-5 center">
                                                            <span />
                                                      </div>
                                                ) : null
                                          }
                                          style={styles.loginButton}
                                          labelStyle={styles.loginButtonLabel}
                                    />
                              </CardActions>
                        </Card>
                  </div>
            );
      }
}

export default Login;
