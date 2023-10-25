//===========================================================================
//  
//===========================================================================
import React from "react";
import {
  Chip,
  Avatar,
  Icon,
} from '@mui/material';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { useHeartbeatContext } from "../../modules/heartbeat";

const ChipIcon = () => (
  <FontAwesomeIcon icon={faCircle} className="fa-lg" />
);

const ConnectionStatusLabel = () => {
  const { connectedStatus } = useHeartbeatContext();

  return (
    <Chip label="Online" color="success" variant="outlined" icon={<ChipIcon/>} />
  );
};

export default ConnectionStatusLabel;
//===========================================================================