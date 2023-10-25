//===========================================================================
//  
//===========================================================================
import { 
  createTheme, 
  responsiveFontSizes,
} from '@mui/material/styles';

const Theme = createTheme({
  components: {
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: 'unset' } },
    },
  },
  palette: {
    mode: 'dark',
    primary: {
      main: 'rgba(33, 33, 64, 0.7)',
    },
    background: {
      paper: 'rgba(0, 0, 26, 0.35)',
      default: 'rgb(41, 41, 61, 1.0)',
    },
    divider: 'rgba(0, 0, 0, 0.12)',
    text: {
      primary: '#E9E9E9',
    },
  },
  mixins: {
    sidebar: {
      width: 240,
    },
  },
});

export default responsiveFontSizes(Theme);
//===========================================================================