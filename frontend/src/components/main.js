import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import Menu from 'material-ui/Menu';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import MenuItem from 'material-ui/MenuItem';
import Drawer from 'material-ui/Drawer';
import { styles } from '../styles/styles';
import AbsenceTable from './absenceTable';
import GradesTable from './gradesTable';
import ApiHandler from '../api';
import ClickOutside from 'react-click-outside';
import Default from './default';
import { path, concat, assocPath, map, flatten } from 'ramda';
import deepmerge from 'deepmerge';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import Snackbar from 'material-ui/Snackbar';
import FlatButton from 'material-ui/FlatButton';
import TimeTable from './timeTable';
import mainDefaultState from '../constants/mainDefaultState';

const getNameFromEvent = path(['target', 'name'])
const getValueFromEvent = path(['target', 'value'])

const setInput = (name, value) => (state, props) => assocPath(['inputs', name, 'value'], value, state);

const menuComponents = {
    default: () => <Default />,
    absence: (props) => <AbsenceTable {...props.absence} />,
    classification: (props) => <GradesTable {...props.classification} />,
    timeTable: (props) => <TimeTable {...props.timeTable} />,
    files: 'Soubory (in far future)'
};

const Logged = (props) => {

    return (<div>
        <IconMenu
            iconButtonElement={
                <IconButton><MoreVertIcon /></IconButton>
            }
            targetOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
            onItemClick={props.handleItemClick}
        >
            <MenuItem primaryText="Change Password" value='changePasswd' />
            <MenuItem primaryText="Sign out" value='logOut' />
        </IconMenu>
    </div>)
};

Logged.muiName = 'IconMenu';

class Main extends Component {
    _apiErrorCallback = (e) => {
        this.setState({ errorState: { fetchError: e.message,fetchErrorMsg:'Bez připojení k internetu', errorOpen: true } })
    }
    _closeError=()=>{
        this.setState({ errorState: { errorOpen: false }});     
    }
    constructor(props) {
        super(props);
        this.state = mainDefaultState;
        this.apiHandler = new ApiHandler(this._apiErrorCallback);
        this._lazyLoadContent();
    }
    _lazyLoadContent = () => {
        this.apiHandler.rightsAbsence(this.props.cid).then(() => this._loadDefAbsence());

        this.apiHandler.rightsClassification(this.props.cid).then(() => this._loadClassification());
    }
    _handleFetchingData = (path, value) => {
        console.log(path, value)
        this.setState({
            [path]: assocPath(['fetchingData'], value, this.state[path]),
        })
    }

    _loadClassification = () => {

        this._handleFetchingData('classificationState', true)

        this.apiHandler.getClassification(this.props.cid, this.state.classificationState.period)
            .then((classificationResp) => {
                const newClassificationState = this.state.classificationState;
                newClassificationState.response = classificationResp;

                this.setState({
                    classificationState: newClassificationState,
                })
                this._handleFetchingData('classificationState', false)
            })

    }
    _loadDefAbsence = () => {
        this._handleFetchingData('absenceState', true)
        console.log('absencePeriod ' + this.state.absenceState.period)
        this.apiHandler.getAbsence(this.props.cid, this.state.absenceState.period, 0)
            .then((absenceResp) => {
                const numberOfWeekBefore = absenceResp.total - 1;
                this.apiHandler.getAbsence(this.props.cid, this.state.absenceState.period, numberOfWeekBefore)
                    .then((absenceResp2) => {
                        const absenceRespMerged = deepmerge(absenceResp2, absenceResp);
                        console.log('mergeRes', absenceRespMerged)
                        const newAbsenceState = this.state.absenceState;
                        newAbsenceState.items = [];
                        const newAbsenceState2 = deepmerge(newAbsenceState, { currentWeek: numberOfWeekBefore, totalWeek: absenceRespMerged.total, items: absenceRespMerged.items, numberOfRecords: 10 })

                        this.setState({
                            absenceState: newAbsenceState2,
                        })

                        this._handleFetchingData('absenceState', false)


                    })

            })

    }
    _handleNumberOfAbsenceRecords = (e, value) => {
        this._handleFetchingData('absenceState', true)

        let newCurrentWeek = this.state.absenceState.currentWeek;
        const {
            numberOfRecords,
            currentWeek
        } = this.state.absenceState;
        console.log('condition for call', value > numberOfRecords && currentWeek > 1)
        if (value > numberOfRecords && currentWeek > 1) {
            const a = value / 5;
            const arrayOfPromises = [];

            for (let i = currentWeek - 1; i >= 1 && (currentWeek - i) !== a; i--) {
                arrayOfPromises.push(this.apiHandler.getAbsence(this.props.cid, this.state.absenceState.period, i))
                newCurrentWeek = i;
                console.log('call for absence week ' + i)
            }
            Promise.all(arrayOfPromises).then(arrayResults => {

                const absenceState = this.state.absenceState;
                const resItems = map((object) => object.items, arrayResults);
                const newItems = concat(absenceState.items, flatten(resItems));


                absenceState.numberOfRecords = value;
                absenceState.currentWeek = newCurrentWeek;
                absenceState.items = newItems;

                this.setState({ absenceState: absenceState })

                this._handleFetchingData('absenceState', false)

            })
        } else {
            const newAbsenceState = this.state.absenceState;

            newAbsenceState.numberOfRecords = value;
            this.setState({
                absenceState: newAbsenceState
            })
            this._handleFetchingData('absenceState', false)


        }

        //TODO přepsat manipulaci s objektem
        /*      let newAbsenceState = this.state.absenceState;
              newAbsenceState.items = itemsNew;
              newAbsenceState.numberOfRecords = value;
              newAbsenceState.currentWeek = newCurrentWeek;
              this.setState({ absenceState: newAbsenceState })
              this._handleFetchingData('absenceState', false)*/
    }
    handleClickOutside() {
        this._handleESC();
    }
    _handleToggleDrawer = () => {
        this.setState({ open: !this.state.open });
    }
    _handleESC = () => this.state.open ? this.setState({ open: false }) : null;
    _handleItemSelect = (e, menuItem, i) => {
        if (menuItem.props.value) this.setState({ activeComponent: menuItem.props.value });

        const menuItemsStyles = { [menuItem.props.value]: styles.menuItemFocused }
        this.setState({ menuItemsStyles });
    }
    _handleRightMenuItemClick = (e, item) => {
        if (item.props.value === 'logOut') this.props.handleLogOut();
        if (item.props.value === 'changePasswd') this._hangleChangePasswordMenu();
    }
    _handleChangePeriodAbsence = (e, isChecked) => {
        const newAbsenceState = this.state.absenceState;
        newAbsenceState.period = isChecked ? 2 : 1;
        this.setState({ absenceState: newAbsenceState });
        this._loadDefAbsence();
    }
    _handleChangePeriodClassification = (e, isChecked) => {
        const newClassificationState = this.state.classificationState;
        newClassificationState.period = isChecked ? 2 : 1;
        this.setState({ classificationState: newClassificationState });
        this._loadClassification();
    }
    _handleChangePassword = async () => {
        const passwd = path(['inputs', 'passwordNew', 'value'], this.state);
        const passwdAgain = path(['inputs', 'passwordNewAgain', 'value'], this.state);
        const passwdOld = path(['inputs', 'passwordOld', 'value'], this.state);
        let newState = this.state;

        if (passwdAgain !== passwd) {
            newState = assocPath(['inputs', 'passwordNewAgain', 'valid'], false, newState)
        } else {
            newState = assocPath(['inputs', 'passwordNewAgain', 'valid'], true, newState)
        }
        if (passwd.length < 5) {
            newState = assocPath(['inputs', 'passwordNew', 'valid'], false, newState)
        } else {
            newState = assocPath(['inputs', 'passwordNew', 'valid'], true, newState)
        }
        newState = assocPath(['inputs', 'dialog', 'valid'], true, newState)
        if (passwdOld.length < 5) {
            newState = assocPath(['inputs', 'passwordOld', 'valid'], false, newState)
        } else {
            newState = assocPath(['inputs', 'passwordOld', 'valid'], true, newState)
        }
        this.setState(newState)
        console.log(newState)
        const inputsState = newState.inputs;
        inputsState.passwordOld.valid && inputsState.passwordNew.valid && inputsState.passwordNewAgain.valid && this._changePassword(this.props.cid, passwdOld, passwd)
    }
    _changePassword = (cid, oldPasswd, newPasswd) => {
        this.apiHandler.changePassword(cid, oldPasswd, newPasswd)
            .then((response) => {
                console.log(response.status === 'success')
                if (response.status === 'success') this._hangleChangePasswordMenu();
                if (response.status === 'mismatch') {
                    const inputs = this.state.inputs;
                    inputs.dialog.valid = false;
                    this.setState({ inputs });
                }
            })

    }
    _hangleChangePasswordMenu = () => {
        this.setState({ openDialogPassword: !this.state.openDialogPassword })
    }
    _handleOnChange = (e) => {
        e.persist();
        this.setState(setInput(getNameFromEvent(e), getValueFromEvent(e)));
        setTimeout(() => {
            this[getNameFromEvent(e)].focus();
        }, 10);

    }
    render() {
        return (
            <div style={{ height: 'inherit' }}>
                <ClickOutside onClickOutside={this._handleESC}>
                    <AppBar
                        title={"Intranet"}
                        iconElementRight={<Logged handleItemClick={this._handleRightMenuItemClick} />}
                        onLeftIconButtonClick={this._handleToggleDrawer}
                        titleStyle={styles.appBarTitle}
                        style={styles.appBar}
                    />
                    <Drawer open={this.state.open} containerStyle={styles.drawerContainer}>
                        <Menu
                            onItemClick={this._handleItemSelect}
                            onEscKeyDown={this._handleESC}
                        >
                            <MenuItem style={this.state.menuItemsStyles.absence} value='absence'>Absence</MenuItem>
                            <MenuItem style={this.state.menuItemsStyles.classification} value='classification'>Klasifikace</MenuItem>
                            <MenuItem value='timeTable'>Rozvrh</MenuItem>
                            <MenuItem style={this.state.menuItemsStyles.files} value=''>Soubory (in far future)</MenuItem>
                        </Menu>
                    </Drawer>
                </ClickOutside>
                {menuComponents[this.state.activeComponent]({
                    absence: {
                        absenceState: this.state.absenceState,
                        handleNumberOfRecords: this._handleNumberOfAbsenceRecords,
                        handlePeriodChange: this._handleChangePeriodAbsence,
                    },
                    classification: {
                        response: this.state.classificationState.response,
                        period: this.state.classificationState.period,
                        handlePeriodChange: this._handleChangePeriodClassification,
                        classificationState: this.state.classificationState,
                    },
                    timeTable: {
                        class: this.props.class,
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
                        type='password'
                        name='passwordOld'
                        floatingLabelText="Old password"
                        floatingLabelStyle={styles.textColor}
                        floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                        underlineStyle={styles.underlineStyle}
                        underlineFocusStyle={styles.underlineFocusStyle}
                        onChange={this._handleOnChange}
                        ref={(input) => this.passwordOld = input}
                        value={path(['inputs', 'passwordOld', 'value'], this.state)}
                        errorText={(!path(['inputs', 'passwordOld', 'valid'], this.state) && path(['inputs', 'passwordOld', 'errorMessage'], this.state)) || !path(['inputs', 'dialog', 'valid'], this.state) && path(['inputs', 'dialog', 'errorMessage'], this.state)}
                    /><br />
                    <TextField
                        type='password'
                        name='passwordNew'
                        floatingLabelText="new password"
                        floatingLabelStyle={styles.textColor}
                        floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                        underlineStyle={styles.underlineStyle}
                        underlineFocusStyle={styles.underlineFocusStyle}
                        onChange={this._handleOnChange}
                        ref={(input) => this.passwordNew = input}
                        value={path(['inputs', 'passwordNew', 'value'], this.state)}
                        errorText={!path(['inputs', 'passwordNew', 'valid'], this.state) && path(['inputs', 'passwordNew', 'errorMessage'], this.state)}
                    /><br />
                    <TextField
                        type='password'
                        name='passwordNewAgain'
                        floatingLabelText="password again"
                        floatingLabelStyle={styles.textColor}
                        floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                        underlineStyle={styles.underlineStyle}
                        underlineFocusStyle={styles.underlineFocusStyle}
                        ref={(input) => this.passwordNewAgain = input}
                        onChange={this._handleOnChange}
                        value={path(['inputs', 'passwordNewAgain', 'value'], this.state)}
                        errorText={!path(['inputs', 'passwordNewAgain', 'valid'], this.state) && path(['inputs', 'passwordNewAgain', 'errorMessage'], this.state)}
                    />
                </Dialog>
                <Snackbar
                    open={this.state.errorState.errorOpen}
                    message={this.state.errorState.fetchErrorMsg}
                    autoHideDuration={3000}
                    action='Zavřít'
                    onActionClick={this._closeError}
                />
            </div>
        );
    }
}

export default Main;