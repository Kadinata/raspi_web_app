import React from "react";
import {
  Typography,
  CardMedia,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { DisplayCard } from "../Card";
import Logo from '../../assets/Logo.png';

const makeStyles = (theme) => ({
  cardMedia: {
    height: 240,
    objectFit: 'scale-down',
    paddingTop: 3,
    paddingBottom: 3,
  },
  typography: {
    paddingLeft: 3,
    paddingRight: 3,
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

const LogoCard = ({ children, title, ...props }) => {

  const styles = makeStyles(useTheme());

  return (
    <DisplayCard title={<CardTitle title={title} />} >
      <CardMedia
        component="img"
        image={Logo}
        title="Raspberry Pi"
        sx={styles.cardMedia}
      />
      {children}
    </DisplayCard>
  );
};

export default LogoCard;