import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { Grid, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { MyNumberTextField, ColorTextfield } from "../..";
import {
  changeValeus,
  cleanStops,
} from "../../../services/actions/overview/overviewDialog";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChoseMeasure from "../../highchart/popUpLayout/choseMeasure";
import PopUpItem from "../../highchart/popUpLayout/popUpItem";
import Measurement from "../../highchart/popUpLayout/measurement";
import MyList from "../utils/popUpUtils/list";
import Stop from "../../highchart/popUpLayout/stop";
const Stops = () => {
  const dispatch = useDispatch();
  const type = useSelector((state) => state.overviewDialog.values);
  const highchartProps = useSelector(
    (state) => state.overviewDialog.highchartProps
  );
  const boundaries = useSelector(
    (state) => state.overviewDialog.highchartProps?.["Show Boundaries"]
  );
  var loop = [];
  for (let i = 0; i < highchartProps.Stops; i++) {
    loop.push(i);
  }
  console.log('LOOP2 ************************************************************** ' + loop);
  const handleChangeFunc = (key, val) => {
    dispatch(changeValeus(key, val));
  };
  return (
    <React.Fragment>
      <Grid container rowGap={2}>
        {loop.map((e, i) => {
          return (
            <Grid container columnSpacing={2} key={i}>
              <Grid item xs={12} sm={6} md={3}>
                <Grid container rowGap={0.5}>
                  <Grid item xs={12}>
                    {`[${e}] ${type?.["Stops"]}`}
                  </Grid>
                  <Grid item xs={12}>
                    <MyNumberTextField
                      defaultValue={highchartProps[`[${e}] Stops`]}
                      disabled={!boundaries}
                      handleChangeFunc={(value) => {
                        handleChangeFunc(`[${e}] Stops`, value);
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Grid container rowGap={0.5}>
                  <Grid item xs={12}>
                    {`[${e}] ${type?.["Color"]}`}
                  </Grid>
                  <Grid item xs={12}>
                    <ColorTextfield
                      defaultValue={highchartProps[`[${e}] Color`]}
                      disabled={!boundaries}
                      handleChangeFunc={(value) => {
                        handleChangeFunc(`[${e}] Color`, value);
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          );
        })}
      </Grid>
    </React.Fragment>
  );
};

const SolidPopUp = ({ handleClose }) => {
  const dispatch = useDispatch();
  const type = useSelector((state) => state.overviewDialog.values);
  const stops = useSelector(
    (state) => state.overviewDialog.highchartProps["Stops"]
  );
  const Boundaries = useSelector(
    (state) => state.overviewDialog.highchartProps?.["Show Boundaries"]
  );
  const FontSize = useSelector(
    (state) => state.overviewDialog.highchartProps?.["Show Default Font Size"]
  );

  return (
    <>
      <Grid
        container
        id="draggable-dialog-title"
        className="overview-update-pop-up__box__header"
      >
        <Grid item className="overview-update-pop-up__box__header__id">
          {type?.["Type"]}
        </Grid>

        <Grid item>
          <IconButton onClick={handleClose}>
            <CloseIcon fontSize="small" className="dialog-header-text" />
          </IconButton>
        </Grid>
      </Grid>
      <Grid
        container
        columnSpacing={2}
        rowGap={2}
        className="overview-update-pop-up__box__body"
      >
        <Grid item xs={12} sm={9}>
          <Grid container rowGap={2}>
            <Grid item xs={12}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography className="overview-update-pop-up__box__body__label">
                    {type?.["Properties"]}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container columnSpacing={2} rowGap={2}>
                    <PopUpItem type="text" title="Name" nullTrue={true} />
                    <PopUpItem
                      type="number"
                      title="Name Font Size(em)"
                      disabled={FontSize}
                    />
                    <PopUpItem type="number" title="Widget Refresh (seconds)" />
                    <Grid item xs={6}></Grid>
                    <PopUpItem
                      type="number"
                      title="Tag Name Font Size"
                      disabled={FontSize}
                    />
                    <PopUpItem
                      type="number"
                      title="Value Font Size"
                      disabled={FontSize}
                    />
                    <PopUpItem
                      type="number"
                      title="UoM Font Size"
                      disabled={FontSize}
                    />
                    <PopUpItem type="number" title="Decimal Places" />
                    <PopUpItem
                      type="number"
                      title="Time Stamp Font Size"
                      disabled={FontSize}
                    />
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>
            <Grid item xs={12}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography className="overview-update-pop-up__box__body__label">
                    {type?.["Measurement"]}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <ChoseMeasure />
                </AccordionDetails>
              </Accordion>
            </Grid>
            <Grid item xs={12}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography className="overview-update-pop-up__box__body__label">
                    {type?.["Stops"]}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container columnSpacing={2} rowGap={2} sx={{ mb: 2 }}>
                    <Measurement />
                    <Grid item xs={12} sm={6} md={2}>
                      <Grid container rowGap={0.5}>
                        <Stop />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Stops />
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Grid container>
            <Grid item xs={12}>
              <MyList
                array={[
                  "Name",
                  "Tag Name",
                  "Measurement",
                  "Unit of Measurement",
                  "Timestamp",
                  "Enable Export",
                  "Boundaries",
                  "Default Font Size",
                ]}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default SolidPopUp;
