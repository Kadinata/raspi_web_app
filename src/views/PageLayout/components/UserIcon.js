//===========================================================================
//  
//===========================================================================
import React from 'react';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserCircle,
  faSignOutAlt,
  faUserGear,
} from '@fortawesome/free-solid-svg-icons';
import {
  useAuthenticationState,
  useAuthActions,
} from '../../../modules/auth/AuthProvider';

const useStyles = () => {
  const theme = useTheme();
  return ({
    menu: {
      '& .MuiPaper-root': {
        backgroundColor: theme.palette.background.default,
      },
    },
    menuIcon: {
      minWidth: "36px",
    },
  });
};

const useUserIconMenu = () => {

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = ({ currentTarget }) => {
    setAnchorEl(currentTarget || null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return { anchorEl, handleClick, handleClose };
};

const iconLogout = (<FontAwesomeIcon icon={faSignOutAlt} className="fa-fw" />);
const iconUserSettings = (<FontAwesomeIcon icon={faUserGear} className="fa-fw" />);

const MenuEntry = React.forwardRef(({ icon, text, onClick, ...props }, ref) => {
  const styles = useStyles();
  return (
    <MenuItem onClick={onClick} {...props} ref={ref}>
      {icon && (<ListItemIcon sx={styles.menuIcon}>
        {icon}
      </ListItemIcon>)}
      <ListItemText>{text}</ListItemText>
    </MenuItem>
  );
});

const UserIcon = () => {

  const styles = useStyles();
  const { isAuthenticated, authCheckComplete } = useAuthenticationState();
  const { onLogout } = useAuthActions();
  const { anchorEl, handleClick, handleClose } = useUserIconMenu();

  const handleLogout = () => {
    handleClose();
    onLogout();
  };

  const navigate = useNavigate();

  if (!isAuthenticated && authCheckComplete) {
    return null;
  }

  return (
    <div>
      <IconButton
        color="inherit"
        onClick={handleClick}
      >
        <FontAwesomeIcon icon={faUserCircle} />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={styles.menu}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuEntry
          icon={iconUserSettings}
          text="Account Settings"
          onClick={() => navigate('/account/settings')}
        />
        <MenuEntry icon={iconLogout} text={"Logout"} onClick={handleLogout} />
      </Menu>
    </div>
  )
};

export default UserIcon;
//===========================================================================