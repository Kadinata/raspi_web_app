import './App.css';
import { ThemeProvider } from '@mui/material/styles';
import { Box } from '@mui/material';
import AuthProvider from './modules/auth/AuthProvider';
import { HeartbeatProvider } from './modules/heartbeat';
import Theme from './components/Theme';
import AppRoutes from './routes';

const useStyles = () => ({
  canvas: {
    display: 'flex',
    minHeight: '100vh',
    background: 'linear-gradient(to bottom right, #13547A, #80D0C7)',
    color: '#E9E9E9',
  },
});

function App() {

  const styles = useStyles();

  return (
    <ThemeProvider theme={Theme}>
      <Box component="div" sx={styles.canvas}>
        <AuthProvider>
          <HeartbeatProvider enable>
            <AppRoutes />
          </HeartbeatProvider>
        </AuthProvider>
      </Box>
    </ThemeProvider>
  );
}

export default App;