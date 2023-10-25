import React from 'react';

import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const PercentCircle = ({ value, ...props }) => {
  return (
    <CircularProgressbar
      value={value}
      text={`${value.toFixed(0)}%`}
      circleRatio={0.75}
      styles={buildStyles({
        rotation: 1 / 2 + 1 / 8,
        strokeLinecap: 'butt',
        pathColor: '#f8c04e',
        textColor: '#f8c04e',
        trailColor: '#e0e0e0',
      })}
    />
  );
};

export default PercentCircle;