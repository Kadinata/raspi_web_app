/**
 * GPIO Data Stream Provider: GPIO data stream context and provider module.
 */
import React from 'react';
import { useStreamRequest } from '../endpoint_request/hooks';

/** Endpoint for the GPIO data SSE stream API */
const GPIO_STREAM_PATH = 'api/v1/gpio/stream';

/** React context object to provide GPIO data from the stream */
export const GpioStreamContext = React.createContext({});

/**
 * React Context Provider Element that provides the latest GPIO data from the stream.
 * @param {boolean} enable - Flag to enable or disable the subscription to the stream.
 * @param {object} initialData - Optional initial data
 * @param {any} props - React props to pass on to the returned context provider element.
 * @returns {Element} - React Context Provider element providing GPIO data.
 */
const GpioStreamProvider = ({ enable, initialData = {}, ...props }) => {

  const { data } = useStreamRequest(GPIO_STREAM_PATH, enable, initialData);

  return (<GpioStreamContext.Provider value={data} {...props} />);
};

/** Custom hook returning the GPIO data provided by GpioStreamContext */
export const useGpioStreamContext = () => React.useContext(GpioStreamContext);

export default GpioStreamProvider;
//===========================================================================