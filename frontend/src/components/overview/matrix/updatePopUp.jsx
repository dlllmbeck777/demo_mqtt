import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { Grid, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { changeValeus } from "../../../services/actions/overview/overviewDialog";
import Inputs from "../../highchart/popup/inputs";
import StepOne from "./stepOne";
import LineAssets from "../../highchart/popUpLayout/lineAssets";
import Settings from "./settings";
const MatrixUpdatePopUp = ({ handleClose }) => {
  const dispatch = useDispatch();
  const [selectedWidget, setSelectedWidget] = React.useState("Properties");
  const type = useSelector((state) => state.overviewDialog.values);
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
        {["Properties", "Assets", "Inputs", "Settings"].map((e) => (
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
        {selectedWidget === "Inputs" && (
          <Inputs
            handleChangeFunc={(value) => {
              handleChangeFunc("Inputs", value);
            }}
            isNeedCalcTags={true}
          />
        )}
        {selectedWidget === "Settings" && (
          <Box className="overview-update-pop-up__box__body__asset-box">
            <Settings />
          </Box>
        )}
      </Box>
    </>
  );
};

export default React.memo(MatrixUpdatePopUp);
