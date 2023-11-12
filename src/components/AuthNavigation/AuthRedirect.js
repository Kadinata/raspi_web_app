import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStateContext } from '../../modules/auth/AuthProvider';
import Loading from '../Loading';

const initialState = {
  loading: true,
  loggedIn: false,
  activated: false,
};

const useAuthRedirect = (noRetry = false) => {

  const [state, setState] = React.useState(initialState);
  const { isAuthenticated, authCheckComplete } = useAuthStateContext();

  React.useEffect(() => {
    const loading = !authCheckComplete;
    const loggedIn = isAuthenticated;
    const activated = (authCheckComplete && !isAuthenticated && noRetry);
    setState((prevState) => ({
      ...prevState,
      loading,
      loggedIn,
      activated: prevState.activated || activated,
    }));
  }, [isAuthenticated, authCheckComplete, noRetry]);

  return state;
};

const AuthRedirect = ({ redirect, noRetry = false, ...rest }) => {

  const { loading, loggedIn, activated } = useAuthRedirect(noRetry);

  if (loggedIn && !loading && !activated) {
    return (<Navigate to={redirect} />);
  }

  return (<Loading show={loading} {...rest} />);
};

export default AuthRedirect;