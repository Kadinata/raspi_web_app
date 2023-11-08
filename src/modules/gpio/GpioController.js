//===========================================================================
//  
//===========================================================================
import React from 'react';
import { sendGpioCommand } from './Gpio';

const FLAG_PIN_OENABLE = (0x1 << 1);
const FLAG_PIN_HIGH = (0x1 << 0);

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

const useGpioController = () => {

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
    event?.preventDefault();

    const gpioSetting = _get_gpio_setting(gpioControlState);

    if (Object.keys(gpioSetting).length === 0) return;

    try {
      await sendGpioCommand(gpioSetting);
    } catch (err) {
      console.log({ err });
    }
  };

  return { handleChange, handleSubmit, disableSubmit, controlState };
};

export const GpioControlStateContext = React.createContext({});

const GpioControllerProvider = (props) => {
  const gpioControlFunctions = useGpioController();
  return (
    <GpioControlStateContext.Provider value={gpioControlFunctions} {...props} />
  );
};

export const useGpioControllerContext = () => React.useContext(GpioControlStateContext);

export const useGpioSubmissionController = () => {
  const { handleSubmit, disableSubmit } = useGpioControllerContext();
  return { handleSubmit, disableSubmit };
};

export const useGpioPinController = (pinNum) => {
  const { handleChange, controlState } = useGpioControllerContext();
  const pinControlstate = controlState(pinNum);
  return { handleChange, pinControlstate };
};

export default GpioControllerProvider;
//===========================================================================