import React from 'react';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import { map, insert, head, keys, merge, addIndex } from 'ramda';
import itemsValue from '../utils/valuesFromAbsenceItems';
import { styles } from '../styles/styles';
import mapIndexed from '../utils/mapIndex';
import json from '../apiResponses/absence';

const generateHeaderRow = (headerArray) => (
  <TableRow >
  {mapIndexed((item, idx) => 
    <TableHeaderColumn key={idx} style={styles.tableRowColumme}>{item}</TableHeaderColumn>, headerArray)}
  </TableRow >
);
  
const generateRows = (items) => mapIndexed(generateCollumes, items);

const generateCollumes = (items, idx) => {

  const collumes = mapIndexed(generateCollume, itemsValue(items.items, 11)) //číslo pro počet buněk (doplní prázdné)
  const collumesWithFirst = insert(0, (<TableRowColumn key={-1} style={styles.tableRowColumme}>{items.header.value.substring(0,7)}</TableRowColumn>), collumes)
  return (<TableRow key={idx} >{collumesWithFirst}</TableRow>);
}

const generateCollume = (item, idx) => (<TableRowColumn key={idx} style={merge(styles['tableRowColummeKind' + item.kind], styles.tableRowColumme)}>{item.value}</TableRowColumn>);

const absenceTable = ({response}) => {
  console.log(response)
  return (
    <Table>
      <TableHeader
        displaySelectAll={false}
        adjustForCheckbox={false}
      >
        {generateHeaderRow(['Datum', '0.', '1.', '2.', '3.', '4.', '5.', '6.', '7.', '8.', '9.', '10.'])}
      </TableHeader>
      <TableBody
        displayRowCheckbox={false}
      >
        {generateRows(response.items)}
      </TableBody>
    </Table>
  )
}

export default absenceTable;