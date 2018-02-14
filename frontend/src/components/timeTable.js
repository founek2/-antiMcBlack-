import React from 'react';
import {styles} from '../styles/styles';

const TimeTable = (props) => {
      return (
            <iframe src={'http://localhost:8088/trida/' + props.class} style={styles.timeTableIframe} title='rozvrh'></iframe>
      )
}

export default TimeTable;