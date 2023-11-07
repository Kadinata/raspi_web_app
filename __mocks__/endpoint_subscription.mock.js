//===========================================================================
//  
//===========================================================================

export default create_endpoint_subsrciption_mock = () => {

  const generate = () => {
    let closed = false;
    let mock_event_source = {};

    const implementation = jest.fn((endpoint, onMessage) => {
      closed = false;
      mock_event_source = {
        close: jest.fn(() => { closed = true }),
        onmessage: (data) => ((typeof onMessage === 'function') ? onMessage(data) : null),
      };
      return mock_event_source;
    });

    const get_event_handle = () => mock_event_source;

    const emit = (key, value) => {
      if (closed) return;

      if ((key === 'open') && (typeof mock_event_source.onopen === 'function')) {
        mock_event_source.onopen(value);
      }
      else if ((key === 'error') && (typeof mock_event_source.onerror === 'function')) {
        mock_event_source.onerror(value);
      }
      else if (typeof mock_event_source.onmessage === 'function') {
        mock_event_source.onmessage(value);
      }
    };

    return { get_event_handle, implementation, emit };
  };

  return generate();
};

//===========================================================================