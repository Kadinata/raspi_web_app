/**
 * Heartbeat Provider: Server live connection status context provider module.
 */
import React from "react";
import { useHeartbeatStatus } from "./Heartbeat";
import { useAuthStateContext } from "../auth/AuthProvider";

/** React context object to provide live connection status */
export const HeartbeatContext = React.createContext({});

/**
 * React Context Provider Element that provides live connection status to the server.
 * @param {boolean} enable - A flag to enable or disable the status hook.
 * @param {boolean} initialData - Optional initial data to set the connection status to.
 * @param {any} props - React props to pass on to the returned context provider element.
 * @returns {Element} - React Context Provider element providing live connection status.
 */
const HeartbeatProvider = ({ enable, initialData = false, ...props }) => {
  const { isAuthenticated, authCheckComplete } = useAuthStateContext();
  enable = enable && authCheckComplete && isAuthenticated;

  const { connectedStatus } = useHeartbeatStatus({ enable, initialData });

  return (<HeartbeatContext.Provider value={{connectedStatus}} {...props} />);
};

/** Custom hook returning the live connection status provided by HeartbeatContext */
export const useHeartbeatContext = () => React.useContext(HeartbeatContext);

export default HeartbeatProvider;
//===========================================================================
