import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import Menu from 'material-ui/Menu';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import MenuItem from 'material-ui/MenuItem';
import Drawer from 'material-ui/Drawer';
import { styles } from '../styles/styles';
import AbsenceTable from './absenceTable';
import GradesTable from './gradesTable';
import { logIn, getAbsence, rightsAbsence, rightsClassification, getClassification } from '../api';
import ClickOutside from 'react-click-outside';
import Default from './default';
import { path, mergeDeepWith, concat } from 'ramda';
import deepmerge from 'deepmerge';

const menuComponents = {
    default: () => <Default />,
    absence: (props) => <AbsenceTable {...props.absence} cid={props.cid} />,
    classification: (props) => <GradesTable response={props.classificationResponse} />,
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
            <MenuItem primaryText="Help" value='help' />
            <MenuItem primaryText="Sign out" value='logOut' />
        </IconMenu>
    </div>)
};

Logged.muiName = 'IconMenu';

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            activeComponent: 'default',
            menuItemsStyles: {},
            absenceState: {
                numberOfRecords: 10,
                currentWeek: 0,
                totalWeek: 0,
                items: [],
                period: 2,
            }
        };
        this._lazyLoadContent();
    }
    _lazyLoadContent = async () => {
        await rightsAbsence(this.props.cid);
        this._loadDefAbsence()
        await rightsClassification(this.props.cid);

        const classificationResp = await getClassification(this.props.cid, 2);
         this.setState({
            classificationResponse: classificationResp
        })

    }
    _loadDefAbsence = async () => {
        console.log('absencePeriod ' + this.state.absenceState.period)
        const absenceResp = await getAbsence(this.props.cid, this.state.absenceState.period, 0);
        const numberOfWeekBefore = absenceResp.total - 1;
        const absenceResp2 = await getAbsence(this.props.cid, this.state.absenceState.period, numberOfWeekBefore);
        const absenceRespMerged = deepmerge(absenceResp2, absenceResp);
        console.log('mergeRes', absenceRespMerged)
        const newAbsenceState = this.state.absenceState;
        newAbsenceState.items = [];
        const newAbsenceState2 = deepmerge(newAbsenceState, { currentWeek: numberOfWeekBefore, totalWeek: absenceRespMerged.total, items: absenceRespMerged.items})
     
        this.setState({
            absenceState: newAbsenceState2,
        })
    }
    _handleNumberOfAbsenceRecords = async (e, value) => {
        let itemsNew = this.state.absenceState.items;
        let newCurrentWeek = this.state.absenceState.currentWeek;
        const {
            numberOfRecords,
            currentWeek
        } = this.state.absenceState;
        if (value > numberOfRecords && currentWeek > 1) {
            const numberOfWeeks = [];
            const a = value / 5;
            for (let i = currentWeek - 1; i >= 1 && (currentWeek - i) !== a; i--) {
                const absenceResp2 = await getAbsence(this.props.cid, this.state.absenceState.period, i);
                itemsNew = deepmerge(absenceResp2.items, itemsNew)
                newCurrentWeek = i; 
                console.log('call for absence week ' + i)
            }

        };
        //TODO přepsat manipulaci s objektem
        let newAbsenceState = this.state.absenceState;
        newAbsenceState.items = itemsNew;
        newAbsenceState.numberOfRecords = value;
        newAbsenceState.currentWeek = newCurrentWeek;
        this.setState({ absenceState: newAbsenceState })
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
    }
    _handleChangePeriodAbsence = (e, isChecked) => {
        const newAbsenceState = this.state.absenceState;
        newAbsenceState.period = isChecked ? 2 : 1;
        this.setState({ absenceState: newAbsenceState });
        this._loadDefAbsence();
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
                    
                    classificationResponse: this.props.classificationResponse,
                    cid: this.props.cid,
                })}
            </div>
        );
    }
}

export default Main;