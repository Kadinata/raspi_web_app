import { render, act, waitFor, cleanup } from "@testing-library/react";
import { Endpoint } from "../../endpoint_request";
import create_endpoint_subsrciption_mock from '../../../../__mocks__/endpoint_subscription.mock';

import GpioStreamProvider, { useGpioStreamContext } from "../GpioDataStreamProvider";

const MOCK_GPIO_INITIAL_DATA = {
  "0": 0, "1": 0, "2": 0, "3": 0,
  "4": 0, "5": 0, "6": 0, "7": 0,
};

const MOCK_GPIO_STREAM_MESSAGE = {
  "0": 3, "1": 2, "2": 1, "3": 0,
};

const TestChildComponent = () => {

  const data = useGpioStreamContext();

  return (
    <p data-testid="TestID/GPIOData">
      {JSON.stringify(data || {})}
    </p>
  );
};

describe('GPIO Data Stream Provider Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  /** Test the happy path for GpioStreamProvider with initial data provided */
  test('GpioStreamProvider should provide GPIO state data to its children', async () => {

    const mock_sub = create_endpoint_subsrciption_mock();
    jest.spyOn(Endpoint, 'subscribe').mockImplementation(mock_sub.implementation);

    /** Render the provider */
    const { getByTestId } = render(
      <GpioStreamProvider enable initialData={MOCK_GPIO_INITIAL_DATA}>
        <TestChildComponent />
      </GpioStreamProvider>
    )

    const gpioDataElement = getByTestId("TestID/GPIOData");

    /** Verify that the initial data are being rendered */
    expect(gpioDataElement.textContent).toEqual(JSON.stringify(MOCK_GPIO_INITIAL_DATA));

    /** Emit a GPIO data message */
    act(() => mock_sub.emit('event', MOCK_GPIO_STREAM_MESSAGE));

    /** Wait for the child component to re-render */
    await waitFor(() => expect(gpioDataElement.textContent).not.toEqual(JSON.stringify(MOCK_GPIO_INITIAL_DATA)));

    /** Verify that the updated, merged data are being rendered */
    expect(gpioDataElement.textContent).toEqual(JSON.stringify({
      ...MOCK_GPIO_INITIAL_DATA,
      ...MOCK_GPIO_STREAM_MESSAGE
    }));

    cleanup();
  });

  /** Test the happy path for GpioStreamProvider without initial data */
  test('GpioStreamProvider should not throw error without initial data provided', async () => {

    const mock_sub = create_endpoint_subsrciption_mock();
    jest.spyOn(Endpoint, 'subscribe').mockImplementation(mock_sub.implementation);

    /** Render the provider */
    const { getByTestId } = render(
      <GpioStreamProvider enable>
        <TestChildComponent />
      </GpioStreamProvider>
    )

    const gpioDataElement = getByTestId("TestID/GPIOData");

    /** Verify that the initial data are being rendered */
    expect(gpioDataElement.textContent).toEqual(JSON.stringify({}));

    /** Emit a GPIO data message */
    act(() => mock_sub.emit('event', MOCK_GPIO_STREAM_MESSAGE));

    /** Wait for the child component to re-render */
    await waitFor(() => expect(gpioDataElement.textContent).not.toEqual(JSON.stringify({})));

    /** Verify that the updated, merged data are being rendered */
    expect(gpioDataElement.textContent).toEqual(JSON.stringify(MOCK_GPIO_STREAM_MESSAGE));

    cleanup();
  });

  /** useGpioStreamContext should throw an error if called outside the provider */
  test('useGpioStreamContext() should throw an error if called outside the provider', () => {
    expect(() => useGpioStreamContext()).toThrow();
  });
});
