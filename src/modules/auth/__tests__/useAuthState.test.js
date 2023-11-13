import { renderHook, act } from "@testing-library/react";
import AuthService from "../AuthService";
import * as AuthUtils from '../AuthUtils';
import { useAuthState } from "../useAuthState";

const MOCK_AUTH_TOKEN = 'This is a mock auth token';
const MOCK_USER_DATA = { username: 'someuser' };

describe('useAuthState Custom Hook Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  /** Test the return value of the hook */
  it('should return functions to check, retrieve, and clear authentication state', () => {

    /** Render the hook */
    let hook;
    act(() => {
      hook = renderHook(() => useAuthState());
    });

    const { result, unmount } = hook;

    /** Verify the return values of the hook are defined */
    expect(result.current.getAuthState).toBeDefined();
    expect(result.current.checkAuthState).toBeDefined();
    expect(result.current.clearAuthState).toBeDefined();

    /** Verify the return values of the hook are functions */
    expect(typeof result.current.getAuthState).toEqual('function');
    expect(typeof result.current.checkAuthState).toEqual('function');
    expect(typeof result.current.clearAuthState).toEqual('function');

    /** Unmount the hook on cleanup */
    unmount();
  });

  /** Test the functionality of the returned functions */
  it('should check, retrieve, and clear authentication state', async () => {

    /** Create dependency mocks */
    const mock_get_auth_token = jest.spyOn(AuthUtils, 'getAuthToken').mockImplementation(() => MOCK_AUTH_TOKEN);
    const mock_remove_token = jest.spyOn(AuthUtils, 'removeToken').mockImplementation(() => null);
    const mock_auth_get_user = jest.spyOn(AuthService, 'getUser').mockResolvedValue(MOCK_USER_DATA);

    /** Render the hook */
    let hook;
    act(() => {
      hook = renderHook(() => useAuthState());
    });

    const { result, unmount } = hook;

    /** Verify the current authentication state is not authenticated */
    let authState = result.current.getAuthState();
    expect(authState.user).toEqual(null);
    expect(authState.token).toEqual(null);
    expect(authState.isAuthenticated).toEqual(false);
    expect(authState.authCheckComplete).toEqual(false);

    /** Verify none of the mocks have been called so far */
    expect(mock_get_auth_token).toHaveBeenCalledTimes(0);
    expect(mock_remove_token).toHaveBeenCalledTimes(0);
    expect(mock_auth_get_user).toHaveBeenCalledTimes(0);

    /** Invoke checkAuthState and verify the auth state has been updated correctly */
    await act(async () => result.current.checkAuthState());

    /** Verify the authentication state is now authenticated */
    authState = result.current.getAuthState();
    expect(authState.user).toEqual(MOCK_USER_DATA);
    expect(authState.token).toEqual(MOCK_AUTH_TOKEN);
    expect(authState.isAuthenticated).toEqual(true);
    expect(authState.authCheckComplete).toEqual(true);

    /** Verify both get auth token and get user have been called so far */
    expect(mock_get_auth_token).toHaveBeenCalledTimes(1);
    expect(mock_auth_get_user).toHaveBeenCalledTimes(1);
    expect(mock_remove_token).toHaveBeenCalledTimes(0);

    /** Clear the authentication state and verify the auth state has been updated correctly */
    act(() => result.current.clearAuthState());

    /** Verify the authentication state is now no longer authenticated */
    authState = result.current.getAuthState();
    expect(authState.user).toEqual(null);
    expect(authState.token).toEqual(null);
    expect(authState.isAuthenticated).toEqual(false);
    expect(authState.authCheckComplete).toEqual(true);

    /** Verify remove token has been called */
    expect(mock_get_auth_token).toHaveBeenCalledTimes(1);
    expect(mock_auth_get_user).toHaveBeenCalledTimes(1);
    expect(mock_remove_token).toHaveBeenCalledTimes(1);

    /** Unmount the hook on cleanup */
    unmount();
  });

  /** Test checkAuthState handling of error */
  it('should de-authenticate when checkAuthState encounters an error', async () => {

    /** Create dependency mocks */
    const mock_get_auth_token = jest.spyOn(AuthUtils, 'getAuthToken').mockImplementation(() => MOCK_AUTH_TOKEN);
    const mock_remove_token = jest.spyOn(AuthUtils, 'removeToken').mockImplementation(() => null);
    const mock_auth_get_user = jest.spyOn(AuthService, 'getUser')
      .mockResolvedValueOnce(MOCK_USER_DATA)
      .mockRejectedValueOnce({ error: 'An induced error occurred.' });

    /** Render the hook */
    let hook;
    act(() => {
      hook = renderHook(() => useAuthState());
    });

    const { result, unmount } = hook;

    /** Verify the current authentication state is not authenticated */
    let authState = result.current.getAuthState();
    expect(authState.user).toEqual(null);
    expect(authState.token).toEqual(null);
    expect(authState.isAuthenticated).toEqual(false);
    expect(authState.authCheckComplete).toEqual(false);

    /** Verify none of the mocks have been called so far */
    expect(mock_get_auth_token).toHaveBeenCalledTimes(0);
    expect(mock_remove_token).toHaveBeenCalledTimes(0);
    expect(mock_auth_get_user).toHaveBeenCalledTimes(0);

    /** Invoke checkAuthState and verify the auth state has been updated correctly */
    await act(async () => result.current.checkAuthState());

    /** Verify the authentication state is now authenticated */
    authState = result.current.getAuthState();
    expect(authState.user).toEqual(MOCK_USER_DATA);
    expect(authState.token).toEqual(MOCK_AUTH_TOKEN);
    expect(authState.isAuthenticated).toEqual(true);
    expect(authState.authCheckComplete).toEqual(true);

    /** Verify both get auth token and get user have been called so far */
    expect(mock_get_auth_token).toHaveBeenCalledTimes(1);
    expect(mock_auth_get_user).toHaveBeenCalledTimes(1);
    expect(mock_remove_token).toHaveBeenCalledTimes(0);

    /** Invoke checkAuthState the second time. This time it should induce an error */
    await act(async () => result.current.checkAuthState());

    /** Verify the authentication state is now no longer authenticated */
    authState = result.current.getAuthState();
    expect(authState.user).toEqual(null);
    expect(authState.token).toEqual(null);
    expect(authState.isAuthenticated).toEqual(false);
    expect(authState.authCheckComplete).toEqual(true);

    /** Verify the mocks have been called correctly */
    expect(mock_get_auth_token).toHaveBeenCalledTimes(2);
    expect(mock_auth_get_user).toHaveBeenCalledTimes(2);
    expect(mock_remove_token).toHaveBeenCalledTimes(1);

    /** Unmount the hook on cleanup */
    unmount();
  });
});