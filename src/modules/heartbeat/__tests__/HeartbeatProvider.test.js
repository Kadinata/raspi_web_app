import { render, act, waitFor, cleanup } from "@testing-library/react";
import * as AuthProvider from "../../auth/AuthProvider";
import { Endpoint } from "../../endpoint_request";
import create_endpoint_subsrciption_mock from '../../../../__mocks__/endpoint_subscription.mock';

import HeartbeatProvider, { useHeartbeatContext } from "../HeartbeatProvider";

const TestChildComponent = () => {
  const { connectedStatus } = useHeartbeatContext();

  return (<p data-testid="TestID/ConnStatus">{connectedStatus?.toString()}</p>);
};

describe('Heartbeat Provider Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  /** Test the happy path for HeartbeatProvider */
  test('HeartbeatProvider should provide connection status info to its children', async () => {

    const MOCK_AUTH_STATE = {
      isAuthenticated: true,
      authCheckComplete: true,
    };

    const mock_sub = create_endpoint_subsrciption_mock();
    jest.spyOn(Endpoint, 'subscribe').mockImplementation(mock_sub.implementation);

    const mock_use_auth_state = jest.spyOn(AuthProvider, 'useAuthenticationState')
      .mockReturnValue(MOCK_AUTH_STATE);

    /** Render the provider component in the enabled state */
    const { getByTestId } = render(
      <HeartbeatProvider enable>
        <TestChildComponent />
      </HeartbeatProvider>
    );

    const connStatusElement = getByTestId("TestID/ConnStatus");

    /**
     * Connection status should still be false due to the open event
     * not yet being emitted. The hook should have queried auth state
     * and subscribed to the heartbeat stream endpoint, however.
     */
    expect(connStatusElement.textContent).toEqual("false");
    expect(mock_sub.implementation).toHaveBeenCalledTimes(1);
    expect(mock_use_auth_state).toHaveBeenCalledTimes(2);

    /** Emit the connection open event */
    act(() => mock_sub.emit('open', 'onopen'));

    /** The connection status should change to true now */
    await waitFor(() => expect(connStatusElement.textContent).toEqual("true"));

    /** Emit an error to trigger a disconnect */
    act(() => mock_sub.emit('error', 'onerror'));

    /** The connection status should change to false now */
    await waitFor(() => expect(connStatusElement.textContent).toEqual("false"));

    cleanup();
  });

  /** HeartbeatProvider should not provide connection status when the user is not authenticated */
  test('HeartbeatProvider should not provide connection status when the user is not authenticated', async () => {

    const MOCK_AUTH_STATE = {
      isAuthenticated: false,
      authCheckComplete: true,
    };

    const mock_sub = create_endpoint_subsrciption_mock();
    jest.spyOn(Endpoint, 'subscribe').mockImplementation(mock_sub.implementation);

    const mock_use_auth_state = jest.spyOn(AuthProvider, 'useAuthenticationState')
      .mockReturnValue(MOCK_AUTH_STATE);

    /** Render the provider component in the enabled state */
    const { getByTestId } = render(
      <HeartbeatProvider enable>
        <TestChildComponent />
      </HeartbeatProvider>
    );

    const connStatusElement = getByTestId("TestID/ConnStatus");

    /** The hook should have queried auth state but not subscribed to the heartbeat stream endpoint. */
    expect(connStatusElement.textContent).toEqual("false");
    expect(mock_sub.implementation).toHaveBeenCalledTimes(0);
    expect(mock_use_auth_state).toHaveBeenCalledTimes(1);

    cleanup();
  });

  /** useHeartbeatContext should throw an error if called outside of the provider */
  test('useHeartbeatContext should throw an error if called outside of the provider', () => {
    expect(() => useHeartbeatContext()).toThrow();
  });

});