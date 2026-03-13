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
import {
  updateChecked,
  setCheckedsAsset,
} from "../../../services/actions/overview/taps";
import "../../../assets/styles/page/overview/inputs.scss";
const RenderRow = (props) => {
  const {
    data,
    index,
    style,
    selectFunc = () => {},
    primaryText = "", //Specifies the path to reach the text in data
  } = props;
  const selected = useSelector(
    (state) => state.tapsOverview.isChecked[data[index][0]]
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
  const ItemData = useSelector((state) => state.overviewDialog.itemData);

  const assets = useSelector(
    (state) => state.overviewDialog.highchartProps["Assets"]
  );
  const [checked, setChecked] = React.useState([]);
  const [left, setLeft] = React.useState([]);
  const [right, setRight] = React.useState([]);
  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);
  React.useEffect(() => {
    setLeft(ItemData.filter((e) => !assets?.some((a) => a[0] === e[0])));
    setRight(ItemData.filter((e) => assets?.some((a) => a[0] === e[0])));
    dispatch(setCheckedsAsset(ItemData));
  }, [ItemData]);

  const handleToggle = (value, val) => {
    dispatch(updateChecked(value[0], val));
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };
  const handleAllRight = () => {
    leftChecked.map((e) => {
      dispatch(updateChecked(e.TAG_ID, false));
    });
    setRight(right.concat(left));
    setLeft([]);
    handleChangeFunc(right.concat(left));
  };
  const handleAllLeft = () => {
    rightChecked.map((e) => {
      dispatch(updateChecked(e.TAG_ID, false));
    });
    setLeft(left.concat(right));
    setRight([]);
    handleChangeFunc([]);
  };
  const handleCheckedRight = () => {
    leftChecked.map((e) => {
      dispatch(updateChecked(e[0], false));
    });
    setRight(right.concat(leftChecked));
    handleChangeFunc(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    rightChecked.map((e) => {
      dispatch(updateChecked(e[0], false));
    });
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    handleChangeFunc(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
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
                primaryText: 1,
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
        <Grid container rowGap={1} direction="column" alignItems="center">
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
