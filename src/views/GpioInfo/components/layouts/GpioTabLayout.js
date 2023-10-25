//===========================================================================
//  
//===========================================================================
import React from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Tab,
  Tabs,
  Box,
  Grid,
} from '@mui/material';
import { useStyles } from '../../../common/styles';
import { DisplayCard } from '../../../../components/Card';
import { TabPanel } from '../../../../components/Tabs/TabPanel';
import GpioControl from '../GpioControl';
import GpioStatus from '../GpioStatus';

const useLocalStyles = () => {
  const theme = useTheme();
  return ({
    tabLayout: {
      [theme.breakpoints.up('md')]: {
        display: 'none',
      }
    },
  });
};

const a11yProps = (index) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
};

const GpioTabLayout = ({ pinLayout, ...props }) => {

  const styles = useStyles();
  const localStyles = useLocalStyles();

  const [activeIndex, setActiveIndex] = React.useState(0);
  const handleChange = (event, newActiveIndex) => {
    setActiveIndex(newActiveIndex);
  };

  return (
    <Grid container sx={{ ...styles.widgetContainer, ...localStyles.tabLayout }}>
      <DisplayCard noHeader>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={activeIndex}
            onChange={handleChange}
            aria-label="gpio tabs"
            indicatorColor="secondary"
          >
            <Tab label="GPIO Status" {...a11yProps(0)} />
            <Tab label="GPIO Control" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <TabPanel value={activeIndex} index={0}>
          <GpioStatus pinLayout={pinLayout} />
        </TabPanel>
        <TabPanel value={activeIndex} index={1}>
          <GpioControl pinLayout={pinLayout} />
        </TabPanel>
      </DisplayCard>
    </Grid>
  );
};

export default GpioTabLayout;
//===========================================================================