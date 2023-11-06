//===========================================================================
//  
//===========================================================================
import React from "react";
import { Endpoint } from "../endpoint_request";

const HEARTBEAT_ENDPOINT = 'api/v1/heartbeat';

export const useHeartbeatStatus = ({ enable, initialData = false }) => {
  const [connectedStatus, setConnectedStatus] = React.useState(initialData);
  const [event, setEvent] = React.useState(null);

  React.useEffect(() => {
    if (!enable) {
      setEvent(null);
      return;
    }

    const eventSource = Endpoint.subscribe(HEARTBEAT_ENDPOINT, null);

    eventSource.onopen = (event) => {
      console.log('>> event source opened', event);
      setConnectedStatus(true);
    }

    eventSource.onerror = (event) => {
      console.log('>> event source errored', event);
      setConnectedStatus(false);
    }

    setEvent(eventSource);

    return () => {
      console.log('>> closing event source');
      eventSource.close();
    };
  }, [enable]);

  return { connectedStatus };
};

//===========================================================================