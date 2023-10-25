//===========================================================================
//  
//===========================================================================
import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Grid } from '@mui/material';
import { ErrorBar } from '../Alert';

const useStyles = () => {
  const theme = useTheme();
  return ({
    container: {
      padding: 1,
      [theme.breakpoints.up('md')]: {
        padding: 2,
      }
    },
  })
};

const PageError = ({ error, ...props }) => {
  const styles = useStyles();
  const { message } = error || {};
  if (message) {
    console.log('error: ', error);
    return (
      <Grid container item alignItems="stretch" justifyContent="flex-start" sx={styles.container}>
        <ErrorBar variant="filled" show>
          {message}
        </ErrorBar>
      </Grid>
    );
  }

  return (props.children || null);
};

export default PageError;
//===========================================================================