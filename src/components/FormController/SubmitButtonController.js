//===========================================================================
//
//===========================================================================
import React from 'react';
import FormControlStates from './FormControlStates';

const initialState = {
  disabled: true,
  loading: false,
  success: false,
};

const defaultCheckDisable = (formValues) => (
  Object.keys(formValues).reduce((result, key) => (result || !(formValues[key].trim())), false)
);

const useSubmitButtonController = ({ formValues, formState, shouldDisable }) => {

  shouldDisable = shouldDisable || defaultCheckDisable;

  const [btnState, setBtnState] = React.useState(initialState);

  React.useEffect(() => {
    const disabled = shouldDisable(formValues);
    const loading = (formState === FormControlStates.submitting);
    const success = (formState === FormControlStates.success);
    setBtnState({ disabled, loading, success });
  }, [formValues, formState]);

  return btnState;
};

export default useSubmitButtonController;
//===========================================================================