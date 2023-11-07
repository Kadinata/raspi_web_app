import React from "react";
import { render, waitFor, act, cleanup } from "@testing-library/react";

import { Endpoint } from "../../endpoint_request";
import create_endpoint_subsrciption_mock from '../../../../__mocks__/endpoint_subscription.mock';

import SysInfoStreamProvider, { useTimeStreamContext, useDataStreamContext } from "../SysInfoStreamProvider";

const MOCK_SYSINFO_DATA = {
  sysinfo: 'some system information data',
};

const MOCK_SYSINFO_TIME_DATA = {
  uptime: 'some uptime data',
  localtime: 'some uptime data',
  starttime: 'some uptime data',
};

const TestChildComponent = () => {
  const timeData = useTimeStreamContext();
  const sysinfoData = useDataStreamContext();

  return (
    <div>
      <p data-testid="TestID/Uptime">{timeData?.uptime}</p>
      <p data-testid="TestID/LocalTime">{timeData?.localtime}</p>
      <p data-testid="TestID/StartTime">{timeData?.starttime}</p>
      <p data-testid="TestID/SysInfo">{sysinfoData?.sysinfo}</p>
    </div>
  )
};

describe('System Information Provider Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  /** Test the happy path for SysInfoStreamProvider */
  test('SysInfoStreamProvider should provide system info data to its children', async () => {

    const mock_sub = create_endpoint_subsrciption_mock();
    jest.spyOn(Endpoint, 'subscribe').mockImplementation(mock_sub.implementation);

    /** Render the components */
    const { getByTestId } = render(
      <SysInfoStreamProvider enable>
        <TestChildComponent />
      </SysInfoStreamProvider>
    );

    const uptimeElement = getByTestId("TestID/Uptime");
    const localTimeElement = getByTestId("TestID/LocalTime");
    const startTimeElement = getByTestId("TestID/StartTime");
    const sysinfoElement = getByTestId("TestID/SysInfo");

    /** The child components should render nothing before any data has been emitted */
    expect(uptimeElement.textContent).toEqual("");
    expect(localTimeElement.textContent).toEqual("");
    expect(startTimeElement.textContent).toEqual("");
    expect(sysinfoElement.textContent).toEqual("");

    /** Emit a sysinfo time data */
    act(() => mock_sub.emit('event', MOCK_SYSINFO_TIME_DATA));

    /** Wait for the child component to re-render */
    await waitFor(() => expect(uptimeElement).not.toEqual(""));

    /** Verify the child component has been updated correctly */
    expect(uptimeElement.textContent).toEqual(MOCK_SYSINFO_TIME_DATA.uptime);
    expect(localTimeElement.textContent).toEqual(MOCK_SYSINFO_TIME_DATA.localtime);
    expect(startTimeElement.textContent).toEqual(MOCK_SYSINFO_TIME_DATA.starttime);
    expect(sysinfoElement.textContent).toEqual("");

    /** Emit a sysinfo data (not time data) */
    act(() => mock_sub.emit('event', MOCK_SYSINFO_DATA));

    /** Wait for the child component to re-render */
    await waitFor(() => expect(sysinfoElement).not.toEqual(""));

    /** Verify the child component has been updated correctly */
    expect(uptimeElement.textContent).toEqual(MOCK_SYSINFO_TIME_DATA.uptime);
    expect(localTimeElement.textContent).toEqual(MOCK_SYSINFO_TIME_DATA.localtime);
    expect(startTimeElement.textContent).toEqual(MOCK_SYSINFO_TIME_DATA.starttime);
    expect(sysinfoElement.textContent).toEqual(MOCK_SYSINFO_DATA.sysinfo);

    cleanup();
  });

  /** Verify context hooks throw errors when called outside of their provider */
  test('Sysinfo context hooks should throw an error if called outside of their provider', () => {
    expect(() => useTimeStreamContext()).toThrow();
    expect(() => useDataStreamContext()).toThrow();
  });

});