//===========================================================================
//  
//===========================================================================
import React from 'react';
import { useStreamRequest } from '../endpoint_request/hooks';

const GPIO_STREAM_PATH = 'api/v1/gpio/stream';

export const GpioStreamContext = React.createContext({});

const GpioStreamProvider = ({ enable, initialData = {}, ...props }) => {

  const { data } = useStreamRequest(GPIO_STREAM_PATH, enable, initialData);

  return (
    <GpioStreamContext.Provider value={data} {...props} />
  );
};

export const useGpioStreamContext = () => React.useContext(GpioStreamContext);

export default GpioStreamProvider;
//===========================================================================