//===========================================================================
//  
//===========================================================================
import React from 'react';
import Endpoint from './EndpointRequest';

const serializeRequests = async ({ ...endpoints }) => {
  const result = {};
  for (const key in endpoints) {
    const endpoint = endpoints[key];
    const data = await Endpoint.get(endpoint);
    result[key] = data;
  }
  return result;
};

const initializeDataState = (initialData) => {
  const timestamp = 0;
  const data = initialData || {};
  return { timestamp, data };
};

const updateDataState = (prevData, newData) => {
  const timestamp = Date.now();
  const data = { ...prevData, ...newData };
  return { timestamp, data };
};

export const useDataRequest = (endpoints) => {

  const [dataState, setDataState] = React.useState(initializeDataState({}));
  const [completed, setCompleted] = React.useState(false);
  const [error, setError] = React.useState(null);

  const fetchResource = React.useCallback(
    async () => {
      setCompleted(false);
      try {
        const newData = await serializeRequests(endpoints);
        setDataState(({ data }) => updateDataState(data, newData));
      } catch (err) {
        setError(err);
      }
      setCompleted(true);
    },
    [setDataState, setCompleted, setError, endpoints]
  );

  React.useEffect(() => {
    fetchResource();
    return () => console.log('cleaning up useDataRequest useEffect()');
  }, [fetchResource]);

  return { ...dataState, completed, error };
};

export const useStreamRequest = (endpoint, enable, initialData = {}) => {

  const [event, setEvent] = React.useState(null);
  const [dataState, setDataState] = React.useState(initializeDataState(initialData));

  React.useEffect(() => {
    console.log({enable, event});
    if (!enable || (event !== null)) {
      return () => {
        if (event) {
          console.log('>>> event is still open; closing event');
          event.close();
        }
      };
    }
    const eventSource = Endpoint.subscribe(endpoint, (newData) => {
      setDataState(({ data }) => updateDataState(data, newData));
    });
    setEvent(eventSource);

    return () => {
      console.log('>>> closing eventSource');
      eventSource.close();
    };
  }, [enable, endpoint]);

  return dataState;
};
//===========================================================================