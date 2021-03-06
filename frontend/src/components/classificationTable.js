import React, { Component } from 'react';
import { map, length, append, repeat, unnest, prop, addIndex, takeLast, lt, splitEvery } from 'ramda';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
import Toggle from 'material-ui/Toggle';
import { styles } from '../styles/styles'

const indexedMap = addIndex(map);
const generateGrades = (row) => {
    const makeColumn = (item, index) => {
        return (
            <TableRowColumn key={index} className='gradesTableRow gradesColumn'>
                {getValue(item)}
            </TableRowColumn>)
    }
    const makeRow = (item, index) => (
        <TableRow key={index}>
            {indexedMap(makeColumn, item)}
        </TableRow>)
    return indexedMap(makeRow, splitEvery(5, insertBlank(prop('items', row))))
}
const getValue = prop('value');
const colSpanGradesHeader = () => lt(window.innerWidth, 680) ? 2 : 5
const insertBlank = (items) => lt(length(items), colSpanGradesHeader()) ? unnest(append(repeat({ value: '' }, colSpanGradesHeader() - length(items)), items)) : items;
const generateNameColumn = (name) => lt(window.innerWidth, 680) ? takeLast(4, name) : name;
const generateRow = (row, key) => {
    return (
        <TableRow key={key} style={{ 'height': '30px' }}>
            <TableRowColumn className='gradesTableRow subjectNameColumn' >{generateNameColumn(getValue(prop('header', row)))}</TableRowColumn>
            {generateGrades(row)}
            <TableRowColumn className='gradesTableRow  averageColumn'>{getValue(prop('total', row))}</TableRowColumn>
            <TableRowColumn className='gradesTableRow  absenceColumn'>{getValue(prop('absence', row))}</TableRowColumn>
        </TableRow>
    )
}
const generateHeaderRowDesktop = (width) => {
    return (
        <TableHeader displaySelectAll={false}
            adjustForCheckbox={false}
            enableSelectAll={false}>
            <TableRow>
                <TableHeaderColumn >Název předmětu</TableHeaderColumn>
                <TableHeaderColumn colSpan={colSpanGradesHeader()} style={styles.gradesColumnHeader} className='gradesColumnHeader'>Známky</TableHeaderColumn>
                <TableHeaderColumn style={styles.averageColumnHeader}>Výsledná známka</TableHeaderColumn>
                <TableHeaderColumn style={styles.absenceColumnHeader}>Absence</TableHeaderColumn>
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
                <TableHeaderColumn  >Známky</TableHeaderColumn>
                <TableHeaderColumn className='averageColumnHeader'>Výsledná známka</TableHeaderColumn>
                <TableHeaderColumn >Absence</TableHeaderColumn>
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
                            {generateGrades(row)}
                            <TableRowColumn className='gradesTableRow  averageColumn'>{getValue(prop('total', row))}</TableRowColumn>
                            <TableRowColumn >{getValue(prop('absence', row))}</TableRowColumn>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardText>
        </Card>
    )
}
const renderResponse = (items, generate) => {
    return items ? indexedMap((row, key) => generate(row, key), items) : null;
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

    _renderForDesktop = (items) => {
        return (
            <div>
                <Table selectable={false}>
                    <TableHeader displaySelectAll={false}
                        adjustForCheckbox={false}>
                    </TableHeader>
                    {generateHeaderRowDesktop(5)}
                    <TableBody displayRowCheckbox={false}>
                        {renderResponse(items, generateRow)}
                    </TableBody>
                </Table>
            </div>
        )
    }
    _renderForMobile = (items) => {
        return (
            <div>
                {renderResponse(items, generateRowMobile)}
            </div>
        )
    }
    render() {
        const { width } = this.state;
        const { classificationState } = this.props;
        const { period, fetchingData, items } = classificationState;
        const isMobile = width <= 540;
        const render = isMobile ? this._renderForMobile : this._renderForDesktop
        return (
            <div>
                <div style={styles.classificationTop}>
                    <div style={styles.absencePeriodSwitchContainer}>
                        <span style={styles.absencePeriodSwitchContainer.title}>Pololetí </span>
                        <Toggle
                            label="1."
                            trackSwitchedStyle={styles.trackSwitched}
                            thumbSwitchedStyle={styles.thumbSwitched}
                            trackStyle={styles.track}
                            thumbStyle={styles.thumb}
                            style={styles.periodSwitch}
                            toggled={period === 2 ? true : false}
                            onToggle={this.props.handlePeriodChange}
                        />
                        <span style={{ paddingRight: '10px' }}>2.</span>
                    </div>
                    {fetchingData ? <div className='loader-5' style={{ marginTop: '20px' }}><span></span></div> : null}
                </div>
                {render(items[period])}
            </div >
        );
    }
}

export default Grades;