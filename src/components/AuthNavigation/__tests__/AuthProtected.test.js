import '@testing-library/jest-dom';
import { render, cleanup } from "@testing-library/react";
import * as Router from 'react-router';
import * as AuthProvider from '../../../modules/auth/AuthProvider';

import AuthProtected from '../AuthProtected';

const TEST_REDIRECT_LOGIN = '/login';
const MOCK_NAVIGATE_FN = jest.fn();

const TestChildComponent = () => (<p data-testid="TestID/AuthComponent">Authenticated user only!</p>);

describe('AuthProtected Component Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  /** The component should simply not render anything before auth check completes */
  it('should simply return null before auth state check finishes', () => {

    const isAuthenticated = false;
    const authCheckComplete = false;
    const mock_use_navigate = jest.spyOn(Router, 'useNavigate').mockReturnValue(MOCK_NAVIGATE_FN);
    jest.spyOn(AuthProvider, 'useAuthStateContext').mockReturnValue({ isAuthenticated, authCheckComplete });

    /** Render the component */
    const { getByTestId } = render(
      <AuthProtected redirect={TEST_REDIRECT_LOGIN} >
        <TestChildComponent />
      </AuthProtected>
    );

    /** Verify the redirect has not been invoked */
    expect(mock_use_navigate).toHaveBeenCalledTimes(1);
    expect(MOCK_NAVIGATE_FN).toHaveBeenCalledTimes(0);

    /** Verify the child component is not rendered */
    expect(() => getByTestId("TestID/AuthComponent")).toThrow();

    /** Cleanup */
    cleanup();
  });

  /** The component should redirect after auth check completes if not authenticated */
  it('should redirect to the given URL if not authenticated', () => {
    const isAuthenticated = false;
    const authCheckComplete = true;

    const mock_use_navigate = jest.spyOn(Router, 'useNavigate').mockReturnValue(MOCK_NAVIGATE_FN);
    jest.spyOn(AuthProvider, 'useAuthStateContext').mockReturnValue({ isAuthenticated, authCheckComplete });

    /** Render the component */
    const { getByTestId } = render(
      <AuthProtected redirect={TEST_REDIRECT_LOGIN} >
        <TestChildComponent />
      </AuthProtected>
    );

    /** Verify the redirect has been invoked */
    expect(mock_use_navigate).toHaveBeenCalledTimes(1);
    expect(MOCK_NAVIGATE_FN).toHaveBeenCalledTimes(1);
    expect(MOCK_NAVIGATE_FN).toHaveBeenCalledWith(TEST_REDIRECT_LOGIN);

    /** Verify the child component is not rendered */
    expect(() => getByTestId("TestID/AuthComponent")).toThrow();

    /** Cleanup */
    cleanup();
  });

  /** The component should render the protected children if the user is authenticated */
  it('should render the child component if authenticated', () => {

    const isAuthenticated = true;
    const authCheckComplete = true;

    const mock_use_navigate = jest.spyOn(Router, 'useNavigate').mockReturnValue(MOCK_NAVIGATE_FN);
    jest.spyOn(AuthProvider, 'useAuthStateContext').mockReturnValue({ isAuthenticated, authCheckComplete });

    /** Render the component */
    const { getByTestId } = render(
      <AuthProtected redirect={TEST_REDIRECT_LOGIN} >
        <TestChildComponent />
      </AuthProtected>
    );

    /** Verify the redirect has not been invoked */
    expect(mock_use_navigate).toHaveBeenCalledTimes(1);
    expect(MOCK_NAVIGATE_FN).toHaveBeenCalledTimes(0);

    /** Verify the child component is rendered */
    expect(() => getByTestId("TestID/AuthComponent")).not.toThrow();

    const TestChildElement = getByTestId("TestID/AuthComponent");
    expect(TestChildElement).toBeDefined();

    /** Cleanup */
    cleanup();
  });
});
//===========================================================================