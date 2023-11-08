import { renderHook, act } from "@testing-library/react";
import { Endpoint } from "../../endpoint_request";

import { useGpioController, useGpioInfo } from "../Gpio";

const MOCK_GPIO_DATA = { "0": 3, "1": 2, "2": 1, "3": 0, "4": 4 };
const MOCK_USABLE_PINS = [0, 1, 2, 3, 4];

const GPIO_DATA_ENDPOINT = 'api/v1/gpio';
const USABLE_PINS_ENDPOINT = 'api/v1/gpio/usable_pins';

const PIN_0_NEW_STATE = { used: true, output: true, high: false };
const PIN_1_NEW_STATE = { used: true, output: false, high: true };

const mock_handle_request = async (endpoint) => {
  if (endpoint === GPIO_DATA_ENDPOINT) {
    return MOCK_GPIO_DATA;
  }
  else if (endpoint === USABLE_PINS_ENDPOINT) {
    return MOCK_USABLE_PINS;
  }
  return {};
};

describe('GPIO Module Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  /** Test useGpioInfo happy path with initial data provided */
  test('useGpioInfo() should return GPIO state information', async () => {

    const mock_endpoint_get = jest.spyOn(Endpoint, 'get').mockImplementation((url) => mock_handle_request(url));

    let hook;
    await act(async () => {
      hook = renderHook(() => useGpioInfo());
    });

    const { result, unmount } = hook;

    /** Verify the GPIO state information is returned by the hook */
    expect(result.current.gpioData.gpioState).toEqual(MOCK_GPIO_DATA);
    expect(result.current.gpioData.usablePins).toEqual(MOCK_USABLE_PINS);
    expect(result.current.error).toEqual(null);
    expect(result.current.completed).toEqual(true);

    /** Verify the appropriate GPIO API endpoints have been called */
    expect(mock_endpoint_get).toHaveBeenCalledTimes(2);
    expect(mock_endpoint_get.mock.calls[0][0]).toEqual(GPIO_DATA_ENDPOINT);
    expect(mock_endpoint_get.mock.calls[1][0]).toEqual(USABLE_PINS_ENDPOINT);

    /** Finally, unmount the hook */
    unmount();
  });

  /** Test useGpioController happy path for handling changes */
  test('useGpioController() should handle and reflect GPIO state changes accordingly', () => {

    let hook;
    act(() => {
      hook = renderHook(() => useGpioController());
    });

    const { result, unmount } = hook;

    /** Verify the hook is returning the correct functions */
    expect(typeof result.current.handleChange).toEqual('function');
    expect(typeof result.current.handleSubmit).toEqual('function');
    expect(typeof result.current.disableSubmit).toEqual('function');
    expect(typeof result.current.controlState).toEqual('function');

    /** Verify the internal GPIO controller state is currently empty. */
    expect(result.current.controlState(0)).toEqual({});
    expect(result.current.controlState(1)).toEqual({});

    /** Verify disableSubmit indicates the submit button should be disabled */
    expect(result.current.disableSubmit()).toEqual(true);

    /** Emit a change verify the internal state is updated */
    act(() => result.current.handleChange({ pin: 0, ...PIN_0_NEW_STATE }));
    expect(result.current.controlState(0)).toEqual(PIN_0_NEW_STATE);
    expect(result.current.controlState(1)).toEqual({});

    /** Verify disableSubmit indicates the submit button should be enabled */
    expect(result.current.disableSubmit()).toEqual(false);

    /** Emit another change to a different pin verify only that pin is updated */
    act(() => result.current.handleChange({ pin: 1, ...PIN_1_NEW_STATE }));
    expect(result.current.controlState(0)).toEqual(PIN_0_NEW_STATE);
    expect(result.current.controlState(1)).toEqual(PIN_1_NEW_STATE);

    /** Verify disableSubmit indicates the submit button should be enabled */
    expect(result.current.disableSubmit()).toEqual(false);

    /** Disable the pins */
    act(() => result.current.handleChange({ pin: 0, ...PIN_0_NEW_STATE, used: false }));
    act(() => result.current.handleChange({ pin: 1, ...PIN_1_NEW_STATE, used: false }));

    /** Verify disableSubmit indicates the submit button should be disabled */
    expect(result.current.disableSubmit()).toEqual(true);

    unmount();
  });

  /** Test useGpioController happy path for submitting changes */
  test('useGpioController() should submit changes successfully', async () => {

    const mock_event = { preventDefault: jest.fn() };
    const mock_endpoint_post = jest.spyOn(Endpoint, 'post').mockResolvedValue({ status: 'succcess' });

    let hook;
    act(() => {
      hook = renderHook(() => useGpioController());
    });

    const { result, unmount } = hook;

    /** Create a submission */
    await act(() => result.current.handleSubmit());

    /** Verify the post endpoint has not been called because the internal state is still empty */
    expect(mock_endpoint_post).toHaveBeenCalledTimes(0);

    /** Emit pin state changes so that there are data to send */
    act(() => result.current.handleChange({ pin: 0, ...PIN_0_NEW_STATE }));
    act(() => result.current.handleChange({ pin: 1, ...PIN_1_NEW_STATE }));

    /** Verify disableSubmit indicates the submit button should be enabled */
    expect(result.current.disableSubmit()).toEqual(false);

    /** Verify the internal state has been updated accordingly */
    expect(result.current.controlState(0)).toEqual(PIN_0_NEW_STATE);
    expect(result.current.controlState(1)).toEqual(PIN_1_NEW_STATE);

    /** verify the post endpoint has not been called */
    expect(mock_endpoint_post).toHaveBeenCalledTimes(0);

    /** Create a submission request and wait for the result */
    await act(() => result.current.handleSubmit(mock_event));

    /** Verify the preventDefault method has been called on the event */
    expect(mock_event.preventDefault).toHaveBeenCalledTimes(1);

    /** Verify the post endpoint has been called */
    expect(mock_endpoint_post).toHaveBeenCalledTimes(1);
    expect(mock_endpoint_post).toHaveBeenCalledWith(GPIO_DATA_ENDPOINT, { "0": 2, "1": 1 });

    /** Disable pin 1 */
    act(() => result.current.handleChange({ pin: 1, ...PIN_1_NEW_STATE, used: false }));

    /** Create a submission request and wait for the result */
    await act(() => result.current.handleSubmit());

    /** Verify the post endpoint has been called without sending pin 1 information*/
    expect(mock_endpoint_post).toHaveBeenCalledTimes(2);
    expect(mock_endpoint_post).toHaveBeenCalledWith(GPIO_DATA_ENDPOINT, { "0": 2 });

    /** Finally unmount the hook */
    unmount();
  });

  /** Test useGpioController the error path for submitting changes */
  test('useGpioController() should handle errors gracefully while submitting changes', async () => {

    const mock_event = { preventDefault: jest.fn() };
    const mock_endpoint_post = jest.spyOn(Endpoint, 'post').mockRejectedValue({ error: 'An induced error occurred' });

    let hook;
    act(() => {
      hook = renderHook(() => useGpioController());
    });

    const { result, unmount } = hook;

    /** Create a submission */
    await act(() => result.current.handleSubmit());

    /** Verify the post endpoint has not been called because the internal state is still empty */
    expect(mock_endpoint_post).toHaveBeenCalledTimes(0);

    /** Emit pin state changes so that there are data to send */
    act(() => result.current.handleChange({ pin: 0, ...PIN_0_NEW_STATE }));
    act(() => result.current.handleChange({ pin: 1, ...PIN_1_NEW_STATE }));

    /** Verify disableSubmit indicates the submit button should be enabled */
    expect(result.current.disableSubmit()).toEqual(false);

    /** Verify the internal state has been updated accordingly */
    expect(result.current.controlState(0)).toEqual(PIN_0_NEW_STATE);
    expect(result.current.controlState(1)).toEqual(PIN_1_NEW_STATE);

    /** verify the post endpoint has not been called */
    expect(mock_endpoint_post).toHaveBeenCalledTimes(0);

    /** Create a submission request. It should not throw an error */
    await act(() => result.current.handleSubmit(mock_event));

    /** Finally unmount the hook */
    unmount();
  });

});