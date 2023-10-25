//===========================================================================
//  
//===========================================================================
import React from 'react';
import {
  Grid,
  Typography,
} from '@mui/material';
import { DisplayCard } from '../../../components/Card';
import { Table, TableRow, TableBody, TableCell } from '../../../components/Table';
import { formatBytes } from './formatBytes';
import { useDataStreamContext } from '../../../modules/sysinfo/SysInfoStreamProvider';

const cardTitle = (
  <Typography component="h5" variant="h5" align="left">
    Network Usage
  </Typography>
);

const RowItem = ({ label, netstats }) => {

  const { bytes, error, dropped } = netstats;
  const volume = formatBytes(bytes);

  return (
    <TableRow>
      <TableCell>
        <Typography>{label}</Typography>
      </TableCell>
      <TableCell align="right">
        <Typography display="inline">{volume.value.toFixed(2)}</Typography>
        <Typography display="inline">{` ${volume.unit}`}</Typography>
      </TableCell>
      <TableCell>
        <Typography display="inline">{"Err/Drop"}</Typography>
      </TableCell>
      <TableCell align="right">
        <Typography>
          {`${error}/${dropped}`}
        </Typography>
      </TableCell>
    </TableRow>
  );
};

const NetworkDisplay = ({ net_if, classes }) => {

  const { rx, tx } = net_if;

  return (
    <React.Fragment>
      <TableRow>
        <TableCell colSpan="4">
          <Typography>{`${net_if.interface} (${net_if.ipaddr})`}</Typography>
        </TableCell>
      </TableRow>
      <RowItem label={"Sent"} netstats={tx} />
      <RowItem label={"Received"} netstats={rx} />
    </React.Fragment>
  );
};

const NetworkUsage = (props) => {
  const data = useDataStreamContext();
  const { netstats = [] } = data;

  const network_interfaces = netstats.map((net_if, key) => (<NetworkDisplay net_if={net_if} key={key} />));

  return (
    <DisplayCard title={cardTitle}>
      <Grid container>
        <Table size="small">
          <TableBody>
            {network_interfaces}
          </TableBody>
        </Table>
      </Grid>
    </DisplayCard>
  );
};

export default NetworkUsage;
//===========================================================================