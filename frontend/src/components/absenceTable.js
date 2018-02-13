import React, { Component } from 'react';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import { insert, merge, reverse, slice, compose, prop, lt } from 'ramda';
import itemsValue from '../utils/valuesFromAbsenceItems';
import { styles } from '../styles/styles';
import mapIndexed from '../utils/mapIndex';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import { Card, CardActions, CardTitle, CardText } from 'material-ui/Card';
import { getAbsence } from '../api'
import deepmerge from 'deepmerge';
import Toggle from 'material-ui/Toggle';
import CircularProgress from 'material-ui/CircularProgress';
const mobileView = () => lt(window.innerWidth, 580)

const generateHeaderRow = (headerArray) => (
  <TableRow >
    {mapIndexed((item, idx) =>
      <TableHeaderColumn key={idx} style={styles.tableRowColumme} className={idx===0?'tableHeaderColumnFirst':null}>{item}</TableHeaderColumn>, headerArray)}
  </TableRow >
);

const generateRows = (items, numberOfRecords) => mapIndexed(generateColumns, slice(0, numberOfRecords, reverse(items)));

const generateColumns = (items, idx) => {

  const columns = mapIndexed(generateColumn, itemsValue(items.items, 11)) //číslo pro počet buněk (doplní prázdné)
  const columnsWithFirst = insert(0, (<TableRowColumn key={-1} style={styles.tableRowColumme} className='tableDateColumn'>{items.header.value.substring(0, 7)}</TableRowColumn>), columns)
  return (<TableRow key={idx} >{columnsWithFirst}</TableRow>);
}

const generateColumn = (item, idx) => (<TableRowColumn key={idx} style={merge(styles['tableRowColummeKind' + item.kind], styles.tableRowColumme)} className='tableRowColumn'>{item.value}</TableRowColumn>);

const AbsenceTable = (props) => (
  <Card >
    <div style={styles.absenceTop}>
      <div style={styles.absencePeriodSwitchContainer}>
        <Toggle
          label="Pololetí 1."
          style={styles.toggle}
          trackSwitchedStyle={styles.trackSwitched}
          thumbSwitchedStyle={styles.thumbSwitched}
          style={styles.periodSwitch}
          toggled={props.absenceState.period === 2 ? true : false}
          onToggle={props.handlePeriodChange}
        />
        <span>2.</span>
        <CircularProgress size={25} thickness={3} style={!props.absenceState.fetchingData ? {display: 'none'} : {}}/>
      </div>
      <RadioButtonGroup style={{ width: '300px' }} name="numberOfRecords" defaultSelected="10" labelPosition='right' onChange={props.handleNumberOfRecords}>
        <RadioButton
          value="5"
          label="5"
          style={styles.radioButton}
        />
        <RadioButton
          value="10"
          label="10"
          style={styles.radioButton}
        />
        <RadioButton
          value="20"
          label="20"
          style={styles.radioButton}
        />
        <RadioButton
          value="50"
          label="50"
          style={{ ...styles.radioButton, float: 'none' }}
        />
      </RadioButtonGroup>
    </div>
    <Table style={styles.absenceTableHeaderRow}>
      <TableHeader
        displaySelectAll={false}
        adjustForCheckbox={false}
      >
        {generateHeaderRow(['Datum', '0.', '1.', '2.', '3.', '4.', '5.', '6.', '7.', '8.', '9.', '10.'])}
      </TableHeader>
      <TableBody
        displayRowCheckbox={false}
      >
        {generateRows(props.absenceState.items, props.absenceState.numberOfRecords)}
      </TableBody>
    </Table>
  </Card>
)



export default AbsenceTable;