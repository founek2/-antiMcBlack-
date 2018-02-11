import React, { Component } from 'react';
import { map, path, length, max, reduce, append, repeat, unnest, prop, addIndex, takeLast, lt } from 'ramda';
import response from "../apiResponses/gradesResponse";
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';

const indexedMap = addIndex(map);
const generateGrades = (row, maxValue) => {
    const makeRow = (item, index) => <TableRowColumn key={index} className='gradesTableRow gradesColumn'>{getValue(item)}</TableRowColumn>;
    return indexedMap(makeRow, insertBlank(prop('items', row), maxValue))
}
const getValue = prop('value');
const insertBlank = (items, max) => unnest(append(repeat({ value: '' }, max - length(items)), items));
const generateNameColumn = (name) => lt(window.innerWidth, 680) ? takeLast(4, name) : name;
const generateRow = (row, maxValue, key) => {
    return (
        <TableRow key={key} style={{ 'height': '30px' }}>
            <TableRowColumn className='gradesTableRow subjectNameColumn' >{generateNameColumn(getValue(prop('header', row)))}</TableRowColumn>
            {generateGrades(row, maxValue)}
            <TableRowColumn className='gradesTableRow ' style={{ width: '1em', 'height': '30px' }}>{getValue(prop('total', row))}</TableRowColumn>
            <TableRowColumn className='gradesTableRow ' style={{ width: '4em', 'height': '30px' }}>{getValue(prop('absence', row))}</TableRowColumn>
        </TableRow>
    )
}
const generateHeaderRowDestop = (width) => {
    return (
        <TableHeader displaySelectAll={false}
            adjustForCheckbox={false}
            enableSelectAll={false}>
            <TableRow>
                <TableHeaderColumn tooltip="Název předmětu">Název předmětu</TableHeaderColumn>
                <TableHeaderColumn colSpan={width} tooltip="Známky">Známky</TableHeaderColumn>
                <TableHeaderColumn tooltip="Výsledná známka">Výsledná známka</TableHeaderColumn>
                <TableHeaderColumn tooltip="Absence">Absence</TableHeaderColumn>
            </TableRow>
        </TableHeader>
    )
}
const generateHeaderRowMobile = (width) => {
    return (
        <TableHeader displaySelectAll={false}
            adjustForCheckbox={false}
            enableSelectAll={false}>
            <TableRow>
                <TableHeaderColumn colSpan={width.toString()} tooltip="Známky">Známky</TableHeaderColumn>
                <TableHeaderColumn tooltip="Výsledná známka">Výsledná známka</TableHeaderColumn>
                <TableHeaderColumn tooltip="Absence">Absence</TableHeaderColumn>
            </TableRow>
        </TableHeader>
    )
}
const generateRowMobile = (row, maxValue, key) => {
    return (
        <Card key={key} >
            <CardHeader
                title={getValue(prop('header', row))}
                actAsExpander={true}
                showExpandableButton={true} />
            <CardText expandable={true}>
                <Table selectable={false}>
                    <TableHeader displaySelectAll={false}
                        adjustForCheckbox={false}>
                        {generateHeaderRowMobile(maxValue)}
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                        <TableRow>
                            {generateGrades(row, maxValue)}
                            <TableRowColumn >{getValue(prop('total', row))}</TableRowColumn>
                            <TableRowColumn >{getValue(prop('absence', row))}</TableRowColumn>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardText>
        </Card>
    )
}
const renderResponse = (response, generate) => {
    const items = path(['response', 'items'], response)
    const counts = map((item) => length(item.items), items)
    const maxValue = reduce(max, -Infinity, counts)
    return indexedMap((row, key) => generate(row, maxValue, key), path(['response', 'items'], response));
}

class Grades extends Component {
    constructor() {
        super();
        this.state = {
            width: window.innerWidth,
        };
    }

    componentWillMount() {
        window.addEventListener('resize', this._handleWindowSizeChange);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._handleWindowSizeChange);
    }

    _handleWindowSizeChange = () => {
        this.setState({ width: window.innerWidth });
    };

    _renderForDesktop = () => {
        return (
            <div>
                <Table selectable={false} >
                    <TableHeader displaySelectAll={false}
                        adjustForCheckbox={false}>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                        {renderResponse(response, generateRow)}
                    </TableBody>
                </Table>
            </div>
        )
    }
    _renderForMobile = () => {
        return (
            <div>
                {renderResponse(response, generateRowMobile)}
            </div>
        )
    }
    render() {
        const { width } = this.state;
        const isMobile = width <= 540;
        const render = isMobile ? this._renderForMobile : this._renderForDesktop
        return (
            <div>
                {render()}
            </div>
        );
    }
}

export default Grades;