import React from "react";
import { render, cleanup, waitFor, fireEvent } from "@testing-library/react";
import Auth from "../Auth";
import * as AuthUtils from '../AuthUtils';

import AuthProvider, { useAuthenticationState, useAuthActions, useAuthDataContext } from "../AuthProvider";

const MOCK_USERNAME = 'someuser';
const MOCK_PASSWORD = 'P@$$w0rD!';
const MOCK_TOKEN = 'sometoken';

const MOCK_USER_DATA = {
  username: MOCK_USERNAME,
  id: 7357
};

const TestChildComponent = () => {
  const { user, token, isAuthenticated, authCheckComplete } = useAuthenticationState();
  const { handleLogin, onLogout } = useAuthActions();

  const [error, setError] = React.useState(null);

  const handleLoginWrapper = async () => {
    try {
      await handleLogin(MOCK_USERNAME, MOCK_PASSWORD);
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div>
      <p data-testid="Test/Error">{error?.error}</p>
      <p data-testid="Test/Username">{user?.username}</p>
      <p data-testid="Test/Token">{token}</p>
      <p data-testid="Test/isAuth">{isAuthenticated?.toString()}</p>
      <p data-testid="Test/checkComplete">{authCheckComplete?.toString()}</p>
      <button data-testid="Test/HandleLogin" onClick={() => handleLoginWrapper()}>handleLogin</button>
      <button data-testid="Test/OnLogout" onClick={() => onLogout()}>onLogout</button>
    </div>
  );
};

describe('Auth Provider Component and Auth Context Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  /** Test AuthProvider happy path */
  test('AuthProvider should provide AuthContext to child elements if authentication is successful', async () => {

    const mock_auth_get_user = jest.spyOn(Auth, 'getUser').mockResolvedValue(MOCK_USER_DATA);
    const mock_get_auth_token = jest.spyOn(AuthUtils, 'getAuthToken').mockReturnValue(MOCK_TOKEN);

    const { getByTestId } = render(
      <AuthProvider>
        <TestChildComponent />
      </AuthProvider>
    );

    const authTokenElement = getByTestId("Test/Token");
    const usernameElement = getByTestId("Test/Username");
    const isAuthElement = getByTestId("Test/isAuth");
    const checkCompleteElement = getByTestId("Test/checkComplete");

    /** Auth context should be in the unauthenticated state before the auth check completes */
    expect(usernameElement.textContent).toEqual('');
    expect(isAuthElement.textContent).toEqual('false');
    expect(checkCompleteElement.textContent).toEqual('false');

    /** Wait for the auth check to complete */
    await waitFor(() => expect(checkCompleteElement.textContent).toEqual('true'));

    /** Auth context should now be in the authenticated state */
    expect(usernameElement.textContent).toEqual(MOCK_USERNAME);
    expect(authTokenElement.textContent).toEqual(MOCK_TOKEN);
    expect(isAuthElement.textContent).toEqual('true');
    expect(checkCompleteElement.textContent).toEqual('true');

    /** Verify the get user and token APIs have been called */
    expect(mock_auth_get_user).toHaveBeenCalled();
    expect(mock_get_auth_token).toHaveBeenCalled();

    cleanup();
  });

  /** Test AuthProvider error handling */
  test('AuthProvider should update to the unauthenticated state if there is an error', async () => {

    const mock_auth_get_user = jest.spyOn(Auth, 'getUser').mockRejectedValue({ error: 'An induced error occurred' });
    const mock_get_auth_token = jest.spyOn(AuthUtils, 'getAuthToken').mockReturnValue(MOCK_TOKEN);
    const mock_remove_token = jest.spyOn(AuthUtils, 'removeToken').mockReturnValue(null);

    const { getByTestId } = render(
      <AuthProvider>
        <TestChildComponent />
      </AuthProvider>
    );

    const usernameElement = getByTestId("Test/Username");
    const isAuthElement = getByTestId("Test/isAuth");
    const checkCompleteElement = getByTestId("Test/checkComplete");

    /** Auth context should be in the unauthenticated state before the auth check completes */
    expect(usernameElement.textContent).toEqual('');
    expect(isAuthElement.textContent).toEqual('false');
    expect(checkCompleteElement.textContent).toEqual('false');
    expect(mock_remove_token).toHaveBeenCalledTimes(0);

    /** Wait for the auth check to complete */
    await waitFor(() => expect(checkCompleteElement.textContent).toEqual('true'));

    /** Auth context should still be in the unauthenticated state due to the error */
    expect(usernameElement.textContent).toEqual('');
    expect(isAuthElement.textContent).toEqual('false');
    expect(checkCompleteElement.textContent).toEqual('true');

    /** Verify the get user and token APIs have been called */
    expect(mock_auth_get_user).toHaveBeenCalled();
    expect(mock_get_auth_token).toHaveBeenCalled();
    expect(mock_remove_token).toHaveBeenCalledTimes(1);

    cleanup();
  });

  /** Test user login action */
  test('AuthProvider should update auth states correctly when the user successfully logs in', async () => {
    const mock_auth_get_user = jest.spyOn(Auth, 'getUser').mockResolvedValueOnce(null).mockResolvedValueOnce(MOCK_USER_DATA);
    const mock_auth_authenticate_user = jest.spyOn(Auth, 'authenticateUser').mockResolvedValue({ success: true });
    const mock_get_auth_token = jest.spyOn(AuthUtils, 'getAuthToken').mockReturnValue(MOCK_TOKEN);

    const { getByTestId } = render(
      <AuthProvider>
        <TestChildComponent />
      </AuthProvider>
    );

    const authTokenElement = getByTestId("Test/Token");
    const usernameElement = getByTestId("Test/Username");
    const isAuthElement = getByTestId("Test/isAuth");
    const checkCompleteElement = getByTestId("Test/checkComplete");
    const handleLoginButton = getByTestId("Test/HandleLogin");

    /** Auth context should be in the unauthenticated state before the auth check completes */
    expect(usernameElement.textContent).toEqual('');
    expect(isAuthElement.textContent).toEqual('false');
    expect(checkCompleteElement.textContent).toEqual('false');

    /** Wait for the auth check to complete */
    await waitFor(() => expect(checkCompleteElement.textContent).toEqual('true'));

    /** Auth context should still be in the unauthenticated state because Auth.getUser() returns null */
    expect(usernameElement.textContent).toEqual('');
    expect(isAuthElement.textContent).toEqual('false');
    expect(checkCompleteElement.textContent).toEqual('true');

    /** Verify Auth.getUser() has been called but Auth.authenticateUser() has not */
    expect(mock_auth_get_user).toHaveBeenCalledTimes(1);
    expect(mock_auth_authenticate_user).toHaveBeenCalledTimes(0);
    expect(mock_get_auth_token).toHaveBeenCalled();

    /** Attempt to login */
    fireEvent.click(handleLoginButton);

    /** Wait for the authentication state to update */
    await waitFor(() => expect(isAuthElement.textContent).toEqual('true'));

    /** Auth context should now be in the authenticated state */
    expect(usernameElement.textContent).toEqual(MOCK_USERNAME);
    expect(authTokenElement.textContent).toEqual(MOCK_TOKEN);
    expect(isAuthElement.textContent).toEqual('true');
    expect(checkCompleteElement.textContent).toEqual('true');

    /** Verify both Auth.getUser() and Auth.authenticateUser() have been called accordingly */
    expect(mock_auth_get_user).toHaveBeenCalledTimes(2);
    expect(mock_auth_authenticate_user).toHaveBeenCalledTimes(1);

    cleanup();
  });

  /** Test user logout action */
  test('AuthProvider should update auth states correctly when the user logs out', async () => {
    jest.spyOn(Auth, 'getUser').mockResolvedValue(MOCK_USER_DATA);
    jest.spyOn(AuthUtils, 'getAuthToken').mockReturnValue(MOCK_TOKEN);
    const mock_remove_token = jest.spyOn(AuthUtils, 'removeToken').mockReturnValue(null);

    const { getByTestId } = render(
      <AuthProvider>
        <TestChildComponent />
      </AuthProvider>
    );

    const authTokenElement = getByTestId("Test/Token");
    const usernameElement = getByTestId("Test/Username");
    const isAuthElement = getByTestId("Test/isAuth");
    const checkCompleteElement = getByTestId("Test/checkComplete");
    const logoutButton = getByTestId("Test/OnLogout");

    /** Auth context should be in the unauthenticated state before the auth check completes */
    expect(usernameElement.textContent).toEqual('');
    expect(isAuthElement.textContent).toEqual('false');
    expect(checkCompleteElement.textContent).toEqual('false');

    /** Wait for the auth check to complete */
    await waitFor(() => expect(checkCompleteElement.textContent).toEqual('true'));

    /** Auth context should be in the authenticated state when auth check completes */
    expect(usernameElement.textContent).toEqual(MOCK_USERNAME);
    expect(authTokenElement.textContent).toEqual(MOCK_TOKEN);
    expect(isAuthElement.textContent).toEqual('true');
    expect(checkCompleteElement.textContent).toEqual('true');

    expect(mock_remove_token).toHaveBeenCalledTimes(0);

    /** Attempt to logout */
    fireEvent.click(logoutButton);

    /** Wait for the authentication state to update */
    await waitFor(() => expect(isAuthElement.textContent).toEqual('false'));

    /** Auth context should now be in the unauthenticated state */
    expect(usernameElement.textContent).toEqual("");
    expect(authTokenElement.textContent).toEqual("");
    expect(isAuthElement.textContent).toEqual('false');
    expect(checkCompleteElement.textContent).toEqual('true');

    expect(mock_remove_token).toHaveBeenCalledTimes(1);

    cleanup();
  });

  /** Test login error handling */
  test('AuthProvider should not provide authenticated state when login fails', async () => {

    const ERROR_MESSAGE = 'An induced error occurred';

    const mock_auth_get_user = jest.spyOn(Auth, 'getUser').mockResolvedValue(null)
    const mock_auth_authenticate_user = jest.spyOn(Auth, 'authenticateUser').mockRejectedValue({ error: ERROR_MESSAGE });
    const mock_get_auth_token = jest.spyOn(AuthUtils, 'getAuthToken').mockReturnValue(MOCK_TOKEN);

    const { getByTestId } = render(
      <AuthProvider>
        <TestChildComponent />
      </AuthProvider>
    );

    const errorElement = getByTestId("Test/Error");
    const usernameElement = getByTestId("Test/Username");
    const isAuthElement = getByTestId("Test/isAuth");
    const checkCompleteElement = getByTestId("Test/checkComplete");
    const handleLoginButton = getByTestId("Test/HandleLogin");

    /** Auth context should be in the unauthenticated state before the auth check completes */
    expect(usernameElement.textContent).toEqual('');
    expect(isAuthElement.textContent).toEqual('false');
    expect(checkCompleteElement.textContent).toEqual('false');

    /** Wait for the auth check to complete */
    await waitFor(() => expect(checkCompleteElement.textContent).toEqual('true'));

    /** Auth context should still be in the unauthenticated state because Auth.getUser() returns null */
    expect(errorElement.textContent).toEqual('');
    expect(usernameElement.textContent).toEqual('');
    expect(isAuthElement.textContent).toEqual('false');
    expect(checkCompleteElement.textContent).toEqual('true');

    /** Verify Auth.getUser() has been called but Auth.authenticateUser() has not */
    expect(mock_auth_get_user).toHaveBeenCalledTimes(1);
    expect(mock_auth_authenticate_user).toHaveBeenCalledTimes(0);
    expect(mock_get_auth_token).toHaveBeenCalled();

    /** Attempt to login. This should induce an error */
    fireEvent.click(handleLoginButton);

    /** Wait for the the error message to appear */
    await waitFor(() => expect(errorElement.textContent).not.toEqual(''));

    /** Auth context should still be in the unauthenticated state and the error element is populated */
    expect(errorElement.textContent).toEqual(ERROR_MESSAGE);
    expect(usernameElement.textContent).toEqual('');
    expect(isAuthElement.textContent).toEqual('false');
    expect(checkCompleteElement.textContent).toEqual('true');

    cleanup();
  });

  /** Verify auth context hooks throw errors when called outside of AuthProvider */
  test('auth context hooks should throw an error if called outside of AuthProvider', () => {
    expect(() => useAuthDataContext()).toThrow();
    expect(() => useAuthenticationState()).toThrow();
    expect(() => useAuthActions()).toThrow();
  });

});