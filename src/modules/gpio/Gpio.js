/**
 * GPIO: Function and custom hook to request and send GPIO data to and from the server.
 */
import { Endpoint } from '../endpoint_request';
import { useDataRequest } from '../endpoint_request/hooks';

/** GPIO API endpoints */
const GPIO_DATA_ENDPOINT = 'api/v1/gpio';
const USABLE_PINS_ENDPOINT = 'api/v1/gpio/usable_pins';

/** Object to organize GPIO GET request serialization */
const endpoints = {
  gpioState: GPIO_DATA_ENDPOINT,
  usablePins: USABLE_PINS_ENDPOINT,
};

/**
 * Custom hook to send a GPIO data request to the server, providing the response in return.
 * @returns {object} - A GPIO request state object.
 * @returns {object} - result.gpioData: Object containing usable GPIO pins as well
 * as the current state of GPIO pins.
 * @returns {error} - result.error: An error object if the request encounters an
 * error, otherwise null.
 * @returns {boolean} - result.completed: Result completion flag. This is set to
 * true after when request completes whether or not an error is encountered.
 */
export const useGpioInfo = () => {
  const { data, error, completed } = useDataRequest(endpoints);
  const { ...gpioData } = data;
  return { gpioData, error, completed };
};

/**
 * Function to send a GPIO command to the server through an HTTP POST request.
 * @param {object} gpioCommand - GPIO command to send to the server.
 * @return None
 */
export const sendGpioCommand = async (gpioCommand) => {
  await Endpoint.post(GPIO_DATA_ENDPOINT, gpioCommand);
};
//===========================================================================