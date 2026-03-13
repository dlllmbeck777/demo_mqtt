import React from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Checkbox,
  ListItemText,
} from "@mui/material";

import { changeValeus } from "../../../services/actions/overview/overviewDialog";
import PopUpItem from "../../highchart/popUpLayout/popUpItem";
import "../../../assets/styles/page/overview/popUpLayout.scss";
import ProfileService from "../../../services/api/profile";
import CodelistService from "../../../services/api/codeList";
import { Select } from "../..";
const StepOne = () => {
  const dispatch = useDispatch();
  const type = useSelector((state) => state.overviewDialog.values);
  const CULTURE = useSelector((state) => state.lang.cultur);
  const [alarmValues, setAlarmValues] = React.useState([]);
  const EnableTitles = useSelector(
    (state) => state.overviewDialog.highchartProps["Show Name"]
  );
  const alert = useSelector(
    (state) => state.overviewDialog?.highchartProps["Alarms"]
  );
  const FontSize = useSelector(
    (state) => state.overviewDialog.highchartProps?.["Show Default Font Size"]
  );
  const handleChangeFunc = (key, val) => {
    dispatch(changeValeus(key, val));
  };
  async function myFunc() {
    let res = await ProfileService.loadProfileSettings();
    const fontSize = parseInt(res.data[0].font_size);
    dispatch(changeValeus(`Name Font Size(em)`, fontSize));
    dispatch(changeValeus(`Header Font Size`, fontSize));
  }

  React.useEffect(() => {
    async function asyncLoadFunc() {
      try {
        let res = await CodelistService.getByParentHierarchy({
          CULTURE,
          LIST_TYPE: "ALARM_TYPE",
        });
        setAlarmValues(res?.data);
        if (alert === "") {
          handleChangeFunc("Alarms", res?.data?.[0]?.CODE);
        }
      } catch (err) {
        console.log(err);
        console.log("catch");
      }
    }
    asyncLoadFunc();
  }, []);

  return (
    <Grid
      container
      columnSpacing={2}
      rowGap={2}
      className="pop-up-layout-font-size"
    >
      <Grid item xs={12} sm={8.5}>
        <Grid container rowGap={2}>
          <Grid item xs={12}>
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
                title="Header Font Size"
                disabled={FontSize}
              />
              <Grid item xs={6}></Grid>

              <Grid item xs={12} sm={6}>
                <Grid container rowGap={0.5}>
                  <Grid item xs={12}>
                    {type?.["Alarms"]}
                  </Grid>
                  <Grid item xs={12}>
                    <Select
                      values={alarmValues}
                      defaultValue={alert}
                      handleChangeFunc={async (value) => {
                        handleChangeFunc("Alarms", value);
                      }}
                      valuesPath={"CODE"}
                      dataTextPath={"CODE_TEXT"}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={3.5}>
        <Grid container>
          <Grid item xs={12}>
            <List>
              <ListItem disablePadding>
                <ListItemButton
                  role={undefined}
                  onClick={() => {
                    handleChangeFunc(`Show Name`, !EnableTitles);
                  }}
                  dense
                >
                  <ListItemIcon>
                    <Checkbox
                      aria-label="name"
                      edge="start"
                      checked={!EnableTitles}
                      tabIndex={-1}
                      disableRipple
                    />
                  </ListItemIcon>
                  <ListItemText
                    id={"name"}
                    primary={`${type?.["Show Name"]}`}
                  />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  role={undefined}
                  onClick={() => {
                    if (!FontSize) myFunc();
                    handleChangeFunc(`Show Default Font Size`, !FontSize);
                  }}
                  dense
                >
                  <ListItemIcon>
                    <Checkbox
                      aria-label="Default Font Size"
                      edge="start"
                      checked={FontSize}
                      tabIndex={-1}
                      disableRipple
                    />
                  </ListItemIcon>
                  <ListItemText
                    id={"Default Font Size"}
                    primary={`${type?.["Show Default Font Size"]}`}
                  />
                </ListItemButton>
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default StepOne;
