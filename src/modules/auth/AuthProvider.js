/**
 * Auth Provider: Authentication context provider module.
 *
 * This module provides authentication actions and state contexts,
 * including their context provider component.
 */
import React from 'react';
import AuthService from './AuthService';
import { useAuthState } from './useAuthState';

/** React context object to provide authentication state and actions */
export const AuthContext = React.createContext(null);

/**
 * React Context Provider Element that provides authentication actions and state data.
 * @param {any} props - React props to pass on to the returned context provider element.
 * @returns {Element} - React Context Provider element for authentication state and actions.
 */
const AuthProvider = (props) => {

  const { getAuthState, checkAuthState, clearAuthState } = useAuthState();

  React.useEffect(() => {
    checkAuthState();
  }, [checkAuthState]);

  const onLogout = () => clearAuthState();

  const handleLogin = async (username, password) => {
    try {
      const result = await AuthService.authenticateUser(username, password);
      checkAuthState();
      return result;
    } catch (err) {
      return Promise.reject(err);
    }
  };

  const authDataValue = { getAuthState, handleLogin, onLogout };
  return (<AuthContext.Provider value={authDataValue} {...props} />);
};

/** Shortcut custom hook to consume AuthContext */
export const useAuthDataContext = () => React.useContext(AuthContext);

/** Custom hook to return authentication state data from AuthContext */
export const useAuthStateContext = () => {
  const { getAuthState } = useAuthDataContext();
  return getAuthState();
};

/** Custom hook to return authentication action functions from AuthContext */
export const useAuthActionContext = () => {
  const { handleLogin, onLogout } = useAuthDataContext();
  return { handleLogin, onLogout };
};

export default AuthProvider;
//===========================================================================