//===========================================================================
//  
//===========================================================================
import React from 'react';
import { styled } from '@mui/material/styles';
import {
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  useLocation,
  useNavigate,
  matchPath,
} from 'react-router-dom';

const useSelectionDetect = (path) => {
  const { pathname } = useLocation();
  if (!path) return false;
  return (matchPath({ path }, pathname) !== null);
};

const ListItemActive = styled(ListItem)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  backgroundColor: 'rgba(255,255,255,0.05)',
  boxShadow: 'inset 0.1875rem 0 0',
}));

const ListItemInactive = styled(ListItem)(({ theme }) => ({
  color: theme.palette.text.disabled,
}));

const SideBarItem = ({ to, ...props }) => {
  const selected = useSelectionDetect(to);
  return selected ? (<ListItemActive {...props} />) : (<ListItemInactive {...props} />);
};

const StyledListItemIcon = styled(ListItemIcon)(({ theme }) => ({
  justifyContent: 'center',
  color: 'inherit',
}));

const StyledListItemText = styled(ListItemText)(({ theme }) => ({
  paddingLeft: theme.spacing(1),
}));

const SidebarLink = ({ icon, title, to, onClick, ...props }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(to);
    onClick();
  };

  return (
    <SideBarItem to={to} button onClick={handleClick}>
      <StyledListItemIcon size="20">
        {icon}
      </StyledListItemIcon>
      <StyledListItemText primary={title} />
    </SideBarItem>
  );
};

export default SidebarLink;
//===========================================================================