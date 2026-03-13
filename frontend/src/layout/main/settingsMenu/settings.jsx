import React from "react";
import $ from "jquery";
import axios from "axios";
import { MenuItem, Divider, Slider, Box } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DoneIcon from "@mui/icons-material/Done";
import MenuItems from "./menuItem";
import ProfileService from "../../../services/api/profile";
import { useDispatch } from "react-redux";
const Settings = ({ changeMenu, handleClose, menuItem }) => {
  const dispatch = useDispatch();
  const [treeMenuState, setTreeMenuState] = React.useState("vertical");
  const [fullScreenMode, setFullScreenMode] = React.useState(false);
  const [alarms, setAlarms] = React.useState(false);
  React.useEffect(() => {
    async function myFunc() {
      try {
        let res = await ProfileService.loadProfileSettings();
        setTreeMenuState(res.data?.[0].overview_orientation);
        setFullScreenMode(res.data?.[0].full_screen);
        setAlarms(res.data?.[0].alarm_notification);
      } catch {
        setTreeMenuState(
          localStorage.getItem("treemenuoverview")
            ? localStorage.getItem("treemenuoverview")
            : "vertical"
        );
      }
    }
    myFunc();
  }, []);

  let overviewCancelToken;
  const treeMenuStateSelect = async (e) => {
    try {
      if (e === "horizontal") {
        if (overviewCancelToken) {
          overviewCancelToken.cancel();
        }
        overviewCancelToken = axios.CancelToken.source();
        ProfileService.updateSettings(
          { overview_orientation: e },
          overviewCancelToken
        );
      } else {
        if (overviewCancelToken) {
          overviewCancelToken.cancel();
        }
        overviewCancelToken = axios.CancelToken.source();
        ProfileService.updateSettings(
          { overview_orientation: e },
          overviewCancelToken
        );
      }
    } catch {}

    if (e === "horizontal") {
      $(".overview-tree-menu").hide(200);
      $(".overview-container__horizontal-menu").show(200);
      $(".overview-container__tab-box").css({ height: "calc(100% - 44px)" });
      localStorage.setItem("treemenuoverview", `${e}`);
      setTreeMenuState("horizontal");
    } else {
      $(".overview-tree-menu").show(200);
      $(".overview-container__horizontal-menu").hide(200);
      $(".overview-container__tab-box").css({ height: "100%" });
      localStorage.setItem("treemenuoverview", `${e}`);
      setTreeMenuState("vertical");
    }
  };

  let fullScreenCancelToke;
  let alarmNotification;

  return (
    <>
      <MenuItem
        onClick={() => {
          changeMenu("MAIN");
        }}
      >
        <MenuItems Icon={ArrowBackIcon} text={menuItem.CODE_TEXT} />
      </MenuItem>
      <Divider />
      <MenuItem
        disableTouchRipple
        sx={{ "&:hover": { backgroundColor: "transparent" } }}
      >
        {menuItem?.CHILD?.[0]?.CODE_TEXT}
      </MenuItem>

      {[menuItem?.CHILD?.[0]?.CHAR1, menuItem?.CHILD?.[0]?.CHAR2].map(
        (e, i) => {
          return (
            <MenuItem
              key={e}
              onClick={() => {
                treeMenuStateSelect(e);
              }}
            >
              <Box className="settings-container__main-menu__item-icon-box">
                {treeMenuState === e && <DoneIcon />}
              </Box>
              {i === 0
                ? menuItem?.CHILD?.[0]?.CHAR3
                : menuItem?.CHILD?.[0]?.CHAR4}
            </MenuItem>
          );
        }
      )}

      <MenuItem
        disableTouchRipple
        sx={{ "&:hover": { backgroundColor: "transparent" } }}
      >
        {menuItem?.CHILD?.[1]?.CODE_TEXT}
      </MenuItem>

      {[menuItem?.CHILD?.[1]?.CHAR1, menuItem?.CHILD?.[1]?.CHAR2].map(
        (e, i) => {
          return (
            <MenuItem
              key={e}
              onClick={() => {
                try {
                  if (fullScreenCancelToke) {
                    fullScreenCancelToke.cancel();
                  }
                  fullScreenCancelToke = axios.CancelToken.source();
                  ProfileService.updateSettings(
                    { full_screen: e === "on" },
                    fullScreenCancelToke
                  );
                } catch (err) {
                  console.log(err);
                }

                if ("on" === e)
                  $(".normal-screen-box").addClass("full-screen-box");
                else $(".normal-screen-box").removeClass("full-screen-box");
                $(".normal-screen-box").each(function () {
                  var classes = $(this).attr("class").split(" ");
                  if (classes.includes("full-screen-box")) {
                    setFullScreenMode(true);
                  } else {
                    setFullScreenMode(false);
                  }
                });
              }}
            >
              <Box className="settings-container__main-menu__item-icon-box">
                {fullScreenMode && e === "on" && <DoneIcon />}
                {!fullScreenMode && e === "close" && <DoneIcon />}
              </Box>
              {i === 0
                ? menuItem?.CHILD?.[1]?.CHAR3
                : menuItem?.CHILD?.[1]?.CHAR4}
            </MenuItem>
          );
        }
      )}

      <MenuItem
        disableTouchRipple
        sx={{ "&:hover": { backgroundColor: "transparent" } }}
      >
        {menuItem?.CHILD?.[2]?.CODE_TEXT}
      </MenuItem>

      {[menuItem?.CHILD?.[2]?.CHAR1, menuItem?.CHILD?.[2]?.CHAR2].map(
        (e, i) => {
          return (
            <MenuItem
              key={e}
              onClick={() => {
                try {
                  if (alarmNotification) {
                    alarmNotification.cancel();
                  }
                  alarmNotification = axios.CancelToken.source();
                  ProfileService.updateSettings(
                    { alarm_notification: e === "on" },
                    alarmNotification
                  );
                  setAlarms(e === "on");
                } catch (err) {
                  console.log(err);
                }

                if ("on" === e)
                  dispatch({
                    type: "TOGGLE_ALARMS",
                    payload: true,
                  });
                else
                  dispatch({
                    type: "TOGGLE_ALARMS",
                    payload: false,
                  });
              }}
            >
              <Box className="settings-container__main-menu__item-icon-box">
                {alarms && e === "on" && <DoneIcon />}
                {!alarms && e === "close" && <DoneIcon />}
              </Box>
              {i === 0
                ? menuItem?.CHILD?.[2]?.CHAR3
                : menuItem?.CHILD?.[2]?.CHAR4}
            </MenuItem>
          );
        }
      )}
    </>
  );
};

export default Settings;
