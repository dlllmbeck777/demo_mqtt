import React from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Grid,
  Paper,
  ListItem,
  ListItemIcon,
  Checkbox,
  Button,
  ListItemText,
} from "@mui/material";
import { FixedSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { changeValeus } from "../../../services/actions/overview/overviewDialog";
import {
  updateChecked,
  setCheckeds,
} from "../../../services/actions/overview/taps";
import ItemLinkService from "../../../services/api/itemLink";
import axios from "axios";
import "../../../assets/styles/page/overview/inputs.scss";
import { uuidv4 } from "../../../services/utils/uuidGenerator";
let cancelToken;
const RenderRow = (props) => {
  const {
    data,
    index,
    style,
    selectFunc = () => {},
    primaryText = "", //Specifies the path to reach the text in data
  } = props;
  const selected = useSelector(
    (state) => state.tapsOverview.isChecked[data[index].TAG_ID]
  );
  return (
    <ListItem
      style={style}
      key={index}
      component="div"
      disablePadding
      onClick={(event) => {
        selectFunc(data[index], !selected);
      }}
    >
      <ListItemIcon>
        <Checkbox checked={selected} tabIndex={-1} disableRipple />
      </ListItemIcon>
      <ListItemText
        primary={`${data[index][primaryText]}`}
        className="overview-inputs-container__list-box__item__text"
      />
    </ListItem>
  );
};

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

const Inputs = (props) => {
  const dispatch = useDispatch();
  const { handleChangeFunc } = props;
  const tags = useSelector((state) => state.overviewDialog.measuremenetData);
  const Inputs = useSelector(
    (state) => state.overviewDialog.highchartProps?.["Inputs"]
  );
  const transactionProps = useSelector(
    (state) => state.overviewDialog.highchartProps?.["Assets"]
  );
  const [checked, setChecked] = React.useState([]);
  const [left, setLeft] = React.useState([]);
  const [right, setRight] = React.useState([]);
  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);
  React.useEffect(() => {
    let tmepleft = tags.filter(
      (e) => !Inputs?.some((a) => a.TAG_ID === e.TAG_ID)
    );
    tmepleft = tmepleft.sort((a, b) => (a.SHORT_NAME > b.SHORT_NAME ? 1 : -1));
    let tempright = tags.filter((e) =>
      Inputs?.some((a) => a.TAG_ID === e.TAG_ID)
    );
    tempright = tempright.sort((a, b) =>
      a.SHORT_NAME > b.SHORT_NAME ? 1 : -1
    );
    setLeft(tmepleft);
    setRight(tempright);
    dispatch(setCheckeds(tags));
  }, [tags]);
  React.useEffect(() => {
    async function myFunc() {
      if (cancelToken) {
        cancelToken.cancel();
      }
      cancelToken = axios.CancelToken.source();
      let ids = [];
      if (transactionProps)
        transactionProps.map((e) => {
          ids.push(e[0]);
        });
      const body = JSON.stringify({ ID: ids });
      let res = [];
      if (props?.isNeedCalcTags)
        res = await ItemLinkService.getItemCalcTags(body, cancelToken);
      else {
        res = await ItemLinkService.getItemCalcTags(body, cancelToken);
        res.data = res.data.filter(
          (e) => !e?.OPERATIONS_TYPE || e?.OPERATIONS_TYPE === "velocity"
        );
      }

      dispatch({
        type: "SET_MEASUREMENT_DATA",
        payload: res?.data,
      });
    }
    myFunc();
  }, []);
  const handleToggle = (value, val) => {
    dispatch(updateChecked(value.TAG_ID, val));
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };
  const helper = (e) => {
    dispatch(changeValeus(`${e.NAME} Y-Axis Minimum`, e.LIMIT_LOLO));
    dispatch(changeValeus(`${e.NAME} Y-Axis Maximum`, e.LIMIT_HIHI));
    dispatch(changeValeus(`${e.NAME} Y-Axis Normal Minimum`, e.NORMAL_MINIMUM));
    dispatch(changeValeus(`${e.NAME} Y-Axis Normal Maximum`, e.NORMAL_MAXIMUM));

    dispatch(changeValeus(`[${e.NAME}] Stops`, 3));
    dispatch(changeValeus(`[0] [${e.NAME}] Low`, parseFloat(e.LIMIT_LOLO)));
    dispatch(
      changeValeus(`[0] [${e.NAME}] High`, parseFloat(e.NORMAL_MINIMUM))
    );
    dispatch(changeValeus(`[0] [${e.NAME}] Color`, "#008000"));
    dispatch(changeValeus(`[0] [${e.NAME}] Opacity`, "0.15"));
    dispatch(changeValeus(`[1] [${e.NAME}] Low`, parseFloat(e.NORMAL_MINIMUM)));
    dispatch(
      changeValeus(`[1] [${e.NAME}] High`, parseFloat(e.NORMAL_MAXIMUM))
    );
    dispatch(changeValeus(`[1] [${e.NAME}] Color`, "#d7d700"));
    dispatch(changeValeus(`[1] [${e.NAME}] Opacity`, "0.15"));
    dispatch(changeValeus(`[2] [${e.NAME}] Low`, parseFloat(e.NORMAL_MAXIMUM)));
    dispatch(changeValeus(`[2] [${e.NAME}] High`, parseFloat(e.LIMIT_HIHI)));
    dispatch(changeValeus(`[2] [${e.NAME}] Color`, "#ff0000"));
    dispatch(changeValeus(`[2] [${e.NAME}] Opacity`, "0.15"));
    dispatch(changeValeus("Color Flag", uuidv4()));
  };
  const handleAllRight = () => {
    leftChecked.map((e) => {
      dispatch(updateChecked(e.TAG_ID, false));
    });
    let tempright = right.concat(left);
    tempright = tempright.sort((a, b) =>
      a.SHORT_NAME > b.SHORT_NAME ? 1 : -1
    );
    setRight(tempright);
    left.map(async (e) => {
      helper(e);
    });
    setLeft([]);
    handleChangeFunc(right.concat(left));
    dispatch(changeValeus("Input Flag", uuidv4()));
  };
  const handleAllLeft = () => {
    rightChecked.map((e) => {
      dispatch(updateChecked(e.TAG_ID, false));
    });
    let tempLeft = left.concat(right);
    tempLeft = tempLeft.sort((a, b) => (a.SHORT_NAME > b.SHORT_NAME ? 1 : -1));
    setLeft(tempLeft);
    setRight([]);
    handleChangeFunc([]);
    dispatch(changeValeus("Input Flag", uuidv4()));
  };
  const handleCheckedRight = () => {
    leftChecked.map((e) => {
      dispatch(updateChecked(e.TAG_ID, false));
    });
    let tempright = right.concat(leftChecked);
    tempright = tempright.sort((a, b) =>
      a.SHORT_NAME > b.SHORT_NAME ? 1 : -1
    );
    setRight(tempright);
    handleChangeFunc(right.concat(leftChecked));
    leftChecked.map(async (e) => {
      helper(e);
    });
    let tempLeft = not(left, leftChecked);
    tempLeft = tempLeft.sort((a, b) => (a.SHORT_NAME > b.SHORT_NAME ? 1 : -1));
    setLeft(tempLeft);
    setChecked(not(checked, leftChecked));
    dispatch(changeValeus("Input Flag", uuidv4()));
  };

  const handleCheckedLeft = () => {
    rightChecked.map((e) => {
      dispatch(updateChecked(e.TAG_ID, false));
    });
    let tempLeft = left.concat(rightChecked);
    tempLeft = tempLeft.sort((a, b) => (a.SHORT_NAME > b.SHORT_NAME ? 1 : -1));
    setLeft(tempLeft);
    let tempright = not(right, rightChecked);
    tempright = tempright.sort((a, b) =>
      a.SHORT_NAME > b.SHORT_NAME ? 1 : -1
    );
    setRight(tempright);
    handleChangeFunc(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
    dispatch(changeValeus("Input Flag", uuidv4()));
  };

  const customList = (items) => (
    <Paper className="overview-inputs-container__list-box__item">
      <AutoSizer>
        {({ height, width }) => (
          <FixedSizeList
            height={height}
            width={width}
            itemSize={35}
            itemCount={items.length}
            itemData={items}
            overscanCount={5}
          >
            {(props) =>
              RenderRow({
                ...props,
                selectFunc: handleToggle,
                primaryText: "SHORT_NAME",
              })
            }
          </FixedSizeList>
        )}
      </AutoSizer>
    </Paper>
  );

  return (
    <Grid
      container
      justifyContent="center"
      columns={24}
      className="overview-inputs-container"
    >
      <Grid item xs={10.5} className="overview-inputs-container__list-box">
        {customList(left)}
      </Grid>
      <Grid item xs={3}>
        <Grid container direction="column" rowGap={1} alignItems="center">
          <Button
            variant="outlined"
            size="small"
            onClick={handleAllRight}
            disabled={left.length === 0}
            aria-label="move all right"
          >
            ≫
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0}
            aria-label="move selected right"
          >
            &gt;
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0}
            aria-label="move selected left"
          >
            &lt;
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={handleAllLeft}
            disabled={right.length === 0}
            aria-label="move all left"
          >
            ≪
          </Button>
        </Grid>
      </Grid>
      <Grid item xs={10.5} className="overview-inputs-container__list-box">
        {customList(right)}
      </Grid>
    </Grid>
  );
};

export default React.memo(Inputs);
