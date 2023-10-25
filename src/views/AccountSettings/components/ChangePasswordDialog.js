//===========================================================================
//  
//===========================================================================
import * as React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { SubmitButton } from '../../../components/Button';
import {
  FormControlStates,
  useFormController,
  useSubmitButtonController,
} from '../../../components/FormController';
import {
  ErrorBar,
  SuccessBar,
} from '../../../components/Alert';
import { useChangePasswordHandler } from '../hooks';

const DialogHeader = ({ children, onClose, ...rest }) => {

  return (
    <DialogTitle
      sx={{
        m: 0,
        px: 3,
        pb: 1,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
      {...rest}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            width: '40px',
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <FontAwesomeIcon icon={faTimes} />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

const DELAY_AFTER_SUCCESS = 850;

const initialState = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const ChangePasswordDialog = ({ onClose, open, ...props }) => {

  const handler = useChangePasswordHandler();

  let clearForm = () => null;

  const handleClose = () => {
    clearForm();
    onClose();
  };

  const {
    formValues,
    formErrors,
    formState,
    handleChange,
    handleSubmit,
    resetForm
  } = useFormController({
    initialState,
    onSubmit: (values) => handler.handleSubmit(values),
    onError: (errors) => handler.handleError(errors),
    onSuccess: () => setTimeout(handleClose, DELAY_AFTER_SUCCESS),
    onReset: (prevValues) => ({ ...prevValues, ...initialState }),
  });

  clearForm = resetForm;

  const btnState = useSubmitButtonController({ formValues, formState });
  const disableInputs = (formState === FormControlStates.success || formState === FormControlStates.submitting);

  return (
    <Dialog
      onClose={() => handleClose()}
      open={open}
    >
      <DialogHeader
        onClose={() => handleClose()}
      >
        Change Password
      </DialogHeader>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ py: (theme) => theme.spacing(0) }}>

          <ErrorBar variant="filled" show={((formState === FormControlStates.error) && (!!formErrors.message))}>
            {formErrors.message}
          </ErrorBar>

          <SuccessBar variant="filled" show={(formState === FormControlStates.success)}>
            Password successfully changed.
          </SuccessBar>

          <TextField
            variant="outlined"
            type="password"
            margin="normal"
            required
            fullWidth
            name="currentPassword"
            label="Enter your current password"
            id="currentPassword"
            disabled={disableInputs}
            error={!!formErrors.currentPassword}
            helperText={formErrors.currentPassword}
            value={formValues.currentPassword}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            type="password"
            margin="normal"
            required
            fullWidth
            name="newPassword"
            label="Choose a new password"
            id="newPassword"
            disabled={disableInputs}
            error={!!formErrors.password}
            helperText={formErrors.password}
            value={formValues.newPassword}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            type="password"
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Re-type your new password"
            id="confirmPassword"
            disabled={disableInputs}
            error={!!formErrors.confirmpw}
            helperText={formErrors.confirmpw}
            value={formValues.confirmPassword}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions sx={{
          px: (theme) => theme.spacing(3),
          pt: (theme) => theme.spacing(2),
        }}>
          <SubmitButton
            type="submit"
            variant="contained"
            color="primary"
            sx={{ width: '33%' }}
            disabled={btnState.disabled}
            loading={btnState.loading}
            success={btnState.success}
          >
            Submit
          </SubmitButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

ChangePasswordDialog.defaultProps = {
  open: false,
};

export default ChangePasswordDialog;
//===========================================================================