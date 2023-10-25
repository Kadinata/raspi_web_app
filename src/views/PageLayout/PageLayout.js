//===========================================================================
//  
//===========================================================================
import React from 'react';
import { Box } from '@mui/material';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';

const useStyles = () => {

  return ({
    layoutContainer: {
      display: 'flex',
      minHeight: '100vh',
      fontSize: 'calc(10px + 2vmin)',
      flexGrow: 1,
    },
    layoutContent: {
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
      height: '100vh',
      overflow: 'auto',
    },
  });
};

const PageLayout = ({ children, noTopbar, routes, ...props }) => {

  const styles = useStyles();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  return (
    <Box component="div" sx={styles.layoutContainer}>
      <Sidebar routes={routes} open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <Box component="main" sx={styles.layoutContent}>
        {!noTopbar && <Topbar onDrawerOpen={() => setDrawerOpen(true)} />}
        {children}
      </Box>
    </Box>
  );
};

export default PageLayout;
//===========================================================================