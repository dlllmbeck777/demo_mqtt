import React from "react";
import { useDispatch } from "react-redux";

import { Box, Button } from "@mui/material";
import ComponentHeader from "./componentHeader";
import Notification from "./notification";
import Appearance from "./appearance";
import Theme from "./theme";
import Language from "./language";
import {
  handleSubmitSettings,
  loadSettings,
  cleanSettings,
} from "../../../../services/actions/profile/profile";
import "../../../../assets/styles/page/administration/profile/settings.scss";
const Settings = () => {
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(loadSettings());
    return dispatch(cleanSettings());
  }, []);
  function submit(event) {
    try {
      dispatch(handleSubmitSettings());
    } catch (err) {
      console.log(err);
    }
    event.preventDefault();
  }

  return (
    <Box className="profile-settings">
      {/* <ComponentHeader header="Settings" /> */}
      <form onSubmit={submit} autoComplete="off">
        <ComponentHeader header="Notification" />
        <Box className="profile-settings__body">
          <Notification />
        </Box>
        <ComponentHeader header="Appearance" />
        <Box className="profile-settings__body">
          <Appearance />
        </Box>
        <Box className="profile-settings__body">
          <Theme />
        </Box>
        <ComponentHeader header="Language" />
        <Box className="profile-settings__body">
          <Language />
        </Box>
        <Box
          className="profile-personal-info__body"
          sx={{ textAlign: "right" }}
        >
          <Button type="submit" variant="outlined">
            Save
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default Settings;
