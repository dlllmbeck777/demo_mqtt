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
} from "../../../../services/actions/overview/taps";
import { uuidv4 } from "../../../../services/utils/uuidGenerator";
import "../../../../assets/styles/page/overview/inputs.scss";
import ItemService from "../../../../services/api/item";
const RenderRow = (props) => {
  const {
    data,
    index,
    style,
    selectFunc = () => {},
    primaryText = "", //Specifies the path to reach the text in data
  } = props;
  const selected = useSelector(
    (state) => state.tapsOverview.isChecked[data[index]["ROW_ID"]]
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

const ProcessDeff = (props) => {
  const dispatch = useDispatch();
  const { handleChangeFunc } = props;
  const [ItemData, setItemData] = React.useState([]);
  const CULTURE = useSelector((state) => state.lang.cultur);
  const processDeff = useSelector(
    (state) => state.overviewDialog.highchartProps["Process Defination"]
  );
  const TYPE = useSelector(
    (state) => state.overviewDialog?.highchartProps?.["Transaction"]
  );
  const [checked, setChecked] = React.useState([]);
  const [left, setLeft] = React.useState([]);
  const [right, setRight] = React.useState([]);
  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);
  React.useEffect(() => {
    setLeft(
      ItemData.filter((e) => !processDeff?.some((a) => a.ROW_ID === e.ROW_ID))
    );
    setRight(
      ItemData.filter((e) => processDeff?.some((a) => a.ROW_ID === e.ROW_ID))
    );
    dispatch(setCheckedsAsset(ItemData));
  }, [ItemData]);

  React.useEffect(() => {
    const asyncLoadFunc = async () => {
      const body = JSON.stringify({ CULTURE, TYPE });
      console.log(body);
      try {
        let res = await ItemService.getTypePropertyNoToken(body);
        let data = [];
        Promise.all(
          Object.values(res.data).map((e) => {
            Promise.all(
              e.map((type) => {
                if (
                  type.PROPERTY_TYPE === "NUMBER" ||
                  type.PROPERTY_TYPE === "DURATION"
                )
                  data.push(type);
              })
            );
          })
        );
        console.log(data);
        setItemData((prev) => data);
      } catch (err) {}
    };
    asyncLoadFunc();
  }, [TYPE, CULTURE]);

  const handleToggle = (value, val) => {
    console.log(value);
    console.log(val);
    dispatch(updateChecked(value["ROW_ID"], val));
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
      dispatch(updateChecked(e.ROW_ID, false));
    });
    setRight(right.concat(left));
    setLeft([]);
    handleChangeFunc(right.concat(left));
    dispatch("Input Flag", uuidv4());
  };
  const handleAllLeft = () => {
    rightChecked.map((e) => {
      dispatch(updateChecked(e.ROW_ID, false));
    });
    setLeft(left.concat(right));
    setRight([]);
    handleChangeFunc([]);
    dispatch("Input Flag", uuidv4());
  };
  const handleCheckedRight = () => {
    leftChecked.map((e) => {
      dispatch(updateChecked(e["ROW_ID"], false));
    });
    setRight(right.concat(leftChecked));
    handleChangeFunc(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
    dispatch("Input Flag", uuidv4());
  };

  const handleCheckedLeft = () => {
    rightChecked.map((e) => {
      dispatch(updateChecked(e["ROW_ID"], false));
    });
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    handleChangeFunc(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
    dispatch("Input Flag", uuidv4());
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
                primaryText: "SHORT_LABEL",
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

export default React.memo(ProcessDeff);
