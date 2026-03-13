import React from "react";

import PropTypes from "prop-types";
import { Box, Grid, Typography, Tab, Tabs } from "@mui/material";

import DateBreak from "./dateBreak";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}
const Properties = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Box
      sx={{
        backgroundColor: "myCanvasColor",
        display: "flex",
        ".css-19kzrtu": {
          p: 0,
        },
      }}
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs"
        sx={{
          justifyContent: "flex-start",
          height: "200px",
          width: "45px",
          position: "relatice",
        }}
      >
        <Tab
          label="Properties"
          {...a11yProps(0)}
          sx={{
            p: 0,
            top: "21px",
            left: "-23px",
            typography: "subtitle2",
            textTransform: "capitalize",
            WebkitTransform: "rotate(270deg)",
            MozTransform: "rotate(270deg)",
            OTransform: "rotate(270deg)",
            msTransform: "rotate(270deg)",
          }}
        />
        <Tab
          label="Links"
          {...a11yProps(1)}
          sx={{
            top: "65px",
            p: 0,
            left: "-23px",
            typography: "subtitle2",
            textTransform: "capitalize",
            WebkitTransform: "rotate(270deg)",
            MozTransform: "rotate(270deg)",
            OTransform: "rotate(270deg)",
            msTransform: "rotate(270deg)",
          }}
        />
      </Tabs>
      <TabPanel value={value} index={0}>
        <Grid container sx={{ pt: 1 }}>
          <Grid item xs={12}>
            Props
          </Grid>
        </Grid>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Box sx={{ backgroundColor: "red" }}>asdasd</Box>
      </TabPanel>
    </Box>
  );
};

export default Properties;
