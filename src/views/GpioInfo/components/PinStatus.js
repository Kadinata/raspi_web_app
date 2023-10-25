import React from 'react';
import {
  Grid,
  Typography,
} from '@mui/material';
import { useStyles } from './styles';

const GpioState = ({ oenable, high, locked, ...rest }) => {
  const styles = useStyles();
  const mode = (!!oenable) ? 'OUT' : 'IN';
  const circle = '\u2B24';
  return (
    <React.Fragment>
      <Grid container item xs={4} alignContent="center" >
        <Typography sx={oenable ? styles.pinModeEnabled : styles.pinModeDisabled}>
          {mode}
        </Typography>
      </Grid>
      <Grid container item xs={3} alignContent="center" justifyContent="center">
        <Typography sx={high ? styles.pinStateHigh : styles.pinStateLow}>
          {circle}
        </Typography>
      </Grid>
    </React.Fragment>
  );
};

const PinStatus = ({ label, pinType, oenable, high, locked, ...props }) => {

  const styles = useStyles();
  const isGpio = !!(pinType === 'gpio');
  let labelClass = styles.label;
  switch (pinType) {
    case 'power':
      labelClass = styles.powerPinLabel;
      break;
    case 'ground':
      labelClass = styles.groundPinLabel;
      break;
    case 'misc':
      labelClass = styles.miscPinLabel;
      break;
    default:
      labelClass = styles.label;
  }

  return (
    <Grid container item alignItems="stretch" justifyContent="space-between" sx={styles.pinInfoContainer}>
      <Grid container item xs={5} alignContent="center" >
        <Typography sx={labelClass}>
          {label}
        </Typography>
      </Grid>
      {isGpio && (<GpioState oenable={oenable} high={high} locked={locked} />)}
    </Grid>
  );
};

export default PinStatus;