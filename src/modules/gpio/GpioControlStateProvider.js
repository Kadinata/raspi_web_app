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

export const useGpioControlStateContext = () => {
  const context = React.useContext(GpioControlStateContext);
  if (context === undefined) {
    throw new Error('useGpioControlStateContext must be used within an GpioControlStateContext.');
  }
  return context;
};

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