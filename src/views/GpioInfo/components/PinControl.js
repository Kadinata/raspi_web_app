import React from 'react';
import { StyledSwitch } from '../../../components/Switch';
import {
  Grid,
  Typography,
  Checkbox,
} from '@mui/material';
import { useGpioPinController } from '../../../modules/gpio/GpioController';
import { useStyles } from './styles';

const _ID_USED = "used";
const _ID_OUTPUT = "output";
const _ID_HIGH = "high";

const initialState = {
  [_ID_USED]: false,
  [_ID_OUTPUT]: false,
  [_ID_HIGH]: false,
};

const usePinControlState = ({ pin, onChange }) => {

  const handleChange = React.useCallback(({ target }) => {
    const { id, checked } = target;
    if ((id === _ID_USED) && (checked === false)) {
      const newState = {
        [_ID_USED]: false,
        [_ID_OUTPUT]: false,
        [_ID_HIGH]: false,
        pin,
      };
      onChange(newState);
    } else {
      onChange({ [id]: !!checked, pin });
    }
  }, [onChange, pin]);

  return { handleChange };
};

const PinControl = ({ label, pinNum, ...props }) => {

  const styles = useStyles();
  const { handleChange: onChange, pinControlstate: controlState } = useGpioPinController(pinNum);

  const { handleChange } = usePinControlState({
    pin: pinNum,
    onChange: (newState) => onChange({ ...initialState, ...controlState, ...newState }),
  });

  return (
    <Grid container item alignItems="stretch" justifyContent="space-between" sx={styles.pinInfoContainer}>
      <Grid container item xs={2} alignContent="center" justifyContent="flex-start" >
        <Checkbox
          size="small"
          color="default"
          id={_ID_USED}
          checked={!!controlState[_ID_USED]}
          onChange={handleChange}
        />
      </Grid>
      <Grid container item xs={4} alignContent="center" >
        <Typography sx={styles.label}>
          {label}
        </Typography>
      </Grid>
      <Grid container item xs={3} alignContent="center" justifyContent="center">
        <StyledSwitch
          size="small"
          id={_ID_OUTPUT}
          checked={!!controlState[_ID_OUTPUT]}
          disabled={!controlState[_ID_USED]}
          onChange={handleChange}
        />
      </Grid>
      <Grid container item xs={3} alignContent="center" justifyContent="center">
        <StyledSwitch
          size="small"
          id={_ID_HIGH}
          checked={!!controlState[_ID_HIGH]}
          disabled={!controlState[_ID_USED]}
          onChange={handleChange}
        />
      </Grid>
    </Grid>
  );
};

PinControl.defaultProps = {
  pinNum: -1,
  onChange: () => { },
};

export default PinControl;