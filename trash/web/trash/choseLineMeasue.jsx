import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Paper,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Checkbox,
  ListItemText,
  Box,
} from "@mui/material";
import { changeValeus } from "../../../frontend/src/services/actions/overview/overviewDialog";
import Inputs from "../../../frontend/src/components/highchart/popup/inputs";
import ItemLinkService from "../../../frontend/src/services/api/itemLink";
import axios from "axios";
let cancelToken;
const ChoseMeasure = () => {
  const dispatch = useDispatch();
  const checked = useSelector(
    (state) => state.overviewDialog.highchartProps["Transaction Property"]
  );
  const ItemData = useSelector((state) => state.overviewDialog.itemData);

  const handleToggle = async (value) => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    dispatch(changeValeus("Transaction Property", newChecked));
  };
  React.useEffect(() => {
    async function myFunc() {
      if (cancelToken) {
        cancelToken.cancel();
      }
      cancelToken = axios.CancelToken.source();
      const body = JSON.stringify({ ID: checked });
      let res = await ItemLinkService.getItemTags(body, cancelToken);
      dispatch({
        type: "SET_MEASUREMENT_DATA",
        payload: res.data,
      });
    }
    myFunc();
  }, [checked]);

  return (
    <Grid
      container
      columnSpacing={2}
      rowGap={2}
      sx={{ div: { fontSize: "14px" } }}
    >
      <Box sx={{ ml: 2, fontSize: "14px" }}> Transaction Property</Box>
      <Paper sx={{ ml: 2, width: "100%", borderRadius: "3px" }}>
        <List
          sx={{
            width: "100%",
            height: "300px",
            bgcolor: "inherit",
            overflowY: "auto",
          }}
        >
          {ItemData.map((value) => {
            const labelId = `checkbox-list-label-${value[1]}`;
            return (
              <ListItem key={value[0]} disablePadding>
                <ListItemButton
                  role={undefined}
                  onClick={async () => {
                    await handleToggle(value[0]);
                  }}
                  dense
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={checked.indexOf(value[0]) !== -1}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ "aria-labelledby": labelId }}
                    />
                  </ListItemIcon>
                  <ListItemText id={labelId} primary={`${value[1]}`} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Paper>
    </Grid>
  );
};

export default ChoseMeasure;
