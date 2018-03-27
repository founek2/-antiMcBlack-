import React from 'react';
import {styles} from '../styles/styles';

const TimeTable = (props) => {
      return (
            <iframe src={'https://skalicky-vps.spse-net.cz/trida/' + props.class} style={styles.timeTableIframe} title='rozvrh'></iframe>
      )
}

export default TimeTable;