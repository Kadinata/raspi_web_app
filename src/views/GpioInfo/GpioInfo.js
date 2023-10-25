//===========================================================================
//  
//===========================================================================
import React from 'react';
import {
  Grid,
} from '@mui/material';
import { PageContentController } from '../../components/PageContentController';
import { useGpioInfo } from '../../modules/gpio/Gpio';
import GpioControlStateProvider from '../../modules/gpio/GpioControlStateProvider';
import GpioDataStreamProvider from '../../modules/gpio/GpioDataStreamProvider';
import {
  GpioGridLayout,
  GpioTabLayout,
} from './components/layouts';
import PinLayout from './config/PinLayout';

const pageTitle = "GPIO Control & Status";

const GpioInfo = (props) => {
  const { error, completed, gpioData } = useGpioInfo();
  const { gpioState } = gpioData;

  console.log("[Rendering]: GpioInfo", { error, completed, gpioData });

  return (
    <PageContentController loading={!completed} error={error} data={gpioData} title={pageTitle}>
      <GpioControlStateProvider>
        <GpioDataStreamProvider enable initialData={gpioState}>
          <Grid container item spacing={0} alignItems="stretch" justifyContent="space-between">
            <GpioTabLayout pinLayout={PinLayout} {...props} />
            <GpioGridLayout pinLayout={PinLayout} {...props} />
          </Grid>
        </GpioDataStreamProvider>
      </GpioControlStateProvider>
    </PageContentController>
  );
};

export default GpioInfo;
//===========================================================================