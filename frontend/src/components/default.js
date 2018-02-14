import React, { Component } from 'react';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import { pink500 } from 'material-ui/styles/colors';

class Default extends Component {


    render() {
        return (
            <div >
                <Card className='defaultCard'>
                    <CardTitle title='- McWhite -' titleColor={pink500} />
                    <CardText >
                        <p>Tento projekt je vytvářen dvěma studenty ve volném čase jako lepší alternative k Intranetu SPŠE
                             s využitím nových technologií. Frontend je napsaný v knihovně React s
                              využitím <a href='http://www.material-ui.com'>material-ui</a> komponent.</p>
                        <p>Nikdy nejsou ukládána uživatelská data na backendu. Requesty z frontendu se pouze přeposílají na api.spse.cz.</p>
                    </CardText>
                </Card>
            </div >
        );
    }
}

export default Default;