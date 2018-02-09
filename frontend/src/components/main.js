import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import MenuItem from 'material-ui/MenuItem';
import Drawer from 'material-ui/Drawer';
import { styles } from '../styles/styles';

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
        this.state = { open: false };
    }

    handleToggle = () => this.setState({ open: !this.state.open });

    render() {
        return (
            <div style={{height: 'inherit'}}>
                <AppBar
                    title={"Intranet"}
                    iconElementRight={<Logged />}
                    onLeftIconButtonClick={this.handleToggle}
                    titleStyle={styles.appBarTitle}
                    style={styles.appBar}
                />
            <div className='drawerContainer'>
                <Drawer open={this.state.open} containerStyle={styles.drawerContainer}>
                    <MenuItem>Menu Item</MenuItem>
                    <MenuItem>Menu Item 2</MenuItem>
                </Drawer>
                </div>
            </div>
        );
    }
}

export default Main;