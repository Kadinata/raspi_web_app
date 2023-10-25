import React from 'react';
import {
  Grid,
  Typography,
} from '@mui/material';
import { DisplayCard } from '../../../components/Card';
import { Table, TableBody, TableRow, TableCell } from '../../../components/Table';
import { usePageContentData } from '../../../components/PageContentController';

const RowItem = ({ label, value, classes }) => {
  return (
    <TableRow>
      <TableCell>
        <Typography align="left">{label}</Typography>
      </TableCell>
      <TableCell>
        <Typography align="left">{value}</Typography>
      </TableCell>
    </TableRow>
  );
}

const CardTitle = (
  <Typography component="h5" variant="h5" align="left">
    Device Info
  </Typography>
);

const DeviceInfo = (props) => {

  const { cpu_info = {}, os_info = {} } = usePageContentData();
  const { hostname, host_ip, type, release, processor, distribution } = { ...cpu_info, ...os_info };

  return (
    <DisplayCard title={CardTitle}>
      <Grid container>
        <Table>
          <TableBody>
            <RowItem label="Hostname" value={`${hostname} (${host_ip[0]})`} />
            <RowItem label="Kernel" value={`${type} ${release}`} />
            <RowItem label="Processor" value={processor} />
            <RowItem label="Distribution" value={distribution} />
          </TableBody>
        </Table>
      </Grid>
    </DisplayCard>
  );
};

export default DeviceInfo;