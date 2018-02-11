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
import json from '../apiResponses/absence';
import { assoc } from 'ramda';
import ClickOutside from 'react-click-outside';
import Default from './default';

const menuComponents = {
    default: <Default />,
    absence: <AbsenceTable response={json.response} />,
    classification: 'Klasifikace',
    files: 'Soubory (in far future)'
};

class Logged extends Component {

    render() {
        const props = this.props;
        return (<div>
            <IconMenu
                {...props}
                iconButtonElement={
                    <IconButton><MoreVertIcon /></IconButton>
                }
                targetOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
            >
                <MenuItem primaryText="Refresh" />
                <MenuItem primaryText="Help" />
                <MenuItem primaryText="Sign out" />
            </IconMenu>
        </div>)
    }
};

Logged.muiName = 'IconMenu';

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            activeComponent: 'default',
            menuItemsStyles: {}
        };
    }
    handleClickOutside() {
        this._handleESC();
    }
    _handleToggleDrawer = () => {
        this.setState({ open: !this.state.open });
        console.log(this.state.open)
    }
    _handleESC = () => this.state.open ? this.setState({ open: false }) : null;
    _handleItemSelect = (e, menuItem, i) => {
        if (menuItem.props.value) this.setState({ activeComponent: menuItem.props.value });

        const menuItemsStyles = { [menuItem.props.value]: styles.menuItemFocused }
        this.setState({ menuItemsStyles });
    }
    render() {
        return (
            <div style={{ height: 'inherit' }}>
                <ClickOutside onClickOutside={this._handleESC}>
                    <AppBar
                        title={"Intranet"}
                        iconElementRight={<Logged />}
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
                {menuComponents[this.state.activeComponent]}
            </div>
        );
    }
}

export default Main;