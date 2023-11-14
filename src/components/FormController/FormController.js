/**
 * Form Controller: Custom hook to simplify form states and actions management.
 */
import * as React from 'react';
import FormControlStates from './FormControlStates';

/**
 * Custom form controller hook that manages the associated form's states.
 * @param {object} initialState - Object to initialize the values of the form's input fields.
 * @param {function} onError - Error handler function that is called when the submission encounters an error.
 * @param {function} onSuccess - Success handler function that is called when the submission is successful.
 * @param {function} onReset - Reset handler function to reset the form after a submission.
 * @param {function} onSubmit - Submit handler function that is called when the form's submit button is clicked.
 * @returns {object} - formValues: Contains the values to set the form's input field.
 * @returns {error} - formErrors: Contains error message to display on the form after a submission error.
 * @returns {state} - formState: Determines the current state of the form's lifecycle.
 * @return {function} - handleChange: A listener function that listen to changes in the form's input fields.
 * @return {function} - handleSubmit: A listener function that listen to the form's submission event.
 * @returns {function} - resetForm: A function to clear the form's state and values to their initial values.
 */
const useFormController = ({ initialState, onError, onSuccess, onReset, onSubmit }) => {

  const [formValues, setFormValues] = React.useState(initialState || {});
  const [formErrors, setFormErrors] = React.useState({ message: '' });
  const [formState, setFormState] = React.useState(FormControlStates.default);

  const handleChange = ({ target }) => {
    const { id, value } = target;
    setFormValues((prevValues) => ({ ...prevValues, [id]: value }));
  };

  const resetForm = () => {
    if (formState === FormControlStates.submitting) {
      return;
    }
    setFormValues(initialState || {});
    setFormErrors({ message: '' });
    setFormState(FormControlStates.default);
  };

  const handleSubmit = async (event) => {

    event?.preventDefault();

    switch (formState) {
      case FormControlStates.submitting:
      case FormControlStates.success:
        return;
      default:
        break;
    }

    setFormState(FormControlStates.submitting);
    setFormErrors({ message: '' });

    const { success, error } = await onSubmit({ ...formValues });
    if (!success) {
      setFormState(FormControlStates.error);
      setFormErrors(error);
      onError(formErrors);
    } else {
      setFormState(FormControlStates.success);
      onSuccess();
    }
    setFormValues((prevValues) => onReset(prevValues));
  };

  return {
    formValues,
    formErrors,
    formState,
    handleChange,
    handleSubmit,
    resetForm,
  };
};

export default useFormController;
//===========================================================================