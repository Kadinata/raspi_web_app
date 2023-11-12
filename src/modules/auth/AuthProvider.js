/**
 * Auth Provider: Authentication context provider module.
 *
 * This module provides authentication actions and state contexts,
 * including their context provider component.
 */
import React from 'react';
import AuthService from './AuthService';
import { getAuthToken, removeToken } from './AuthUtils';

/** React context object to provide authentication state and actions */
export const AuthContext = React.createContext(null);

/**
 * @private Internal function to retrieve the initial authentication state.
 * The initial state is wrapped in a function to prevent it from being mutated. 
 * @returns {object} - Initial authentication state containing user data and auth token.
 */
const getInitialData = () => {
  const user = null;
  const token = getAuthToken();
  return { user, token };
};

/**
 * @private Internal custom hook to manage and store authentication data and state.
 * @param {object} initialAuthData - The value the authentication data is initially set to.
 * @returns {object} - An object containing the auth data, check completion status, and a function to set the auth data.
 */
const useAuthState = (initialAuthData) => {
  const [authState, setAuthState] = React.useState({
    authCheckComplete: false,
    authData: initialAuthData,
  });

  const setAuthData = (user, token) => {
    setAuthState((prevState) => ({
      authCheckComplete: true,
      authData: { ...prevState.authData, user, token }
    }))
  };

  const { authData, authCheckComplete } = authState;

  return { authData, authCheckComplete, setAuthData };
};

/**
 * React Context Provider Element that provides authentication actions and state data. 
 * @param {any} props - React props to pass to the returned element.
 * @returns {Element} - React Context Provider element for authentication state and actions.
 */
const AuthProvider = (props) => {

  const { authData, authCheckComplete, setAuthData } = useAuthState(getInitialData());

  const checkAuthState = React.useCallback(async () => {
    const token = getAuthToken();
    try {
      const user = await AuthService.getUser();
      setAuthData(user, token);
    } catch (err) {
      removeToken();
      setAuthData(null, null);
    }
  }, []);

  React.useEffect(() => {
    checkAuthState();
  }, [checkAuthState]);

  const onLogout = () => {
    removeToken();
    setAuthData(null, null);
  }

  const handleLogin = async (username, password) => {
    try {
      const result = await AuthService.authenticateUser(username, password);
      checkAuthState();
      return result;
    } catch (err) {
      return Promise.reject(err);
    }
  };

  const { user, token } = authData;
  const isAuthenticated = (!!user && !!token);

  const authDataValue = { ...authData, isAuthenticated, authCheckComplete, handleLogin, onLogout };
  console.log('AuthProvider()', authData, { authCheckComplete });
  return (<AuthContext.Provider value={authDataValue} {...props} />);
};

/** Shortcut custom hook to consume AuthContext */
export const useAuthDataContext = () => React.useContext(AuthContext);

/** Custom hook to return authentication state data from AuthContext */
export const useAuthStateContext = () => {
  const { user, token, isAuthenticated, authCheckComplete } = useAuthDataContext();
  return { user, token, isAuthenticated, authCheckComplete };
};

/** Custom hook to return authentication action functions from AuthContext */
export const useAuthActionContext = () => {
  const { handleLogin, onLogout } = useAuthDataContext();
  return { handleLogin, onLogout };
};

export default AuthProvider;
//===========================================================================