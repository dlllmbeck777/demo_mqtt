import React from "react";
import { useDispatch, useSelector } from "react-redux";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import { Box, Grid, IconButton, Button } from "@mui/material";
import AlarmsItem from "./alarmsItem";
import resourceList from "../../../services/api/resourceList";
import "../../../assets/styles/layouts/notifications/notifications.scss";

const AlarmsBox = ({ data, allReaded, itemReaded }) => {
  const CULTURE = useSelector((state) => state.lang.cultur);
  const [value, setValue] = React.useState("unread");
  const [btnText, setBtnText] = React.useState([]);
  const handleChange = (value) => {
    setValue(value);
  };
  async function asyncGetBtnText() {
    try {
      let res = await resourceList.getResourcelist({
        CULTURE,
        PARENT: "BUTTON_TEXT",
      });
      setBtnText(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  React.useEffect(() => {
    asyncGetBtnText();
  }, [CULTURE]);
  return (
    <Box className="notification__container">
      <Grid
        container
        justifyContent={"space-between"}
        alignItems={"center"}
        className="notification__container__header"
      >
        <Grid item>
          {
            btnText?.filter((e) => e.ID === "BUTTON_TEXT_NOTIFICATIONS")?.[0]
              ?.SHORT_LABEL
          }
        </Grid>
        <Grid item>
          <IconButton
            onClick={() => {
              allReaded();
            }}
          >
            <DoneOutlineIcon />
          </IconButton>
        </Grid>
      </Grid>
      <Box className={`notification__container__header__btn-box`}>
        <Button
          className={`notification__container__header__btn-box__btn ${
            value === "all"
              ? "notification__container__header__btn-box__btn-active"
              : ""
          }`}
          onClick={() => {
            handleChange("all");
          }}
        >
          {btnText?.filter((e) => e.ID === "BUTTON_TEXT_ALL")?.[0]?.SHORT_LABEL}
        </Button>
        <Button
          className={`notification__container__header__btn-box__btn ${
            value === "unread"
              ? "notification__container__header__btn-box__btn-active"
              : ""
          }`}
          onClick={() => {
            handleChange("unread");
          }}
        >
          {
            btnText?.filter((e) => e.ID === "BUTTON_TEXT_UNREAD")?.[0]
              ?.SHORT_LABEL
          }
        </Button>
      </Box>
      {data
        .filter((a) => value === "all" || !a.is_read)

        .map((e, i) => {
          return (
            <AlarmsItem data={e} key={e.id} index={i} itemReaded={itemReaded} />
          );
        })}
    </Box>
  );
};

export default AlarmsBox;
