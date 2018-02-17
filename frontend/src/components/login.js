import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import { Card, CardActions, CardTitle, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import { styles } from '../styles/styles'
import { pink500 } from 'material-ui/styles/colors';
import { path, assocPath } from 'ramda';

const getNameFromEvent = path(['target', 'name'])
const getValueFromEvent = path(['target', 'value'])

const setInput = (name,value ) => (state, props) => assocPath(['inputs', name, 'value'], value, state);

class Login extends Component {
    constructor(props){
        super(props)
        this.state = {
            inputs: {
                password: {value: '', valid: true, errorMessage: 'Password musí mít min. délku 5 znaků'},
                username: {value: '', valid: true, errorMessage: 'Username musí mít min. délku 3 znaky'}
            },
        }
    }

    _handleOnChange = (e) => {
        this.setState(setInput(getNameFromEvent(e), getValueFromEvent(e)));
    }

    _handleLogin = () => {
        const userName = path(['inputs','username', 'value'],this.state);
        const passwd = path(['inputs','password', 'value'],this.state);
        let newState = this.state;

        if(passwd.length < 5){
            newState = assocPath(['inputs', 'password', 'valid'], false, newState)
        } else {
            newState = assocPath(['inputs', 'password', 'valid'], true, newState)
        }
        if (userName.length < 3){
         newState =  assocPath(['inputs', 'username', 'valid'], false, newState)
        }else {
            newState =  assocPath(['inputs', 'username', 'valid'], true, newState)
        }
        this.setState(newState) 
       
        const inputsState = newState.inputs;
        inputsState.username.valid && inputsState.password.valid && this.props.handleLogin(userName, passwd)
    }

    render() {
        console.log('login render')
        return (
            <div >
                <Card className='loginCard'>
                    <CardTitle title='- McWhite -' titleColor={pink500} />
                    <CardText >
                        <TextField
                            type='username'
                            name='username'
                            floatingLabelText="Username"
                            floatingLabelStyle={styles.textColor}
                            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                            underlineStyle={styles.underlineStyle}
                            underlineFocusStyle={styles.underlineFocusStyle}
                            onChange={this._handleOnChange}
                            value={path(['inputs','username', 'value'],this.state)}
                            onKeyPress={(e) => e.key === 'Enter' && this._handleLogin()}
                            errorText={!path(['inputs','username', 'valid'],this.state) && path(['inputs','username', 'errorMessage'],this.state)}
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
                            value={path(['inputs','password', 'value'],this.state)}
                            onKeyPress={(e) => e.key === 'Enter' && this._handleLogin()}                            
                            errorText={(!path(['inputs','password', 'valid'],this.state) && path(['inputs','password', 'errorMessage'],this.state)) || this.props.logError}
                            />
                    </CardText>
                    <CardActions>
                        <RaisedButton 
                            label="Login" 
                            onClick={this._handleLogin}
                            icon={this.props.logInProggres ? <div className='loader-5 center'><span></span></div> : null}
                            style={styles.loginButton}
                            labelStyle={styles.loginButtonLabel}
                         />
                    </CardActions>
                </Card>
            </div >
        );
    }
}

export default Login;