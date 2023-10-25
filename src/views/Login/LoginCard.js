//===========================================================================
//
//===========================================================================
import React from 'react';
import {
  Typography,
  TextField,
  CardMedia,
} from '@mui/material';
import {
  FormControlStates,
  useFormController,
  useSubmitButtonController,
} from '../../components/FormController';
import { DisplayCard } from '../../components/Card';
import { SubmitButton } from '../../components/Button';
import {
  ErrorBar,
  SuccessBar,
} from '../../components/Alert';
import { useTheme } from '@mui/material/styles';
import Logo from '../../assets/Logo.png';

const initialState = {
  username: "",
  password: "",
};

const makeStyles = (theme) => {
  return ({
    cardMedia: {
      height: 240,
      objectFit: 'scale-down',
      paddingTop: 3,
      paddingBottom: 6,
    },
    form: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
    submitButton: {
      marginTop: 1,
    },
    successBar: {
      
    }
  });
};

const LoginCard = ({ onSubmit, onError, onSuccess, ...props }) => {

  const styles = makeStyles(useTheme());

  const {
    formValues,
    formErrors,
    formState,
    handleChange,
    handleSubmit,
  } = useFormController({
    initialState,
    onSubmit: (values) => onSubmit(values),
    onError: (errors) => onError(errors),
    onSuccess: () => onSuccess(),
    onReset: (prevValues) => ({ ...prevValues, password: "" }),
  });

  const btnState = useSubmitButtonController({ formValues, formState });

  return (
    <DisplayCard
      title={
        <Typography component="h5" variant="h5" align="center">
          Login
        </Typography>
      }
    >

      <CardMedia
        component="img"
        image={Logo}
        title="Raspberry Pi"
        sx={styles.cardMedia}
      />

      <form onSubmit={handleSubmit} style={styles.form}>
        <ErrorBar variant="filled" show={(!!formErrors.message)}>
          {formErrors.message}
        </ErrorBar>

        <SuccessBar 
        variant="filled" 
        show={(formState === FormControlStates.success)}
        >
          Login successful.
        </SuccessBar>

        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="username"
          label="username"
          id="username"
          disabled={(formState === FormControlStates.success)}
          value={formValues.username}
          onChange={handleChange}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="password"
          type="password"
          id="password"
          disabled={(formState === FormControlStates.success)}
          value={formValues.password}
          onChange={handleChange}
        />
        <SubmitButton
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          disabled={btnState.disabled}
          loading={btnState.loading}
          success={btnState.success}
          sx={styles.submitButton}
        >
          Login
        </SubmitButton>
      </form>
    </DisplayCard>
  );
};

LoginCard.defaultProps = {
  onSubmit: () => { },
  onError: () => { },
  onSuccess: () => { },
};

export default LoginCard;
//===========================================================================