//===========================================================================
//  
//===========================================================================
import React from 'react';
import { StatsCard } from '../../../components/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { useTimeStreamContext } from '../../../modules/sysinfo/SysInfoStreamProvider';

const moddiv = (dividend, divisor) => ((dividend - (dividend % divisor)) / divisor);

const formatUptime = (uptime) => {

  if (uptime === null) {
    return '\u2014';
  }

  const seconds = String(uptime % 60).padStart(2, 0);
  const minutes = String(moddiv(uptime, 60) % 60).padStart(2, 0);
  const hours = String(moddiv(uptime, 3600) % 24).padStart(2, 0);
  const days = moddiv(uptime, 86400);

  if (days > 0) {
    return `${days} d ${hours} h ${minutes} m`;
  } else if (hours > 0) {
    return `${hours} h ${minutes} m ${seconds} s`;
  }

  return `${minutes} m ${seconds} s`;
};

const cardIcon = (<FontAwesomeIcon className="fa-2x" icon={faClock} />);

const Uptime = (props) => {
  const data = useTimeStreamContext();
  const { uptime = null } = data;

  return (
    <StatsCard
      label={"System Uptime"}
      value={formatUptime(uptime)}
      background={"#f8c04e"}
      icon={cardIcon}
    />
  );
};

Uptime.defaultProps = {
  uptime: 0,
};

export default Uptime;
//===========================================================================