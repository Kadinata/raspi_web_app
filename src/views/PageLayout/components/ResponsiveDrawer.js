//===========================================================================
//
//===========================================================================
import React from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Drawer,
  Box,
  IconButton,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const drawerWidth = 240;

const useStyles = () => {

  const theme = useTheme();
  return ({
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 2),
      ...theme.mixins.toolbar,
    },
    drawer: {
      '& .MuiDrawer-paper': {
        boxSizing: 'border-box',
        width: drawerWidth,
      },
    },
    smDrawer: {
      display: 'block',
      [theme.breakpoints.up('md')]: {
        display: 'none',
      }
    },
    mdDrawer: {
      display: 'none',
      [theme.breakpoints.up('md')]: {
        display: 'block',
      }
    },
    closeButton: {
      px: 1.5625,
    },
  });
};

const ResponsiveDrawer = ({ children, ...props }) => {

  const styles = useStyles();
  const theme = useTheme();

  return (
    <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
      <Drawer
        {...props}
        variant="temporary"
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          ...styles.drawer, ...styles.smDrawer,
          '& .MuiPaper-root': {
            background: theme.palette.background.default,
          },
        }}
      >
        <Box
          component="div"
          sx={styles.drawerHeader}
        >
          <IconButton
            color="inherit"
            edge="start"
            onClick={props.onClose}
            sx={styles.closeButton}
          >
            <FontAwesomeIcon icon={faTimes} />
          </IconButton>
        </Box>
        {children}
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          ...styles.drawer, ...styles.mdDrawer,
        }}
        open
      >
        <Box component="div" sx={styles.drawerHeader} />
        {children}
      </Drawer>
    </Box>
  );
};

export default ResponsiveDrawer;
//===========================================================================