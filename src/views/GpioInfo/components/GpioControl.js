import React from 'react';
import { SubmitButton } from '../../../components/Button';
import { PinControlHeader } from './PinRowHeaders';
import { useGpioControlSubmit } from '../../../modules/gpio/GpioControlStateProvider';
import PinControl from './PinControl';
import { useTheme } from '@mui/material/styles';
import {
  Grid,
} from '@mui/material';
import { usePageContentData } from '../../../components/PageContentController';

const useStyles = () => {
  const theme = useTheme();
  return ({
    submitButton: {
      marginTop: theme.spacing(1),
      marginLeft: theme.spacing(2),
    },
  });
};

const GpioSubmitButton = () => {
  const styles = useStyles();
  const { handleSubmit, disableSubmit } = useGpioControlSubmit();

  return (
    <SubmitButton
      type="submit"
      variant="contained"
      color="primary"
      disabled={disableSubmit()}
      onClick={handleSubmit}
      sx={styles.submitButton}
    >
      Apply
    </SubmitButton>
  );
};

const GpioControl = ({ pinLayout, ...props }) => {

  const { usablePins = [] } = usePageContentData();
  const halfCount = usablePins.length / 2;

  console.log('[Rendering] GpioControl');

  const leftColPins = usablePins.filter((pinNum, index) => (index < halfCount));
  const rightColPins = usablePins.filter((pinNum, index) => (index >= halfCount));

  const leftColumn = leftColPins.map((pinNum) => (
    <PinControl pinNum={pinNum} label={`GPIO ${pinNum}`} key={pinNum} />
  ));

  const rightColumn = rightColPins.map((pinNum) => (
    <PinControl pinNum={pinNum} label={`GPIO ${pinNum}`} key={pinNum} />
  ));

  return (
    <React.Fragment>
      <Grid container>
        <Grid container item sm={6} xs={12}>
          <PinControlHeader key={'header'} />
          {leftColumn}
        </Grid>
        <Grid container item sm={6} xs={12}>
          <Grid container item sx={{ display: { xs: 'none', sm: 'flex' } }}>
            <PinControlHeader key={'header'} />
          </Grid>
          {rightColumn}
        </Grid>
      </Grid>
      <GpioSubmitButton />
    </React.Fragment>
  );
};

export default GpioControl;