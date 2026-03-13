import React from "react";
import { Box } from "@mui/material";

import { ComponentError } from "../../../components";

import { selectDrawerItem } from "../../../services/actions/drawerMenu/drawerMenu";
import "../../../assets/styles/page/extra/feedback.scss";
import Body from "./body";

const Main = () => {
  document.title = "Ligeia.ai | Feedback";
  selectDrawerItem("Feedback");

  return (
    <Box className="template-container__body feedback-page">
      <ComponentError errMsg="Error">
        <Body />
      </ComponentError>
    </Box>
  );
};

export default Main;
