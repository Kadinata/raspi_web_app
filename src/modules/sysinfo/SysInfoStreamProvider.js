//===========================================================================
//  
//===========================================================================
import React from 'react';
import { useSysInfoStream } from './SysInfo';

export const SysInfoTimeStreamContext = React.createContext({});
export const SysInfoDataStreamContext = React.createContext({});

const SysInfoStreamProvider = ({ enable, initialData = {}, ...props }) => {

  const { timeData, data } = useSysInfoStream({ enable, initialData });

  return (
    <SysInfoTimeStreamContext.Provider value={timeData}>
      <SysInfoDataStreamContext.Provider value={data} {...props} />
    </SysInfoTimeStreamContext.Provider>
  );
};

export const useTimeStreamContext = () => {
  return React.useContext(SysInfoTimeStreamContext);
}

export const useDataStreamContext = () => {
  return React.useContext(SysInfoDataStreamContext);
}

export default SysInfoStreamProvider;
//===========================================================================