/**
 * Auth Service: User authentication service module.
 *
 * This module provides functions for user authentication functionalities,
 * e.g. login, registration, and password update.
 */
import { Endpoint } from '../endpoint_request';
import { useDataRequest } from '../endpoint_request/hooks';

/**
 * Password requirement definitions:
 * - must be 8 characters minimum
 * - must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character
 */
const MIN_PW_LENGTH = 8;
const PW_VALIDATION = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{0,}$/;

/** API Endpoint URLs */
const USER_DATA_ENDPOINT = 'api/v1/auth/user';
const USER_LOGIN_ENDPOINT = 'api/v1/auth/login';
const REGISTRATION_ENDPOINT = 'api/v1/auth/register';
const UPDATE_PASSWORD_ENDPOINT = 'api/v1/auth/update_password';

const userDataEndpoint = {
  user: USER_DATA_ENDPOINT,
};

/**
 * Authenticate a user with their username and password (i.e. logging in).
 * @param {string} username - The username of the user logging in.
 * @param {string} password - The password associated with the username.
 * @returns {object} - result: authentication result containing a boolean and a message.
 * @returns {boolean} - result.success: true if the authentication is successful, false otherwise.
 * @returns {string} - result.message: a message describing the authentication result.
 */
const authenticateUser = async (username, password) => {
  const { auth, message } = await Endpoint.post(USER_LOGIN_ENDPOINT, { username, password });
  return { success: auth, message };
};

/**
 * Create a new user with the given username and password (i.e. registration).
 * @param {string} username - The username of the new user.
 * @param {string} password - The password associated with the username.
 * @returns {object} - result: registration result containing a boolean and a message.
 * @returns {boolean} - result.success: true if the new user is registered successfully, false otherwise.
 * @returns {string} - result.message: a message describing the user registration result.
 */
const createUser = async (username, password) => {
  const { status, message } = await Endpoint.post(REGISTRATION_ENDPOINT, { username, password });
  const success = (status === 'success');
  return { success, message };
};

/**
 * Fetch the profile of the current user from the server.
 * @returns {object} - An object containing the profile of the current user if the user is authenticated.
 * @returns {null} - Null is returned if the user is not authenticated.
 */
const getUser = async () => {
  const { user } = await Endpoint.get(USER_DATA_ENDPOINT);
  return user;
}

/**
 * Update the password of the current user.
 * @param {string} currentPassword - The current password of the user.
 * @param {string} newPassword - The password to be updated to.
 * @returns {object} - result: an object containing a boolean and a message.
 * @returns {boolean} - result.success: true if the password is updated successfully, false otherwise.
 * @returns {string} - result.message: a message describing the password update result.
 */
const changePassword = async (currentPassword, newPassword) => {
  const { status, message } = await Endpoint.post(UPDATE_PASSWORD_ENDPOINT, { currentPassword, newPassword });
  const success = (status === 'success');
  return { success, message };
};

/**
 * Validate the given password against the password requirements.
 * @param {string} password - The password to be validated.
 * @param {string} confirmpw - Password confirmation that must match the provided password.
 * @returns {object} - An object containing the password validation result.
 * @returns {boolean} - result.success: true if the password validation is successful, false otherwise.
 * @returns {boolean} - result.error: object containing error messages in the event of a password validation failure.
 */
const validatePasswords = (password, confirmpw) => {

  let success = true;
  const error = {
    password: '',
    confirmpw: '',
  };

  if (password.length < MIN_PW_LENGTH) {
    error.password = 'Password must contain 8 or more characters.';
    success = false;
  } else if (!password.match(PW_VALIDATION)) {
    error.password = 'Password must have at least 1 uppercase, 1 lowercase, 1 numeric, and 1 special characters.';
    success = false;
  }

  if (password !== confirmpw) {
    error.confirmpw = 'Passwords do not match.';
    success = false;
  }

  return { success, error };
};

/**
 * Custom hook to fetch the profile of the current user from the server.
 * @returns {object} - An object containing the user profile and request state.
 * @returns {object} - result.user: profile data of the current user or null if the user is not authenticated.
 * @returns {error} - result.error: an error object if the request ends in an error, null otherwise.
 * @returns {boolean} - result.completed: true if the request has completed, false otherwise.
 */
const useUserData = () => {
  const { data, error, completed } = useDataRequest(userDataEndpoint);
  const { user } = data;
  return { user, error, completed };
};

/** Bundle all of the methods into a single object */
const AuthService = {
  authenticateUser,
  createUser,
  getUser,
  validatePasswords,
  changePassword,
  useUserData,
};

export default AuthService;
//===========================================================================