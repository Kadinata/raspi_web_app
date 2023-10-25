//===========================================================================
//  
//===========================================================================
import React from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Typography,
  Grid,
} from '@mui/material';

const useStyles = () => {

  const theme = useTheme();

  return ({
    container: {
      padding: theme.spacing(1),
      [theme.breakpoints.up('md')]: {
        padding: theme.spacing(2),
      }
    },
  });
};

const PageTitle = ({ children, ...props }) => {
  const styles = useStyles();
  return (
    <Grid container item alignItems="stretch" justifyContent="flex-start" sx={styles.container}>
      <Typography component="h4" variant="h4" align="left">
        {children}
      </Typography>
    </Grid>
  );
};

export default PageTitle;
//===========================================================================