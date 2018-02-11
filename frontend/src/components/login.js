import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import { Card, CardActions, CardTitle, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import { styles } from '../styles/styles'
import { pink500 } from 'material-ui/styles/colors';
import { path, assocPath, prop } from 'ramda';

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

    _handleSubmit = (e)=>{
        console.log('====================================');
        console.log('lets fetch some data');
        console.log('this data will be send to backend');
        console.log(prop('inputs',this.state));
        console.log('====================================');
    }
    encodeToken= (a, b) =>{
        var d, c = (255 * Math.random() ^ 255 * Math.random() + 255 * Math.random()) & 255, e = 15 < c ? c.toString(16) : "0" + c.toString(16);
        a = ":" + a + ":" + b + ":" + Date.now();
        b = 10 + 10 * Math.random();
        for (d = ""; d.length < b; )
            d += "./abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".charAt(64 * Math.random());
        a = d + a;
        for (b = 0; b < a.length; b++)
            d = a.charCodeAt(b) ^ c,
            e += 15 < d ? d.toString(16) : "0" + d.toString(16),
            d = (c & 1 ^ 1) << 7,
            c = c >> 1 & 127 | d;
        return e
    }
    render() {
        return (
            <div >
                <Card className='loginCard'>
                    <CardTitle title='McWhite' titleColor={pink500} />
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
                            value={path(['inputs','username'],this.state)}
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
                            value={path(['inputs','password'],this.state)}                            
                        />
                    </CardText>
                    <CardActions style={styles.loginCardActions}>
                        <RaisedButton 
                            label="Login" 
                            onClick={() => this.props.handleLogin(path(['inputs','username'],this.state), path(['inputs','password'],this.state))}
                         />
                    </CardActions>
                </Card>
            </div >
        );
    }
}

export default Login;