//===========================================================================
//  
//===========================================================================
import { useAuthActions } from '../../../modules/auth/AuthProvider';

const useLoginHandler = () => {

  const { handleLogin } = useAuthActions();

  const handleSubmit = async ({ username, password }) => {
    try {
      const { success, message } = await handleLogin(username, password);
      return { success, error: { message } };
    } catch (err) {
      const success = false;
      const error = { message: 'Connection error occurred' };
      return { success, error };
    };
  }

  const handleError = (error) => { };

  return {
    handleSubmit,
    handleError,
  };
};

export default useLoginHandler;
//===========================================================================