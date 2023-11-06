import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import createTestID from '../../../modules/test_id/TestID';
import Error404 from '../404';

const test_id = createTestID('Error404');

const mock_navigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mock_navigate,
}));

describe('404 Page Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  test('should render the 404 page.', () => {
    render(<Error404 />);
    const labelElement = screen.getByTestId(test_id("Label"));
    expect(labelElement).toBeInTheDocument();
    expect(labelElement).toHaveTextContent("404");
  });

  test('should navigate home when the home button is clicked.', () => {
    render(<Error404 />);
    const homeButton = screen.getByTestId(test_id("HomeButton"));
    expect(homeButton).toBeInTheDocument();

    expect(mock_navigate).toHaveBeenCalledTimes(0);
    fireEvent.click(homeButton);
    expect(mock_navigate).toHaveBeenCalledTimes(1);
    expect(mock_navigate).toHaveBeenCalledWith('/');
  });
});