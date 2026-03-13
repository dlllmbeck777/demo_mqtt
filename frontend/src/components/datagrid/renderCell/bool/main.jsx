import React from "react";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
const main = ({ value }) => {
  return (
    <div
      style={{
        margin: "auto",
      }}
    >
      {value === "True" || value === true ? <CheckIcon /> : <ClearIcon />}
    </div>
  );
};
export default main;
