import React from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Grid,
} from '@mui/material';

const useStyles = () => {
  const theme = useTheme();
  return ({
    card: {
      display: 'flex',
      height: '100%',
      alignItems: 'stretch',
    },
    content: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing(2),
      '&:last-child': {
        paddingBottom: theme.spacing(2),
      },
    },
    avatar: {
      backgroundColor: 'transparent',
      color: theme.palette.text.primary,
      height: 56,
      width: 56
    },
    icon: {
      height: 40,
      width: 40
    },
    iconContainer: {
      background: theme.palette.primary.main,
      borderTopLeftRadius: 4,
      borderBottomLeftRadius: 4,
    },
    w100: {
      flex: 1,
    },
  });
};


const CardIcon = ({ icon, background, ...props }) => {

  const styles = useStyles();

  if (icon === null) {
    return null;
  }

  background = background || styles.iconContainer.background;

  return (
    <CardContent sx={{ ...styles.content, ...styles.iconContainer, backgroundColor: background }} >
      <Avatar variant="rounded" sx={styles.avatar}>
        {icon}
      </Avatar>
    </CardContent >
  );
};

const StatsCard = ({ label, value, icon, background, ...props }) => {

  const styles = useStyles();

  return (
    <Card sx={styles.card}>
      <CardIcon icon={icon} background={background} />

      <CardContent sx={{ ...styles.content, ...styles.w100 }}>
        <Grid container spacing={2} justifyContent="flex-start" alignItems="center">
          <Grid item sx={styles.w100}>
            <Typography variant="subtitle1" align="left" noWrap>
              {label}
            </Typography>
            <Typography component="h5" variant="h5" align="left" noWrap>
              {value}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

StatsCard.defaultProps = {
  label: '',
  value: '',
  icon: null,
};

export default StatsCard;