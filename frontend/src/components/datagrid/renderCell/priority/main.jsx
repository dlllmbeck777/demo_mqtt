import React from "react";
import {
  ErrorOutline,
  WarningAmberOutlined,
  InfoOutlined,
} from "@mui/icons-material";
const alarmIcon = {
  1: <ErrorOutline fontSize="small" sx={{ color: "red" }} />,
  2: <WarningAmberOutlined fontSize="small" sx={{ color: "yellow" }} />,
  3: <InfoOutlined fontSize="small" sx={{ color: "lightblue" }} />,
};

const main = ({ value }) => {
  return alarmIcon[parseInt(value)];
};

export default main;
