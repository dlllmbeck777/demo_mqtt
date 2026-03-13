import React from "react";

import { IconButton, Box } from "@mui/material";

import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import AddToPhotosOutlinedIcon from "@mui/icons-material/AddToPhotosOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import resourceList from "../../services/api/resourceList";
import { useSelector } from "react-redux";
import { MyTooltip } from "..";
const ActionIcon = (props) => {
  const defaultFunction = () => {};
  const {
    btnNew = defaultFunction,
    btnNewIsActive = true,
    btnNewIsDisabled = false,
    dublicate = defaultFunction,
    dublicateIsActive = true,
    dublicateIsDisabled = false,
    save = defaultFunction,
    saveIsActive = true,
    saveIsDisabled = false,
    btnDelete = defaultFunction,
    btnDeleteIsActive = true,
    btnDeleteIsDisabled = false,
    saveGoPrev = defaultFunction,
    saveGoPrevIsActive = true,
    saveGoPrevIsDisabled = false,
    saveGoNext = defaultFunction,
    saveGoNextIsActive = true,
    saveGoNextIsDisabled = false,
    info = defaultFunction,
    infoIsActive = true,
    infoIsDisabled = false,
    refresh = defaultFunction,
    refreshIsActive = true,
    refreshIsDisabled = false,
  } = props;
  const CULTURE = useSelector((state) => state.lang.cultur);
  const [tooltip, setTooltip] = React.useState([]);

  async function asyncGetTooltipText() {
    try {
      let res = await resourceList.getResourcelist({
        CULTURE,
        PARENT: "TOOLTIP",
      });
      setTooltip(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  React.useEffect(() => {
    asyncGetTooltipText();
  }, [CULTURE]);

  const icons = [
    {
      Icon: AddBoxOutlinedIcon,
      tooltip: "TOOLTIP_NEW",
      function: btnNew,
      isActive: btnNewIsActive,
      isDisabled: btnNewIsDisabled,
    },
    {
      Icon: AddToPhotosOutlinedIcon,
      tooltip: "TOOLTIP_DUBLICATE",
      function: dublicate,
      isActive: dublicateIsActive,
      isDisabled: dublicateIsDisabled,
    },
    {
      Icon: SaveOutlinedIcon,
      tooltip: "TOOLTIP_SAVE",
      function: save,
      isActive: saveIsActive,
      isDisabled: saveIsDisabled,
    },
    {
      Icon: DeleteOutlineIcon,
      tooltip: "TOOLTIP_DELETE",
      function: btnDelete,
      isActive: btnDeleteIsActive,
      isDisabled: btnDeleteIsDisabled,
    },
    {
      Icon: ArrowCircleLeftOutlinedIcon,
      tooltip: "TOOLTIP_SAVE_GO_PREV",
      function: saveGoPrev,
      isActive: saveGoPrevIsActive,
      isDisabled: saveGoPrevIsDisabled,
    },
    {
      Icon: ArrowCircleRightOutlinedIcon,
      tooltip: "TOOLTIP_SAVE_GO_NEXT",
      function: saveGoNext,
      isActive: saveGoNextIsActive,
      isDisabled: saveGoNextIsDisabled,
    },
    {
      Icon: InfoOutlinedIcon,
      tooltip: "TOOLTIP_INFO",
      function: info,
      isActive: infoIsActive,
      isDisabled: infoIsDisabled,
    },
    {
      Icon: RefreshIcon,
      tooltip: "TOOLTIP_REFRESH",
      function: refresh,
      isActive: refreshIsActive,
      isDisabled: refreshIsDisabled,
    },
  ];

  return (
    <Box className="action-menu-container">
      {icons.map((Element, key) => {
        if (!Element.isDisabled) {
          return (
            <MyTooltip
              key={key}
              resourceId={Element.tooltip}
              className={Element.isActive ? "" : "invisible"}
            >
              <IconButton
                onClick={() => {
                  Element.function();
                }}
              >
                <Element.Icon
                  fontSize="small"
                  className="action-menu-container__icon"
                />
              </IconButton>
            </MyTooltip>
          );
        } else {
          return (
            <IconButton disabled={true} key={key}>
              <Element.Icon fontSize="small" />
            </IconButton>
          );
        }
      })}
    </Box>
  );
};

export default ActionIcon;
