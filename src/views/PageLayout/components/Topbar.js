//===========================================================================
//  
//===========================================================================
import React from 'react';
import { useTheme } from '@mui/material/styles';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import UserIcon from './UserIcon';
import ConnectionStatusIcon from '../../ConnectionStatus/ConnectionStatusIcon';

const makeStyles = (theme) => ({
  spacer: theme.mixins.spacer,
  appBar: {
    color: theme.palette.text.primary,
    backgroundColor: 'theme.palette.primary.main',
  },
  toolbarSpacer: {
    flexGrow: 1,
  },
  iconButton: {
    px: 1.1875,
    [theme.breakpoints.up('md')]: {
      display: 'none',
    }
  },
});

const Topbar = ({ onDrawerOpen, ...props }) => {

  const styles = makeStyles(useTheme());

  return (
    <React.Fragment>
      <AppBar enableColorOnDark position="static" sx={styles.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={onDrawerOpen}
            sx={styles.iconButton}
          >
            <FontAwesomeIcon icon={faBars} />
          </IconButton>
          <Box sx={styles.toolbarSpacer} />
          <ConnectionStatusIcon />
          <UserIcon />
        </Toolbar>
      </AppBar>
      <Box component="div" sx={styles.spacer} />
    </React.Fragment>
  );
};

export default Topbar;
//===========================================================================