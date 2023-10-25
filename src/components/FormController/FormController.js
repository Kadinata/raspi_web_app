//===========================================================================
//
//===========================================================================
import * as React from 'react';
import FormControlStates from './FormControlStates';

const useFormController = ({ initialState, onError, onSuccess, onReset, onSubmit }) => {

  const [formValues, setFormValues] = React.useState(initialState || {});
  const [formErrors, setFormErrors] = React.useState({ message: '' });
  const [formState, setFormState] = React.useState(FormControlStates.default);

  const handleChange = ({ target }) => {
    const { id, value } = target;
    setFormValues((prevValues) => ({ ...prevValues, [id]: value }));
  };

  const resetForm = () => {
    console.log('resetting form');
    setFormValues(initialState || {});
    setFormErrors({ message: '' });
    setFormState(FormControlStates.default);
  };

  const handleSubmit = async (event) => {

    if (event) {
      event.preventDefault();
    }

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
    console.log({ success, error });
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