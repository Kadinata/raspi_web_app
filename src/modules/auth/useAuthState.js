/**
 * useAuthState: Custom React hook to store and manage authentication state.
 */
import React from "react";
import AuthService from './AuthService';
import { getAuthToken, removeToken } from './AuthUtils';

/**
 * @private Internal function to retrieve the initial authentication state.
 * The initial state is wrapped in a function to prevent it from being mutated. 
 * @returns {object} - Initial authentication state containing user data and auth token.
 */
const getInitialAuthState = () => {
  const user = null;
  const token = null;
  const authCheckComplete = false;
  return { user, token, authCheckComplete };
};

/**
 * @private Internal helper function to compute the next auth state based on the provided user and token data.
 * @param {object} prevState - Previous authentication state to be updated.
 * @param {object} user - New user data.
 * @param {object} token - New authentication token.
 * @returns {object} - An updated authentication state containing the provided user and token.
 */
const updateAuthState = (prevState, user, token) => {
  const authCheckComplete = true;
  return ({...prevState, authCheckComplete, user, token});
};

/**
 * Custom hook to manage and store authentication data and state.
 * @param {object} initialAuthState - The value the authentication state is initially set to.
 * @returns {object} - An object containing the auth data, check completion status, and a function to set the auth data.
 */
export const useAuthState = () => {
  const [authState, setAuthState] = React.useState(getInitialAuthState());

  const clearAuthState = () => {
    removeToken();
    setAuthState((prevState) => updateAuthState(prevState, null, null));
  };

  const checkAuthState = React.useCallback(async () => {
    const token = getAuthToken();
    try {
      const user = await AuthService.getUser();
      setAuthState((prevState) => updateAuthState(prevState, user, token));
    } catch (err) {
      clearAuthState();
    }
  }, []);

  const getAuthState = () => {
    const { user, token } = authState;
    const isAuthenticated = (!!user && !!token);
    return { ...authState, isAuthenticated };
  };

  return { getAuthState, checkAuthState, clearAuthState };
};
//===========================================================================