import React from 'react';
import {
  Grid,
  Typography,
} from '@mui/material';
import { useStyles } from './styles';

export const PinStatusHeader = (props) => {
  const styles = useStyles();
  return (
    <Grid container item alignItems="stretch" justifyContent="space-between" sx={styles.pinInfoContainer}>
      <Grid container item xs={5} alignContent="center" >
        <Typography sx={styles.headerLabel}>
          Pin
        </Typography>
      </Grid>
      <Grid container item xs={4} alignContent="center" >
        <Typography sx={styles.headerLabel}>
          Mode
        </Typography>
      </Grid>
      <Grid container item xs={3} alignContent="center" justifyContent="center" >
        <Typography sx={styles.headerLabel} align="right">
          Status
        </Typography>
      </Grid>
    </Grid>
  );
};

export const PinControlHeader = (props) => {
  const styles = useStyles();
  return (
    <Grid container item alignItems="stretch" justifyContent="space-between" sx={styles.pinInfoContainer}>
      <Grid container item xs={2} alignContent="center" justifyContent="center" />
      <Grid container item xs={4} alignContent="center" >
        <Typography sx={styles.headerLabel}>
          Pin
        </Typography>
      </Grid>
      <Grid container item xs={3} alignContent="center" justifyContent="center" >
        <Typography sx={styles.headerLabel} align="center">
          Output
        </Typography>
      </Grid>
      <Grid container item xs={3} alignContent="center" justifyContent="center" >
        <Typography sx={styles.headerLabel} align="right">
          State
        </Typography>
      </Grid>
    </Grid>
  );
};
