//===========================================================================
//  
//===========================================================================
import React from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Container,
  Grid,
} from '@mui/material';
import { Navigate } from 'react-router-dom';
import {AuthRedirect} from '../../components/AuthNavigation';
import LoginCard from './LoginCard';
import { useLoginHandler } from './hooks';

const makeStyles = (theme) => ({
  container: {
    padding: 3,
    paddingTop: 8 * 4 / 3,
    flex: 1,
    alignItems: 'flex-start',
    display: 'flex',
    color: 'inherit',
  },
});

const DELAY_AFTER_LOGIN_MS = 850;
const RedirectAfter = '/';

const LoginView = (props) => {

  const styles = makeStyles(useTheme());

  const [loginSucceeded, setLoginSucceeded] = React.useState(false);
  const { handleSubmit } = useLoginHandler();

  const handleSuccess = () => {
    setTimeout(() => setLoginSucceeded(true), DELAY_AFTER_LOGIN_MS);
  };

  if (loginSucceeded) {
    return (<Navigate to={RedirectAfter} />);
  }

  return (
    <AuthRedirect noRetry redirect={RedirectAfter}>
      <Grid container sx={styles.container}>
        <Container maxWidth="sm">
          <LoginCard onSubmit={handleSubmit} onSuccess={handleSuccess} />
        </Container>
      </Grid>
    </AuthRedirect>
  );
};

export default LoginView;
//===========================================================================