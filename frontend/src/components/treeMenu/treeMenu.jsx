import React from "react";

import { ListItem, ListItemButton, ListItemText } from "@mui/material";

import { FixedSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

import { ComponentError, ComponentErrorBody } from "../../components";
import { applyFontWeight } from "../../services/actions/fontSize";
const RenderRow = (props) => {
  const {
    data,
    index,
    style,
    selectFunc = () => {},
    selectedIndex = -999,
    primaryText = "", //Specifies the path to reach the text in data
  } = props;

  return (
    <ListItem
      style={style}
      key={index}
      component="div"
      disablePadding
      sx={{
        ".MuiButtonBase-root": {
          paddingY: "3px",
        },
      }}
    >
      <ListItemButton
        selected={selectedIndex === index}
        onClick={(event) => {
          selectFunc(index);
        }}
      >
        <ListItemText
          primary={`${data[index][primaryText]}`}
          className="treemenu-container__box__element-box__list__item"
        />
      </ListItemButton>
    </ListItem>
  );
};

const TreeMenuItem = (myProps) => {
  const { items = [] } = myProps;
  React.useEffect(() => {
    applyFontWeight();
  }, [myProps]);
  return (
    <AutoSizer>
      {({ height, width }) => (
        <FixedSizeList
          height={height}
          width={width}
          itemSize={35}
          itemCount={items.length}
          itemData={items}
          overscanCount={5}
          className="treemenu-container__box__element-box__list"
        >
          {(props) =>
            RenderRow({
              ...props,
              selectFunc: myProps.selectFunc,
              selectedIndex: myProps.selectedIndex,
              primaryText: myProps.primaryText,
            })
          }
        </FixedSizeList>
      )}
    </AutoSizer>
  );
};

export const TreeMenu = (props) => {
  return (
    <ComponentError
      errMsg={
        <ComponentErrorBody
          text="Something went wrong"
          icon={<ErrorOutlineIcon />}
        />
      }
    >
      <TreeMenuItem {...props} />
    </ComponentError>
  );
};
