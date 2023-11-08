//===========================================================================
//  
//===========================================================================
import React from "react";
import { Endpoint } from "../endpoint_request";

const HEARTBEAT_ENDPOINT = 'api/v1/heartbeat';

export const useHeartbeatStatus = ({ enable, initialData = false }) => {
  const [connectedStatus, setConnectedStatus] = React.useState(initialData);

  React.useEffect(() => {
    if (!enable) return;

    const eventSource = Endpoint.subscribe(HEARTBEAT_ENDPOINT, null);

    eventSource.onopen = (event) => {
      console.log('>> event source opened', event);
      setConnectedStatus(true);
    }

    eventSource.onerror = (event) => {
      console.log('>> event source errored', event);
      setConnectedStatus(false);
    }

    return () => eventSource.close();
  }, [enable]);

  return { connectedStatus };
};
//===========================================================================