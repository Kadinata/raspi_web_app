//===========================================================================
//  
//===========================================================================
import React from 'react';
import { useTheme } from '@mui/material/styles';
import { List } from '@mui/material';
import SidebarLink from './SidebarLink';
import ResponsiveDrawer from './ResponsiveDrawer';

const useStyles = () => {

  const theme = useTheme();

  return ({
    drawer: {
      ...theme.mixins.sidebar,
      flexShrink: 0,
      '& .MuiPaper-root': {
        [theme.breakpoints.down('sm')]: {
          background: theme.palette.background.default,
        },
        width: theme.mixins.sidebar.width,
      },
    },
    toolbar: theme.mixins.toolbar,
  });
};

const Sidebar = ({ open, onClose, routes, ...props }) => {

  const styles = useStyles();

  return (
    <ResponsiveDrawer
      sx={styles.drawer}
      anchor="left"
      open={!!open}
      onClose={onClose}
      variant="permanent"
    >
      <List component="nav">
        {routes.map(({ title, path, icon }, key) => {
          return (
            <SidebarLink
              title={title}
              icon={icon}
              to={path}
              key={key}
              onClick={onClose}
            />
          );
        })}
      </List>
    </ResponsiveDrawer>
  );
};

Sidebar.defaultProps = {
  routes: [],
};

export default Sidebar;
//===========================================================================