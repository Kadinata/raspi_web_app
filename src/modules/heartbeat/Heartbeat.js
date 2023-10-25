//===========================================================================
//  
//===========================================================================
import React from "react";
import { Endpoint } from "../endpoint_request";

const HEARTBEAT_PATH = 'api/v1/heartbeat';

export const useHeartbeatStatus = ({ enable, initialData = false }) => {
  const [connectedStatus, setConnectedStatus] = React.useState(initialData);
  const [event, setEvent] = React.useState(null);

  React.useEffect(() => {
    if (!enable || (event !== null)) return () => {
      if (event) {
        console.log('>> closing event');
        event.close();
      }
    };

    const eventSource = Endpoint.subscribe(HEARTBEAT_PATH, (data) => {
      console.log('received data: ', data);
    });

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