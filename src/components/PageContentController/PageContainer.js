//===========================================================================
//  
//===========================================================================
import React from "react";
import { useTheme } from "@mui/material/styles";
import { Grid } from "@mui/material";

const useStyles = () => {
  const theme = useTheme();
  return ({
    pageContainer: {
      display: 'flex',
      flex: 1,
      padding: 3,
      paddingTop: 2,
      [theme.breakpoints.down('lg')]: {
        padding: 1,
      },
    },
  });
};

const PageContainer = ({ children, ...rest }) => {

  const styles = useStyles();

  return (
    <Grid
      container
      direction="column"
      wrap="nowrap"
      alignItems="stretch"
      spacing={0}
      sx={styles.pageContainer}
    >
      {children}
    </Grid>
  );
};

export default PageContainer;
//===========================================================================