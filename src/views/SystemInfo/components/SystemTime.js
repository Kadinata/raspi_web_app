//===========================================================================
//  
//===========================================================================
import React from 'react';
import { StatsCard } from '../../../components/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import { useTimeStreamContext } from '../../../modules/sysinfo/SysInfoStreamProvider';

const cardIcon = (<FontAwesomeIcon className="fa-2x" icon={faCalendar} />);

const SystemTime = ({ time, ...props }) => {
  const data = useTimeStreamContext();
  const { localtime = null } = data;

  const date = (localtime !== null) ? new Date(localtime) : null;
  const date_options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };
  const time_options = { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
  const date_line = (date !== null) ? date.toLocaleDateString('default', date_options) : 'Local Time';
  const time_line = (date !== null) ? date.toLocaleTimeString('default', time_options) : '\u2014';

  return (
    <StatsCard
      label={date_line}
      value={time_line}
      background={"#e67e22"}
      icon={cardIcon}
    />
  );
};

SystemTime.defaultProps = {
  time: 0,
};

export default SystemTime;
//===========================================================================