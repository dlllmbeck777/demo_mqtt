import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { Grid, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { changeValeus } from "../../../services/actions/overview/overviewDialog";
import StepOne from "./stepOne";
import LineAssets from "../../highchart/popUpLayout/lineAssets";
import StepThree from "./stepThree";
const MatrixUpdatePopUp = ({ handleClose }) => {
  const dispatch = useDispatch();
  const type = useSelector((state) => state.overviewDialog.values);
  const [selectedWidget, setSelectedWidget] = React.useState("Properties");
  const handleChangeFunc = (key, val) => {
    dispatch(changeValeus(key, val));
  };
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
        {["Properties", "Assets", "Settings"].map((e) => (
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
        {selectedWidget === "Properties" && <StepOne isNew={true} />}
        {selectedWidget === "Assets" && (
          <LineAssets
            handleChangeFunc={(value) => {
              handleChangeFunc("Assets", value);
            }}
          />
        )}
        {selectedWidget === "Settings" && <StepThree />}
      </Box>
    </>
  );
};

export default React.memo(MatrixUpdatePopUp);
