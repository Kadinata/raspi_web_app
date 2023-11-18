//===========================================================================
//  
//===========================================================================
import React from 'react';
import {
  Grid,
  Container,
  Box,
  Typography,
  Link,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SignupForm from './SignupForm';
import { useSignupHandler } from './hooks';
import { AuthRedirect } from '../../components/AuthNavigation';
import { LogoCard } from '../../components/Logo';
import { useTheme } from '@mui/material/styles';

const makeStyles = (theme) => {
  return ({
    container: {
      padding: 3,
      paddingTop: 8 * 4 / 3,
      flex: 1,
      alignItems: 'flex-start',
      display: 'flex',
    },
    container2: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    linkBar: {
      paddingTop: 2,
      color: theme.palette.text.secondary,
    },
  });
};

const DELAY_AFTER_SIGN_UP_MS = 850;
const REDIRECT_AFTER_SIGNUP = '/login';
const REDIRECT_IF_LOGGED_IN = '/';

const LinkBar = ({ redirect }) => {

  const styles = makeStyles(useTheme());
  const navigate = useNavigate();

  return (
    <Box component="span" sx={styles.linkBar}>
      <Typography component="span">Already have an account? </Typography>
      <Link component="button" onClick={() => navigate(redirect)}>Login</Link>
    </Box>
  );
};

const SignupView = (props) => {

  const styles = makeStyles(useTheme());

  const { handleSubmit } = useSignupHandler();
  const navigate = useNavigate();

  const handleSuccess = () => {
    setTimeout(() => navigate(REDIRECT_AFTER_SIGNUP), DELAY_AFTER_SIGN_UP_MS);
  };

  return (
    <AuthRedirect noRetry redirect={REDIRECT_IF_LOGGED_IN}>
      <Grid container sx={styles.container}>
        <Container maxWidth="sm" sx={styles.container2}>
          <LogoCard title="Create User">
            <SignupForm onSubmit={handleSubmit} onSuccess={handleSuccess} />
          </LogoCard>
          <LinkBar redirect={REDIRECT_AFTER_SIGNUP} />
        </Container>
      </Grid>
    </AuthRedirect>
  );
};

export default SignupView;
//=====================================================