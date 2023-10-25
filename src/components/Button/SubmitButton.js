//===========================================================================
//  
//===========================================================================
import React from 'react';
import {
  Button,
  CircularProgress,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

const ProgressIcon = <CircularProgress size={24} color="inherit" />;

const CheckIcon = <FontAwesomeIcon icon={faCheck} color="inherit" />

const SubmitButton = ({ loading, disabled, success, children, ...props }) => {

  const Icon = loading ? ProgressIcon : (success ? CheckIcon : null);

  return (
    <Button
      {...props}
      disabled={disabled}
      startIcon={Icon}
    >
      {(!loading && !success) && children}
    </Button>
  );
};

export default SubmitButton;
//===========================================================================