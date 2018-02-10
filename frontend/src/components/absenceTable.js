import React from 'react';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import json from '../apiResponses/absence';
import { map, insert, head, keys } from 'ramda';
import itemsValue from '../utils/valuesFromAbsenceItems';

const generateHeaderRow = (headerArray) => (
  <TableRow key={Math.random()} >
  {headerArray.map((item) => <TableHeaderColumn>{item}</TableHeaderColumn>, headerArray)}
  </TableRow >
);
  
const generateRows = (items) => map(generateCollumes, items);

const generateCollumes = (items) => {

  const collumes = map(generateCollume, itemsValue(items.items, 11))
  const collumesWithFirst = insert(0, (<TableRowColumn key={Math.random()} >{items.header.value.substring(0,7)}</TableRowColumn>), collumes)
  return (<TableRow key={Math.random()} >{collumesWithFirst}</TableRow>);
}

const generateCollume = (item) => (<TableRowColumn key={Math.random()} >{item.value}</TableRowColumn>);

const absenceTable = ({ items }) => {

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
        {generateRows(json.response.items)}
      </TableBody>
    </Table>
  )
}

export default absenceTable;