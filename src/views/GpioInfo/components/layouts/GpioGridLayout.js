//===========================================================================
//  
//===========================================================================
import React from 'react';
import { DisplayCard } from '../../../../components/Card';
import { useStyles } from '../../../common/styles';
import { useTheme } from '@mui/material/styles';
import {
  Grid,
  Typography,
} from '@mui/material';
import GpioControl from '../GpioControl';
import GpioStatus from '../GpioStatus';

const useLocalStyles = () => {
  const theme = useTheme();
  return ({
    cardLayout: {
      [theme.breakpoints.down('md')]: {
        display: 'none',
      }
    },
  });
};

const CardTitle = ({ text, ...props }) => (
  <Typography component="h5" variant="h5" align="left" {...props}>
    {text}
  </Typography>
);

const controlTitle = (<CardTitle text={"GPIO Control"} />);
const statusTitle = (<CardTitle text={"GPIO Status"} />);

const GpioGridLayout = ({ pinLayout, ...props }) => {
  const styles = useStyles();
  const localStyles = useLocalStyles();
  return (
    <React.Fragment>
      <Grid container item lg={6} sm={12} xs={12} sx={{ ...styles.widgetContainer, ...localStyles.cardLayout }}>
        <DisplayCard title={controlTitle}>
          <GpioControl pinLayout={pinLayout} />
        </DisplayCard>
      </Grid>
      <Grid container item lg={6} sm={12} xs={12} sx={{ ...styles.widgetContainer, ...localStyles.cardLayout }}>
        <DisplayCard title={statusTitle}>
          <GpioStatus pinLayout={pinLayout} />
        </DisplayCard>
      </Grid>
    </React.Fragment>
  )
};

export default GpioGridLayout;
//===========================================================================