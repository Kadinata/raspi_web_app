import '@testing-library/jest-dom';
import { render, cleanup } from "@testing-library/react";
import * as Router from 'react-router';
import * as AuthProvider from '../../../modules/auth/AuthProvider';

import AuthRedirect from '../AuthRedirect';

const TEST_REDIRECT_HOME = '/';
const MOCK_NAVIGATE_FN = jest.fn();

const TestChildComponent = () => (<p data-testid="TestID/ChildComponent">This is a login page</p>);

describe('AuthRedirect Component Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  /** The component should render a loading component before auth check completes */
  it('should show a loading component before auth state check finishes', () => {

    const isAuthenticated = false;
    const authCheckComplete = false;
    const mock_use_navigate = jest.spyOn(Router, 'useNavigate').mockReturnValue(MOCK_NAVIGATE_FN);
    jest.spyOn(AuthProvider, 'useAuthStateContext').mockReturnValue({ isAuthenticated, authCheckComplete });

    /** Render the component */
    const { getByTestId, getByText } = render(
      <AuthRedirect redirect={TEST_REDIRECT_HOME} >
        <TestChildComponent />
      </AuthRedirect>
    );

    /** Verify the redirect has not been invoked */
    expect(mock_use_navigate).toHaveBeenCalledTimes(1);
    expect(MOCK_NAVIGATE_FN).toHaveBeenCalledTimes(0);

    /** Verify the loading component is rendered instead of the child component */
    expect(() => getByTestId("TestID/ChildComponent")).toThrow();
    expect(getByText('Loading')).toBeTruthy();

    /** Cleanup */
    cleanup();
  });

  /** The component should redirect after auth check completes if the user is authenticated */
  it('should redirect to the given URL if the user is authenticated', () => {

    const isAuthenticated = true;
    const authCheckComplete = true;
    const mock_use_navigate = jest.spyOn(Router, 'useNavigate').mockReturnValue(MOCK_NAVIGATE_FN);
    jest.spyOn(AuthProvider, 'useAuthStateContext').mockReturnValue({ isAuthenticated, authCheckComplete });

    /** Render the component */
    const { getByTestId, getByText } = render(
      <AuthRedirect redirect={TEST_REDIRECT_HOME} >
        <TestChildComponent />
      </AuthRedirect>
    );

    /** Verify the redirect has not been invoked */
    expect(mock_use_navigate).toHaveBeenCalledTimes(1);
    expect(MOCK_NAVIGATE_FN).toHaveBeenCalledTimes(1);
    expect(MOCK_NAVIGATE_FN).toHaveBeenCalledWith(TEST_REDIRECT_HOME);

    /** Verify neither the loading component nor the child component is rendered */
    expect(() => getByTestId("TestID/ChildComponent")).toThrow();
    expect(() => getByText('Loading')).toThrow();

    /** Cleanup */
    cleanup();
  });

  /** The component should render the child component if the user is not authenticated */
  it('should render the child component if not authenticated', () => {

    let isAuthenticated = false;
    let authCheckComplete = true;
    const mock_use_navigate = jest.spyOn(Router, 'useNavigate').mockReturnValue(MOCK_NAVIGATE_FN);
    jest.spyOn(AuthProvider, 'useAuthStateContext').mockImplementation(() => ({ isAuthenticated, authCheckComplete }));

    /** Render the component */
    const { getByTestId, getByText, rerender } = render(
      <AuthRedirect redirect={TEST_REDIRECT_HOME} >
        <TestChildComponent />
      </AuthRedirect>
    );

    /** Verify the redirect has not been invoked */
    expect(mock_use_navigate).toHaveBeenCalledTimes(1);
    expect(MOCK_NAVIGATE_FN).toHaveBeenCalledTimes(0);

    /** Verify the child component is rendered and the loading component is not */
    expect(() => getByTestId("TestID/ChildComponent")).not.toThrow();
    expect(() => getByText('Loading')).toThrow();

    const TestChildElement = getByTestId("TestID/ChildComponent");
    expect(TestChildElement).toBeDefined();

    /** Authenticate the user and rerender the component */
    isAuthenticated = true;
    authCheckComplete = true;
    rerender(
      <AuthRedirect redirect={TEST_REDIRECT_HOME} >
        <TestChildComponent />
      </AuthRedirect>
    );

    /** Verify the redirect has now been invoked */
    expect(mock_use_navigate).toHaveBeenCalledTimes(2);
    expect(MOCK_NAVIGATE_FN).toHaveBeenCalledTimes(1);
    expect(MOCK_NAVIGATE_FN).toHaveBeenCalledWith(TEST_REDIRECT_HOME);

    /** Verify neither the child component nor the loading component is rendered any longer */
    expect(() => getByTestId("TestID/ChildComponent")).toThrow();
    expect(() => getByText('Loading')).toThrow();

    /** Cleanup */
    cleanup();
  });

  /** The page should not redirect after the user authenticates if noRetry is set */
  it('should not redirect after the user authenticates if noRetry is set', () => {

    let isAuthenticated = false;
    let authCheckComplete = true;
    const mock_use_navigate = jest.spyOn(Router, 'useNavigate').mockReturnValue(MOCK_NAVIGATE_FN);
    jest.spyOn(AuthProvider, 'useAuthStateContext').mockImplementation(() => ({ isAuthenticated, authCheckComplete }));

    /** Render the component */
    const { getByTestId, getByText, rerender } = render(
      <AuthRedirect noRetry redirect={TEST_REDIRECT_HOME} >
        <TestChildComponent />
      </AuthRedirect>
    );

    /** Verify the redirect has not been invoked */
    expect(mock_use_navigate).toHaveBeenCalledTimes(2);
    expect(MOCK_NAVIGATE_FN).toHaveBeenCalledTimes(0);

    /** Verify the child component is rendered and the loading component is not */
    expect(() => getByTestId("TestID/ChildComponent")).not.toThrow();
    expect(() => getByText('Loading')).toThrow();
    expect(getByTestId("TestID/ChildComponent")).toBeDefined();

    /** Set the authentication flag and rerender the component */
    isAuthenticated = true;
    authCheckComplete = true;
    rerender(
      <AuthRedirect noRetry redirect={TEST_REDIRECT_HOME} >
        <TestChildComponent />
      </AuthRedirect>
    );

    /** Verify the redirect has still not been invoked */
    expect(mock_use_navigate).toHaveBeenCalledTimes(3);
    expect(MOCK_NAVIGATE_FN).toHaveBeenCalledTimes(0);

    /** Verify the child component is still rendered */
    expect(() => getByTestId("TestID/ChildComponent")).not.toThrow();
    expect(() => getByText('Loading')).toThrow();
    expect(getByTestId("TestID/ChildComponent")).toBeDefined();

    /** Cleanup */
    cleanup();
  });
});
//===========================================================================