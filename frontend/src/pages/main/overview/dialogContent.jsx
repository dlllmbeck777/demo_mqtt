import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { IconButton, Grid, Box } from "@mui/material";

import { Select, Stepper, LoadingComponent } from "../../../components";
import CloseIcon from "@mui/icons-material/Close";
import {
  fillProperties,
  loadFormSelectItems,
} from "../../../services/actions/overview/overviewDialog";
import { saveNewChart } from "../../../services/actions/overview/overviewDialog";
import * as PopUps from "../../../components/overview/newPopUp";
import CodelistService from "../../../services/api/codeList";
import { changeValeus } from "../../../services/actions/overview/overviewDialog";
import "../../../assets/styles/page/overview/createPopUp.scss";
const DialogContent = ({ handleClose }) => {
  const dispatch = useDispatch();
  const CULTURE = useSelector((state) => state.lang.cultur);
  const [refresh, setRefresh] = React.useState(false);

  const [chartTypeValues, setChartTypeValues] = React.useState([]);
  const [chartType, setChartType] = React.useState({});

  const [chartLibValues, setChartLibValues] = React.useState([]);
  const [chartLib, setChartLib] = React.useState({});

  const [widgetTypeValues, setWidgetTypeValues] = React.useState([]);
  const [widgetType, setWidgetType] = React.useState({});

  const formValues = useSelector(
    (state) => state.overviewDialog.formSelectItems
  );

  const { [chartType?.CHAR1]: Element } = PopUps;

  const handleWidgetTypeChange = async (val) => {
    setWidgetType(val);
    if (val?.CODE === "Widgets") {
      let res = await CodelistService.getByParentHierarchy({
        CULTURE,
        LIST_TYPE: "Chart_lib",
        PARENT: val?.CODE,
      });
      setChartLibValues(res?.data);
      handleChartLibChange(res?.data?.[0]);
    } else {
      await handleChartTypeChange(formValues?.[0]);
    }
  };

  const handleChartLibChange = async (val) => {
    setChartLib(val);
    let res = await CodelistService.getByParentHierarchy({
      CULTURE,
      LIST_TYPE: "CHART_TYPE",
      PARENT: val?.CODE,
    });
    setChartTypeValues(res?.data);
    handleChartTypeChange(res?.data?.[0]);
  };

  const handleChartTypeChange = async (val) => {
    console.log(val);
    setRefresh(false);
    await dispatch(await fillProperties(val.CODE));
    setChartType(val);
    if (val?.TYPE) {
      Object.keys(val).map((e) => {
        dispatch(changeValeus(e, val?.[e]));
      });
    }
    setRefresh(true);
    return Promise.resolve(true);
  };
  React.useEffect(() => {
    async function myFunc() {
      dispatch(loadFormSelectItems());
      try {
        let res = await CodelistService.getByParentHierarchy({
          CULTURE,
          LIST_TYPE: "WIDGET_TYPE",
        });
        setWidgetTypeValues(res?.data);
        handleWidgetTypeChange(res.data?.[0]);
      } catch {
        console.log("catch");
      }
    }
    myFunc();
  }, []);
  function finishFunc() {
    dispatch(saveNewChart());
    handleClose();
  }
  return (
    <Box className="overview-create-pop-up">
      <Box
        id="draggable-dialog-title"
        className="overview-create-pop-up__drag"
      ></Box>
      <Grid className="overview-create-pop-up__header" container>
        <Grid item>
          <Grid container columnSpacing={2}>
            <Grid item>
              <Select
                values={widgetTypeValues}
                handleChangeFunc={(val) => {
                  handleWidgetTypeChange(val);
                }}
                defaultValue={widgetType}
                dataTextPath={"CODE_TEXT"}
                className="dialog-header-text"
              />
            </Grid>
            {widgetType?.CODE === "Widgets" && (
              <Grid item>
                <Select
                  values={chartLibValues}
                  handleChangeFunc={(val) => {
                    handleChartLibChange(val);
                  }}
                  defaultValue={chartLib}
                  dataTextPath={"CODE_TEXT"}
                  className="dialog-header-text"
                />
              </Grid>
            )}
            <Grid item>
              <Select
                values={
                  widgetType?.CODE === "Widgets" ? chartTypeValues : formValues
                }
                handleChangeFunc={(val) => {
                  handleChartTypeChange(val);
                }}
                defaultValue={chartType}
                dataTextPath={
                  widgetType?.CODE === "Widgets" ? "CODE_TEXT" : "TYPE"
                }
                className="dialog-header-text"
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <IconButton onClick={handleClose}>
            <CloseIcon fontSize="small" className="dialog-header-text" />
          </IconButton>
        </Grid>
      </Grid>
      {refresh ? (
        <Box className="overview-create-pop-up__stepper-box">
          {Element && (
            <Stepper
              components={Element}
              finishFunc={finishFunc}
              mykey={chartType?.CODE}
            />
          )}
        </Box>
      ) : (
        <Box className="overview-create-pop-up__loading-box">
          <LoadingComponent />
        </Box>
      )}
    </Box>
  );
};

export default DialogContent;
