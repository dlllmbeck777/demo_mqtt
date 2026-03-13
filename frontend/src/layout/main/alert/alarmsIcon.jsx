import * as React from "react";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import { Grid, IconButton, Popover } from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { useDispatch, useSelector } from "react-redux";
import AlertBox from "./alarmsBox";
import { wsBaseUrl } from "../../../services/baseApi";
import NotificationsService from "../../../services/api/notification";
import NotificationsOffOutlinedIcon from "@mui/icons-material/NotificationsOffOutlined";
import ProfileService from "../../../services/api/profile";
import {
  closeAlarms,
  openAlarms,
} from "../../../services/actions/alarms/alarms";
var W3CWebSocket = require("websocket").w3cwebsocket;
const AlertIcon = () => {
  const dispatch = useDispatch();
  const alarms = useSelector((state) => state.alarms.isOpen);
  const [data, setData] = React.useState([]);
  const layer = useSelector((state) => state?.auth?.user.active_layer);
  const token = useSelector((state) => state?.auth?.token);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const allReaded = async () => {
    const copiedArray = Array.from(data);
    let payload = [];
    copiedArray.map((e) => {
      payload.push({ ...e, is_read: true });
    });
    try {
      NotificationsService.allNotificationsReaded();
      setData(payload);
    } catch (err) {
      console.log(err);
    }
  };

  const itemReaded = (id) => {
    const copiedArray = Array.from(data);
    let payload = [];
    copiedArray.map((e) => {
      if (e.id === id) payload.push({ ...e, is_read: true });
      else payload.push({ ...e });
    });
    try {
      NotificationsService.notificationsReaded(id);
      setData(payload);
    } catch (err) {
      console.log(err);
    }
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  React.useEffect(() => {
    let alarms;

    const myAsyncFunc = async () => {
      try {
        let res = await ProfileService.loadProfileSettings();
        if (res.data?.[0].alarm_notification) {
          dispatch(openAlarms());
        } else {
          dispatch(closeAlarms());
        }
        alarms = new W3CWebSocket(
          `${wsBaseUrl}/ws/all/alarms/${layer}/${token}/`
        );
        alarms.onerror = function () {
          console.log("Connection Error");
        };
        alarms.onopen = function () {
          console.log("connected");
        };
        alarms.onclose = function () {
          console.log("WebSocket Client Closed");
        };
        alarms.onmessage = function (e) {
          async function sendNumber() {
            if (alarms.readyState === alarms.OPEN) {
              if (typeof e.data === "string") {
                let jsonData = JSON.parse(e.data);
                setData(jsonData);
              }
              return true;
            }
          }
          sendNumber();
        };
      } catch {}
    };
    myAsyncFunc();

    return () => {
      if (alarms) {
        alarms.close();
      }
    };
  }, [layer]);

  return (
    <Grid className="alarms" item sx={{ position: "relative", mr: "2px" }}>
      <IconButton
        sx={{
          height: "49px",
          width: "49px !important",
        }}
        aria-describedby={id}
        variant="contained"
        onClick={handleClick}
      >
        {alarms ? (
          <Badge
            badgeContent={data.filter((e) => !e.is_read).length}
            max={99}
            color={"error"}
          >
            <NotificationsNoneIcon
              sx={{
                color: "primary.light",
              }}
              className="app-header__right-box__alert-icon"
            />
          </Badge>
        ) : (
          <NotificationsOffOutlinedIcon />
        )}
      </IconButton>
      {alarms && (
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
          }}
          classes={{ paper: "notification" }}
        >
          <AlertBox data={data} allReaded={allReaded} itemReaded={itemReaded} />
        </Popover>
      )}
    </Grid>
  );
};

export default React.memo(AlertIcon);
