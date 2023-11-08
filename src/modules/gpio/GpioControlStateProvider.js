//===========================================================================
//  
//===========================================================================
import React from 'react';
import { useGpioController } from './Gpio';

export const GpioControlStateContext = React.createContext({});

const GpioControlStateProvider = (props) => {
  const gpioControlFunctions = useGpioController();
  return (
    <GpioControlStateContext.Provider value={gpioControlFunctions} {...props} />
  );
};

export const useGpioControlStateContext = () => React.useContext(GpioControlStateContext);

export const useGpioControlSubmit = () => {
  const { handleSubmit, disableSubmit } = useGpioControlStateContext();
  return { handleSubmit, disableSubmit };
};

export const useGpioControlState = (pinNum) => {
  const { handleChange, controlState } = useGpioControlStateContext();
  const pinControlstate = controlState(pinNum);
  return { handleChange, pinControlstate };
};

export default GpioControlStateProvider;
//===========================================================================