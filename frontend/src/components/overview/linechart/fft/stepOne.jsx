import React from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Checkbox,
  ListItemText,
} from "@mui/material";

import SpectralWaveformSelect from "./spectralWaveformSelect";
import PopUpItem from "../../../highchart/popUpLayout/popUpItem";
import "../../../../assets/styles/page/overview/popUpLayout.scss";
import { changeValeus } from "../../../../services/actions/overview/overviewDialog";
import MyList from "../../utils/popUpUtils/list";
const MyListItem = ({ item, values }) => {
  const dispatch = useDispatch();
  const type = useSelector((state) => state.overviewDialog?.values);
  const check = useSelector(
    (state) => state.overviewDialog?.highchartProps?.[`Show ${item}`]
  );
  const handleChangeFunc = (val) => {
    values.map((e) => {
      dispatch(changeValeus(`Show ${e}`, item === e ? !check : check));
    });
  };
  const labelId = `checkbox-list-label-${item}`;
  return (
    <ListItem key={item} disablePadding>
      <ListItemButton
        role={undefined}
        onClick={() => {
          handleChangeFunc(`Show ${item}`, !check);
        }}
        dense
      >
        <ListItemIcon>
          <Checkbox
            edge="start"
            checked={check}
            tabIndex={-1}
            disableRipple
            inputProps={{ "aria-labelledby": labelId }}
          />
        </ListItemIcon>
        <ListItemText id={labelId} primary={type?.[`Show ${item}`]} />
      </ListItemButton>
    </ListItem>
  );
};

const CreateWidget = () => {
  const FontSize = useSelector(
    (state) => state.overviewDialog.highchartProps?.["Show Default Font Size"]
  );
  const Kinematic = useSelector(
    (state) => state.overviewDialog.highchartProps?.["Kinematic"]
  );
  const Analysis = useSelector(
    (state) => state.overviewDialog.highchartProps?.["Spectral Waveform"]
  );
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
              <PopUpItem
                type="number"
                title="Graph Axis Value Font Size (em)"
                disabled={FontSize}
              />
              <PopUpItem
                type="number"
                title="Graph Axis Title Font Size (em)"
                disabled={FontSize}
              />
              <PopUpItem
                type="number"
                title="Graph Legend Font Size (em)"
                disabled={FontSize}
              />
              <PopUpItem type="number" title="Decimal Places" />
              <SpectralWaveformSelect />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={3.5}>
        <Grid container>
          <Grid item xs={12}>
            <MyList
              array={[
                "Name",
                "Enable Export",
                "Enable Graph Legend",
                "Boundaries",
                "Default Font Size",
                Analysis === "Peakfactor" && "RMS",
                Analysis === "Peakfactor" && "Peak",
              ]}
            />
            {Analysis === "Waveform" || Analysis === "Envelope" ? (
              <List sx={{ paddingTop: 0 }}>
                {["Time", "Frequency"].map((value) => {
                  return (
                    value && (
                      <MyListItem item={value} values={["Time", "Frequency"]} />
                    )
                  );
                })}
              </List>
            ) : (
              <></>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CreateWidget;
