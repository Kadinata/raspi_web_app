//===========================================================================
//  
//===========================================================================
const normalizePath = (path) => (`/${path}`);

const get = async (endpoint) => {
  try {
    const response = await fetch(normalizePath(endpoint), { credentials: 'include' });
    const result = await response.json();
    return response.ok ? result : Promise.reject(result);
  } catch (err) {
    return Promise.reject(err);
  }
};

const subscribe = (endpoint, onMessage) => {
  console.log(`subscribing to: ${normalizePath(endpoint)}`)
  const eventSource = new EventSource(normalizePath(endpoint));
  eventSource.onmessage = (event) => {
    // console.log('onMessage:', {onMessage, event});
    if (typeof onMessage !== 'function') return;
    const eventData = JSON.parse(event.data);
    onMessage(eventData);
  };
  return eventSource;
};

const post = async (endpoint, data) => {
  try {
    const response = await fetch(normalizePath(endpoint), {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    const result = await response.json();
    return result;
  } catch (err) {
    return Promise.reject(err);
  }
};

const EndpointRequest = {
  get,
  post,
  subscribe,
};

export default EndpointRequest;
//===========================================================================