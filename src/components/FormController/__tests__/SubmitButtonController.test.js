import { renderHook, act } from "@testing-library/react";
import useSubmitButtonController from "../SubmitButtonController";
import FormControlStates from "../FormControlStates";

const TEST_INPUT_VALUE_1 = 'Some test input value';
const TEST_INPUT_VALUE_2 = 'Another test input value'

describe('Form Submit Button Controller Hook Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  /** The submit button should be enabled if and only if all of the input fields are not empty */
  it('should enable the submit button if and only if all of the input fields are not empty', () => {

    /** Start with empty form input fields */
    const formValues = { field1: '', field2: '' };
    const formState = FormControlStates.default;
    const initialProps = { formValues, formState };

    /** Render the hook */
    let hook;
    act(() => {
      hook = renderHook(({ formValues, formState }) => useSubmitButtonController({ formValues, formState }), { initialProps });
    });

    const { result, unmount } = hook;

    /** Verify the return values of the hook. Disabled should be true */
    expect(result.current.disabled).toEqual(true);
    expect(result.current.loading).toEqual(false);
    expect(result.current.success).toEqual(false);

    /** Rerender the hook with one input field filled */
    formValues.field1 = TEST_INPUT_VALUE_1;
    act(() => hook.rerender({ formValues: { ...formValues }, formState }));

    /** Verify that disabled is still true because the other input field is still empty. */
    expect(result.current.disabled).toEqual(true);
    expect(result.current.loading).toEqual(false);
    expect(result.current.success).toEqual(false);

    /** Rerender the hook with the other input field filled */
    formValues.field2 = TEST_INPUT_VALUE_2;
    act(() => hook.rerender({ formValues: { ...formValues }, formState }));

    /** Verify that disabled is now false because both input fields are now true */
    expect(result.current.disabled).toEqual(false);
    expect(result.current.loading).toEqual(false);
    expect(result.current.success).toEqual(false);

    /** unmount the hook on cleanup */
    unmount();
  });

  /** The hook should consider any input field containing nothing but whitespaces as empty */
  it('should disable the submit button if any of the input fields contains nothing but whitespaces.', () => {

    /** Start with populated form input fields */
    const formValues = { field1: TEST_INPUT_VALUE_1, field2: TEST_INPUT_VALUE_2 };
    const formState = FormControlStates.default;
    const initialProps = { formValues, formState };

    /** Render the hook */
    let hook;
    act(() => {
      hook = renderHook(({ formValues, formState }) => useSubmitButtonController({ formValues, formState }), { initialProps });
    });

    const { result, unmount } = hook;

    /** Verify the return values of the hook. Disabled should be true */
    expect(result.current.disabled).toEqual(false);
    expect(result.current.loading).toEqual(false);
    expect(result.current.success).toEqual(false);

    /** Rerender the hook with one input field filled */
    formValues.field1 = '   ';
    act(() => hook.rerender({ formValues: { ...formValues }, formState }));

    /** Verify that disabled is still true because the other input field is still empty. */
    expect(result.current.disabled).toEqual(true);
    expect(result.current.loading).toEqual(false);
    expect(result.current.success).toEqual(false);

    /** unmount the hook on cleanup */
    unmount();
  });

  /** Loading mode should be set while the form is in the submitting state */
  it('should enable loading mode while the from is in the submitting state.', () => {

    /** Start with populated form input fields */
    const formValues = { field1: TEST_INPUT_VALUE_1, field2: TEST_INPUT_VALUE_2 };
    const formState = FormControlStates.submitting;
    const initialProps = { formValues, formState };

    /** Render the hook */
    let hook;
    act(() => {
      hook = renderHook(({ formValues, formState }) => useSubmitButtonController({ formValues, formState }), { initialProps });
    });

    const { result, unmount } = hook;

    /** Verify the return values of the hook. Disabled should be true */
    expect(result.current.disabled).toEqual(false);
    expect(result.current.loading).toEqual(true);
    expect(result.current.success).toEqual(false);

    /** unmount the hook on cleanup */
    unmount();
  });

  /** Success flag should be set while the form has been successfully submitted */
  it('should set the success flag if the form has been successfully submitted.', () => {

    /** Start with populated form input fields */
    const formValues = { field1: TEST_INPUT_VALUE_1, field2: TEST_INPUT_VALUE_2 };
    const formState = FormControlStates.success;
    const initialProps = { formValues, formState };

    /** Render the hook */
    let hook;
    act(() => {
      hook = renderHook(({ formValues, formState }) => useSubmitButtonController({ formValues, formState }), { initialProps });
    });

    const { result, unmount } = hook;

    /** Verify the return values of the hook. Disabled should be true */
    expect(result.current.disabled).toEqual(false);
    expect(result.current.loading).toEqual(false);
    expect(result.current.success).toEqual(true);

    /** unmount the hook on cleanup */
    unmount();
  });
});