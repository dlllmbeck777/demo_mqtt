import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import AppRouter from "../routers/appRouter";
import myTheme from "../themes/composeStyle";
import Loading from "../components/loading/loading";

import { LicenseInfo } from "@mui/x-data-grid-pro";
LicenseInfo.setLicenseKey(
  "2d77f27932a9f5bf1fee30c90b822b82Tz04MTI0MCxFPTE3MzUzNzc3OTEwMDAsUz1wcm8sTE09c3Vic2NyaXB0aW9uLEtWPTI="
);

const App = () => {
  return (
    <ThemeProvider theme={myTheme()}>
      <Loading Element={<AppRouter />} />
    </ThemeProvider>
  );
};

export default React.memo(App);
