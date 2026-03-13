import React from "react";
import { useDispatch } from "react-redux";
import $ from "jquery";

import * as Icons from "@mui/icons-material";
import { Box, List, ListItem, Typography } from "@mui/material";

import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import { hasChildren } from "./utils";
import history from "../../routers/history";

import {
  setSelectedDrawerItem,
  toggleDrawerSubItem,
} from "../../services/actions/drawerMenu/drawerMenu";

import { confirmationPushHistory } from "../../services/utils/historyPush";
import { setGoFunctionConfirmation } from "../../services/actions/confirmation/historyConfirmation";
import { urlFormatter } from "../../services/utils/urlFormatter";
import { applyFontWeight } from "../../services/actions/fontSize";
function App({ menu }) {
  React.useEffect(() => {
    applyFontWeight();
  }, []);
  return Object.keys(menu).map((item, key) => (
    <MenuItem key={key} item={menu[item]} url="/" />
  ));
}

const MenuItem = ({ item, url }) => {
  const Component = hasChildren(item) ? MultiLevel : SingleLevel;
  return <Component item={item} url={url} />;
};

const SingleLevel = ({ item, url }) => {
  url = url + urlFormatter(item.PATH);
  if (url === "/home") {
    url = "/";
  }
  const dispatch = useDispatch();
  const { [item.ICON]: Icon } = Icons;
  const handleClick = () => {
    function goFunction() {
      dispatch(setSelectedDrawerItem(item));
      history.push(`${url}`);
    }
    dispatch(setGoFunctionConfirmation(goFunction));
    dispatch(confirmationPushHistory());
  };

  return (
    <ListItem
      button
      className={`drawer-menu__list-item drawer-menu__${urlFormatter(
        item.PATH
      )}-list-item drawer-menu__${urlFormatter(item.SHORT_LABEL)}-list-item`}
      onClick={handleClick}
    >
      {Icon ? (
        <Icon />
      ) : (
        <Box className="drawer-menu__list-item__empty-box"></Box>
      )}
      <Typography
        variant="subtitle2"
        className={"drawer-menu__list-item__text"}
      >
        {item.SHORT_LABEL}
      </Typography>
    </ListItem>
  );
};

const MultiLevel = ({ item, url }) => {
  const dispatch = useDispatch();
  url = url + urlFormatter(item.PATH) + "/";
  const { CHILD: children } = item;
  const { [item.ICON]: Icon } = Icons;

  const handleClick = () => {
    if (
      !(
        $(".drawer-menu")
          .attr("class")
          .split(" ")
          .indexOf("drawer-menu-closed") > -1
      )
    ) {
      dispatch(toggleDrawerSubItem(item.PATH));
    } else {
      function goFunction() {
        dispatch(setSelectedDrawerItem(item));
        history.push(`${url}`);
      }
      dispatch(setGoFunctionConfirmation(goFunction));
      dispatch(confirmationPushHistory());
    }
  };
  return (
    <React.Fragment>
      <ListItem
        button
        onClick={handleClick}
        className={`drawer-menu__list-item
         drawer-menu__${urlFormatter(item.PATH)}-list-item`}
      >
        {Icon ? (
          <Icon />
        ) : (
          <Box className="drawer-menu__list-item__empty-box"></Box>
        )}

        <Typography
          variant="subtitle2"
          className={"drawer-menu__list-item__text"}
        >
          {item.SHORT_LABEL}
        </Typography>

        <ArrowDropUpIcon
          typography="body1"
          className={`drawer-menu__arrow-up-icon drawer-menu__${urlFormatter(
            item.PATH
          )}opened-list-item__arrow-up-icon drawer-menu__arrow-icon`}
        />
        <ArrowDropDownIcon
          typography="body1"
          className={`drawer-menu__arrow-down-icon drawer-menu__${urlFormatter(
            item.PATH
          )}opened-list-item__arrow-down-icon drawer-menu__arrow-icon`}
        />
      </ListItem>

      <List
        id={`drawer-menu_${urlFormatter(item.PATH)}-collapse-item`}
        className="drawer-menu__sub-menu"
        component="div"
        disablePadding
      >
        {Object.keys(children).map((child, key) => (
          <MenuItem key={key} item={children[child]} url={url} />
        ))}
      </List>
    </React.Fragment>
  );
};

export default App;
