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

const updateDataState = (prevData, newData) => {
  const data = { ...prevData, ...newData };
  return { data };
};

export const useDataRequest = (endpoints) => {

  const [dataState, setDataState] = React.useState({data: {}});
  const [completed, setCompleted] = React.useState(false);
  const [timestamp, setTimestamp] = React.useState(Date.now());
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
      setTimestamp(Date.now());
      setCompleted(true);
    },
    [setDataState, setCompleted, setError, endpoints]
  );

  React.useEffect(() => {
    fetchResource();
  }, [fetchResource]);

  return { ...dataState, timestamp, completed, error };
};

export const useStreamRequest = (endpoint, enable, initialData = {}) => {

  const [dataState, setDataState] = React.useState({data: initialData});
  const [timestamp, setTimestamp] = React.useState(Date.now());

  React.useEffect(() => {
    if (!enable) return;

    const eventSource = Endpoint.subscribe(endpoint, (newData) => {
      setDataState(({ data }) => updateDataState(data, newData));
      setTimestamp(Date.now());
    });

    return () => eventSource.close();
  }, [enable, endpoint]);

  return {...dataState, timestamp};
};
//===========================================================================