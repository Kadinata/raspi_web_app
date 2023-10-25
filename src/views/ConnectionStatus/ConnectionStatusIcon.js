//===========================================================================
//  
//===========================================================================
import React from "react";
import { styled } from '@mui/material/styles';
import {
  Badge,
  Icon,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignal } from '@fortawesome/free-solid-svg-icons';
import { useHeartbeatContext } from "../../modules/heartbeat";

const commonStyles = {
  justifyContent: 'center',
  display: 'inline-flex',
  padding: '8px',
};

const IconActive = styled(Icon)(({ theme }) => ({
  ...commonStyles,
  color: 'inherit',
}));

const IconInactive = styled(Icon)(({ theme }) => ({
  ...commonStyles,
  color: theme.palette.text.disabled,
}));

const StatusIcon = ({ ...props }) => {
  const { connectedStatus } = useHeartbeatContext();
  return connectedStatus ? (<IconActive {...props} />) : (<IconInactive {...props} />);
}

const ConnectionStatusIcon = () => {
  const { connectedStatus } = useHeartbeatContext();
  const dot_color = connectedStatus ? "success" : "error";

  console.log({ connectedStatus });

  return (
    <StatusIcon>
      <Badge color={dot_color} variant="dot" anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}>
        <FontAwesomeIcon icon={faSignal} />
      </Badge>
    </StatusIcon>
  );
};

export default ConnectionStatusIcon;
//===========================================================================