/**
 * AuthRedirect: A container component that conditionally redirects
 * depending on the current authentication status.
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStateContext } from '../../modules/auth/AuthProvider';
import Loading from '../Loading';

/**
 * @private Internal custom hook to manage the state of the page
 */
const useRedirectState = (noRetry) => {

  const [activated, setActivated] = React.useState(false);
  const { isAuthenticated, authCheckComplete } = useAuthStateContext();

  React.useEffect(() => {
    setActivated((prevState) => (prevState || (authCheckComplete && !isAuthenticated && noRetry)));
  }, [isAuthenticated, authCheckComplete, noRetry, setActivated]);

  const loading = !authCheckComplete;
  const shouldRedirect = authCheckComplete && isAuthenticated && !activated;

  return {loading, shouldRedirect};
};

/**
 * The opposite of the AuthProtected component. This component does not
 * render its children as long as the user remains authenticated. This
 * compone is useful to prevent the login page from being rendered after
 * the user successfully authenticates. This component must be used
 * inside both AuthProvider and Router components.
 * @param {string} redirect - URL of the page to redirect to while the user
 * is authenticated.
 * @param {boolean} noRetry - If set to true, the component will attempt to
 * redirect only once.
 */
const AuthRedirect = ({ redirect, noRetry = false, ...rest }) => {

  const navigate = useNavigate();
  const { loading, shouldRedirect } = useRedirectState(noRetry);

  if (shouldRedirect) {
    navigate(redirect);
    return null;
  }

  return (<Loading show={loading} {...rest} />);
};

export default AuthRedirect;
//===========================================================================