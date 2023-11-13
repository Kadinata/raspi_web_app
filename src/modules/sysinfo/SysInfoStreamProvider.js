/**
 * SysInfo Provider: System information stream context provider module.
 */
import React from 'react';
import { useSysInfoStream } from './SysInfo';

/** React contexts to provide live system information data */
export const SysInfoTimeStreamContext = React.createContext({});
export const SysInfoDataStreamContext = React.createContext({});

/**
 * eact Context Provider Element that provides live system information data.
 * @param {boolean} enable - A flag to enable or disable the subscription to the stream.
 * @param {boolean} initialData - Optional initial data.
 * @param {any} props - React props to pass on to the returned context provider element.
 * @returns {Element} - React Context Provider element providing live system information.
 */
const SysInfoStreamProvider = ({ enable, initialData = {}, ...props }) => {

  const { timeData, data } = useSysInfoStream({ enable, initialData });

  return (
    <SysInfoTimeStreamContext.Provider value={timeData}>
      <SysInfoDataStreamContext.Provider value={data} {...props} />
    </SysInfoTimeStreamContext.Provider>
  );
};

/** Custom hooks returning live system information data */
export const useTimeStreamContext = () => React.useContext(SysInfoTimeStreamContext);
export const useDataStreamContext = () => React.useContext(SysInfoDataStreamContext);

export default SysInfoStreamProvider;
//===========================================================================