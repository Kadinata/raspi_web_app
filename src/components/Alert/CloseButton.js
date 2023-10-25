//===========================================================================
//  
//===========================================================================
import React from 'react';
import { IconButton } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const CloseButton = ({ onClick, ...props }) => {
  return (
    <IconButton
      aria-label="close"
      color="inherit"
      size="small"
      onClick={onClick}
    >
      <FontAwesomeIcon icon={faTimes} className="fa-fw" />
    </IconButton>
  );
};

export default CloseButton;
//===========================================================================