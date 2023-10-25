//===========================================================================
//
//===========================================================================
import React from 'react';
import { StatsCard } from '../../../components/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThermometerHalf } from '@fortawesome/free-solid-svg-icons';
import { useDataStreamContext } from '../../../modules/sysinfo/SysInfoStreamProvider';

const cardIcon = (<FontAwesomeIcon className="fa-2x" icon={faThermometerHalf} />);

const CpuTemp = (props) => {
  const data = useDataStreamContext();
  const { cpu_info = {} } = data;
  const { cpu_temp = null } = cpu_info || {};

  const temperature = (cpu_temp === null) ? '\u2014' : cpu_temp.toFixed(2);

  return (
    <StatsCard
      label={"Core Temp"}
      value={`${temperature} \u2103`}
      background={"#c0392b"}
      icon={cardIcon}
    />
  );
};

CpuTemp.defaultProps = {
  temperature: null,
};

export default CpuTemp;
//===========================================================================