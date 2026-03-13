import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Grid, Box, Switch } from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { handleChangeSettings } from "../../../../services/actions/profile/profile";
import { IOSSwitch } from "../../../../components";

const Notification = () => {
  const dispatch = useDispatch();
  const value = useSelector((state) =>
    state.profile.values?.email_notification === undefined
      ? false
      : state.profile.values?.email_notification
  );
  const alarmValue = useSelector((state) =>
    state.profile.values?.alarm_notification === undefined
      ? false
      : state.profile.values?.alarm_notification
  );
  return (
    <>
      <Grid
        container
        alignItems={"center"}
        columnGap={2}
        sx={{ mb: 2, width: "50%" }}
      >
        <Grid item>
          <MailOutlineIcon
            fontSize="large"
            className="profile-settings__body__notification__icon"
          />
        </Grid>
        <Grid item>
          <Box className="profile-settings__body__notification__header">
            Email Notification
          </Box>
          <Box className="profile-settings__body__notification__text">
            Turn on email notification to get updates through email
          </Box>
        </Grid>
        <Grid item sx={{ marginLeft: "auto" }}>
          <IOSSwitch
            checked={value}
            onChange={(event) => {
              dispatch(
                handleChangeSettings("email_notification", event.target.checked)
              );
            }}
          />
        </Grid>
      </Grid>
      <Grid
        container
        rowGap={2}
        columnGap={2}
        alignItems={"center"}
        sx={{ width: "50%" }}
      >
        <Grid item>
          <NotificationsNoneIcon
            fontSize="large"
            className="profile-settings__body__notification__icon"
          />
        </Grid>
        <Grid item>
          <Box className="profile-settings__body__notification__header">
            Alarms Notification
          </Box>
          <Box className="profile-settings__body__notification__text">
            Turn on alarm notification to get updates through alarm
          </Box>
        </Grid>
        <Grid item sx={{ marginLeft: "auto" }}>
          <IOSSwitch
            checked={alarmValue}
            onChange={(event) => {
              dispatch(
                handleChangeSettings("alarm_notification", event.target.checked)
              );
            }}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default Notification;
