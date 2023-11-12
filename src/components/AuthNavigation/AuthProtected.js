//===========================================================================
//  
//===========================================================================
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStateContext } from '../../modules/auth/AuthProvider';

const AuthProtected = ({ children, redirect, ...rest }) => {

  const { isAuthenticated, authCheckComplete } = useAuthStateContext();

  if (!authCheckComplete) return null;

  if (!isAuthenticated) {
    console.log('navigating to', redirect);
    return (<Navigate to={redirect} replace />);
  }
  return (children);
};

export default AuthProtected;
//===========================================================================