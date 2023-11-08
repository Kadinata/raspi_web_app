import '@testing-library/jest-dom';
import { render, waitFor, act, cleanup, fireEvent } from "@testing-library/react";
import { Endpoint } from '../../endpoint_request';

import GpioControllerProvider, { useGpioPinController, useGpioSubmissionController } from "../GpioController";

const MOCK_USABLE_PINS = [0, 1];

const MOCK_INITIAL_PIN_STATE = {
  used: false,
  output: false,
  high: false,
};

const TestGpioPinControl = ({ pinNum }) => {

  const { handleChange, pinControlstate } = useGpioPinController(pinNum);

  const handle_pin_change = (pin, { target }) => {
    const { id, checked } = target;
    const newState = { [id]: !!checked, pin };
    handleChange({ ...MOCK_INITIAL_PIN_STATE, ...pinControlstate, ...newState });
  };

  return (
    <div>
      <input type="checkbox" data-testid={`TestID/Pin${pinNum}/Used`} id="used" onChange={(e) => handle_pin_change(pinNum, e)} />
      <input type="checkbox" data-testid={`TestID/Pin${pinNum}/OEnable`} id="output" onChange={(e) => handle_pin_change(pinNum, e)} />
      <input type="checkbox" data-testid={`TestID/Pin${pinNum}/State`} id="high" onChange={(e) => handle_pin_change(pinNum, e)} />

      <p data-testid={`TestID/Pin${pinNum}/State/Used`}>{pinControlstate.used?.toString()}</p>
      <p data-testid={`TestID/Pin${pinNum}/State/OEnable`}>{pinControlstate.output?.toString()}</p>
      <p data-testid={`TestID/Pin${pinNum}/State/State`}>{pinControlstate.high?.toString()}</p>
    </div>
  );
};

const TestChildComponent = () => {

  const { handleSubmit, disableSubmit } = useGpioSubmissionController();

  return (
    <div>
      {MOCK_USABLE_PINS.map((pinNum) => <TestGpioPinControl key={pinNum} pinNum={pinNum} />)}
      <button data-testid="TestID/SubmitButton" disabled={disableSubmit()} onClick={handleSubmit} />
      <button data-testid="TestID/GodModeButton" onClick={handleSubmit} />
    </div>
  );
};

describe('GPIO Controller and State Provider Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  /** Test the happy path for GpioControllerProvider */
  test('GpioControllerProvider should provide GPIO controller functions to its children', async () => {

    const mock_endpoint_post = jest.spyOn(Endpoint, 'post').mockResolvedValue({ status: 'succcess' });

    /** Render the components */
    const { getByTestId } = render(
      <GpioControllerProvider>
        <TestChildComponent />
      </GpioControllerProvider>
    );

    const pinControlElements = MOCK_USABLE_PINS.map((pinNum) => ({
      used: getByTestId(`TestID/Pin${pinNum}/Used`),
      output: getByTestId(`TestID/Pin${pinNum}/OEnable`),
      high: getByTestId(`TestID/Pin${pinNum}/State`),
    }));

    const pinStateElements = MOCK_USABLE_PINS.map((pinNum) => ({
      used: getByTestId(`TestID/Pin${pinNum}/State/Used`),
      output: getByTestId(`TestID/Pin${pinNum}/State/OEnable`),
      high: getByTestId(`TestID/Pin${pinNum}/State/State`),
    }));

    const submitButtonElement = getByTestId('TestID/SubmitButton');
    const godModeButtonElement = getByTestId('TestID/GodModeButton');

    /** Verify the child elements are rendered */
    MOCK_USABLE_PINS.forEach((pin) => {
      expect(pinControlElements[pin].used).toBeTruthy();
      expect(pinControlElements[pin].output).toBeTruthy();
      expect(pinControlElements[pin].high).toBeTruthy();

      expect(pinStateElements[pin].used.textContent).toEqual("");
      expect(pinStateElements[pin].output.textContent).toEqual("");
      expect(pinStateElements[pin].high.textContent).toEqual("");

      expect(submitButtonElement).toBeDisabled();
    });

    /** Attempt to generate a post request using the god mode submit button */
    await act(() => fireEvent.click(godModeButtonElement));

    /** There should not a be post request because there are no changes to submit */
    expect(mock_endpoint_post).toHaveBeenCalledTimes(0);

    /** Toggle Pin 0 to output low */
    act(() => {
      fireEvent.click(pinControlElements[0].used);
      fireEvent.click(pinControlElements[0].output);
    });

    /** Wait for the components to re-render */
    await waitFor(() => expect(pinStateElements[0].used.textContent).not.toEqual(""));

    /** Verify the pin 0 states are updated correctly */
    expect(pinStateElements[0].used.textContent).toEqual("true");
    expect(pinStateElements[0].output.textContent).toEqual("true");
    expect(pinStateElements[0].high.textContent).toEqual("false");
    expect(submitButtonElement).not.toBeDisabled();

    /** Toggle Pin 0 to input high */
    act(() => {
      fireEvent.click(pinControlElements[1].used);
      fireEvent.click(pinControlElements[1].high);
    });

    /** Wait for the components to re-render */
    await waitFor(() => expect(pinStateElements[1].used.textContent).not.toEqual(""));

    /** Verify the pin 0 states haven't changed */
    expect(pinStateElements[0].used.textContent).toEqual("true");
    expect(pinStateElements[0].output.textContent).toEqual("true");
    expect(pinStateElements[0].high.textContent).toEqual("false");

    /** Verify the pin 1 states are updated correctly */
    expect(pinStateElements[1].used.textContent).toEqual("true");
    expect(pinStateElements[1].output.textContent).toEqual("false");
    expect(pinStateElements[1].high.textContent).toEqual("true");
    expect(submitButtonElement).not.toBeDisabled();

    /** Clicking the submit button should generate a post request */
    await act(() => fireEvent.click(submitButtonElement));
    expect(mock_endpoint_post).toHaveBeenCalledTimes(1);

    /** Uncheck all pins and verify the submit button is disabled again */
    act(() => {
      fireEvent.click(pinControlElements[0].used);
      fireEvent.click(pinControlElements[1].used);
    });

    /** Wait for the components to re-render */
    await waitFor(() => expect(pinStateElements[0].used.textContent).not.toEqual("true"));

    /** The submit button should now be disabled */
    expect(submitButtonElement).toBeDisabled();

    /** Attempt to generate a post request using the god mode submit button */
    await act(() => fireEvent.click(godModeButtonElement));

    /** There should not be a post request because all of the pins are not used */
    expect(mock_endpoint_post).toHaveBeenCalledTimes(1);

    cleanup();
  });

  /** Test the case for GpioControllerProvider when there is an error while submitting a GPIO command */
  test('GpioControllerProvider should provide GPIO controller functions to its children', async () => {

    const mock_endpoint_post = jest.spyOn(Endpoint, 'post').mockRejectedValue({ error: 'An induced error occurred' });

    /** Render the components */
    const { getByTestId } = render(
      <GpioControllerProvider>
        <TestChildComponent />
      </GpioControllerProvider>
    );

    const pinControlElements = MOCK_USABLE_PINS.map((pinNum) => ({
      used: getByTestId(`TestID/Pin${pinNum}/Used`),
      output: getByTestId(`TestID/Pin${pinNum}/OEnable`),
      high: getByTestId(`TestID/Pin${pinNum}/State`),
    }));

    const pinStateElements = MOCK_USABLE_PINS.map((pinNum) => ({
      used: getByTestId(`TestID/Pin${pinNum}/State/Used`),
      output: getByTestId(`TestID/Pin${pinNum}/State/OEnable`),
      high: getByTestId(`TestID/Pin${pinNum}/State/State`),
    }));

    const submitButtonElement = getByTestId('TestID/SubmitButton');

    /** Verify the child elements are rendered */
    MOCK_USABLE_PINS.forEach((pin) => {
      expect(pinControlElements[pin].used).toBeTruthy();
      expect(pinControlElements[pin].output).toBeTruthy();
      expect(pinControlElements[pin].high).toBeTruthy();

      expect(pinStateElements[pin].used.textContent).toEqual("");
      expect(pinStateElements[pin].output.textContent).toEqual("");
      expect(pinStateElements[pin].high.textContent).toEqual("");

      expect(submitButtonElement).toBeDisabled();
    });

    /** Toggle Pin 0 to output low */
    act(() => {
      fireEvent.click(pinControlElements[0].used);
      fireEvent.click(pinControlElements[0].output);
    });

    /** Wait for the components to re-render */
    await waitFor(() => expect(pinStateElements[0].used.textContent).not.toEqual(""));

    /** Verify the pin 0 states are updated correctly */
    expect(pinStateElements[0].used.textContent).toEqual("true");
    expect(pinStateElements[0].output.textContent).toEqual("true");
    expect(pinStateElements[0].high.textContent).toEqual("false");
    expect(submitButtonElement).not.toBeDisabled();

    /** Clicking the submit button should not throw an exception */
    await act(() => fireEvent.click(submitButtonElement));
    expect(mock_endpoint_post).toHaveBeenCalledTimes(1);
  });

  /** Context hooks should throw an error if called outside the provider */
  test('Context hooks should throw an error if called outside the provider', () => {
    expect(() => useGpioControllerContext()).toThrow();
    expect(() => useGpioSubmissionController()).toThrow();
    expect(() => useGpioPinController()).toThrow();
  });

});