/**
 * Auth Utils: Utility functions for the authentication module.
 */
import Cookies from 'js-cookie';

/**
 * @private Internal helper function to decode and parse the provided JSON Web Token.
 * @param {string} token - JWT to be decoded and parsed.
 * @returns {object} - payload: payload object contained in the provided token.
 */
const parseJWT = (token) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const uriComponent = atob(base64).split('').map((char) => {
    return '%' + ('00' + char.charCodeAt(0).toString(16)).slice(-2);
  }).join('');
  const payload = decodeURIComponent(uriComponent);
  return JSON.parse(payload);
};

/**
 * Retrieve and return the user authentication data encoded in the JWT cookie.
 * @returns {object} - Decoded user data if the JWT cookie exists, null otherwise.
 */
export const getAuthData = () => {
  const jwt_cookie = Cookies.get('jwt');
  if (!jwt_cookie) return null;
  return parseJWT(jwt_cookie);
};

/**
 * Delete the JWT cookie. This is used to log the current user out.
 * @returns {null} - None.
 */
export const removeToken = () => Cookies.remove('jwt');

/**
 * Retrieve the JWT stored in the cookie.
 * @returns {string} - The raw JWT if the cookie exists, null otherwise.
 */
export const getAuthToken = () => (Cookies.get('jwt') || null);
//===========================================================================