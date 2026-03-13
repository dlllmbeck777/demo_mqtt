import React from "react";
import {makeStyles} from "@mui/styles";
import styles from "./companySettingsStyle";
import {
  Card,
  CardContent,
  CardHeader,
  Grid,

  Typography,
} from "@mui/material";


const useStyles = makeStyles(styles);

function CompanySettings() {
  const classes = useStyles();

  return (
    <Grid container className={classes.container}>
      <Card className={classes.card}>
        <CardHeader
          className={classes.cardHeader}
          title={<Typography variant="subtitle1">Details</Typography>}
        />
        <CardContent className={classes.cardContent}>
          <Typography>Card Content</Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}

export default CompanySettings;

