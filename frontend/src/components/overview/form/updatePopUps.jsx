import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { Grid, List, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MyList from "../utils/popUpUtils/list";
import PopUpItem from "../../highchart/popUpLayout/popUpItem";
import CodelistService from "../../../services/api/codeList";

const FormUpdatePopUp = ({ handleClose, title }) => {
  const type = useSelector((state) => state.overviewDialog.values);
  const FontSize = useSelector(
    (state) => state.overviewDialog.highchartProps?.["Show Default Font Size"]
  );
  const CULTURE = useSelector((state) => state.lang.cultur);
  const [positionValues, setPositionValues] = React.useState([]);

  const asyncLoadFunc = async () => {
    const body = JSON.stringify({ CULTURE, CODE_LIST: "FORM_POSITIONS" });
    try {
      let res = await CodelistService.getItemPropCode(body);
      console.log(res?.data);
      setPositionValues((prev) => [...res?.data]);
    } catch (err) {}
  };

  React.useEffect(() => {
    asyncLoadFunc();
  }, []);
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
                    <PopUpItem
                      type="select"
                      title="Position"
                      values={positionValues}
                      valuesPath="CODE"
                      dataTextPath="CODE_TEXT"
                    />
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Grid container>
            <Grid item xs={12}>
              <MyList array={["Name", "Default Font Size"]} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default FormUpdatePopUp;
