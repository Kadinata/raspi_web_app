//===========================================================================
//  
//===========================================================================
import { useTheme } from "@mui/material/styles";

export const useStyles = () => {

  const theme = useTheme();

  return ({
    viewRoot: {
      display: 'flex',
      flex: 1,
      padding: 3,
      paddingTop: 2,
      [theme.breakpoints.down('md')]: {
        padding: 1,
      },
    },
    widgetContainer: {
      padding: theme.spacing(1),
      [theme.breakpoints.up('md')]: {
        padding: theme.spacing(2),
      }
    },
  });
};
//===========================================================================