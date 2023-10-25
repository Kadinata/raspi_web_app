//===========================================================================
//  
//===========================================================================
import React from "react";
import { Endpoint } from '../endpoint_request';
import { useDataRequest } from '../endpoint_request/hooks';

const FLAG_PIN_OENABLE = (0x1 << 1);
const FLAG_PIN_HIGH = (0x1 << 0);

const GPIO_DATA_PATH = 'api/v1/gpio';
const USABLE_PINS_PATH = 'api/v1/gpio/usable_pins';

const endpoints = {
  gpioState: GPIO_DATA_PATH,
  usablePins: USABLE_PINS_PATH,
};

const _get_gpio_setting = (gpioControlState) => {
  const gpioSetting = {};
  for (const pinNum in gpioControlState) {
    let pinSetting = 0;
    const { used, output, high } = gpioControlState[pinNum];
    pinSetting |= output ? FLAG_PIN_OENABLE : 0;
    pinSetting |= high ? FLAG_PIN_HIGH : 0;
    if (used) gpioSetting[pinNum] = pinSetting;
  }

  return gpioSetting;
};

export const useGpioInfo = () => {
  const { data, error, completed } = useDataRequest(endpoints);
  const { ...gpioData } = data;
  return { gpioData, error, completed };
};

export const useGpioController = () => {

  const [gpioControlState, setGpioControlState] = React.useState({});

  const handleChange = ({ pin, ...newState }) => {
    setGpioControlState((prevState) => ({ ...prevState, [pin]: newState }));
  };

  const controlState = (pinNum) => (gpioControlState[pinNum] || {});

  const disableSubmit = () => {
    for (const pinNum in gpioControlState) {
      const { used } = gpioControlState[pinNum];
      if (used) return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    if (event) {
      event.preventDefault();
    }

    const gpioSetting = _get_gpio_setting(gpioControlState);

    if (Object.keys(gpioSetting).length === 0) return;

    try {
      console.log({ gpioSetting });
      await Endpoint.post(GPIO_DATA_PATH, gpioSetting);
    } catch (err) {
      console.log({ err });
    }
  };

  return { handleChange, handleSubmit, disableSubmit, controlState };
};

//===========================================================================