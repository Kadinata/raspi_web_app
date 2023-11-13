/**
 * SysInfo: Hooks to request and subscribe to system information data from the server.
 */
import React from "react";
import { Endpoint } from '../endpoint_request';
import { useDataRequest } from '../endpoint_request/hooks';

/** System information API endpoints */
const SYSINFO_ENDPOINT = 'api/v1/sysinfo';
const SYSINFO_STREAM_ENDPOINT = 'api/v1/sysinfo/stream';

/** Object to organize system information GET request serialization */
const endpoints = {
  sysInfoData: SYSINFO_ENDPOINT,
};

/**
 * Custom hook to send a system information request to the server, providing the response in return.
 * @returns {object} - A system information request state object.
 * @returns {object} - result.sysInfoData: Object containing system information data contained in the
 * response from the server.
 * @returns {error} - result.error: An error object if the request encounters an error, null otherwise.
 * @returns {boolean} - result.completed: Result completion flag. This is set to true after when request
 * completes whether or not an error is encountered.
 */
export const useSysInfo = () => {
  const { data, error, completed } = useDataRequest(endpoints);
  const { sysInfoData } = data;
  return { sysInfoData, error, completed };
};

/**
 * Custom hook to subscribe to the system information stream.
 * @param {boolean} enable - A flag to enable or disable the subscription to the API.
 * @param {boolean} initialData - Optional initial data.
 * @returns {object} - An object containing the latest system information from the stream.
 * This object is updated whenever a new message is received from the server.
 */
export const useSysInfoStream = ({ enable, initialData = {} }) => {
  const { uptime, localtime, startTime, ...restData } = initialData;

  const [timeData, setTimeData] = React.useState({ uptime, localtime, startTime });
  const [data, setData] = React.useState(restData);

  React.useEffect(() => {
    if (!enable) return;

    const eventSource = Endpoint.subscribe(SYSINFO_STREAM_ENDPOINT, (data) => {
      const { uptime } = data;
      if (typeof uptime !== 'undefined') {
        setTimeData((prevData) => ({ ...prevData, ...data }));
      } else {
        setData((prevData) => ({ ...prevData, ...data }));
      }
    });

    return () => eventSource.close();
  }, [enable]);

  return { data, timeData };
};
//===========================================================================