//===========================================================================
//  
//===========================================================================
import React from "react";
import { Endpoint } from '../endpoint_request';
import { useDataRequest } from '../endpoint_request/hooks';

const SYSINFO_ENDPOINT = 'api/v1/sysinfo';
const SYSINFO_STREAM_ENDPOINT = 'api/v1/sysinfo/stream';

const endpoints = {
  sysInfoData: SYSINFO_ENDPOINT,
};

export const useSysInfo = () => {
  const { data, error, completed } = useDataRequest(endpoints);
  const { sysInfoData } = data;
  return { sysInfoData, error, completed };
};

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