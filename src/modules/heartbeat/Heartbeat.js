/**
 * Heartbeat: Custom hook to provide live connection status to the server.
 */
import React from "react";
import { Endpoint } from "../endpoint_request";

/** Endpoint for the heartbeat API */
const HEARTBEAT_ENDPOINT = 'api/v1/heartbeat';

/**
 * Custom hook providing live connection status to the server.
 * @param {boolean} enable - A flag to enable or disable the subscription to the API.
 * @param {boolean} initialData - Optional data to set the connection status to.
 * @returns {object} - An object containing a boolean connectedStatus. This value is
 * updated whenever there is a change to the connection status between the client
 * and the server. If the connection is interrupted for any reason, this flag will be
 * set to false.
 */
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