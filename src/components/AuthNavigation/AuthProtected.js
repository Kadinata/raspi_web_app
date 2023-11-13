/**
 * AuthProtected: A container component that conditionally renders its
 * children depending on the current authentication status.
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStateContext } from '../../modules/auth/AuthProvider';

/**
 * Prevent the children of this component from being rendered if the
 * user is currently not authenticated. This component must be used
 * inside both AuthProvider and Router components.
 * @param {Element} children - Children elements to be rendered as long as
 * the user is authenticated.
 * @param {string} redirect - The URL to redirect to if not authenticated.
 */
const AuthProtected = ({ children, redirect, ...rest }) => {

  const { isAuthenticated, authCheckComplete } = useAuthStateContext();
  const navigate = useNavigate();

  if (!authCheckComplete) return null;

  if (!isAuthenticated) {
    navigate(redirect);
    return null;
  };

  return (
    <React.Fragment>
      {children}
    </React.Fragment>
  );
};

export default AuthProtected;
//===========================================================================