import { renderHook, act } from "@testing-library/react";
import create_endpoint_subsrciption_mock from '../../../../__mocks__/endpoint_subscription.mock';
import { Endpoint } from "../../endpoint_request";

import { useHeartbeatStatus } from "../Heartbeat";

const HEARTBEAT_ENDPOINT = 'api/v1/heartbeat';

describe('Heartbeat Hook Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  /** 
   * Test the happy path. Create the hook in the disabled state,
   * and it should report the status as connected when the hook is enabled.
   */
  test('useHeartbeatStatus should report connected state when it connects succesfully', async () => {

    let enable = true;
    const mock_sub = create_endpoint_subsrciption_mock();

    jest.spyOn(Endpoint, 'subscribe').mockImplementation(mock_sub.implementation);

    let hook;

    /** Create the hook in the disabled state */
    enable = false;
    await act(async () => {
      hook = renderHook(() => useHeartbeatStatus({ enable }));
    });

    const { result, unmount } = hook;

    /** Verify the hook is created without subscribing to the API */
    expect(mock_sub.implementation).toHaveBeenCalledTimes(0);
    expect(mock_sub.get_event_handle().onopen).toBeUndefined();
    expect(mock_sub.get_event_handle().onerror).toBeUndefined();
    expect(result.current.connectedStatus).toEqual(false);

    /** Enable the hook */
    enable = true;
    await act(async () => hook.rerender(true));

    /** Verify the hook has subscribed to the API */
    expect(mock_sub.implementation).toHaveBeenCalledTimes(1);
    expect(mock_sub.implementation.mock.calls[0][0]).toEqual(HEARTBEAT_ENDPOINT);
    expect(typeof mock_sub.get_event_handle().onopen).toEqual('function');
    expect(typeof mock_sub.get_event_handle().onerror).toEqual('function');

    /** connectedStatus should still be false because onopen() hasn't been called */
    expect(result.current.connectedStatus).toEqual(false);

    /** Emit an open event and verify connectedStatus is now true */
    act(() => mock_sub.emit('open', 'onopen'));
    expect(result.current.connectedStatus).toEqual(true);

    unmount();
  });

  /** 
   * Test disconnect handling. The connection status should update to the disconnect state when the subscription errors.
   */
  test('useHeartbeatStatus should report a disconnect when the endpoint subscription is interrupted', async () => {

    let enable = true;
    const mock_sub = create_endpoint_subsrciption_mock();

    jest.spyOn(Endpoint, 'subscribe').mockImplementation(mock_sub.implementation);

    let hook;

    /** Create the hook in the disabled state */
    enable = true;
    await act(async () => {
      hook = renderHook(() => useHeartbeatStatus({ enable }));
    });

    const { result, unmount } = hook;

    /** Verify the hook is created and subscribed to the edpoint */
    expect(mock_sub.implementation).toHaveBeenCalledTimes(1);
    expect(mock_sub.get_event_handle().onopen).toBeDefined();
    expect(mock_sub.get_event_handle().onerror).toBeDefined();

    /** connectedStatus should still be false because onopen() hasn't been called */
    expect(result.current.connectedStatus).toEqual(false);

    /** Emit an open event and verify connectedStatus is now true */
    act(() => mock_sub.emit('open', 'onopen'));
    expect(result.current.connectedStatus).toEqual(true);

    /** Induced an event source error and verify connectedStatus is now false */
    act(() => mock_sub.emit('error', 'onerror'));
    expect(result.current.connectedStatus).toEqual(false);

    /** connectedStatus should be updated to true again when onopen is invoked again */
    act(() => mock_sub.emit('open', 'onopen'));
    expect(result.current.connectedStatus).toEqual(true);

    unmount();
  });

  /** 
   * Test cleanup handling. The hook should stop the subscription by closing the event source.
   */
  test('useHeartbeatStatus should close the internal event source when during cleanup', async () => {
    let enable = true;
    const mock_sub = create_endpoint_subsrciption_mock();

    jest.spyOn(Endpoint, 'subscribe').mockImplementation(mock_sub.implementation);

    let hook;

    /** Create the hook in the disabled state */
    enable = true;
    await act(async () => {
      hook = renderHook(() => useHeartbeatStatus({ enable }));
    });

    const { unmount } = hook;

    /** Verify the hook is created and subscribed to the edpoint */
    expect(mock_sub.implementation).toHaveBeenCalledTimes(1);
    expect(mock_sub.get_event_handle().onopen).toBeDefined();
    expect(mock_sub.get_event_handle().onerror).toBeDefined();
    expect(mock_sub.get_event_handle().close).toHaveBeenCalledTimes(0);

    /** Unmount the component and verify the event source is closed */
    unmount();
    expect(mock_sub.get_event_handle().close).toHaveBeenCalledTimes(1);
  });

  /** 
   * Test the hook's behavior when it's disabled. It should stop updating when disabled.
   */
  test('useHeartbeatStatus should not update status when disabled', async () => {
    let enable = true;
    const mock_sub = create_endpoint_subsrciption_mock();

    jest.spyOn(Endpoint, 'subscribe').mockImplementation(mock_sub.implementation);

    let hook;

    /** Create the hook in the disabled state */
    enable = true;
    await act(async () => {
      hook = renderHook(() => useHeartbeatStatus({ enable }));
    });

    const { result, unmount } = hook;

    /** Verify the hook is created and subscribed to the edpoint */
    expect(mock_sub.implementation).toHaveBeenCalledTimes(1);
    expect(mock_sub.get_event_handle().onopen).toBeDefined();
    expect(mock_sub.get_event_handle().onerror).toBeDefined();

    /** connectedStatus should still be false because onopen() hasn't been called */
    expect(result.current.connectedStatus).toEqual(false);

    /** Emit an open event and verify connectedStatus is now true */
    act(() => mock_sub.emit('open', 'onopen'));
    expect(result.current.connectedStatus).toEqual(true);

    /** Verify the internal event source has not been closed */
    expect(mock_sub.get_event_handle().close).toHaveBeenCalledTimes(0);

    /** Disable the hook and rerender it */
    enable = false;
    act(() => hook.rerender(true));

    /** Verify the internal event source has been closed */
    expect(mock_sub.get_event_handle().close).toHaveBeenCalledTimes(1);

    /** Verify the connection status hasn't changed when the hook is disabled */
    expect(result.current.connectedStatus).toEqual(true);

    /** Induce an error and verify the connection status has not changed */
    act(() => mock_sub.emit('error', 'onerror'));
    expect(result.current.connectedStatus).toEqual(true);

    unmount();
  });
});