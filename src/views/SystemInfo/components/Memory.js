//===========================================================================
//  
//===========================================================================
import React from 'react';
import {
  Typography,
} from '@mui/material';
import { DisplayCard } from '../../../components/Card';
import PercentDisplay from './PercentDisplay';
import { formatBytes } from './formatBytes';
import { useDataStreamContext } from '../../../modules/sysinfo/SysInfoStreamProvider';

const cardTitle = (
  <Typography component="h5" variant="h5" align="left">
    Memory
  </Typography>
);

const Memory = (props) => {
  const data = useDataStreamContext();
  const { mem_info = {} } = data;
  const { total_mem = 0, free_mem = 0, percent = 0 } = mem_info;

  const total = formatBytes(total_mem);
  const free = formatBytes(free_mem);
  const used = formatBytes(total_mem - free_mem);

  const rowValues = [
    { label: "Available", value: free.value.toFixed(2), unit: free.unit },
    { label: "In Use", value: used.value.toFixed(2), unit: used.unit },
    { label: "Total", value: total.value.toFixed(2), unit: total.unit },
  ];

  return (
    <DisplayCard title={cardTitle} >
      <PercentDisplay percent={percent * 100} rows={rowValues} />
    </DisplayCard>
  );
};

Memory.defaultProps = {
  data: {},
};

export default Memory;
//===========================================================================