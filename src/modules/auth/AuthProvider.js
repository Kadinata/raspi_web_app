//===========================================================================
//  
//===========================================================================
import React from 'react';
import Auth from './Auth';
import { getAuthToken, removeToken } from './AuthUtils';

export const AuthContext = React.createContext(null);

const getInitialData = () => {
  const user = null;
  const token = getAuthToken();
  return { user, token };
};

const useAuthState = (initialAuthData = {}) => {
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
      const user = await Auth.getUser();
      setAuthData(user, token);
    } catch (err) {
      removeToken();
      setAuthData(null, null);
    }
  }, []);

  React.useEffect(() => {
    console.log('useEffect() -> checkAuthState');
    checkAuthState();
  }, [checkAuthState]);

  const onLogout = () => {
    removeToken();
    setAuthData(null, null);
  }

  const onLogin = () => checkAuthState();

  const handleLogin = async (username, password) => {
    try {
      const result = await Auth.authenticateUser(username, password);
      checkAuthState();
      return result;
    } catch (err) {
      return Promise.reject(err);
    }
  };

  const { user, token } = authData;
  const isAuthenticated = (!!user && !!token);

  const authDataValue = { ...authData, isAuthenticated, authCheckComplete, onLogin, handleLogin, onLogout };
  console.log('AuthProvider()', authData, { authCheckComplete });
  return (<AuthContext.Provider value={authDataValue} {...props} />);
};

export const useAuthDataContext = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthDataContext must be used within an AuthProvider.');
  }
  return context;
}

export const useAuthenticationState = () => {
  const { user, token, isAuthenticated, authCheckComplete } = useAuthDataContext();
  return { user, token, isAuthenticated, authCheckComplete };
};

export const useAuthActions = () => {
  const { onLogin, handleLogin, onLogout } = useAuthDataContext();
  return { onLogin, handleLogin, onLogout };
};

export default AuthProvider;
//===========================================================================