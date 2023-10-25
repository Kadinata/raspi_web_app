//===========================================================================
//  
//===========================================================================
import React from 'react';
import { Grid } from '@mui/material';
import { useStyles } from '../common/styles';
import {
  useSysInfo,
  SysInfoStreamProvider,
} from '../../modules/sysinfo';
import { PageContentController } from '../../components/PageContentController';
import {
  CpuTemp,
  Uptime,
  StartTime,
  SystemTime,
  DeviceInfo,
  CpuStatus,
  Storage,
  Memory,
  NetworkUsage,
} from './components';

const SystemInfoContent = (props) => {
  const styles = useStyles();
  return (
    <Grid container item spacing={0} alignItems="stretch" justifyContent="space-between">
      <Grid container item spacing={0} alignItems="stretch" justifyContent="space-between">
        <Grid item xl={3} lg={6} md={6} sm={6} xs={12} sx={styles.widgetContainer}>
          <CpuTemp />
        </Grid>
        <Grid item xl={3} lg={6} md={6} sm={6} xs={12} sx={styles.widgetContainer}>
          <Uptime />
        </Grid>
        <Grid item xl={3} lg={6} md={6} sm={6} xs={12} sx={styles.widgetContainer}>
          <StartTime />
        </Grid>
        <Grid item xl={3} lg={6} md={6} sm={6} xs={12} sx={styles.widgetContainer}>
          <SystemTime />
        </Grid>
      </Grid>

      <Grid container item spacing={0} alignItems="stretch" justifyContent="space-between" lg={4} sm={12} xs={12}>
        <Grid item lg={12} md={6} xs={12} sx={styles.widgetContainer}>
          <DeviceInfo />
        </Grid>
        <Grid item lg={12} md={6} xs={12} sx={styles.widgetContainer}>
          <CpuStatus />
        </Grid>
      </Grid>

      <Grid item lg md={6} sm={12} xs={12} sx={styles.widgetContainer}>
        <Storage />
      </Grid>

      <Grid container item spacing={0} alignItems="stretch" justifyContent="space-between" lg md={6} sm={12} xs={12}>
        <Grid item lg={12} md={12} xs={12} sx={styles.widgetContainer}>
          <Memory />
        </Grid>
        <Grid item lg={12} md={12} xs={12} sx={styles.widgetContainer}>
          <NetworkUsage />
        </Grid>
      </Grid>
    </Grid>
  );
};

const pageTitle = "System Information";

const SystemInfo = (props) => {

  const { sysInfoData, error, completed } = useSysInfo();

  return (
    <PageContentController loading={!completed} error={error} data={sysInfoData} title={pageTitle}>
      <SysInfoStreamProvider enable initialData={sysInfoData}>
        <SystemInfoContent />
      </SysInfoStreamProvider>
    </PageContentController>
  );
};

export default SystemInfo;
//===========================================================================