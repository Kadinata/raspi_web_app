//===========================================================================
//  
//===========================================================================
import React from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
} from '@mui/material';

const useStyles = () => {
  const theme = useTheme();

  return ({
    cardBase: {
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
    cardHeader: {
      background: theme.palette.primary.main,
      borderTopLeftRadius: 4,
      borderTopRightRadius: 4,
      [theme.breakpoints.down('md')]: {
        padding: theme.spacing(1.5),
      },
    },
    cardContent: {
      flex: '1 0 auto',
      padding: theme.spacing(1),
      '&:last-child': {
        paddingBottom: theme.spacing(2),
      },
      [theme.breakpoints.up('lg')]: {
        padding: theme.spacing(2),
      },
    },
  });

};

const DisplayCard = ({ title, children, noHeader, ...props }) => {
  const styles = useStyles();
  return (
    <Card sx={styles.cardBase}>
      {!noHeader && <CardHeader title={title} sx={styles.cardHeader} />}
      {!noHeader && <Divider />}
      <CardContent sx={styles.cardContent}>
        {children}
      </CardContent>
    </Card>
  );
};

DisplayCard.defaultProps = {
  noHeader: false,
};

export default DisplayCard;
//===========================================================================