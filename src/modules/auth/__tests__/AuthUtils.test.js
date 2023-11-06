import * as JWT from 'jsonwebtoken';
import Cookies from 'js-cookie';

import { getAuthData, getAuthToken, removeToken } from '../AuthUtils';

const MOCK_JWT_SECRET = 'mock_jwt_secret';
const MOCK_USERNAME = 'someuser';
const MOCK_USER_DATA = {
  username: MOCK_USERNAME,
  id: 7357
};
const MOCK_JWT = JWT.sign(MOCK_USER_DATA, MOCK_JWT_SECRET);

describe("Auth Utility Module Tests", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  /** Test happy path for getAuthData() when authenticated */
  test('getAuthData() should get JWT from cookie and parse it correctly', () => {

    const mock_cookies_get = jest.spyOn(Cookies, 'get').mockReturnValue(MOCK_JWT);

    const result = getAuthData();

    /** Verify the contents of the parsed token data */
    expect(result.username).toEqual(MOCK_USER_DATA.username);
    expect(result.id).toEqual(MOCK_USER_DATA.id);
    expect(result.iat).toBeDefined();

    expect(mock_cookies_get).toHaveBeenCalledTimes(1);
    expect(mock_cookies_get).toHaveBeenCalledWith('jwt');
  });

  /** Test happy path for getAuthData() when not authenticated */
  test('getAuthData() should not return user data if there is no JWT', () => {

    const mock_cookies_get = jest.spyOn(Cookies, 'get').mockReturnValue('');

    const result = getAuthData();

    /** Verify the user data is null */
    expect(result).toEqual(null);

    expect(mock_cookies_get).toHaveBeenCalledTimes(1);
    expect(mock_cookies_get).toHaveBeenCalledWith('jwt');
  });

  /** Test happy path for removeToken() */
  test('removeToken() should remove the JWT cookie', () => {

    const mock_cookies_remove = jest.spyOn(Cookies, 'remove').mockReturnValue('');

    removeToken();
    expect(mock_cookies_remove).toHaveBeenCalledTimes(1);
    expect(mock_cookies_remove).toHaveBeenCalledWith('jwt');
  });

  /** Test happy path for getAuthToken() */
  test('getAuthToken() should return the JWT if available', () => {

    const mock_cookies_get = jest.spyOn(Cookies, 'get')
      .mockReturnValueOnce('')
      .mockReturnValueOnce(MOCK_JWT);

    /** Test the case when there is no JWT */
    expect(getAuthToken()).toEqual(null);
    expect(mock_cookies_get).toHaveBeenCalledTimes(1);
    expect(mock_cookies_get).toHaveBeenCalledWith('jwt');

    /** Test the case when there is JWT */
    expect(getAuthToken()).toEqual(MOCK_JWT);
    expect(mock_cookies_get).toHaveBeenCalledTimes(2);
    expect(mock_cookies_get).toHaveBeenCalledWith('jwt');
  });
});