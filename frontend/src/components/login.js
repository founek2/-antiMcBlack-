import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import { Card, CardActions, CardTitle, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import { styles } from '../styles/styles'
import { pink500 } from 'material-ui/styles/colors';
import { path, assocPath } from 'ramda';

const getNameFromEvent = path(['target', 'name'])
const getValueFromEvent = path(['target', 'value'])

const setInput = (name,value ) => (state, props) => assocPath(['inputs', name], value, state);

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
        return (
            <div style={{ 'margin': 'auto', 'width': '50%' }}>
                <Card>
                    <CardTitle title='Login' titleColor={pink500} />
                    <CardText>
                        <TextField
                            type='username'
                            id='username'
                            name='username'
                            floatingLabelText="Username"
                            floatingLabelStyle={styles.textColor}
                            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                            underlineStyle={styles.underlineStyle}
                            underlineFocusStyle={styles.underlineFocusStyle}
                            onChange={this._handleOnChange}
                            value={path(['inputs','username'],this.state)}
                        />
                        <TextField
                            type='password'
                            id='password'
                            name='password'
                            floatingLabelText="Password"
                            floatingLabelStyle={styles.textColor}
                            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                            underlineStyle={styles.underlineStyle}
                            underlineFocusStyle={styles.underlineFocusStyle}
                            onChange={this._handleOnChange}
                            value={path(['inputs','password'],this.state)}                            
                        />
                    </CardText>
                    <CardActions>
                        <RaisedButton label="Login" secondary={true} />
                    </CardActions>
                </Card>
            </div >
        );
    }
}

export default Login;