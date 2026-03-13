import React from "react";

import { Grid, Divider, Typography } from "@mui/material";

import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import DashboardCustomizeOutlinedIcon from "@mui/icons-material/DashboardCustomizeOutlined";
import { useDispatch, useSelector } from "react-redux";
import "../../assets/styles/layouts/proplink.scss";
import { changePage } from "../../services/actions/propLinkTap/propLinkTap";
import resourceList from "../../services/api/resourceList";
const Properties = ({
  MyProperties,
  isLinkOpen = true,
  MyLinks,
  isImportOpen = false,
  Import = <></>,
}) => {
  const dispatch = useDispatch();
  const CULTURE = useSelector((state) => state.lang.cultur);
  const [view, setView] = React.useState("Properties");
  const [btnText, setBtnText] = React.useState([]);
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
  const handleChange = (event, nextView) => {
    if (nextView) {
      setView(nextView);
      dispatch(changePage(nextView));
    }
  };
  React.useEffect(() => {
    if (view === "Properties") {
      dispatch({
        type: "SET_LINK_ACTIVE",
        payload: false,
      });
    } else {
      dispatch({
        type: "SET_LINK_ACTIVE",
        payload: true,
      });
    }
  }, [view]);
  return (
    <Grid container flexWrap={"noWrap"} className="prop-link-container">
      <Grid item className="prop-link-container__btn-group">
        <ToggleButtonGroup
          orientation="vertical"
          value={view}
          exclusive
          onChange={handleChange}
        >
          <ToggleButton
            value="Properties"
            aria-label="properties"
            className="prop-link-container__btn-group__btn"
          >
            <Typography
              variant="body2"
              className="prop-link-container__btn-group__btn__text"
            >
              <DashboardCustomizeOutlinedIcon />{" "}
              {
                btnText?.filter((e) => e.ID === "BUTTON_TEXT_PROPERTIES")?.[0]
                  ?.SHORT_LABEL
              }
            </Typography>
          </ToggleButton>
          <ToggleButton
            value="Links"
            aria-label="links"
            className={`prop-link-container__btn-group__btn ${
              isLinkOpen ? "" : "prop-link-container__btn-group__display"
            }`}
          >
            <Typography
              variant="body2"
              className="prop-link-container__btn-group__btn__text"
            >
              <DashboardCustomizeOutlinedIcon />{" "}
              {
                btnText?.filter((e) => e.ID === "BUTTON_TEXT_LINKS")?.[0]
                  ?.SHORT_LABEL
              }
            </Typography>
          </ToggleButton>
          <ToggleButton
            value="Import"
            aria-label="import"
            className={`prop-link-container__btn-group__btn ${
              isImportOpen ? "" : "prop-link-container__btn-group__display"
            }`}
          >
            <Typography
              variant="body2"
              className="prop-link-container__btn-group__btn__text"
            >
              <DashboardCustomizeOutlinedIcon />{" "}
              {
                btnText?.filter((e) => e.ID === "BUTTON_TEXT_IMPORT")?.[0]
                  ?.SHORT_LABEL
              }
            </Typography>
          </ToggleButton>
        </ToggleButtonGroup>
      </Grid>
      <Divider
        orientation="vertical"
        flexItem
        className="prop-link-container__divider"
      />
      <Grid item xs={12} className="prop-link-container__body">
        {view === "Properties" ? MyProperties : <></>}
        {view === "Links" ? MyLinks : <></>}
        {view === "Import" ? Import : <></>}
      </Grid>
    </Grid>
  );
};

export default Properties;
