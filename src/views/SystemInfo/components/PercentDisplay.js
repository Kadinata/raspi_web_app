import React from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Grid,
  Typography,
} from '@mui/material';
import { PercentCircle } from '../../../components/ProgressCircle';

const useStyles = () => {
  const theme = useTheme();
  return ({
    container: {
      display: 'flex',
      padding: theme.spacing(1),
    },
    infoBox: {
      display: 'flex',
      padding: theme.spacing(1),
      paddingLeft: theme.spacing(1),
      [theme.breakpoints.up('lg')]: {
        paddingLeft: theme.spacing(2),
      },
    },
    progressBar: {
      display: 'flex',
      minWidth: '56px',
      paddingTop: theme.spacing(1),
      paddingRight: theme.spacing(1),
      paddingLeft: theme.spacing(1),
      // [theme.breakpoints.up('md')]: {
      //   paddingRight: theme.spacing(1),
      //   paddingLeft: theme.spacing(1),
      // },
    },
    rowLabel: {
      flexGrow: 1,
    },
    titleText: {
      flexGrow: 1,
      fontWeight: theme.typography.fontWeightBold,
      borderBottom: '1px solid',
      marginBottom: '0.2rem',
    },
  });
};

const RowItem = ({ label, value, unit, key }) => {
  const styles = useStyles();
  return (
    <Grid container item key={key}>
      <Typography align="left" sx={styles.rowLabel}>{label}</Typography>
      <Typography align="right">{`${value} ${unit}`}</Typography>
    </Grid>
  );
};

const InfoTable = ({ rows, title }) => {

  const styles = useStyles();

  const tableRows = rows.map((data, key) => RowItem({ ...data, key }));

  const titleRow = (title) && (
    <Typography align='left' sx={styles.titleText}>
      {title}
    </Typography>
  );

  return (
    <Grid container item >
      {titleRow}
      {tableRows}
    </Grid>
  );
};

const PercentDisplay = ({ percent, title, rows, key, ...props }) => {

  const styles = useStyles();

  return (
    <Grid container item {...props}>
      <Grid container item alignItems="center" key={key}>
        <Grid container item xs={3}
          alignItems="center"
          sx={styles.progressBar}>
          <PercentCircle value={percent} />
        </Grid>
        <Grid container item xs={9}
          direction="column"
          sx={styles.infoBox}>
          <InfoTable rows={rows} title={title} />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PercentDisplay;