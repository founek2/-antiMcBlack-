import React from 'react';
import {styles} from '../styles/styles';

const TimeTable = (props) => {
      return (
            <iframe src={'http://localhost:8080/trida/' + props.class} style={styles.timeTableIframe} ></iframe>
      )
}

export default TimeTable;