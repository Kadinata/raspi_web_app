//===========================================================================
//
//===========================================================================
import AuthService from '../../../modules/auth/AuthService';

const useSignupHandler = () => {

  const handleSubmit = async ({ username, password, confirmpw }) => {
    var { success, error } =  AuthService.validatePasswords(password, confirmpw);
    if (!success) {
      return { success, error };
    }

    try {
      let result = await AuthService.createUser(username, password);
      return { success: result.success, error: { username: result.message } };
    } catch (err) {
      console.log({err});
      const success = false;
      const error = { message: 'Connection error occurred' };
      return { success, error };
    }
  };

  const handleError = (error) => { };

  return {
    handleSubmit,
    handleError,
  };
};

export default useSignupHandler;
//===========================================================================