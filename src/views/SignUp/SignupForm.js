//===========================================================================
//
//===========================================================================
import React from 'react';
import { TextField } from '@mui/material';
import {
  ErrorBar,
  SuccessBar,
} from '../../components/Alert';
import {
  FormControlStates,
  useFormController,
  useSubmitButtonController,
} from '../../components/FormController';
import { SubmitButton } from '../../components/Button';
import { useTheme } from '@mui/material/styles';

const makeStyles = (theme) => {
  return ({
    form: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
    submitButton: {
      marginTop: 1,
    },
  });
};

const initialState = {
  username: "",
  password: "",
  confirmpw: "",
};

const SignupForm = ({ onSubmit, onError, onSuccess, ...props }) => {

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
    onReset: (prevValues) => ({
      ...initialState,
      username: prevValues.username,
    }),
  });

  const btnState = useSubmitButtonController({ formValues, formState });

  return (
    <form onSubmit={handleSubmit} style={styles.form}>

      <ErrorBar variant="filled" show={(!!formErrors.message)}>
        {formErrors.message}
      </ErrorBar>

      <SuccessBar variant="filled" show={(formState === FormControlStates.success)}>
        Login successful.
      </SuccessBar>

      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        name="username"
        label="Username"
        id="username"
        disabled={(formState === FormControlStates.success)}
        error={!!formErrors.username}
        helperText={formErrors.username}
        value={formValues.username}
        onChange={handleChange}
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        disabled={(formState === FormControlStates.success)}
        error={!!formErrors.password}
        helperText={formErrors.password}
        value={formValues.password}
        onChange={handleChange}
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        name="confirmpw"
        type="password"
        label="Re-type password"
        id="confirmpw"
        disabled={(formState === FormControlStates.success)}
        error={!!formErrors.confirmpw}
        helperText={formErrors.confirmpw}
        value={formValues.confirmpw}
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
        Create Account
      </SubmitButton>
    </form>
  );
};

SignupForm.defaultProps = {
  onSubmit: () => ({ success: false, message: initialState }),
  onSuccess: () => { },
  onError: () => { },
};

export default SignupForm;
//===========================================================================