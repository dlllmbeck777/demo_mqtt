import React from "react";
import Box from "@mui/material/Box";
import TabItems from "../../layout/main/overview/tabItems";

const TabPanel = (props) => {
  const { children, value, widgetname, index, ...other } = props;
  return (
    <Box
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`action-tabpanel-${index}`}
      aria-labelledby={`action-tab-${index}`}
      className="overview-container__tab-box__tab-body__tab-panel"
      {...other}
    >
      {value === index && (
        <>
          <TabItems widgetname={widgetname}></TabItems>
        </>
      )}
    </Box>
  );
};

export default React.memo(TabPanel);
