import { Endpoint } from '..';

const MOCK_FETCH_RESULT = { data: 'some_data' };
const ENDPOINT_URL = 'path/to/endpoint';

const MockEventSource = jest.fn().mockImplementation(
  (endpoint) => ({}),
);

describe('Endpoint Request Tests', () => {

  let event_source_orig;

  beforeAll(() => {
    event_source_orig = window.EventSource;
    window.EventSource = MockEventSource;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    window.EventSource = event_source_orig;
  });

  /** Test get() happy path */
  test('get should resolve successfully', async () => {

    const mock_fetch = jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(MOCK_FETCH_RESULT),
    });

    expect(mock_fetch).toHaveBeenCalledTimes(0);

    await expect(Endpoint.get(ENDPOINT_URL)).resolves.toEqual(MOCK_FETCH_RESULT);
    expect(mock_fetch).toHaveBeenCalledTimes(1);
    expect(mock_fetch.mock.calls[0][0]).toEqual(`/${ENDPOINT_URL}`);

    const { method, credentials } = mock_fetch.mock.calls[0][1];
    expect(method).toEqual('get');
    expect(credentials).toEqual('include');
  });

  /** Test the behavior of get() when the received response is not OK */
  test('get should return a rejected promise if the response is not OK', async () => {

    const mock_fetch = jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue(MOCK_FETCH_RESULT),
    });

    expect(mock_fetch).toHaveBeenCalledTimes(0);

    await expect(Endpoint.get(ENDPOINT_URL)).rejects.toEqual(MOCK_FETCH_RESULT);
    expect(mock_fetch).toHaveBeenCalledTimes(1);
    expect(mock_fetch.mock.calls[0][0]).toEqual(`/${ENDPOINT_URL}`);

    const { method, credentials } = mock_fetch.mock.calls[0][1];
    expect(method).toEqual('get');
    expect(credentials).toEqual('include');
  });

  /** Test the behavior of get() when it encounters an error */
  test('get should return a rejected promise if it encounters an error', async () => {

    const mock_fetch = jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
    });

    expect(mock_fetch).toHaveBeenCalledTimes(0);

    await expect(Endpoint.get(ENDPOINT_URL)).rejects.toBeDefined();
    expect(mock_fetch).toHaveBeenCalledTimes(1);
    expect(mock_fetch.mock.calls[0][0]).toEqual(`/${ENDPOINT_URL}`);

    const { method, credentials } = mock_fetch.mock.calls[0][1];
    expect(method).toEqual('get');
    expect(credentials).toEqual('include');
  });

  /** Test post() happy path */
  test('post should resolve successfully', async () => {
    const POST_DATA = { post_data: 'some_post_data' };

    const mock_fetch = jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(MOCK_FETCH_RESULT),
    });

    expect(mock_fetch).toHaveBeenCalledTimes(0);

    await expect(Endpoint.post(ENDPOINT_URL, POST_DATA)).resolves.toEqual(MOCK_FETCH_RESULT);
    expect(mock_fetch).toHaveBeenCalledTimes(1);
    expect(mock_fetch.mock.calls[0][0]).toEqual(`/${ENDPOINT_URL}`);

    const { method, headers, body, credentials } = mock_fetch.mock.calls[0][1];
    expect(method).toEqual('post');
    expect(headers).toEqual({ 'Content-Type': 'application/json' });
    expect(body).toEqual(JSON.stringify(POST_DATA));
    expect(credentials).toEqual('include');
  });

  /** Test the behavior of ptos() when the received response is not OK */
  test('post should return a rejected promise if the response is not OK', async () => {
    const POST_DATA = { post_data: 'some_post_data' };

    const mock_fetch = jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue(MOCK_FETCH_RESULT),
    });

    expect(mock_fetch).toHaveBeenCalledTimes(0);

    await expect(Endpoint.post(ENDPOINT_URL, POST_DATA)).rejects.toEqual(MOCK_FETCH_RESULT);
    expect(mock_fetch).toHaveBeenCalledTimes(1);
    expect(mock_fetch.mock.calls[0][0]).toEqual(`/${ENDPOINT_URL}`);

    const { method, headers, body, credentials } = mock_fetch.mock.calls[0][1];
    expect(method).toEqual('post');
    expect(headers).toEqual({ 'Content-Type': 'application/json' });
    expect(body).toEqual(JSON.stringify(POST_DATA));
    expect(credentials).toEqual('include');
  });

  /** Test the behavior of post() when it encounters an error */
  test('post should return a rejected promise if it encounters an error', async () => {
    const POST_DATA = { post_data: 'some_post_data' };

    const mock_fetch = jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
    });

    expect(mock_fetch).toHaveBeenCalledTimes(0);

    await expect(Endpoint.post(ENDPOINT_URL, POST_DATA)).rejects.toBeDefined();
    expect(mock_fetch).toHaveBeenCalledTimes(1);
    expect(mock_fetch.mock.calls[0][0]).toEqual(`/${ENDPOINT_URL}`);

    const { method, headers, body, credentials } = mock_fetch.mock.calls[0][1];
    expect(method).toEqual('post');
    expect(headers).toEqual({ 'Content-Type': 'application/json' });
    expect(body).toEqual(JSON.stringify(POST_DATA));
    expect(credentials).toEqual('include');
  });

  /** Test subscribe() happy path */
  test('subscribe should return an event source instance', () => {
    const MOCK_DATA = { mock_data: 'some_mock_data' };
    const MOCK_EVENT = { data: JSON.stringify(MOCK_DATA) };
    const message_handler = jest.fn();
    const mock_json_parse = jest.spyOn(JSON, 'parse');

    expect(MockEventSource).toHaveBeenCalledTimes(0);

    const event_source = Endpoint.subscribe(ENDPOINT_URL, message_handler);
    expect(MockEventSource).toHaveBeenCalledTimes(1);
    expect(MockEventSource).toHaveBeenCalledWith(`/${ENDPOINT_URL}`);
    expect(event_source.onmessage).toBeDefined();
    expect(message_handler).toHaveBeenCalledTimes(0);
    expect(mock_json_parse).toHaveBeenCalledTimes(0);

    event_source.onmessage(MOCK_EVENT);
    expect(message_handler).toHaveBeenCalledTimes(1);
    expect(mock_json_parse).toHaveBeenCalledTimes(1);
    expect(message_handler).toHaveBeenCalledWith(MOCK_DATA);
  });

  /** Test subscribe() without message handler */
  test('subscribe should return an event source instance', () => {
    const MOCK_DATA = { mock_data: 'some_mock_data' };
    const MOCK_EVENT = { data: JSON.stringify(MOCK_DATA) };
    const mock_json_parse = jest.spyOn(JSON, 'parse');

    expect(MockEventSource).toHaveBeenCalledTimes(0);

    const event_source = Endpoint.subscribe(ENDPOINT_URL, null);
    expect(MockEventSource).toHaveBeenCalledTimes(1);
    expect(MockEventSource).toHaveBeenCalledWith(`/${ENDPOINT_URL}`);
    expect(event_source.onmessage).toBeDefined();
    expect(mock_json_parse).toHaveBeenCalledTimes(0);

    event_source.onmessage(MOCK_EVENT);
    expect(mock_json_parse).toHaveBeenCalledTimes(0);
  });
});