import React from "react";
import {
      Table,
      TableBody,
      TableHeader,
      TableHeaderColumn,
      TableRow,
      TableRowColumn
} from "material-ui/Table";
import { insert, merge, reverse, slice, lt, takeWhile, map, append } from "ramda";
import itemsValue from "../utils/valuesFromAbsenceItems";
import { styles } from "../styles/styles";
import indexedMap from "../utils/indexedMap";
import { RadioButton, RadioButtonGroup } from "material-ui/RadioButton";
import { Card } from "material-ui/Card";
import Toggle from "material-ui/Toggle";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";
import { numberOfRecordsArray } from "../constants/index";

const generateHeaderRow = headerArray => (
      <TableRow>
            {indexedMap(
                  (item, idx) => (
                        <TableHeaderColumn
                              key={idx}
                              style={styles.tableRowColumme}
                              className={idx === 0 ? "tableHeaderColumnFirst" : null}
                        >
                              {item}
                        </TableHeaderColumn>
                  ),
                  headerArray
            )}
      </TableRow>
);

const generateRows = (items, numberOfRecords) =>
      indexedMap(generateColumns, slice(0, numberOfRecords, reverse(items)));

const generateColumns = (items, idx) => {
      const columns = indexedMap(generateColumn, itemsValue(items.items, 11)); //číslo pro počet buněk (doplní prázdné)
      const columnsWithFirst = insert(
            0,
            <TableRowColumn key={-1} style={styles.tableRowColumme} className="tableDateColumn">
                  {items.header.value.substring(0, 7)}
            </TableRowColumn>,
            columns
      );
      return <TableRow key={idx}>{columnsWithFirst}</TableRow>;
};

const generateColumn = (item, idx) => (
      <TableRowColumn
            key={idx}
            style={merge(styles.absenceKinds[item.kind], styles.tableRowColumme)}
            className="tableRowColumn"
            data-tooltip={item.comment[2]}
      >
            {item.value}
      </TableRowColumn>
);

const createRadButton = value => (
      <RadioButton value={value} label={value} style={styles.radioButton} key={value} />
);
const generateRadioButtons = totalWeek => {
      var isNotParNumber = totalNum => x => x < totalNum;
      const wantedNumbers = takeWhile(isNotParNumber(totalWeek * 5), numberOfRecordsArray);
      const radButtons = map(createRadButton, wantedNumbers);
      return append(
            <RadioButton
                  value={1000}
                  label="vše"
                  style={{ ...styles.radioButton, float: "none" }}
                  key="all"
            />,
            radButtons
      );
};
const AbsenceTable = ({ absenceState, handlePeriodChange, handleNumberOfRecords }) => (
      <Card>
            <div style={styles.absenceTop}>
                  <div style={styles.absencePeriodSwitchContainer}>
                        <span style={styles.absencePeriodSwitchContainer.title}>Pololetí </span>
                        <Toggle
                              label="1."
                              trackSwitchedStyle={styles.trackSwitched}
                              thumbSwitchedStyle={styles.thumbSwitched}
                              trackStyle={styles.track}
                              thumbStyle={styles.thumb}
                              style={styles.periodSwitch}
                              toggled={absenceState.period === 2 ? true : false}
                              onToggle={handlePeriodChange}
                        />
                        <span style={{ paddingRight: "10px" }}>2.</span>
                  </div>
                  {absenceState.fetchingData ? (
                        <div className="loader-5" style={{ marginTop: "20px" }}>
                              <span />
                        </div>
                  ) : null}
                  <RadioButtonGroup
                        style={styles.absenceRadioButtonGroup}
                        name="numberOfRecords"
                        labelPosition="right"
                        onChange={handleNumberOfRecords}
                        valueSelected={absenceState.numberOfRecords}
                        iconStyle={styles.absenceRadioButtonIcon}
                        className="numberOfRecordsRadio"
                  >
                        {generateRadioButtons(absenceState.totalWeek)}
                  </RadioButtonGroup>
                  <SelectField
                        floatingLabelText="Počet dnů"
                        onChange={handleNumberOfRecords}
                        value={absenceState.numberOfRecords}
                        className="numberOfRecordsSelect"
                        style={{ width: "100px" }}
                  >
                        <MenuItem value={5} primaryText="5" />
                        <MenuItem value={10} primaryText="10" />
                        <MenuItem value={20} primaryText="20" />
                        <MenuItem value={50} primaryText="50" />
                        <MenuItem value={1000} primaryText="vše" />
                  </SelectField>
            </div>
            <Table style={styles.absenceTableHeaderRow} selectable={false}>
                  <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                        {generateHeaderRow([
                              "Datum",
                              "0.",
                              "1.",
                              "2.",
                              "3.",
                              "4.",
                              "5.",
                              "6.",
                              "7.",
                              "8.",
                              "9.",
                              "10."
                        ])}
                  </TableHeader>
                  <TableBody displayRowCheckbox={false} className="absenceTable">
                        {absenceState.items[absenceState.period] &&
                        absenceState.items[absenceState.period].length > 0
                              ? generateRows(
                                      absenceState.items[absenceState.period],
                                      absenceState.numberOfRecords
                                )
                              : null}
                  </TableBody>
            </Table>
      </Card>
);

export default AbsenceTable;
