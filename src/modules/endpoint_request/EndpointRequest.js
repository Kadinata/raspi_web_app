/**
 * Endpoint Request: HTTP request module.
 *
 * This module provides functions to create and send HTTP requests to the server.
 */

/**
 * @private Internal helper function to ensure endpoint URLs are prefixed with '/'
 * @param {string} endpoint - Endpoint URL to normalize.
 * @returns {string} - The provided endpoint URL prefixed with '/'
 */
const normalizeEndpoint = (endpoint) => (`/${endpoint}`);

/**
 * Send an HTTP GET request to the server at the provided endpoint.
 * @param {string} endpoint - API endpoint URL to send the GET request to.
 * @returns {Promise} - A resolved promise containing the response, or a rejected promise if an error is encountered.
 */
const get = async (endpoint) => {
  try {
    const response = await fetch(normalizeEndpoint(endpoint), {
      method: 'get',
      credentials: 'include',
    });
    const result = await response.json();
    return response.ok ? result : Promise.reject(result);
  } catch (err) {
    return Promise.reject(err);
  }
};

/**
 * Subscribe to a server-sent event (SSE) endpoint.
 * @param {string} endpoint - Endpoint URL of the server-sent event stream.
 * @param {function} onMessage - Message handler function to be invoked whenever a new message is sent from the server.
 * @returns {EventSource} - An event source object associated with the SSE stream.
 */
const subscribe = (endpoint, onMessage) => {
  console.log(`subscribing to: ${normalizeEndpoint(endpoint)}`)
  const eventSource = new EventSource(normalizeEndpoint(endpoint));
  eventSource.onmessage = (event) => {
    if (typeof onMessage !== 'function') return;
    const eventData = JSON.parse(event.data);
    onMessage(eventData);
  };
  return eventSource;
};

/**
 * Send an HTTP POST request to the server at the provided endpoint.
 * @param {string} endpoint - API endpoint URL to send the POST request to.
 * @param {any} data - Any data to be sent to the server as the request's body. 
 * @returns {Promise} - A resolved promise containing the response, or a rejected promise if an error is encountered.
 */
const post = async (endpoint, data) => {
  try {
    const response = await fetch(normalizeEndpoint(endpoint), {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    const result = await response.json();
    return response.ok ? result : Promise.reject(result);
  } catch (err) {
    return Promise.reject(err);
  }
};

/** Bundle all of the methods into a single object */
const EndpointRequest = {
  get,
  post,
  subscribe,
};

export default EndpointRequest;
//===========================================================================