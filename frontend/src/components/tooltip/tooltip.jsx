import React from "react";
import { Tooltip } from "@mui/material";
import resourceList from "../../services/api/resourceList";
import { useSelector } from "react-redux";
import "../../assets/styles/components/tooltip/tooltip.scss";
const MyTooltip = ({ resourceId, children, ...props }) => {
  const CULTURE = useSelector((state) => state.lang.cultur);
  const [title, setTitle] = React.useState("");
  async function asyncGetTooltipText() {
    try {
      let res = await resourceList.getResourcelist({
        CULTURE,
        PARENT: "TOOLTIP",
      });
      setTitle(res.data?.find((e) => e.ID === resourceId)?.SHORT_LABEL);
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <Tooltip
      title={title}
      onMouseEnter={asyncGetTooltipText}
      componentsProps={{
        tooltip: { className: "tooltip" },
      }}
      {...props}
    >
      {children}
    </Tooltip>
  );
};

export default React.memo(MyTooltip);
