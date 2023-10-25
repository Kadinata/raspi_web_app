//===========================================================================
//  
//===========================================================================
import { Endpoint } from '../endpoint_request';
import { useDataRequest } from '../endpoint_request/hooks';

const MIN_PW_LENGTH = 8;
const PW_VALIDATION = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{0,}$/;
const USER_DATA_PATH = 'api/v1/auth/user';

const userDataEndpoint = {
  user: USER_DATA_PATH,
};

const authenticateUser = async (username, password) => {
  const path = 'api/v1/auth/login';
  const { auth, message } = await Endpoint.post(path, { username, password });
  return { success: auth, message };
};

const createUser = async (username, password) => {
  const path = 'api/v1/auth/register';
  const { status, message } = await Endpoint.post(path, { username, password });
  const success = (status === 'success');
  return { success, message };
};

const getUser = async () => {
  const path = 'api/v1/auth/user';
  const { user } = await Endpoint.get(path);
  return user;
}

const changePassword = async (currentPassword, newPassword) => {
  const path = 'api/v1/auth/update_password';
  const { status, message } = await Endpoint.post(path, { currentPassword, newPassword });
  const success = (status === 'success');
  return { success, message };
};

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

const useUserData = () => {
  const { data, error, completed } = useDataRequest(userDataEndpoint);
  const { user } = data;
  return { user, error, completed };
};

const Auth = {
  authenticateUser,
  createUser,
  getUser,
  validatePasswords,
  changePassword,
  useUserData,
};

export default Auth;
//===========================================================================