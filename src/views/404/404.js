//===========================================================================
//  
//===========================================================================
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Typography,
} from "@mui/material";
import { useTheme } from '@mui/material/styles';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { DisplayCard } from "../../components/Card";

import createTestID from "../../modules/test_id/TestID";

const test_id = createTestID('Error404');

const makeStyles = (theme) => ({
  container: {
    marginLeft: 'auto',
    marginRight: 'auto',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    maxWidth: 600,
  },
  typography: {
    paddingLeft: 3,
    paddingRight: 3,
  },
  label: {
    textAlign: 'center',
    fontWeight: 'bold',
    letterSpacing: 6,
    fontFamily: 'Monaco',
    fontSize: '10vw',
  },
  homeButton: {
    marginTop: 3,
    marginLeft: 2,
    marginRight: 2,
  },
});

const CardTitle = ({ title }) => {
  const styles = makeStyles(useTheme());
  return (
    <Typography component="h5" variant="h5" align="center" sx={styles.typography}>
      {title}
    </Typography>
  );
};

const HouseIcon = () => (<FontAwesomeIcon icon={faHouse} />);

const HomeButton = ({ onClick, ...props }) => (
  <Button
    fullWidth
    variant="contained"
    color="primary"
    startIcon={<HouseIcon />}
    onClick={() => onClick()}
    data-testid={test_id('HomeButton')}
  >
    Go Home
  </Button>
);

const Error404 = (props) => {
  const styles = makeStyles(useTheme());

  const navigate = useNavigate();
  const handleClick = () => navigate('/');

  return (
    <Box component="div" sx={styles.container}>
      <Container maxWidth="sm">
        <DisplayCard title={<CardTitle title="Page Not Found 😕" />} >

          <Typography variant="h1">
            <Box sx={styles.label} data-testid={test_id('Label')}>
              404
            </Box>
          </Typography>

          <Box sx={styles.homeButton}>
            <HomeButton onClick={() => handleClick()} />
          </Box>
        </DisplayCard>
      </Container>
    </Box>
  );
};

export default Error404;
//===========================================================================
