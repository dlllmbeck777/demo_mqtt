import React from "react";
import { useSelector } from "react-redux";

import { Grid, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import StepOne from "./stepOne";
import StepTwo from "./stepTwo";
import StepThree from "./stepThree";
const UpdatePopUp = ({ handleClose }) => {
  const type = useSelector((state) => state.overviewDialog.values);
  const [selectedWidget, setSelectedWidget] = React.useState("Properties");

  const handeleOnClick = (a) => () => {
    setSelectedWidget(a);
  };
  return (
    <>
      <Grid
        container
        id="draggable-dialog-title"
        className="overview-update-pop-up__box__header"
      >
        <Grid
          item
          className="overview-update-pop-up__box__header__id"
          onClick={handeleOnClick("Properties")}
        >
          {type?.Type}
        </Grid>
        {["Properties", "Measurement", "Stops"].map((e) => (
          <Grid
            item
            style={{
              cursor: "pointer",
              color: selectedWidget === e && "#00ff00",
            }}
            onClick={handeleOnClick(e)}
          >
            {type?.[e]}
          </Grid>
        ))}

        <Grid item>
          <IconButton onClick={handleClose}>
            <CloseIcon fontSize="small" className="dialog-header-text" />
          </IconButton>
        </Grid>
      </Grid>
      <Box className="overview-update-pop-up__box__body">
        {selectedWidget === "Properties" && (
          <Box>
            <StepOne isNew={true} />
          </Box>
        )}
        {selectedWidget === "Measurement" && (
          <Box className="overview-update-pop-up__box__body__asset-box">
            <StepTwo />
          </Box>
        )}
        {selectedWidget === "Stops" && (
          <Box className="overview-update-pop-up__box__body__asset-box">
            <StepThree />
          </Box>
        )}
      </Box>
    </>
  );
};

export default React.memo(UpdatePopUp);
