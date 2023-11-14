import '@testing-library/jest-dom';
import { render, renderHook, act, cleanup, fireEvent, waitFor } from "@testing-library/react";
import useFormController from "../FormController";
import FormControlStates from "../FormControlStates";

const TEST_INPUT_VALUE_1 = 'Some test input value';
const TEST_INPUT_VALUE_2 = 'Another test input value'
const TEST_INPUT_VALUE_3 = 'Some other test input value';
const TEST_ERROR_MESSAGE = 'An induced error occurred.';

const onSuccess = jest.fn();
const onError = jest.fn();

const initialState = {
  field_1: "",
  field_2: "",
};

const TestFormComponent = ({ onSubmit, onReset }) => {

  const {
    formValues,
    formErrors,
    formState,
    handleChange,
    handleSubmit,
    resetForm,
  } = useFormController({
    initialState,
    onSubmit,
    onError,
    onSuccess,
    onReset,
  });

  return (
    <div>
      <button data-testid="TestID/Button/Reset" onClick={resetForm} />
      <form onSubmit={handleSubmit}>
        <p data-testid="TestID/ErrorMsg">{formErrors?.message}</p>
        <p data-testid="TestID/FormState">{formState?.toString()}</p>
        <input data-testid="TestID/Input1" name="field_1" label="field_1" id="field_1" value={formValues.field_1} onChange={handleChange} />
        <input data-testid="TestID/Input2" name="field_2" label="field_2" id="field_2" value={formValues.field_2} onChange={handleChange} />
        <button data-testid="TestID/Button/Submit" type="submit" />
      </form>
    </div>
  );
};

describe('Form Controller Hook Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  /** Render the hook and verify the return values */
  it('should return the correct form states and control functions.', () => {

    const onSubmit = jest.fn();
    const onReset = jest.fn();

    /** Render the hook */
    let hook;
    act(() => {
      hook = renderHook(() => useFormController({ onError, onSuccess, onReset, onSubmit }));
    });

    const { result, unmount } = hook;

    /** Verify the form states returned by the hook */
    expect(result.current.formValues).toEqual({});
    expect(result.current.formState).toEqual(FormControlStates.default);
    expect(result.current.formErrors.message).toEqual('');

    /** Verify the hook also returns form control functions */
    expect(typeof result.current.handleChange).toEqual('function');
    expect(typeof result.current.handleSubmit).toEqual('function');
    expect(typeof result.current.resetForm).toEqual('function');

    /** unmount the hook on cleanup */
    unmount();
  });

  /** Verify changing the input fields causes the internal form control states to update accordingly */
  it('should update the internal states of the form control accordingly when the inputs change', () => {

    /** Render the test form */
    const { getByTestId } = render(<TestFormComponent onSubmit={jest.fn()} onReset={jest.fn()} />);

    /** Get a handle of each element needed in this test */
    const input1Element = getByTestId('TestID/Input1');
    const input2Element = getByTestId('TestID/Input2');

    /** Verify both input fields are initially empty */
    expect(input1Element).toHaveValue('');
    expect(input2Element).toHaveValue('');

    /** Change the value on input 1 and verify the changes are propagated correctly */
    fireEvent.change(input1Element, { target: { id: "field_1", value: TEST_INPUT_VALUE_1 } });
    expect(input1Element).toHaveValue(TEST_INPUT_VALUE_1);
    expect(input2Element).toHaveValue('');

    /** Change the value on input 2 and verify the changes are propagated correctly */
    fireEvent.change(input2Element, { target: { id: "field_2", value: TEST_INPUT_VALUE_2 } });
    expect(input1Element).toHaveValue(TEST_INPUT_VALUE_1);
    expect(input2Element).toHaveValue(TEST_INPUT_VALUE_2);

    /** Change the value on input 1 again and verify the changes are propagated correctly */
    fireEvent.change(input1Element, { target: { id: "field_1", value: TEST_INPUT_VALUE_3 } });
    expect(input1Element).toHaveValue(TEST_INPUT_VALUE_3);
    expect(input2Element).toHaveValue(TEST_INPUT_VALUE_2);
  });

  /** Verify form submission happy path */
  it('should handle form submission success correctly.', async () => {

    const onSubmit = jest.fn().mockResolvedValue({ success: true, error: '' });
    const onReset = jest.fn().mockImplementation((prev) => ({ ...prev, field_2: '' }));

    /** Render the test form */
    const { getByTestId } = render(<TestFormComponent onSubmit={onSubmit} onReset={onReset} />);

    /** Get a handle of each element needed in this test */
    const formStateElement = getByTestId('TestID/FormState');
    const input1Element = getByTestId('TestID/Input1');
    const input2Element = getByTestId('TestID/Input2');
    const submitBtnElement = getByTestId('TestID/Button/Submit');

    /** Change the value on the input fields and verify the changes are propagated correctly */
    fireEvent.change(input1Element, { target: { id: "field_1", value: TEST_INPUT_VALUE_1 } });
    fireEvent.change(input2Element, { target: { id: "field_2", value: TEST_INPUT_VALUE_2 } });
    expect(input1Element).toHaveValue(TEST_INPUT_VALUE_1);
    expect(input2Element).toHaveValue(TEST_INPUT_VALUE_2);

    /** Verify the current form state is still 'default' */
    expect(formStateElement.textContent).toEqual(FormControlStates.default.toString());

    /** The submit handler should have not been called at this point */
    expect(onSubmit).toHaveBeenCalledTimes(0);
    expect(onSuccess).toHaveBeenCalledTimes(0);
    expect(onError).toHaveBeenCalledTimes(0);

    /** Click the submit button and verify the current state of the form is now 'submitting' */
    fireEvent.click(submitBtnElement);
    expect(formStateElement.textContent).toEqual(FormControlStates.submitting.toString());

    /** onReset should not have been called at this point */
    expect(onReset).toHaveBeenCalledTimes(0);

    /** Wait for the form state to change to 'success' as onSubmit resolves */
    await (waitFor(() => expect(formStateElement.textContent).not.toEqual(FormControlStates.submitting.toString())));
    expect(formStateElement.textContent).toEqual(FormControlStates.success.toString());

    /** Verify onSubmit has been called with the input field values */
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({ field_1: TEST_INPUT_VALUE_1, field_2: TEST_INPUT_VALUE_2 });

    /** onReset and onSuccess should have been called now */
    expect(onReset).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledTimes(0);

    /** Verify input fields of the form have been reset according to the rule specified in onReset */
    expect(input1Element).toHaveValue(TEST_INPUT_VALUE_1);
    expect(input2Element).toHaveValue('');
  });

  /** Verify form submission error case */
  it('should handle form submission error correctly.', async () => {
    const onSubmit = jest.fn().mockResolvedValue({ success: false, error: { message: TEST_ERROR_MESSAGE } });
    const onReset = jest.fn().mockImplementation((prev) => ({ ...prev, field_2: '' }));

    /** Render the test form */
    const { getByTestId } = render(<TestFormComponent onSubmit={onSubmit} onReset={onReset} />);

    /** Get a handle of each element needed in this test */
    const formStateElement = getByTestId('TestID/FormState');
    const errorMsgElement = getByTestId('TestID/ErrorMsg');
    const input1Element = getByTestId('TestID/Input1');
    const input2Element = getByTestId('TestID/Input2');
    const submitBtnElement = getByTestId('TestID/Button/Submit');

    /** Change the value on the input fields and verify the changes are propagated correctly */
    fireEvent.change(input1Element, { target: { id: "field_1", value: TEST_INPUT_VALUE_1 } });
    fireEvent.change(input2Element, { target: { id: "field_2", value: TEST_INPUT_VALUE_2 } });
    expect(input1Element).toHaveValue(TEST_INPUT_VALUE_1);
    expect(input2Element).toHaveValue(TEST_INPUT_VALUE_2);

    /** Verify the current form state is still in the 'default' state */
    expect(formStateElement.textContent).toEqual(FormControlStates.default.toString());

    /** The submit handler should have not been called at this point */
    expect(onSubmit).toHaveBeenCalledTimes(0);

    /** Click the submit button and verify the current state of the form is now 'submitting' */
    fireEvent.click(submitBtnElement);
    expect(formStateElement.textContent).toEqual(FormControlStates.submitting.toString());

    /** onReset should not have been called at this point */
    expect(onReset).toHaveBeenCalledTimes(0);

    /** The error message should still be empty at this point */
    expect(errorMsgElement.textContent).toEqual('');

    /** Wait for the form state to change to 'error' as onSubmit resolves */
    await (waitFor(() => expect(formStateElement.textContent).not.toEqual(FormControlStates.submitting.toString())));
    expect(formStateElement.textContent).toEqual(FormControlStates.error.toString());

    /** Verify onSubmit has been called with the input field values */
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({ field_1: TEST_INPUT_VALUE_1, field_2: TEST_INPUT_VALUE_2 });

    /** onReset and onError should have been called now */
    expect(onReset).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledTimes(0);
    expect(onError).toHaveBeenCalledTimes(1);

    /** Verify input fields of the form have been reset according to the rule specified in onReset */
    expect(input1Element).toHaveValue(TEST_INPUT_VALUE_1);
    expect(input2Element).toHaveValue('');

    /** Verify the error message is displayed */
    expect(errorMsgElement.textContent).toEqual(TEST_ERROR_MESSAGE);
  });

  /** The submit handler should not be invoked again while the form is still submitting or if the submission already succeeds */
  it('should not submit the form again while the form is still submitting or has been successfully submitted', async () => {

    const onSubmit = jest.fn().mockResolvedValue({ success: true, error: '' });
    const onReset = jest.fn().mockImplementation((prev) => ({ ...prev, field_2: '' }));

    /** Render the test form */
    const { getByTestId } = render(<TestFormComponent onSubmit={onSubmit} onReset={onReset} />);

    /** Get a handle of each element needed in this test */
    const formStateElement = getByTestId('TestID/FormState');
    const submitBtnElement = getByTestId('TestID/Button/Submit');

    /** Verify the current form state is still in the 'default' state */
    expect(formStateElement.textContent).toEqual(FormControlStates.default.toString());

    /** The submit handler should have not been called at this point */
    expect(onSubmit).toHaveBeenCalledTimes(0);

    /** Click the submit button and verify the current state of the form is now 'submitting' */
    fireEvent.click(submitBtnElement);
    expect(formStateElement.textContent).toEqual(FormControlStates.submitting.toString());

    /** onReset should not have been called at this point */
    expect(onReset).toHaveBeenCalledTimes(0);

    /** Click the submit button again multiple times while the form is still in the 'submitting' state */
    fireEvent.click(submitBtnElement);
    fireEvent.click(submitBtnElement);
    fireEvent.click(submitBtnElement);

    /** Verify the form is still in the submitting state */
    expect(formStateElement.textContent).toEqual(FormControlStates.submitting.toString());

    /** Wait for the form state to change to 'success' as onSubmit resolves */
    await (waitFor(() => expect(formStateElement.textContent).not.toEqual(FormControlStates.submitting.toString())));
    expect(formStateElement.textContent).toEqual(FormControlStates.success.toString());

    /** Verify onSubmit has been called only once */
    expect(onSubmit).toHaveBeenCalledTimes(1);

    /** Click the submit button again while the form is in the 'success' state */
    fireEvent.click(submitBtnElement);

    /** Verify the form is still in the 'success' state and onSubmit is not called */
    expect(formStateElement.textContent).toEqual(FormControlStates.success.toString());
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  /** Resetting the form from the default state should restore it to the initial state */
  it('should restore form values to their initial state when the form is cleared from the default state', async () => {

    const onSubmit = jest.fn()
    const onReset = jest.fn()

    /** Render the hook */
    let hook;
    act(() => {
      hook = renderHook(() => useFormController({ onError, onSuccess, onReset, onSubmit }));
    });

    const { result, unmount } = hook;

    /** Verify the form states returned by the hook */
    expect(result.current.formValues).toEqual({});
    expect(result.current.formState).toEqual(FormControlStates.default);
    expect(result.current.formErrors.message).toEqual('');

    /** Change the value of the form's input fields */
    act(() => result.current.handleChange({ target: { id: "field_1", value: TEST_INPUT_VALUE_1 } }));
    act(() => result.current.handleChange({ target: { id: "field_2", value: TEST_INPUT_VALUE_2 } }));

    /** Verify the form values have been updated accordingly */
    expect(result.current.formValues).toEqual({ field_1: TEST_INPUT_VALUE_1, field_2: TEST_INPUT_VALUE_2 });

    /** Reset the form and verify it's restored to its initial values */
    act(() => result.current.resetForm());
    expect(result.current.formValues).toEqual({});
    expect(result.current.formState).toEqual(FormControlStates.default);

    /** unmount the hook on cleanup */
    unmount();
  });

  /** Resetting the form from the success state should restore it to the initial state */
  it('should restore form values to their initial state when the form is cleared from the success state', async () => {

    const onSubmit = jest.fn().mockResolvedValueOnce({ success: true, error: '' });
    const onReset = jest.fn().mockImplementation((prev) => (prev));

    /** Render the hook */
    let hook;
    act(() => {
      hook = renderHook(() => useFormController({ onError, onSuccess, onReset, onSubmit }));
    });

    const { result, unmount } = hook;

    /** Verify the form states returned by the hook */
    expect(result.current.formValues).toEqual({});
    expect(result.current.formState).toEqual(FormControlStates.default);
    expect(result.current.formErrors.message).toEqual('');

    /** Change the value of the form's input fields */
    act(() => result.current.handleChange({ target: { id: "field_1", value: TEST_INPUT_VALUE_1 } }));
    act(() => result.current.handleChange({ target: { id: "field_2", value: TEST_INPUT_VALUE_2 } }));

    /** Verify the form values have been updated accordingly */
    expect(result.current.formValues).toEqual({ field_1: TEST_INPUT_VALUE_1, field_2: TEST_INPUT_VALUE_2 });

    /** Create a form submission */
    await act(() => result.current.handleSubmit());

    /** Verify the form is in the 'success' state and the input fields are still populated */
    expect(result.current.formValues).toEqual({ field_1: TEST_INPUT_VALUE_1, field_2: TEST_INPUT_VALUE_2 });
    expect(result.current.formState).toEqual(FormControlStates.success);

    /** Reset the form and verify it's restored to its initial values */
    act(() => result.current.resetForm());
    expect(result.current.formValues).toEqual({});
    expect(result.current.formState).toEqual(FormControlStates.default);

    /** unmount the hook on cleanup */
    unmount();
  });

  /** Resetting the form from the error state should restore it to the initial state */
  it('should restore form values to their initial state when the form is cleared from the error state', async () => {

    const onSubmit = jest.fn().mockResolvedValue({ success: false, error: { message: TEST_ERROR_MESSAGE } });
    const onReset = jest.fn().mockImplementation((prev) => (prev));

    /** Render the hook */
    let hook;
    act(() => {
      hook = renderHook(() => useFormController({ onError, onSuccess, onReset, onSubmit }));
    });

    const { result, unmount } = hook;

    /** Verify the form states returned by the hook */
    expect(result.current.formValues).toEqual({});
    expect(result.current.formState).toEqual(FormControlStates.default);
    expect(result.current.formErrors.message).toEqual('');

    /** Change the value of the form's input fields */
    act(() => result.current.handleChange({ target: { id: "field_1", value: TEST_INPUT_VALUE_1 } }));
    act(() => result.current.handleChange({ target: { id: "field_2", value: TEST_INPUT_VALUE_2 } }));

    /** Verify the form values have been updated accordingly */
    expect(result.current.formValues).toEqual({ field_1: TEST_INPUT_VALUE_1, field_2: TEST_INPUT_VALUE_2 });

    /** Create a form submission */
    await act(() => result.current.handleSubmit());

    /** Verify the form is in the 'error' state and the input fields are still populated */
    expect(result.current.formValues).toEqual({ field_1: TEST_INPUT_VALUE_1, field_2: TEST_INPUT_VALUE_2 });
    expect(result.current.formState).toEqual(FormControlStates.error);
    expect(result.current.formErrors.message).toEqual(TEST_ERROR_MESSAGE);

    /** Reset the form and verify it's restored to its initial values */
    act(() => result.current.resetForm());
    expect(result.current.formValues).toEqual({});
    expect(result.current.formState).toEqual(FormControlStates.default);
    expect(result.current.formErrors.message).toBeFalsy();

    /** unmount the hook on cleanup */
    unmount();
  });

  /** Resetting the form while it's submitting should not restore it to the initial state */
  it('should not clear the form if it is reset while it is still submitting', async () => {

    const onSubmit = jest.fn().mockResolvedValue({ success: true, error: '' });
    const onReset = jest.fn().mockImplementation((prev) => ({ ...prev, field_2: '' }));

    /** Render the test form */
    const { getByTestId } = render(<TestFormComponent onSubmit={onSubmit} onReset={onReset} />);

    /** Get a handle of each element needed in this test */
    const formStateElement = getByTestId('TestID/FormState');
    const input1Element = getByTestId('TestID/Input1');
    const input2Element = getByTestId('TestID/Input2');
    const resetBtnElement = getByTestId('TestID/Button/Reset');
    const submitBtnElement = getByTestId('TestID/Button/Submit');

    /** Change the value on the input fields and verify the changes are propagated correctly */
    fireEvent.change(input1Element, { target: { id: "field_1", value: TEST_INPUT_VALUE_1 } });
    fireEvent.change(input2Element, { target: { id: "field_2", value: TEST_INPUT_VALUE_2 } });
    expect(input1Element).toHaveValue(TEST_INPUT_VALUE_1);
    expect(input2Element).toHaveValue(TEST_INPUT_VALUE_2);

    /** Verify the current form state is still 'default' */
    expect(formStateElement.textContent).toEqual(FormControlStates.default.toString());

    /** Click the submit button and verify the current state of the form is now 'submitting' */
    fireEvent.click(submitBtnElement);
    expect(formStateElement.textContent).toEqual(FormControlStates.submitting.toString());

    /** Try to reset the form while it's still submitting */
    fireEvent.click(resetBtnElement);

    /** Verify form values do not reset to their initial values */
    expect(input1Element).toHaveValue(TEST_INPUT_VALUE_1);
    expect(input2Element).toHaveValue(TEST_INPUT_VALUE_2);
    expect(formStateElement.textContent).toEqual(FormControlStates.submitting.toString());

    /** Wait for the form state to change to 'success' as onSubmit resolves */
    await (waitFor(() => expect(formStateElement.textContent).not.toEqual(FormControlStates.submitting.toString())));
    expect(formStateElement.textContent).toEqual(FormControlStates.success.toString());
  });

  /** The form should still allow submission after it errored */
  it('should still allow submission after it errored', async () => {

    const onReset = jest.fn().mockImplementation((prev) => (prev));
    const onSubmit = jest.fn()
      .mockResolvedValueOnce({ success: false, error: { message: TEST_ERROR_MESSAGE } })
      .mockResolvedValueOnce({ success: true, error: '' });

    /** Render the hook */
    let hook;
    act(() => {
      hook = renderHook(() => useFormController({ onError, onSuccess, onReset, onSubmit }));
    });

    const { result, unmount } = hook;

    /** Verify the form states returned by the hook */
    expect(result.current.formValues).toEqual({});
    expect(result.current.formState).toEqual(FormControlStates.default);
    expect(result.current.formErrors.message).toEqual('');

    /** Change the value of the form's input fields */
    act(() => result.current.handleChange({ target: { id: "field_1", value: TEST_INPUT_VALUE_1 } }));
    act(() => result.current.handleChange({ target: { id: "field_2", value: TEST_INPUT_VALUE_2 } }));

    /** Verify the form values have been updated accordingly */
    expect(result.current.formValues).toEqual({ field_1: TEST_INPUT_VALUE_1, field_2: TEST_INPUT_VALUE_2 });
    expect(onSubmit).toHaveBeenCalledTimes(0);

    /** Create a form submission */
    await act(() => result.current.handleSubmit());

    /** Verify the form is in the 'error' state and the input fields are still populated */
    expect(result.current.formValues).toEqual({ field_1: TEST_INPUT_VALUE_1, field_2: TEST_INPUT_VALUE_2 });
    expect(result.current.formState).toEqual(FormControlStates.error);
    expect(result.current.formErrors.message).toEqual(TEST_ERROR_MESSAGE);

    /** Verify onSubmit has been called */
    expect(onSubmit).toHaveBeenCalledTimes(1);

    /** Submit again for the second time. This time it should succeed */
    await act(() => result.current.handleSubmit());

    /** Verify the form is in the 'success' state now */
    expect(result.current.formValues).toEqual({ field_1: TEST_INPUT_VALUE_1, field_2: TEST_INPUT_VALUE_2 });
    expect(result.current.formState).toEqual(FormControlStates.success);
    expect(result.current.formErrors.message).toBeFalsy();

    /** Verify onSubmit has been called twice now */
    expect(onSubmit).toHaveBeenCalledTimes(2);

    /** unmount the hook on cleanup */
    unmount();
  });
});