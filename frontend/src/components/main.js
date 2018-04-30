import React, { Component } from "react";
import AppBar from "material-ui/AppBar";
import Menu from "material-ui/Menu";
import IconButton from "material-ui/IconButton";
import IconMenu from "material-ui/IconMenu";
import MoreVertIcon from "material-ui/svg-icons/navigation/more-vert";
import MenuItem from "material-ui/MenuItem";
import Drawer from "material-ui/Drawer";
import { styles } from "../styles/styles";
import AbsenceTable from "./absenceTable";
import ClassificationTable from "./classificationTable";
import ApiHandler from "../api";
import ClickOutside from "react-click-outside";
import Default from "./default";
import { path, concat, assocPath, map, flatten, reverse, assoc, prop } from "ramda";
import deepmerge from "deepmerge";
import Dialog from "material-ui/Dialog";
import TextField from "material-ui/TextField";
import FlatButton from "material-ui/FlatButton";
import TimeTable from "./timeTable";
import mainDefaultState from "../constants/mainDefaultState";
import mobileCheck from '../utils/mobilecheck';

const getNameFromEvent = path(["target", "name"]);
const getValueFromEvent = path(["target", "value"]);
const getStorage = () => mobileCheck() ? localStorage : sessionStorage;

const setInput = (name, value) => (state, props) =>
      assocPath(["inputs", name, "value"], value, state);

const menuComponents = {
      default: () => <Default />,
      absence: props => <AbsenceTable {...props.absence} />,
      classification: props => <ClassificationTable {...props.classification} />,
      timeTable: props => <TimeTable {...props.timeTable} />,
      files: "Soubory (in far future)"
};

const MenuItems = props => {
      return (
            <div>
                  <IconMenu
                        iconButtonElement={
                              <IconButton>
                                    <MoreVertIcon />
                              </IconButton>
                        }
                        targetOrigin={{ horizontal: "right", vertical: "top" }}
                        anchorOrigin={{ horizontal: "right", vertical: "top" }}
                        onItemClick={props.handleItemClick}
                  >
                        <MenuItem primaryText="Change Password" value="changePasswd" />
                        <MenuItem primaryText="Sign out" value="logOut" />
                  </IconMenu>
            </div>
      );
};

MenuItems.muiName = "IconMenu";

var globalTimoutMenuItemSelect;
class Main extends Component {
      constructor(props) {
            super(props);
            const absenceState = JSON.parse(getStorage().getItem("absenceState"));
            const classificationState = JSON.parse(getStorage().getItem("classificationState"));
            this.state = mainDefaultState(absenceState, classificationState);
            this.apiHandler = new ApiHandler(this.props.handleError, this.props.handleLogOut);

            this._lazyLoadContent(absenceState, classificationState);
      }
      _lazyLoadContent = (abs, clas) => {
            if (!this.state.rightsAbsence && !abs) {
                  this.apiHandler.rightsAbsence(this.props.cid).then(() => {
                        this.setState({ rightsAbsence: true });
                        this._loadDefAbsence();
                  });
            } else {
                  !abs && this._loadDefAbsence();
            }

            if (!this.state.rightsClassification && !clas) {
                  this.apiHandler.rightsClassification(this.props.cid).then(() => {
                        this.setState({ rightsClassification: true });
                        this._loadClassification();
                  });
            } else {
                  !clas && this._loadClassification();
            }
      };
      _handleFetchingData = (path, value) => {
            this.setState({
                  [path]: assocPath(["fetchingData"], value, this.state[path])
            });
      };

      _loadClassification = () => {
            this._handleFetchingData("classificationState", true);
            let promise;
            if (!this.state.rightsClassification) {
                  promise = this.apiHandler
                        .rightsClassification(this.props.cid)
                        .then(() => this.setState({ rightsClassification: true }));
            } else {
                  promise = new Promise(resolve => resolve());
            }

            promise.then(() =>{
                  const {
                        period
                  } = this.state.classificationState;
                  this.apiHandler
                        .getClassification(this.props.cid, period)
                        .then(classificationResp => {
                              const newClassificationState = assocPath(["items", period], prop("items", classificationResp), this.state.classificationState)

                              this.setState({
                                    classificationState: newClassificationState
                              });
                              this._handleFetchingData("classificationState", false);
                              getStorage().setItem(
                                    "classificationState",
                                    JSON.stringify(this.state.classificationState)
                              );
                        })
                  }
            );
      
      };
      _loadDefAbsence = () => {
            this._handleFetchingData("absenceState", true);
            let promise;
            if (!this.state.rightsAbsence) {
                  promise = this.apiHandler
                        .rightsAbsence(this.props.cid)
                        .then(() => this.setState({ rightsAbsence: true }));
            } else {
                  promise = new Promise(resolve => resolve());
            }
            promise.then(() => {
                  const {
                        period,
                  } = this.state.absenceState;

                  this.apiHandler
                        .getAbsence(this.props.cid, period, 0)
                        .then(absenceResp => {
                              if (!absenceResp.error) {
                                    const numberOfWeekBefore = absenceResp.total - 1;
                                    this.apiHandler
                                          .getAbsence(
                                                this.props.cid,
                                                period,
                                                numberOfWeekBefore
                                          )
                                          .then(absenceResp2 => {
                                                const {
                                                      absenceState
                                                } = this.state;

                                                const absenceRespMerged = deepmerge(
                                                      absenceResp2,
                                                      absenceResp
                                                );

                                                const newAbsenceState = assocPath(["items", period], [], absenceState)
                                                const newAbsenceState2 = assocPath(["currentWeek"], numberOfWeekBefore, newAbsenceState);
                                                const newAbsenceState3 = assocPath(["totalWeek"], absenceRespMerged.total, newAbsenceState2);
                                                const newAbsenceState4 = assocPath(["items", period], absenceRespMerged.items, newAbsenceState3);
                                                const newAbsenceState5 = assocPath(["numberOfRecords"], 10, newAbsenceState4);

                                                this.setState({
                                                      absenceState: newAbsenceState5
                                                });

                                                this._handleFetchingData("absenceState", false);
                                                getStorage().setItem(
                                                      "absenceState",
                                                      JSON.stringify(this.state.absenceState)
                                                );
                                          
                                          });
                                    
                              } else {
                                    this._handleFetchingData("absenceState", false);
                              }
                        })
                  }
            );
      };
      _handleNumberOfAbsenceRecords = (e, val, valueSelect) => {
            this._handleFetchingData("absenceState", true);

            const value = valueSelect ? valueSelect : val;
            let newCurrentWeek = this.state.absenceState.currentWeek;
            const { numberOfRecords, currentWeek } = this.state.absenceState;

            if (value > numberOfRecords && currentWeek > 1) {
                  const a = value / 5;
                  const arrayOfPromises = [];
                  let promise;
                  if (!this.state.rightsAbsence) {
                        promise = this.apiHandler.rightsAbsence(this.props.cid);
                  } else {
                        promise = new Promise(resolve => resolve());
                  }
                  promise.then(() => {
                        for (let i = currentWeek - 1; i >= 1 && currentWeek - i !== a; i--) {
                              arrayOfPromises.push(
                                    this.apiHandler.getAbsence(
                                          this.props.cid,
                                          this.state.absenceState.period,
                                          i
                                    )
                              );
                              newCurrentWeek = i;
                        }
                        Promise.all(arrayOfPromises)
                              .then(arrayResults => {
                                    const newArrayResults = reverse(arrayResults);
                                    const absenceState = this.state.absenceState;
                                    const resItems = map(object => object.items, newArrayResults);
                                    const newItems = concat(flatten(resItems), absenceState.items[absenceState.period]);

                                    const newAbsenceState1 = assoc("numberOfRecords", value, absenceState)
                                    const newAbsenceState2 = assoc("currentWeek", newCurrentWeek, newAbsenceState1)
                                    const newAbsenceState3 = assocPath(["items", absenceState.period], newItems, newAbsenceState2)

                                    this.setState({ absenceState: newAbsenceState3 });

                                    this._handleFetchingData("absenceState", false);
                                    absenceState.fetchingData = false; // a little 💩
                                    getStorage().setItem(
                                          "absenceState",
                                          JSON.stringify(absenceState)
                                    );
                              })
                              .catch(e => {
                                    this._handleFetchingData("absenceState", false)
                                    console.log(e)
                              });
                  });
            } else {
                  const newAbsenceState = this.state.absenceState;
                  console.log("nove itemi else", newAbsenceState)
                  newAbsenceState.numberOfRecords = value;
                  this.setState({
                        absenceState: newAbsenceState
                  });
                  this._handleFetchingData("absenceState", false);
            }
      };
      handleClickOutside() {
            this._handleESC();
      }
      _handleToggleDrawer = () => {
            this.setState({ leftMenuOpen: !this.state.leftMenuOpen });
      };
      _handleESC = () => (this.state.leftMenuOpen ? this.setState({ leftMenuOpen: false }) : null);
      _handleItemSelect = (e, menuItem, i) => {
            if (menuItem.props.value) {
                  clearTimeout(globalTimoutMenuItemSelect);
                  globalTimoutMenuItemSelect = setTimeout(
                        () => this.setState({ leftMenuOpen: false }),
                        230
                  );
                  this.setState({ activeComponent: menuItem.props.value });
            }
            const menuItemsStyles = { [menuItem.props.value]: styles.menuItemFocused };
            this.setState({ menuItemsStyles });
      };
      _handleRightMenuItemClick = (e, item) => {
            if (item.props.value === "logOut") this.props.handleLogOut();
            if (item.props.value === "changePasswd") this._hangleChangePasswordMenu();
      };
      _handleChangePeriodAbsence = (e, isChecked) => {
            const newAbsenceState = this.state.absenceState;
            const {
                  items,
                  period
            } = newAbsenceState;
            newAbsenceState.period = isChecked ? 2 : 1;
            this.setState({ absenceState: newAbsenceState });
            if (items[prop("period", newAbsenceState)].length === 0) this._loadDefAbsence();
      };
      _handleChangePeriodClassification = (e, isChecked) => {
            const newClassificationState = this.state.classificationState;
            const {
                  items,
                  period
            } = newClassificationState;
            newClassificationState.period = isChecked ? 2 : 1;
            this.setState({ classificationState: newClassificationState });
            if (items[prop("period", newClassificationState)].length === 0) this._loadClassification();
      };
      _handleChangePassword = async () => {
            const passwd = path(["inputs", "passwordNew", "value"], this.state);
            const passwdAgain = path(["inputs", "passwordNewAgain", "value"], this.state);
            const passwdOld = path(["inputs", "passwordOld", "value"], this.state);
            let newState = this.state;

            if (passwdAgain !== passwd) {
                  newState = assocPath(["inputs", "passwordNewAgain", "valid"], false, newState);
            } else {
                  newState = assocPath(["inputs", "passwordNewAgain", "valid"], true, newState);
            }
            if (passwd.length < 5) {
                  newState = assocPath(["inputs", "passwordNew", "valid"], false, newState);
            } else {
                  newState = assocPath(["inputs", "passwordNew", "valid"], true, newState);
            }
            newState = assocPath(["inputs", "dialog", "valid"], true, newState);
            if (passwdOld.length < 5) {
                  newState = assocPath(["inputs", "passwordOld", "valid"], false, newState);
            } else {
                  newState = assocPath(["inputs", "passwordOld", "valid"], true, newState);
            }
            this.setState(newState);

            const inputsState = newState.inputs;
            inputsState.passwordOld.valid &&
                  inputsState.passwordNew.valid &&
                  inputsState.passwordNewAgain.valid &&
                  this._changePassword(this.props.cid, passwdOld, passwd);
      };
      _changePassword = (cid, oldPasswd, newPasswd) => {
            this.apiHandler.changePassword(cid, oldPasswd, newPasswd).then(response => {
                  if (response.status === "success") this._hangleChangePasswordMenu();
                  if (response.status === "mismatch") {
                        const inputs = this.state.inputs;
                        inputs.dialog.valid = false;
                        this.setState({ inputs });
                  }
            });
      };
      _hangleChangePasswordMenu = () => {
            this.setState({ openDialogPassword: !this.state.openDialogPassword });
      };
      _handleOnChange = e => {
            e.persist();
            this.setState(setInput(getNameFromEvent(e), getValueFromEvent(e)));
            setTimeout(() => {
                  this[getNameFromEvent(e)].focus();
            }, 10);
      };
      render() {
            return (
                  <div style={{ height: "inherit" }}>
                        <ClickOutside onClickOutside={this._handleESC}>
                              <AppBar
                                    title={"Intranet"}
                                    iconElementRight={
                                          <MenuItems
                                                handleItemClick={this._handleRightMenuItemClick}
                                          />
                                    }
                                    onLeftIconButtonClick={this._handleToggleDrawer}
                                    titleStyle={styles.appBarTitle}
                                    style={styles.appBar}
                              />
                              <Drawer
                                    open={this.state.leftMenuOpen}
                                    containerStyle={styles.drawerContainer}
                              >
                                    <Menu
                                          onItemClick={this._handleItemSelect}
                                          onEscKeyDown={this._handleESC}
                                    >
                                          <MenuItem
                                                style={this.state.menuItemsStyles.absence}
                                                value="absence"
                                          >
                                                Absence
                                          </MenuItem>
                                          <MenuItem
                                                style={this.state.menuItemsStyles.classification}
                                                value="classification"
                                          >
                                                Klasifikace
                                          </MenuItem>
                                          <MenuItem value="timeTable">Rozvrh</MenuItem>
                                          <MenuItem
                                                style={this.state.menuItemsStyles.files}
                                                value=""
                                          >
                                                Soubory (in far future)
                                          </MenuItem>
                                    </Menu>
                              </Drawer>
                        </ClickOutside>
                        {menuComponents[this.state.activeComponent]({
                              absence: {
                                    absenceState: this.state.absenceState,
                                    handleNumberOfRecords: this._handleNumberOfAbsenceRecords,
                                    handlePeriodChange: this._handleChangePeriodAbsence
                              },
                              classification: {
                                    response: this.state.classificationState.response,
                                    period: this.state.classificationState.period,
                                    handlePeriodChange: this._handleChangePeriodClassification,
                                    classificationState: this.state.classificationState
                              },
                              timeTable: {
                                    class: this.props.class
                              }
                        })}

                        <Dialog
                              title="Change password"
                              actions={[
                                    <FlatButton
                                          label="Cancel"
                                          primary={false}
                                          keyboardFocused={false}
                                          onClick={this._hangleChangePasswordMenu}
                                    />,
                                    <FlatButton
                                          label="Ok"
                                          primary={true}
                                          keyboardFocused={true}
                                          onClick={this._handleChangePassword}
                                    />
                              ]}
                              modal={false}
                              open={this.state.openDialogPassword}
                              onRequestClose={this._hangleChangePasswordMenu}
                              style={styles.passwordDialog}
                        >
                              <TextField
                                    type="password"
                                    name="passwordOld"
                                    floatingLabelText="Old password"
                                    floatingLabelStyle={styles.textColor}
                                    floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                                    underlineStyle={styles.underlineStyle}
                                    underlineFocusStyle={styles.underlineFocusStyle}
                                    onChange={this._handleOnChange}
                                    ref={input => (this.passwordOld = input)}
                                    value={path(["inputs", "passwordOld", "value"], this.state)}
                                    errorText={
                                          (!path(["inputs", "passwordOld", "valid"], this.state) &&
                                                path(
                                                      ["inputs", "passwordOld", "errorMessage"],
                                                      this.state
                                                )) ||
                                          (!path(["inputs", "dialog", "valid"], this.state) &&
                                                path(
                                                      ["inputs", "dialog", "errorMessage"],
                                                      this.state
                                                ))
                                    }
                              />
                              <br />
                              <TextField
                                    type="password"
                                    name="passwordNew"
                                    floatingLabelText="new password"
                                    floatingLabelStyle={styles.textColor}
                                    floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                                    underlineStyle={styles.underlineStyle}
                                    underlineFocusStyle={styles.underlineFocusStyle}
                                    onChange={this._handleOnChange}
                                    ref={input => (this.passwordNew = input)}
                                    value={path(["inputs", "passwordNew", "value"], this.state)}
                                    errorText={
                                          !path(["inputs", "passwordNew", "valid"], this.state) &&
                                          path(
                                                ["inputs", "passwordNew", "errorMessage"],
                                                this.state
                                          )
                                    }
                              />
                              <br />
                              <TextField
                                    type="password"
                                    name="passwordNewAgain"
                                    floatingLabelText="password again"
                                    floatingLabelStyle={styles.textColor}
                                    floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                                    underlineStyle={styles.underlineStyle}
                                    underlineFocusStyle={styles.underlineFocusStyle}
                                    ref={input => (this.passwordNewAgain = input)}
                                    onChange={this._handleOnChange}
                                    value={path(
                                          ["inputs", "passwordNewAgain", "value"],
                                          this.state
                                    )}
                                    errorText={
                                          !path(
                                                ["inputs", "passwordNewAgain", "valid"],
                                                this.state
                                          ) &&
                                          path(
                                                ["inputs", "passwordNewAgain", "errorMessage"],
                                                this.state
                                          )
                                    }
                              />
                        </Dialog>
                  </div>
            );
      }
}
export default Main;
