import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faServer, faCircle } from '@fortawesome/free-solid-svg-icons';

import { StatsCard } from '../../../common/components/Card';

const statusIcon = (icon) => (
  <span className="fa-layers">
    <FontAwesomeIcon icon={icon} size="sm" />
  </span>
);

const cardIcon = (<FontAwesomeIcon className="fa-2x" icon={faServer} />);

const MqttStatus = ({ brokerStatus, ...props }) => {

  const status_text = (brokerStatus) ? "Online" : "Offline";

  const status = (
    <React.Fragment>
      {statusIcon(faCircle)}
      {status_text}
    </React.Fragment>
  );

  return (
    <StatsCard
      label={"MQTT Broker"}
      value={status}
      background={'#0abde3'}
      icon={cardIcon}
    />
  );
};

export default MqttStatus;