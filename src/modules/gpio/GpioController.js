/**
 * GPIO Controller: Custom hook and contexts for GPIO control panel components
 */
import React from 'react';
import { sendGpioCommand } from './Gpio';

const FLAG_PIN_OENABLE = (0x1 << 1);
const FLAG_PIN_HIGH = (0x1 << 0);

/**
 * @private Internal helper function to convert internal GPIO control state into GPIO commands to send to the server.
 */
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

/**
 * Custom hook providing GPIO control functions.
 * @returns {function} - controlState: A function to retrieve the control states for a particular GPIO pin.
 * @returns {function} - disableSubmit: A function to determine whether or not the submit button should be disabled.
 * @returns {function} - handleSubmit: A function to send a GPIO command to the server when the submit button is clicked.
 * @returns {function} - handleChange: A function to update the hook's internal control state, reflecting changes
 * made to the GPIO control elements.
 */
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

/** React context object to provide GPIO control functions */
export const GpioControlStateContext = React.createContext({});

/**
 * React Context Provider Element that provides GPIO control functions.
 * @param {any} props - React props to pass on to the returned context provider element.
 * @returns {Element} - React Context Provider element providing GPIO control functions.
 */
const GpioControllerProvider = (props) => {
  const gpioControlFunctions = useGpioController();
  return (<GpioControlStateContext.Provider value={gpioControlFunctions} {...props} />);
};

/** Custom hook returning the GPIO control functions provided by GpioControlStateContext */
export const useGpioControllerContext = () => React.useContext(GpioControlStateContext);

/** Custom hook to return GPIO submit button control functions from the context */
export const useGpioSubmissionController = () => {
  const { handleSubmit, disableSubmit } = useGpioControllerContext();
  return { handleSubmit, disableSubmit };
};

/** Custom hook to return GPIO pin control functions from the context */
export const useGpioPinController = (pinNum) => {
  const { handleChange, controlState } = useGpioControllerContext();
  const pinControlstate = controlState(pinNum);
  return { handleChange, pinControlstate };
};

export default GpioControllerProvider;
//===========================================================================