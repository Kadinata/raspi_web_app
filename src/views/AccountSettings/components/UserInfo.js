//===========================================================================
//  
//===========================================================================
import React from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Grid,
  Typography,
} from '@mui/material';
import { usePageContentData } from '../../../components/PageContentController';
import { SubmitButton } from '../../../components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { DisplayCard } from '../../../components/Card';

const useStyles = () => {
  const theme = useTheme();
  return ({
    profileIcon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing(2),
      width: "200px",
      '&:last-child': {
        paddingBottom: theme.spacing(2),
      },
    },
  });
};

const formatCreationDate = (created) => {
  const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
  const date = new Date(created);
  return date.toLocaleDateString('default', options);
};

const UserInfo = ({ onChangePassword, ...props }) => {

  const styles = useStyles();
  const { user } = usePageContentData();
  const { username, created } = user;
  const creationDate = formatCreationDate(created);

  return (
    <DisplayCard noHeader>
      <Grid container>
        <Grid container item xs={3} alignItems="center" sx={styles.profileIcon}>
          <FontAwesomeIcon className="fa-2x" icon={faUser} />
        </Grid>
        <Grid container item xs={9} direction="column">

          <Grid container item sx={{ py: 1 }}>
            <Typography align="left" sx={{ pr: 1 }}>
              Logged in As:
            </Typography>
            <Typography align="left">{username}</Typography>
          </Grid>

          <Grid container item sx={{ py: 1 }}>
            <Typography align="left" sx={{ pr: 1 }}>
              Created:
            </Typography>
            <Typography align="left">{creationDate}</Typography>
          </Grid>

          <Grid container item sx={{ pt: 1 }}>
            <SubmitButton
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => onChangePassword()}
            >
              <FontAwesomeIcon className="fa-fw" icon={faLock} />
              <Typography align='left' sx={{ px: 1 }}>
                Change Password
              </Typography>
            </SubmitButton>
          </Grid>
        </Grid>
      </Grid>
    </DisplayCard>
  );
};

export default UserInfo;
//===========================================================================