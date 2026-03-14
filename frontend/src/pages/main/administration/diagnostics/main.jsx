import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Grid } from "@mui/material";

import {
  Breadcrumb,
  ItemSperatorLineXL,
  ComponentError,
} from "../../../../components";
import DiagnosticEditor from "./diagnosticEditor";

import {
  loadDiagnostic,
  cleanDiagnostic,
} from "../../../../services/actions/diagnostic/diagnostic";
import { selectDrawerItem } from "../../../../services/actions/drawerMenu/drawerMenu";
import "../../../../assets/styles/page/administration/diagnostic/diagnostic.scss";
import "../../../../assets/styles/layouts/template.scss";
const Main = () => {
  document.title = "Ligeia.ai | Diagnostics";
  selectDrawerItem("Diagnostics");
  const dispatch = useDispatch();
  const CULTURE = useSelector((state) => state.lang.cultur);
  const ACTIVE_LAYER = useSelector((state) => state.auth?.user?.active_layer);
  React.useEffect(() => {
    dispatch(loadDiagnostic());
    return () => {
      dispatch(cleanDiagnostic());
    };
  }, [ACTIVE_LAYER, CULTURE, dispatch]);

  return (
    <Grid container className="template-container__body diagnostic-container">
      <Breadcrumb />
      <ItemSperatorLineXL />
      <Grid item xs={12} className="diagnostic-container__body">
        <ComponentError errMsg="Error">
          <DiagnosticEditor />
        </ComponentError>
      </Grid>
    </Grid>
  );
};

export default Main;
