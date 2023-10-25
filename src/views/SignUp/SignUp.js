//===========================================================================
//  
//===========================================================================
import React from 'react';
import {
  Grid,
  Container,
} from '@mui/material';
import { Navigate } from 'react-router-dom';
import SignupCard from './SignupCard';
import { useSignupHandler } from './hooks';
import { AuthRedirect } from '../../components/AuthNavigation';

const useStyles = () => {
  return ({
    container: {
      padding: 3,
      paddingTop: 8 * 4 / 3,
      flex: 1,
      alignItems: 'flex-start',
      display: 'flex',
    },
  });
};

const DELAY_AFTER_SIGN_UP_MS = 850;
const REDIRECT_AFTER_SIGNUP = '/login';
const REDIRECT_IF_LOGGED_IN = '/';

const SignupView = (props) => {

  const styles = useStyles();

  const [signupSucceeded, setSignupSucceeded] = React.useState(false);
  const { handleSubmit } = useSignupHandler();

  const handleSuccess = () => {
    setTimeout(() => setSignupSucceeded(true), DELAY_AFTER_SIGN_UP_MS);
  };

  if (signupSucceeded) {
    return (<Navigate to={REDIRECT_AFTER_SIGNUP} />);
  }

  return (
    <AuthRedirect noRetry redirect={REDIRECT_IF_LOGGED_IN}>
      <Grid container sx={styles.container}>
        <Container maxWidth="sm">
          <SignupCard onSubmit={handleSubmit} onSuccess={handleSuccess} />
        </Container>
      </Grid>
    </AuthRedirect>
  );
};

export default SignupView;
//=====================================================