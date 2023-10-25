import React from 'react';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const useStyles = () => {

  const theme = useTheme();
  return ({
    tabPanel: {
      paddingTop: theme.spacing(2),
    },
  });
};

export const TabPanel = ({ children, value, index, ...props }) => {
  const styles = useStyles();
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      sx={styles.tabPanel}
      {...props}
    >
      {(value === index) && children}
    </Box>
  );
};