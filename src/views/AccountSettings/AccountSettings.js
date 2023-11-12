//===========================================================================
//  
//===========================================================================
import React from 'react';
import { Grid } from '@mui/material';
import { PageContentController } from '../../components/PageContentController';
import AuthService from '../../modules/auth/AuthService';
import UserInfo from './components/UserInfo';
import ChangePasswordDialog from './components/ChangePasswordDialog';

const pageTitle = "Account Settings";

const AccountSettings = (props) => {

  const [showChangePassword, setShowChangePassword] = React.useState(false);
  const { user, error, completed } = AuthService.useUserData();

  return (
    <PageContentController loading={!completed} error={error} data={user} title={pageTitle}>
      <Grid container>
        <UserInfo onChangePassword={() => setShowChangePassword(true)} />
      </Grid>
      <ChangePasswordDialog
        open={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      />
    </PageContentController>
  );
};


export default AccountSettings;
//===========================================================================