//===========================================================================
//  
//===========================================================================
import React from 'react';
import AuthService from './AuthService';
import { getAuthToken, removeToken } from './AuthUtils';

export const AuthContext = React.createContext(null);

const getInitialData = () => {
  const user = null;
  const token = getAuthToken();
  return { user, token };
};

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

export const useAuthDataContext = () => React.useContext(AuthContext);

export const useAuthenticationState = () => {
  const { user, token, isAuthenticated, authCheckComplete } = useAuthDataContext();
  return { user, token, isAuthenticated, authCheckComplete };
};

export const useAuthActions = () => {
  const { handleLogin, onLogout } = useAuthDataContext();
  return { handleLogin, onLogout };
};

export default AuthProvider;
//===========================================================================