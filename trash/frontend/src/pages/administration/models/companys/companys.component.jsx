import { makeStyles } from "@mui/styles";
import styles from "./companysStyles";

import CompanyList from "./companyList/companyList.component";
import CompanyEdit from "./companyEdit/companyEdit.component";
import CompanySettings from "./companySettings/companySettings.component";
import { Grid } from "@mui/material";
import React from "react";
const useStyles = makeStyles(styles);

export default function Companys() {
  const classes = useStyles();

  return (
    <React.Fragment>
      <CompanyList />
      {/* <CompanySettings /> */}
    </React.Fragment>
  );
}
