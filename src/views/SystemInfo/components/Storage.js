//===========================================================================
//  
//===========================================================================
import React from 'react';
import {
  Grid,
  Typography,
} from '@mui/material';
import { DisplayCard } from '../../../components/Card';
import PercentDisplay from './PercentDisplay';
import { formatBytes } from './formatBytes';
import { useDataStreamContext } from '../../../modules/sysinfo/SysInfoStreamProvider';

const CardTitle = (
  <Typography component="h5" variant="h5" align="left">
    Storage
  </Typography>
);

const StorageDisplay = ({ partition }) => {

  const { mount, type, percent } = partition;
  const total = formatBytes(partition.total * 1000000);
  const used = formatBytes(partition.used * 1000000);
  const free = formatBytes(partition.avail * 1000000);
  const title = `${mount} (${type})`;

  const rowValues = [
    { label: "Available", value: free.value.toFixed(2), unit: free.unit },
    { label: "Used", value: used.value.toFixed(2), unit: used.unit },
    { label: "Total", value: total.value.toFixed(2), unit: total.unit },
  ];

  return (
    <PercentDisplay percent={percent} title={title} rows={rowValues} />
  );
}

const Storage = (props) => {
  const data = useDataStreamContext();
  const { hdd_info = [] } = data;

  const storages = hdd_info.map((partition, key) => <StorageDisplay partition={partition} key={key} />);

  return (
    <DisplayCard title={CardTitle} >
      <Grid container>
        {storages}
      </Grid>
    </DisplayCard>
  );
};

Storage.defaultProps = {
  data: [],
};

export default Storage;
//===========================================================================