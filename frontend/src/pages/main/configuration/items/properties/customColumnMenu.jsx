import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Divider, Button } from "@mui/material";

import { GridColumnMenu } from "@mui/x-data-grid-pro";
import resourceList from "../../../../../services/api/resourceList";
import { deleteColum } from "../../../../../services/actions/item/itemDataGrid";

const CustomColumnMenu = (props) => {
  const dispatch = useDispatch();
  const { hideMenu, currentColumn, ...other } = props;
  const [btnText, setBtnText] = React.useState([]);

  const CULTURE = useSelector((state) => state.lang.cultur);
  const TYPE = useSelector((state) => state.drawerMenu.selectedItem?.TYPE);
  const permission = useSelector(
    (state) => state.auth.user?.role?.PROPERTY_ID?.[TYPE]?.DELETE
  );

  const deleteColumn = () => {
    dispatch(deleteColum(currentColumn.field));
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
    <Box>
      <GridColumnMenu
        hideMenu={hideMenu}
        currentColumn={currentColumn}
        {...other}
      />
      <Divider light />
      <Button
        color="error"
        sx={{
          width: "100%",
          textTransform: "capitalize",
          pl: 2,
          display:
            !currentColumn.cellClassName.includes("myRenderCell") || !permission
              ? "none"
              : "auto",
          justifyContent: "flex-start",
        }}
        onClick={deleteColumn}
      >
        {
          btnText?.filter((e) => e.ID === "BUTTON_TEXT_DELETE_COLUMN")?.[0]
            ?.SHORT_LABEL
        }
      </Button>
    </Box>
  );
};

export default CustomColumnMenu;
