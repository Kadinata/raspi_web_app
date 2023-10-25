//===========================================================================
//  
//===========================================================================
import React from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';

const useStyles = () => {
  const theme = useTheme();
  return ({
    container: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    circularProgress: {
      color: theme.palette.text.primary,
    },
  });
};

const Loading = ({ show, ...props }) => {

  const styles = useStyles();

  if (show) {
    return (
      <Box component="div" sx={styles.container}>
        <CircularProgress sx={styles.circularProgress} />
        <Typography>Loading</Typography>
      </Box>
    );
  }

  return (props.children || null);
};

Loading.defaultProps = {
  show: true,
};

export default Loading;
//===========================================================================