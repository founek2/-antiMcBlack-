import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import { Card, CardActions, CardTitle, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import { styles } from '../styles/styles'
import { pink500 } from 'material-ui/styles/colors';
import { path, assocPath } from 'ramda';

class Login extends Component {


    render() {
        return (
            <div >
                <Card className='defaultCard'>
                    <CardTitle title='McWhite' titleColor={pink500} />
                    <CardText >
                    </CardText>
                </Card>
            </div >
        );
    }
}

export default Login;