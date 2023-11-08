import { renderHook, act } from "@testing-library/react";
import { Endpoint } from "../../endpoint_request";

import { sendGpioCommand, useGpioController, useGpioInfo } from "../Gpio";

const MOCK_GPIO_DATA = { "0": 3, "1": 2, "2": 1, "3": 0, "4": 4 };
const MOCK_USABLE_PINS = [0, 1, 2, 3, 4];

const GPIO_DATA_ENDPOINT = 'api/v1/gpio';
const USABLE_PINS_ENDPOINT = 'api/v1/gpio/usable_pins';

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

  /** Test the happy path for sendGpioCommand() */
  test('sendGpioCommand() should send a post request when invoked', async () => {
    
    const mock_endpoint_post = jest.spyOn(Endpoint, 'post').mockResolvedValue({ status: 'succcess' });

    await(sendGpioCommand(MOCK_GPIO_DATA));

    /** Verify the function sent a post request */
    expect(mock_endpoint_post).toHaveBeenCalledTimes(1);
    expect(mock_endpoint_post).toHaveBeenCalledWith(GPIO_DATA_ENDPOINT, MOCK_GPIO_DATA);
  });
});