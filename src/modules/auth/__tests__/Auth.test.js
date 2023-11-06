
import { renderHook, act } from '@testing-library/react';
import { Endpoint } from "../../endpoint_request";

import Auth from '../Auth';

const MOCK_USERNAME = 'someuser';
const MOCK_PASSWORD = 'P@$$w0rD!';
const MOCK_NEW_PASSWORD = 'N3wP@$$w0rD!';

const MOCK_USER_DATA = {
  user: {
    username: MOCK_USERNAME,
    id: 7357
  },
};

describe('User Authentication Handling Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  /** Test user authentication */
  test('should allow user to authenticate successfully', async () => {

    const LOGIN_RESPONSE = {
      auth: true,
      message: 'Login successful',
    };

    const EXPECTED_RESPONSE = {
      success: true,
      message: 'Login successful',
    };

    const EXPECTED_ENDPOINT = 'api/v1/auth/login';

    const username = MOCK_USERNAME;
    const password = MOCK_PASSWORD;
    const mock_endpoint_post = jest.spyOn(Endpoint, 'post').mockResolvedValue(LOGIN_RESPONSE);

    const result = await Auth.authenticateUser(username, password);
    expect(mock_endpoint_post).toHaveBeenCalledTimes(1);
    expect(mock_endpoint_post).toHaveBeenCalledWith(EXPECTED_ENDPOINT, { username, password });
    expect(result).toEqual(EXPECTED_RESPONSE);
  });

  /** Test user registration */
  test('should allow new user to be registered successfully', async () => {

    const REGISTER_RESPONSE = {
      status: 'success',
      message: 'User created',
    };

    const EXPECTED_RESPONSE = {
      success: true,
      message: 'User created',
    };

    const EXPECTED_ENDPOINT = 'api/v1/auth/register';

    const username = MOCK_USERNAME;
    const password = MOCK_PASSWORD;
    const mock_endpoint_post = jest.spyOn(Endpoint, 'post').mockResolvedValue(REGISTER_RESPONSE);

    const result = await Auth.createUser(username, password);
    expect(mock_endpoint_post).toHaveBeenCalledTimes(1);
    expect(mock_endpoint_post).toHaveBeenCalledWith(EXPECTED_ENDPOINT, { username, password });
    expect(result).toEqual(EXPECTED_RESPONSE);
  });

  /** Test user profile retrieval */
  test('should allow user to fetch profile successfully', async () => {

    const EXPECTED_ENDPOINT = 'api/v1/auth/user';

    const mock_endpoint_get = jest.spyOn(Endpoint, 'get').mockResolvedValue(MOCK_USER_DATA);

    const result = await Auth.getUser();
    expect(mock_endpoint_get).toHaveBeenCalledTimes(1);
    expect(mock_endpoint_get).toHaveBeenCalledWith(EXPECTED_ENDPOINT);
    expect(result).toEqual(MOCK_USER_DATA.user);
  });

  /** Test password update */
  test('should allow user to update password', async () => {

    const UPDATE_PASSWORD_RESPONSE = {
      status: 'success',
      message: 'Password updated',
    };

    const EXPECTED_RESPONSE = {
      success: true,
      message: 'Password updated',
    };

    const EXPECTED_ENDPOINT = 'api/v1/auth/update_password';

    const currentPassword = MOCK_PASSWORD;
    const newPassword = MOCK_NEW_PASSWORD;
    const mock_endpoint_post = jest.spyOn(Endpoint, 'post').mockResolvedValue(UPDATE_PASSWORD_RESPONSE);

    const result = await Auth.changePassword(currentPassword, newPassword);
    expect(mock_endpoint_post).toHaveBeenCalledTimes(1);
    expect(mock_endpoint_post).toHaveBeenCalledWith(EXPECTED_ENDPOINT, { currentPassword, newPassword });
    expect(result).toEqual(EXPECTED_RESPONSE);
  });

  /** Test password validation */
  test('should validate passwords correctly', () => {

    /** A password that is too short should fail validation */
    let result = Auth.validatePasswords('pA$SwRd', 'pA$SwRd');
    expect(result.success).toEqual(false);
    expect(result.error.password).not.toEqual('');
    expect(result.error.confirmpw).toEqual('');

    /** A password without at least one uppercase character should fail validation */
    result = Auth.validatePasswords('password1234!', 'password1234!');
    expect(result.success).toEqual(false);
    expect(result.error.password).not.toEqual('');
    expect(result.error.confirmpw).toEqual('');

    /** A password without at least one number should fail validation */
    result = Auth.validatePasswords('PASSword!', 'PASSword!');
    expect(result.success).toEqual(false);
    expect(result.error.password).not.toEqual('');
    expect(result.error.confirmpw).toEqual('');

    /** A password without at least one special character should fail validation */
    result = Auth.validatePasswords('PASSword1234', 'PASSword1234');
    expect(result.success).toEqual(false);
    expect(result.error.password).not.toEqual('');
    expect(result.error.confirmpw).toEqual('');

    /** Password validation should fail if the passwords do not match */
    result = Auth.validatePasswords(MOCK_PASSWORD, MOCK_NEW_PASSWORD);
    expect(result.success).toEqual(false);
    expect(result.error.password).toEqual('');
    expect(result.error.confirmpw).not.toEqual('');

    /** Password validation should succeed if the passwords meet all of the criteria */
    result = Auth.validatePasswords(MOCK_PASSWORD, MOCK_PASSWORD);
    expect(result.success).toEqual(true);
    expect(result.error.password).toEqual('');
    expect(result.error.confirmpw).toEqual('');
  });

  /** Test user data hook */
  test('user data hook should provide user data', async () => {

    const EXPECTED_ENDPOINT = 'api/v1/auth/user';

    const mock_endpoint_get = jest.spyOn(Endpoint, 'get').mockResolvedValue(MOCK_USER_DATA);

    let hook;
    await act(async () => {
      hook = renderHook(() => Auth.useUserData()); 
    });

    const {result, unmount} = hook;

    /** Verify the API endpoint is called correctly */
    expect(mock_endpoint_get).toHaveBeenCalledTimes(1);
    expect(mock_endpoint_get).toHaveBeenCalledWith(EXPECTED_ENDPOINT);

    /** Verify the returned data are correct */
    expect(result.current.user).toEqual(MOCK_USER_DATA);
    expect(result.current.completed).toEqual(true);
    expect(result.current.error).toEqual(null);

    unmount();
  });
});