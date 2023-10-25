import { useTheme } from '@mui/material/styles';

export const useStyles = () => {
  const theme = useTheme();
  return ({
    pinInfoContainer: {
      fontFamily: "monospace",
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      [theme.breakpoints.up('lg')]: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
      }
    },
    label: {
      fontFamily: "inherit",
    },
    headerLabel: {
      fontWeight: "bold",
      fontFamily: "inherit",
    },
    powerPinLabel: {
      flex: 1,
      fontFamily: "inherit",
      color: theme.palette.error.light,
    },
    groundPinLabel: {
      flex: 1,
      fontFamily: "inherit",
      color: theme.palette.grey[500],
    },
    miscPinLabel: {
      flex: 1,
      fontFamily: "inherit",
      color: theme.palette.info.light,
    },
    pinModeEnabled: {
      fontFamily: "inherit",
      color: theme.palette.warning.light,
    },
    pinModeDisabled: {
      fontFamily: "inherit",
      color: theme.palette.info.light,
    },
    pinStateHigh: {
      fontFamily: "inherit",
      color: theme.palette.success.light,
    },
    pinStateLow: {
      fontFamily: "inherit",
      color: theme.palette.grey[500],
    },
  });
};
