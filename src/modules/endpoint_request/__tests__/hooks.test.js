import { renderHook, act, cleanup } from '@testing-library/react';
import create_endpoint_subsrciption_mock from '../../../../__mocks__/endpoint_subscription.mock';

import { Hooks, Endpoint } from '..';

const ENDPOINT_URLS = {
  some_endpoint: 'path/to/some/endpoint',
  another_endpoint: 'path/to/another/endpoint',
};

const ENDPOINT_RESPONSES = {};
ENDPOINT_RESPONSES[`/${ENDPOINT_URLS['some_endpoint']}`] = { data: 'some data from some endpoint' };
ENDPOINT_RESPONSES[`/${ENDPOINT_URLS['another_endpoint']}`] = { data: 'another data from another endpoint' };

const expectAccurateTimestamp = (timestamp) => {
  expect(timestamp).toBeGreaterThan(0);
  expect(timestamp <= Date.now()).toEqual(true);
  expect(timestamp >= (Date.now() - 200)).toEqual(true);
}

describe('Endpoint Hooks Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  /** useDataRequest() happy path test */
  test('useDataRequest should succeed', async () => {

    const EXPECTED_RESPONSE = {
      some_endpoint: ENDPOINT_RESPONSES[`/${ENDPOINT_URLS['some_endpoint']}`],
      another_endpoint: ENDPOINT_RESPONSES[`/${ENDPOINT_URLS['another_endpoint']}`],
    }

    jest.spyOn(global, 'fetch').mockImplementation(async (endpoint) => ({
      ok: true,
      json: jest.fn().mockResolvedValue(ENDPOINT_RESPONSES[endpoint]),
    }));

    let hook;

    await act(async () => {
      hook = renderHook(() => Hooks.useDataRequest(ENDPOINT_URLS));
    });

    const { result, unmount } = hook;

    expect(result.current.data).toEqual(EXPECTED_RESPONSE);
    expect(result.current.completed).toEqual(true);
    expect(result.current.error).toEqual(null);
    expectAccurateTimestamp(result.current.timestamp);

    unmount();
  });

  /** useDataRequest() error path test */
  test('useDataRequest should handle error accordingly', async () => {

    jest.spyOn(global, 'fetch').mockImplementation(async (endpoint) => ({
      ok: true,
    }));

    let hook;

    await act(async () => {
      hook = renderHook(() => Hooks.useDataRequest(ENDPOINT_URLS));
    });

    const { result, unmount } = hook;

    expect(result.current.data).toEqual({});
    expect(result.current.completed).toEqual(true);
    expect(result.current.error).toBeTruthy();
    expectAccurateTimestamp(result.current.timestamp);

    unmount();
  });

  /** useStreamRequest() happy path test */
  test('useStreamRequest should succeed', async () => {

    const ENDPOINT_URL = ENDPOINT_URLS.some_endpoint;
    const TEST_DATA = { data: 'some data' };
    const INITIAL_DATA = { initial_data: 'some initial data' };

    const mock_sub = create_endpoint_subsrciption_mock();
    jest.spyOn(Endpoint, 'subscribe').mockImplementation(mock_sub.implementation);

    let hook;

    await act(async () => {
      hook = renderHook(() => Hooks.useStreamRequest(ENDPOINT_URL, true, INITIAL_DATA));
    });

    const { result, unmount } = hook;

    expect(mock_sub.implementation).toHaveBeenCalledTimes(1);
    expect(mock_sub.implementation.mock.calls[0][0]).toEqual(ENDPOINT_URL);

    expect(result.current.data).toEqual(INITIAL_DATA);
    expectAccurateTimestamp(result.current.timestamp);

    /** Emit a test data and verify the data is stashed in the hook's internal state */
    act(() => mock_sub.emit('message', TEST_DATA));

    expect(result.current.data).toEqual({ ...INITIAL_DATA, ...TEST_DATA });
    expectAccurateTimestamp(result.current.timestamp);

    unmount();
  });

  /** Test behavior of useStreamRequest() when it's disabled or enabled */
  test('useStreamRequest should close the internal event source when disabled', async () => {

    const ENDPOINT_URL = ENDPOINT_URLS.some_endpoint;
    const TEST_DATA = [
      { data: 'some data' },
      { data: 'some newer data' },
    ];

    let enable_stream = false;
    const mock_sub = create_endpoint_subsrciption_mock();

    jest.spyOn(Endpoint, 'subscribe').mockImplementation(mock_sub.implementation);

    let hook;

    /** Create the stream in the disabled state */
    enable_stream = false;
    await act(async () => {
      hook = renderHook(() => Hooks.useStreamRequest(ENDPOINT_URL, enable_stream));
    });

    const { result, unmount } = hook;
    expect(mock_sub.implementation).toHaveBeenCalledTimes(0);
    expect(result.current.data).toEqual({});
    expectAccurateTimestamp(result.current.timestamp);

    /** Enable the stream and re-render the hook */
    enable_stream = true;
    await act(async () => hook.rerender(true));

    expect(mock_sub.implementation).toHaveBeenCalledTimes(1);
    expect(mock_sub.implementation.mock.calls[0][0]).toEqual(ENDPOINT_URL);
  
    expect(result.current.data).toEqual({});
    expectAccurateTimestamp(result.current.timestamp);

    /** Emit a test data and verify the data is stashed in the hook's internal state */
    act(() => mock_sub.emit('message', TEST_DATA[0]));

    expect(result.current.data).toEqual(TEST_DATA[0]);
    expectAccurateTimestamp(result.current.timestamp);

    expect(mock_sub.get_event_handle().close).toHaveBeenCalledTimes(0);

    /** Disable the stream and force a re-render of the hook */
    enable_stream = false;
    await act(async () => hook.rerender(true));
    expect(mock_sub.get_event_handle().close).toHaveBeenCalledTimes(1);
    expect(mock_sub.implementation).toHaveBeenCalledTimes(1);

    /** Internal data should not update when the steam is disabled */
    act(() => mock_sub.emit('message', TEST_DATA[1]));
    expect(result.current.data).toEqual(TEST_DATA[0]);

    /** Enable the stream and re-render the hook */
    enable_stream = true;
    await act(async () => hook.rerender(true));
    expect(mock_sub.implementation).toHaveBeenCalledTimes(2);

    /** Emit a new test data and verify the hook's internal state is updated */
    expect(result.current.data).toEqual(TEST_DATA[0]);
    act(() => mock_sub.emit('message', TEST_DATA[1]));
    expect(result.current.data).toEqual(TEST_DATA[1]);

    unmount();
  });
});