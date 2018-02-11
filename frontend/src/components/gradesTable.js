import React, { Component } from 'react';
import { map, path, length, max, reduce, append, repeat, unnest, prop, addIndex } from 'ramda';
import response from "../apiResponses/gradesResponse";
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card'
const indexedMap = addIndex(map);
const generateGrades = (row, maxValue) => {
    const makeRow = (item, index) => <TableRowColumn key={index}>{getValue(item)}</TableRowColumn>;
    return indexedMap(makeRow, insertBlank(prop('items', row), maxValue))
}
const getValue = prop('value');
const insertBlank = (items, max) => unnest(append(repeat({ value: '' }, max - length(items)), items));

const generateRow = (row, maxValue, key) => {
    return (
        <TableRow key={key}>
            <TableRowColumn style={{ width: '13em' }} >{getValue(prop('header', row))}</TableRowColumn>
            {generateGrades(row, maxValue)}
            <TableRowColumn >{getValue(prop('total', row))}</TableRowColumn>
            <TableRowColumn >{getValue(prop('absence', row))}</TableRowColumn>
        </TableRow>
    )
}
const generateRowMobile = (row, maxValue, key) => {
    return (
        <Card>
            <CardText >
                <TableRow key={key}>
                    <TableRowColumn  >{getValue(prop('header', row))}</TableRowColumn>
                    {generateGrades(row, maxValue)}
                    <TableRowColumn >{getValue(prop('total', row))}</TableRowColumn>
                    <TableRowColumn >{getValue(prop('absence', row))}</TableRowColumn>
                </TableRow>
            </CardText>
        </Card>
    )
}
const renderResponse = (response) => {
    const items = path(['response', 'items'], response)
    const counts = map((item) => length(item.items), items)
    const maxValue = reduce(max, -Infinity, counts)
    return indexedMap((row, key) => generateRowMobile(row, maxValue, key), path(['response', 'items'], response));
}

class Grades extends Component {
    state = {}

    render() {
        return (
            <div>
                <Table selectable={false} >
                    <TableHeader displaySelectAll={false}
                        adjustForCheckbox={false}>

                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                        {renderResponse(response)}
                    </TableBody>
                </Table>
            </div>
        );
    }
}

export default Grades;