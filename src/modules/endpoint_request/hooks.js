/**
 * Endpoint Request Hooks: Custom React hooks to simplify state management while making HTTP requests.
 *
 * This module provides custom hooks to manage component state while making HTTP requests.
 */
import React from 'react';
import Endpoint from './EndpointRequest';

/**
 * @private Internal helper function to combine the responses from multiple GET requests into a single object.
 * @param {object} endpoints - Endpoint URLs to request from and have their responses combined into a single object.
 * @returns {object} - Combined responses from all of the requests to the provided endpoints.
 */
const serializeRequests = async ({ ...endpoints }) => {
  const result = {};
  for (const key in endpoints) {
    const endpoint = endpoints[key];
    const data = await Endpoint.get(endpoint);
    result[key] = data;
  }
  return result;
};

/**
 * @private Internal function to retrieve the initial request state.
 * The initial state is wrapped in a function to prevent it from being mutated.
 * @returns {object} - Initial request state containing fields for data, timestamp,
 * error, and request completion flag.
 */
const getInitialRequestState = (initialData = {}) => {
  const data = initialData;
  const error = null;
  const timestamp = Date.now();
  const completed = false;
  return { data, timestamp, error, completed };
};

/**
 * @private Internal custom hook to manage request state.
 * @returns {object} - An object containing the request state and functions
 * to set new data, new error, or reset the request completion flag.
 */
const useRequestState = (initialData) => {
  const [requestState, setRequestState] = React.useState(() => getInitialRequestState(initialData));

  /** Function to update the data of the request state */
  const setData = React.useCallback((newData) => {
    setRequestState((prevState) => {
      const timestamp = Date.now();
      const completed = true;
      const error = null;
      const data = { ...prevState.data, ...newData };
      return ({ ...prevState, data, error, timestamp, completed });
    });
  }, [setRequestState]);

  /** Function to add an error to the request state */
  const setError = React.useCallback((error) => {
    const timestamp = Date.now();
    const completed = true;
    setRequestState((prevState) => ({ ...prevState, error, timestamp, completed }));
  }, [setRequestState]);

  /** Function to reset the request completion flag */
  const resetCompletionFlag = React.useCallback(() => {
    const completed = false;
    setRequestState((prevState) => ({ ...prevState, completed }));
  }, [setRequestState]);

  return { requestState, setData, resetCompletionFlag, setError };
};

/**
 * Custom hook to manage the component state while making one or more GET requests.
 * @param {object} endpoints - Enpoint URLs to sent the GET requests to.
 * @returns {object} - An object containing the state of the requests.
 * @return {boolean} - result.completed: a flag that is set to true when the request
 * completes whether or not the request results in an error. A false value indicates
 * the server has not yet responded to the request. This flag can be used to determine
 * whether or not to render the loading component.
 * @return {number} - result.timestamp: Unix epoch indicating the time when the request completes.
 * @return {error} - result.error: null if the request completes without error, otherwise this will
 * contain the error from the request.
 * @return {object} - result.data: The data contained in the response from the server.
 */
export const useDataRequest = (endpoints) => {

  const { requestState, setData, resetCompletionFlag, setError } = useRequestState();

  const fetchResource = React.useCallback(
    async () => {
      resetCompletionFlag();
      try {
        const newData = await serializeRequests(endpoints);
        setData(newData);
      } catch (err) {
        setError(err);
      }
    },
    [resetCompletionFlag, setData, setError, endpoints]
  );

  React.useEffect(() => {
    fetchResource();
  }, [fetchResource]);

  return { ...requestState };
};

/**
 * Custom hook to manage the component state while subscribing to a server-sent event stream endpoint.
 * @param {string} endpoint - Endpoint URL pointing to the server-sent event stream to subscribe to.
 * @param {boolean} enable - A flag to enable or disable the subscription.
 * @param {object} initialData - Optional data to initialize the hook's internal data state.
 * @returns {object} - An object containing timestamp and data that are updated whenever a new message
 * is received from the server.
 */
export const useStreamRequest = (endpoint, enable, initialData = {}) => {

  const { requestState, setData } = useRequestState(initialData);

  React.useEffect(() => {
    if (!enable) return;

    const eventSource = Endpoint.subscribe(endpoint, (newData) => setData(newData));

    return () => eventSource.close();
  }, [enable, endpoint]);

  const { data, timestamp } = requestState;
  return { data, timestamp };
};
//===========================================================================