//===========================================================================
//  
//===========================================================================
import React from 'react';
import { useStreamRequest } from '../endpoint_request/hooks';

const GPIO_STREAM_PATH = 'api/v1/gpio/stream';

export const GpioStreamContext = React.createContext({});

const GpioStreamProvider = ({ enable, initialData = {}, ...props }) => {

  console.log('[Rendering]: GpioStreamProvider ');

  const { data } = useStreamRequest(GPIO_STREAM_PATH, enable, initialData);

  return (
    <GpioStreamContext.Provider value={data} {...props} />
  );
};

export const useGpioStreamContext = () => {
  const context = React.useContext(GpioStreamContext);
  if (context === undefined) {
    throw new Error('useGpioStreamContext must be used within an GpioStreamProvider.');
  }
  return context;
}

export default GpioStreamProvider;
//===========================================================================