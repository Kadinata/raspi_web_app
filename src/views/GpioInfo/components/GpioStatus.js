import React from 'react';
import { PinStatusHeader } from './PinRowHeaders';
import PinStatus from './PinStatus';
import {
  Grid,
  Hidden,
} from '@mui/material';
import { useGpioStreamContext } from '../../../modules/gpio/GpioDataStreamProvider';

const isOutput = (gpioState, pinNum) => {
  if (!pinNum && (pinNum !== 0)) return false;
  const oenable = gpioState[pinNum] & (1 << 1);
  return oenable;
};

const isHigh = (gpioState, pinNum) => {
  if (!pinNum && (pinNum !== 0)) return false;
  const oenable = gpioState[pinNum] & (1 << 0);
  return oenable;
};

const GpioStatus = ({ pinLayout, ...props }) => {

  console.log('[Rendering]: GpioStatus ');
  const gpioState = useGpioStreamContext();

  const leftColPins = pinLayout.filter((value, index) => (index % 2 === 0));
  const rightColPins = pinLayout.filter((value, index) => (index % 2 !== 0));

  const leftColumn = leftColPins.map((pinConfig, index) => (
    <PinStatus
      key={index}
      label={pinConfig.label}
      pinType={pinConfig.type}
      oenable={isOutput(gpioState, pinConfig.gpioNum)}
      high={isHigh(gpioState, pinConfig.gpioNum)}
    />
  ));

  const rightColumn = rightColPins.map((pinConfig, index) => (
    <PinStatus
      key={index}
      label={pinConfig.label}
      pinType={pinConfig.type}
      oenable={isOutput(gpioState, pinConfig.gpioNum)}
      high={isHigh(gpioState, pinConfig.gpioNum)}
    />
  ));

  return (
    <React.Fragment>
      <Grid container>
        <Grid container item sm={6} xs={12}>
          <PinStatusHeader />
          {leftColumn}
        </Grid>
        <Grid container item sm={6} xs={12}>
          <Hidden xsDown>
            <PinStatusHeader />
          </Hidden>
          {rightColumn}
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default GpioStatus;