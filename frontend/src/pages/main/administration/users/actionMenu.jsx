import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { Box, Tooltip, IconButton } from "@mui/material";

import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { MyDialog, MyTooltip } from "../../../../components";

import AddNewUser from "./addNewUser";
import { saveUsers, loadUsers } from "../../../../services/actions/users/users";
import { setIsActiveConfirmation } from "../../../../services/actions/confirmation/historyConfirmation";
import { setConfirmation } from "../../../../services/reducers/confirmation";
import { deleteRow } from "../../../../services/actions/datagrid/rows";
import { cleanAllValues } from "../../../../services/actions/datagrid/utils";
import resourceList from "../../../../services/api/resourceList";
import ConfirmDataGrid from "../../../../components/datagrid/confirmDG/datagrid";
import { isCreated, isDeleted } from "../../../../services/utils/permissions";

const UsersActionMenu = () => {
  const [popUpText, setPopUpText] = React.useState({});
  const CULTURE = useSelector((state) => state.lang.cultur);
  const dispatch = useDispatch();
  const isChanged = useSelector((state) => state.historyConfirmation.isActive);
  const selectedType = useSelector((state) => state.drawerMenu.selectedItem.ID);

  React.useEffect(() => {
    async function asyncFunc() {
      let res = {};
      try {
        console.log({
          CULTURE,
          PARENT: "POPUP",
        });
        res = await resourceList.getResourcelist({
          CULTURE,
          PARENT: "POPUP",
        });
        console.log(res.data);
        setPopUpText(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    asyncFunc();
  }, [CULTURE]);

  const save = () => {
    if (isChanged) {
      dispatch(
        setConfirmation({
          title: popUpText?.filter((e) => e.ID === "TYPE.POPUP.SAVE")?.[0]
            ?.SHORT_LABEL,
          body: <ConfirmDataGrid />,
          agreefunction: async () => {
            dispatch(saveUsers());
            dispatch(setIsActiveConfirmation(false));
          },
        })
      );
    }
  };
  const remove = () => {
    dispatch(deleteRow());
  };
  return (
    <Box className="action-menu-container">
      <MyDialog
        Button={
          <MyTooltip resourceId={"TOOLTIP_NEW"}>
            <Box
              onClick={(e) => {
                if (!dispatch(isCreated(selectedType))) e.stopPropagation();
              }}
            >
              <IconButton disabled={!dispatch(isCreated(selectedType))}>
                <AddBoxOutlinedIcon />
              </IconButton>
            </Box>
          </MyTooltip>
        }
        DialogBody={AddNewUser}
        defaultWH={[400, 400]}
      />
      <MyTooltip resourceId={"TOOLTIP_SAVE"}>
        <IconButton
          onClick={() => {
            save();
          }}
        >
          <SaveOutlinedIcon
            fontSize="small"
            className="action-menu-container__icon"
          />
        </IconButton>
      </MyTooltip>
      <MyTooltip resourceId={"TOOLTIP_DELETE"}>
        <IconButton
          disabled={!dispatch(isDeleted(selectedType))}
          onClick={() => {
            remove();
          }}
        >
          <DeleteOutlineIcon
            fontSize="small"
            className="action-menu-container__icon"
          />
        </IconButton>
      </MyTooltip>
      <MyTooltip resourceId={"TOOLTIP_REFRESH"}>
        <IconButton
          onClick={() => {
            dispatch(cleanAllValues());
            dispatch(loadUsers());
          }}
        >
          <RefreshIcon
            fontSize="small"
            className="action-menu-container__icon"
          />
        </IconButton>
      </MyTooltip>
    </Box>
  );
};

export default UsersActionMenu;
