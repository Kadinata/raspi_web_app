//===========================================================================
//  
//===========================================================================
import React from 'react';
import { StatsCard } from '../../../components/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faServer } from '@fortawesome/free-solid-svg-icons';
import { useTimeStreamContext } from '../../../modules/sysinfo/SysInfoStreamProvider';

const moddiv = (dividend, divisor) => ((dividend - (dividend % divisor)) / divisor);

const formatStartTime = (startTime) => {

  if (startTime === null) {
    return '\u2014';
  }

  const delta = Math.floor((Date.now() - startTime) / 1000);

  const seconds = String(delta % 60).padStart(2, 0);
  const minutes = String(moddiv(delta, 60) % 60).padStart(2, 0);
  const hours = String(moddiv(delta, 3600) % 24).padStart(2, 0);
  const days = moddiv(delta, 86400);

  if (days > 0) {
    return `${days} d ${hours} h ${minutes} m`;
  } else if (hours > 0) {
    return `${hours} h ${minutes} m ${seconds} s`;
  }

  return `${minutes} m ${seconds} s`;
};

const cardIcon = (<FontAwesomeIcon className="fa-2x" icon={faServer} />);

const StartTime = (props) => {
  const data = useTimeStreamContext();
  const { startTime = null } = data;

  return (
    <StatsCard
      label={"Server Uptime"}
      value={formatStartTime(startTime)}
      background={"#0abde3"}
      icon={cardIcon}
    />
  );
};

StartTime.defaultProps = {
  startTime: 0,
};

export default StartTime;
//===========================================================================