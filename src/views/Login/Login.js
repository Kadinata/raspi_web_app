//===========================================================================
//  
//===========================================================================
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
  Container,
  Grid,
  Box,
  Typography,
  Link,
} from '@mui/material';
import { AuthRedirect } from '../../components/AuthNavigation';
import { LogoCard } from '../../components/Logo';
import { useLoginHandler } from './hooks';
import LoginForm from './LoginForm';

const makeStyles = (theme) => ({
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

const DELAY_AFTER_LOGIN_MS = 850;
const RedirectAfter = '/';

const LinkBar = ({ redirect }) => {

  const styles = makeStyles(useTheme());
  const navigate = useNavigate();

  return (
    <Box component="span" sx={styles.linkBar}>
      <Typography component="span">Don't have an account? </Typography>
      <Link component="button" onClick={() => navigate(redirect)}>Register</Link>
    </Box>
  );
};

const LoginView = (props) => {

  const styles = makeStyles(useTheme());
  const navigate = useNavigate();

  const { handleSubmit } = useLoginHandler();

  const handleSuccess = () => {
    setTimeout(() => navigate(RedirectAfter), DELAY_AFTER_LOGIN_MS);
  };

  return (
    <AuthRedirect noRetry redirect={RedirectAfter}>
      <Grid container sx={styles.container}>
        <Container maxWidth="sm" sx={styles.container2}>
          <LogoCard title="Login">
            <LoginForm onSubmit={handleSubmit} onSuccess={handleSuccess} />
          </LogoCard>
          <LinkBar redirect="/register" />
        </Container>
      </Grid>
    </AuthRedirect>
  );
};

export default LoginView;
//===========================================================================