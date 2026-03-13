import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { Grid, List, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { MyNumberTextField } from "../..";
import { cleanStops } from "../../../services/actions/overview/overviewDialog";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MyList from "../utils/popUpUtils/list";
import ChoseMeasure from "../../highchart/popUpLayout/choseMeasure";
import PopUpItem from "../../highchart/popUpLayout/popUpItem";
import { Stops } from "../../highchart/popUpLayout/stops";
import Stop from "../../highchart/popUpLayout/stop";
import Measurement from "../../highchart/popUpLayout/measurement";
const AngularPopUp = ({ handleClose, title }) => {
  const type = useSelector((state) => state.overviewDialog.values);
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
              <Grid container columnSpacing={2} rowGap={2}>
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
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container columnSpacing={2} rowGap={2}>
                <Grid item xs={12}>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography className="overview-update-pop-up__box__body__label">
                        {type?.["Stops"]}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid
                        container
                        columnSpacing={2}
                        rowGap={2}
                        sx={{ mb: 2 }}
                      >
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

export default AngularPopUp;
