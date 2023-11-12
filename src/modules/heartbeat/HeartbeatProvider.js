//===========================================================================
//  
//===========================================================================
import React from "react";
import { useHeartbeatStatus } from "./Heartbeat";
import { useAuthStateContext } from "../auth/AuthProvider";

export const HeartbeatContext = React.createContext({});

const HeartbeatProvider = ({ enable, initialData = false, ...props }) => {
  const { isAuthenticated, authCheckComplete } = useAuthStateContext();
  enable = enable && authCheckComplete && isAuthenticated;

  const { connectedStatus } = useHeartbeatStatus({ enable, initialData });

  console.log(`Rendering [HeartbeatProvider]; ${connectedStatus}`);

  return (
    <HeartbeatContext.Provider value={{connectedStatus}} {...props} />
  );
};

export const useHeartbeatContext = () => React.useContext(HeartbeatContext);

export default HeartbeatProvider;
//===========================================================================
