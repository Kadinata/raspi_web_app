//===========================================================================
//
//===========================================================================
import AuthService from '../../../modules/auth/AuthService';

const useChangePasswordHandler = () => {

  const handleSubmit = async ({ currentPassword, newPassword, confirmPassword }) => {
    let { success, error } = AuthService.validatePasswords(newPassword, confirmPassword);
    if (!success) {
      return { success, error };
    }

    try {
      let { success, message } = await AuthService.changePassword(currentPassword, newPassword);
      return { success, error: { message }};
    } catch (err) {
      console.log({ err });
      const success = false;
      const error = { message: 'Connection error occurred' };
      return { success, error };
    }
  };

  const handleError = (error) => null;

  return {
    handleSubmit,
    handleError,
  };
};

export default useChangePasswordHandler;
//===========================================================================