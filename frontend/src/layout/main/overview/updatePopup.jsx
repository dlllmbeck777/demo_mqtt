import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Grid, Box, Typography } from "@mui/material";

import { LoadingComponent } from "../../../components";
import {
  changeValeus,
  updateChart,
  fillTypeValues,
} from "../../../services/actions/overview/overviewDialog";
import CodelistService from "../../../services/api/codeList";
import * as PopUps from "../../../components/overview/updatePopUp";
import resourceList from "../../../services/api/resourceList";
import UpdatePopUp from "../../../components/overview/form/updatePopUps";
import "../../../assets/styles/page/overview/updateContainer.scss";
const DialogContent = ({ highchartProps, chartId, refresh, ...rest }) => {
  const dispatch = useDispatch();
  const CULTURE = useSelector((state) => state.lang.cultur);
  const [loading, setLoading] = React.useState(true);
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [btnText, setBtnText] = React.useState([]);
  const { [selectedItem?.CHAR1]: Element } = PopUps;
  const myAsyncLoadingFunction = async () => {
    setLoading(true);
    await dispatch(await fillTypeValues(highchartProps?.Type));
    setLoading(false);
  };
  React.useEffect(() => {
    myAsyncLoadingFunction();
  }, []);
  React.useEffect(() => {
    async function myFunc() {
      if (!highchartProps?.CHAR1) {
        let res = await CodelistService.getCodelistDetail({
          CODE: highchartProps.Type,
          CULTURE,
        });
        console.log(res);
        setSelectedItem(res?.data?.[0]);
      } else {
        setSelectedItem(highchartProps);
      }
      dispatch({
        type: "SET_HIGHCHART_PROPERTY_OVERVIEW_DIALOG",
        payload: {},
      });
      Object.keys(highchartProps).map((e) => {
        dispatch(changeValeus(e, highchartProps[e]));
      });
    }
    myFunc();
  }, []);
  async function asyncGetBtnText() {
    try {
      let res = await resourceList.getResourcelist({
        CULTURE,
        PARENT: "BUTTON_TEXT",
      });
      console.log(res);
      setBtnText(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  React.useEffect(() => {
    asyncGetBtnText();
  }, [CULTURE]);

  return (
    <Grid container className="overview-update-pop-up">
      <Grid item xs={12} className="overview-update-pop-up__box">
        {Element && !loading ? (
          <Element title={highchartProps.Type} {...rest} />
        ) : (
          <LoadingComponent />
        )}
      </Grid>

      <Grid
        container
        columnSpacing={0.5}
        className="overview-update-pop-up__footer"
      >
        <Grid item>
          <Button
            className="dialog-header-text"
            onClick={() => {
              rest.handleClose();
            }}
            variant="outlined"
          >
            {
              btnText?.filter((e) => e.ID === "BUTTON_TEXT_CANCEL")?.[0]
                ?.SHORT_LABEL
            }
          </Button>
        </Grid>
        <Grid item>
          <Button
            className="dialog-header-text"
            onClick={() => {
              dispatch(updateChart(chartId, refresh));
              rest.handleClose();
            }}
            variant="outlined"
          >
            {
              btnText?.filter((e) => e.ID === "BUTTON_TEXT_SAVE")?.[0]
                ?.SHORT_LABEL
            }
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default React.memo(DialogContent);
