import { renderHook, act } from "@testing-library/react";
import { Endpoint } from "../../endpoint_request";
import create_endpoint_subsrciption_mock from '../../../../__mocks__/endpoint_subscription.mock';

import { useSysInfo, useSysInfoStream } from "../SysInfo";

const SYSINFO_ENDPOINT = 'api/v1/sysinfo';
const SYSINFO_STREAM_ENDPOINT = 'api/v1/sysinfo/stream';

const MOCK_INITIAL_SYSINFO_DATA = {
  sysinfo: 'initial system information data',
};

const MOCK_INITIAL_SYSINFO_TIME_DATA = {
  uptime: 'initial uptime data',
  localtime: 'initial uptime data',
  startTime: 'initial uptime data',
};

const MOCK_SYSINFO_DATA = {
  sysinfo: 'some system information data',
};

const MOCK_SYSINFO_TIME_DATA = {
  uptime: 'some uptime data',
  localtime: 'some uptime data',
  startTime: 'some uptime data',
};

describe('System Information Module Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  /** Test useSysInfo() happy path */
  test('useSysInfo() should return system information data', async () => {

    const mock_endpoint_get = jest.spyOn(Endpoint, 'get').mockResolvedValue(MOCK_SYSINFO_DATA);

    let hook;
    await act(async () => {
      hook = renderHook(() => useSysInfo());
    });

    const { result, unmount } = hook;

    /** Verify the system information data is returned by the hook */
    expect(result.current.sysInfoData).toEqual(MOCK_SYSINFO_DATA);
    expect(result.current.error).toEqual(null);
    expect(result.current.completed).toEqual(true);

    /** Verify the system information API has been called */
    expect(mock_endpoint_get).toHaveBeenCalledTimes(1);
    expect(mock_endpoint_get).toHaveBeenCalledWith(SYSINFO_ENDPOINT);

    /** Finally, unmount the hook */
    unmount();
  });

  /**
   * Test useSysInfoStream() happy path. Create the hook in the disabled state.
   * Internal system info data should be updated when new data is received
   */
  test('useSysInfoStream() should update system information when new data are sent by the stream', async () => {

    let hook;
    let enable = false;

    const mock_sub = create_endpoint_subsrciption_mock();
    jest.spyOn(Endpoint, 'subscribe').mockImplementation(mock_sub.implementation);

    /** Create the hook in the disabled state */
    enable = false;
    await act(async () => {
      hook = renderHook(() => useSysInfoStream({
        enable,
        initialData: { ...MOCK_INITIAL_SYSINFO_DATA, ...MOCK_INITIAL_SYSINFO_TIME_DATA },
      }));
    })

    const { result, unmount } = hook;

    /** Verify the hook has not subscribed to the sysinfo stream endpoint */
    expect(mock_sub.implementation).toHaveBeenCalledTimes(0);

    /** Verify the current internal data are populated with initial data */
    expect(result.current.data).toEqual(MOCK_INITIAL_SYSINFO_DATA);
    expect(result.current.timeData).toEqual(MOCK_INITIAL_SYSINFO_TIME_DATA);

    /** Enable the stream */
    enable = true;
    await act(async () => hook.rerender(true));

    /** Verify the hook has subscribed to the sysinfo stream endpoint */
    expect(mock_sub.implementation).toHaveBeenCalledTimes(1);
    expect(mock_sub.implementation.mock.calls[0][0]).toEqual(SYSINFO_STREAM_ENDPOINT);

    /** Verify the internal data has not changed since no new data has been emitted */
    expect(result.current.data).toEqual(MOCK_INITIAL_SYSINFO_DATA);
    expect(result.current.timeData).toEqual(MOCK_INITIAL_SYSINFO_TIME_DATA);

    /**
     * Emit a system information data (not time data), then verify
     * the non-time data has been updated with the newly emitted data
     */
    act(() => mock_sub.emit('event', MOCK_SYSINFO_DATA));
    expect(result.current.data).toEqual(MOCK_SYSINFO_DATA);
    expect(result.current.timeData).toEqual(MOCK_INITIAL_SYSINFO_TIME_DATA);

    /**
     * Emit a system information time data, then verify the time data
     * has been updated with the newly emitted data
     */
    act(() => mock_sub.emit('event', MOCK_SYSINFO_TIME_DATA));
    expect(result.current.data).toEqual(MOCK_SYSINFO_DATA);
    expect(result.current.timeData).toEqual(MOCK_SYSINFO_TIME_DATA);

    unmount();
  });

  /** useSysInfoStream() should close the event source during cleanup when it unmounts */
  test('useSysInfoStream() should unsubscribe when it unmounts by closing the event source', async () => {
    let hook;
    let enable = false;

    const mock_sub = create_endpoint_subsrciption_mock();
    jest.spyOn(Endpoint, 'subscribe').mockImplementation(mock_sub.implementation);

    /** Create the hook in the enabled state */
    enable = true;
    await act(async () => {
      hook = renderHook(() => useSysInfoStream({ enable }));
    })

    const { unmount } = hook;

    /** Verify the hook has subscribed to the sysinfo stream endpoint since it is enabled */
    expect(mock_sub.implementation).toHaveBeenCalledTimes(1);
    expect(mock_sub.implementation.mock.calls[0][0]).toEqual(SYSINFO_STREAM_ENDPOINT);

    /** Verify the subscription is sill active */
    expect(mock_sub.get_event_handle().close).toHaveBeenCalledTimes(0);

    /** Unmount the component and verify the event source is closed */
    unmount();
    expect(mock_sub.get_event_handle().close).toHaveBeenCalledTimes(1);
  });

  /** useSysInfoStream() should unsubscribe and stop updating after it has been disabled */
  test('useSysInfoStream() unsubscribe and stop updating after it has been disabled', async () => {
    let hook;
    let enable = false;

    const mock_sub = create_endpoint_subsrciption_mock();
    jest.spyOn(Endpoint, 'subscribe').mockImplementation(mock_sub.implementation);

    /** Create the hook in the enabled state */
    enable = true;
    await act(async () => {
      hook = renderHook(() => useSysInfoStream({ enable }));
    })

    const { result, unmount } = hook;

    /** Verify the hook has subscribed to the sysinfo stream endpoint since it is enabled */
    expect(mock_sub.implementation).toHaveBeenCalledTimes(1);
    expect(mock_sub.implementation.mock.calls[0][0]).toEqual(SYSINFO_STREAM_ENDPOINT);

    /** Verify the subscription is sill active */
    expect(mock_sub.get_event_handle().close).toHaveBeenCalledTimes(0);

    /**
     * Emit a system information data (not time data), then verify
     * the non-time data has been updated with the newly emitted data
     */
    act(() => mock_sub.emit('event', MOCK_SYSINFO_DATA));
    expect(result.current.data).toEqual(MOCK_SYSINFO_DATA);

    /** Disable the stream */
    enable = false;
    await act(async () => hook.rerender(true));

    /** Verify the event source has been closed */
    expect(mock_sub.get_event_handle().close).toHaveBeenCalledTimes(1);

    /**
     * Emit a system information time data, then verify the time data
     * has not been updated with the newly emitted data
     */
    act(() => mock_sub.emit('event', MOCK_SYSINFO_TIME_DATA));
    expect(result.current.timeData).not.toEqual(MOCK_SYSINFO_TIME_DATA);

    unmount();
  });
});