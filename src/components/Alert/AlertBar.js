//===========================================================================
//  
//===========================================================================
import React from 'react';
import {
  Collapse,
  Alert,
  AlertTitle,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseButton from './CloseButton';

const makeStyles = (theme) => {
  return ({
    alertBar: {
      color: 'inherit',
    },
  });
};

const AlertBar = ({ title, children, show, ...props }) => {

  const styles = makeStyles(useTheme());

  const [open, setOpen] = React.useState(!!show);

  React.useEffect(() => {
    setOpen(!!show);
  }, [show]);

  return (
    <Collapse in={open}>
      <Alert
        {...props}
        action={
          <CloseButton onClick={() => setOpen(false)} />
        }
        sx={styles.alertBar}
      >
        {!!title && <AlertTitle>{title}</AlertTitle>}
        {children}
      </Alert>
    </Collapse>
  );

};

export default AlertBar;
//===========================================================================