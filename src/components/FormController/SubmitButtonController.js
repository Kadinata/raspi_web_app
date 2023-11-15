/**
 * Submit Button Controller: Custom hook to simplify form submit button state management.
 */
import React from 'react';
import FormControlStates from './FormControlStates';

/**
 * @private Internal function to retrieve the initial submit button states.
 * The initial state is wrapped in a function to prevent it from being mutated. 
 * @returns {object} - Initial submit button states.
 */
const getInitialState = () => {
  const disabled = true;
  const loading = false;
  const success = false;
  return ({ disabled, loading, success });
};

/**
 * @private Internal helper function implementing the logic to determine when the submit button
 * should be disabled based on the current values of the form's input fields.
 * @param {object} formValues - Object containing the values of the form's input fields.
 * @returns {boolean} - A flag to determine whether or not the submit button should be disabled.
 */
const shouldDisable = (formValues) => (
  Object.keys(formValues).reduce((result, key) => (result || !(formValues[key].trim())), false)
);

/**
 * Submit button state control hook.
 * @param {object} formValues - Object containing the values of the form's input fields.
 * @param {enum} formState - State of the form as indicated by the FormController hook.
 * @returns {boolean} disabled - A flag to determine whether or not the submit button should be disabled.
 * @returns {boolean} loading - A flag to determine whether or not the submit button should display a loading circle.
 * @returns {boolean} success - A flag to determine whether or not the submit button should indicate the form
 * has been successfully subimitted.
 */
const useSubmitButtonController = ({ formValues, formState }) => {

  const [btnState, setBtnState] = React.useState(getInitialState);

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