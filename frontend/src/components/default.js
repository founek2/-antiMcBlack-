import React, { Component } from 'react';
import { Card, CardActions, CardTitle, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import { pink500 } from 'material-ui/styles/colors';

class Default extends Component {


    render() {
        return (
            <div >
                <Card className='defaultCard'>
                    <CardTitle title='McWhite' titleColor={pink500} />
                    <CardText >
                        <p>Tento projekt je vytvářen dvěma studenty ve volném čase jako lepší alternative k Intranetu SPŠE
                             s využitím nových technologií. Frontend je napsaný v knihovně React s
                              využitím <a href='http://www.material-ui.com'>material-ui</a> komponent.</p>
                    </CardText>
                </Card>
            </div >
        );
    }
}

export default Default;