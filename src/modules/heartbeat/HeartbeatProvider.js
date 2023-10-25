//===========================================================================
//  
//===========================================================================
import React from "react";
import { useHeartbeatStatus } from "./Heartbeat";
import { useAuthenticationState } from "../auth/AuthProvider";

export const HeartbeatContext = React.createContext({});

const HeartbeatProvider = ({ enable, initialData = false, ...props }) => {
  const { isAuthenticated, authCheckComplete } = useAuthenticationState();
  enable = enable && authCheckComplete && isAuthenticated;

  const { connectedStatus } = useHeartbeatStatus({ enable, initialData });

  console.log(`Rendering [HeartbeatProvider]; ${connectedStatus}`);

  return (
    <HeartbeatContext.Provider value={{connectedStatus}} {...props} />
  );
};

export const useHeartbeatContext = () => {
  const context = React.useContext(HeartbeatContext);
  if (context === undefined) {
    throw new Error('useHeartbeatContext must be used within an HeartbeatProvider.');
  }
  return context;
};

export default HeartbeatProvider;
//===========================================================================
