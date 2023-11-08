//===========================================================================
//  
//===========================================================================
import { Endpoint } from '../endpoint_request';
import { useDataRequest } from '../endpoint_request/hooks';

const GPIO_DATA_ENDPOINT = 'api/v1/gpio';
const USABLE_PINS_ENDPOINT = 'api/v1/gpio/usable_pins';

const endpoints = {
  gpioState: GPIO_DATA_ENDPOINT,
  usablePins: USABLE_PINS_ENDPOINT,
};

export const useGpioInfo = () => {
  const { data, error, completed } = useDataRequest(endpoints);
  const { ...gpioData } = data;
  return { gpioData, error, completed };
};

export const sendGpioCommand = async (gpioCommand) => {
  await Endpoint.post(GPIO_DATA_ENDPOINT, gpioCommand);
};
//===========================================================================