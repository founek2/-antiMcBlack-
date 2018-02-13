import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import { Card, CardActions, CardTitle, CardText } from 'material-ui/Card';
import Button from 'material-ui/Button';
import { styles } from '../styles/styles'
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import pink from 'material-ui/colors/pink';
import { path, assocPath } from 'ramda';
console.log(Button)
const stylesGrid = theme => ({
    root: {
        flexGrow: 1,
        marginTop: 30,
    },
    paper: {
        padding: 16,
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
});

const getNameFromEvent = path(['target', 'name'])
const getValueFromEvent = path(['target', 'value'])

const setInput = (name, value) => (state, props) => assocPath(['inputs', name], value, state);

class Login extends Component {
    state = {
        inputs: {
            password: '',
            username: ''
        }
    }

    _handleOnChange = (e) => {
        this.setState(setInput(getNameFromEvent(e), getValueFromEvent(e)));
    }

    render() {
        const { classes } = this.props;
        return (
            <div style={{ 'margin': 'auto', 'width': '30%' }}>
                <Card>
                    <CardTitle title='McWhite' titleColor={pink[500]} style={{ 'text-align': 'center' }} />
                    <CardText style={{ 'text-align': 'center' }}>
                        <TextField
                            type='username'
                            name='username'
                            floatingLabelText="Username"
                            floatingLabelStyle={styles.textColor}
                            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                            underlineStyle={styles.underlineStyle}
                            underlineFocusStyle={styles.underlineFocusStyle}
                            onChange={this._handleOnChange}
                            value={path(['inputs', 'username'], this.state)}
                        />
                        <TextField
                            type='password'
                            name='password'
                            floatingLabelText="Password"
                            floatingLabelStyle={styles.textColor}
                            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                            underlineStyle={styles.underlineStyle}
                            underlineFocusStyle={styles.underlineFocusStyle}
                            onChange={this._handleOnChange}
                            value={path(['inputs', 'password'], this.state)}
                        />
                    </CardText>
                    <CardActions style={{ 'text-align': 'center' }}>
                        <Button label="Login" secondary={true} variant="raised" />
                    </CardActions>
                </Card>
            </div >
        );
    }
}

export default Login;