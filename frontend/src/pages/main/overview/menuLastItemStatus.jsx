import React from "react";
import CircleIcon from "@mui/icons-material/Circle";
import { MenuItem, Menu } from "@mui/material";
import TypeService from "../../../services/api/type";
import ItemService from "../../../services/api/item";
import CodelistService from "../../../services/api/codeList";
import { useDispatch, useSelector } from "react-redux";
import { uuidv4 } from "../../../services/utils/uuidGenerator";
import { dateFormatter } from "../../../services/utils/dateFormatter";
const MenuLastItemStatus = ({ item, handleClick, text }) => {
  const dispatch = useDispatch();
  const CULTURE = useSelector((state) => state.lang.cultur);
  const [readType, setReadType] = React.useState();
  const [statusState, setStatusState] = React.useState();
  const [currentStatus, setCurrentStatus] = React.useState();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [subMenuAnchorEl, setSubMenuAnchorEl] = React.useState(null);
  const openSub = Boolean(subMenuAnchorEl);
  const open = Boolean(anchorEl);
  const id = open ? `${uuidv4()}` : undefined;
  const idSub = openSub ? `${uuidv4()}` : undefined;
  const handleClose = () => {
    setSubMenuAnchorEl(null);
    setAnchorEl(null);
  };

  React.useEffect(() => {
    async function myFunc() {
      try {
        let itemRead = await TypeService.getItemRead(item?.FROM_ITEM_TYPE);
        setReadType(itemRead?.data?.[0]?.TYPE);
        let res = await ItemService.hierarchStatusGet({
          ITEM_ID: item?.FROM_ITEM_ID,
          EVENT_TYPE: itemRead?.data?.[0]?.TYPE,
        });
        const body = JSON.stringify({ CULTURE, CODE_LIST: "PUMP_STATUS" });
        let val = await CodelistService.getItemPropCode(body);
        setCurrentStatus(res.data);
        setStatusState(val.data);
      } catch (err) {
        console.log(err);
      }
    }
    myFunc();
  }, []);

  return (
    <MenuItem
      onClick={async () => {
        handleClick(item);
      }}
      onContextMenu={(event) => {
        event.preventDefault();
        setAnchorEl(event.currentTarget);
        setSubMenuAnchorEl(null);
      }}
    >
      <CircleIcon
        sx={{
          color: statusState?.filter(
            (e) => e?.CODE === currentStatus?.CHAR1
          )?.[0]?.CHAR1,
          mr: 0.5,
        }}
      />
      {text}
      <Menu
        open={open}
        id={id}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
        }}
      >
        <MenuItem
          onClick={(event) => {
            event.preventDefault();
            setSubMenuAnchorEl(event.currentTarget);
          }}
        >
          Status {">"}
          {subMenuAnchorEl && (
            <Menu
              id={idSub}
              open={openSub}
              anchorEl={subMenuAnchorEl}
              onClose={handleClose}
              anchorOrigin={{
                horizontal: "right",
              }}
            >
              {statusState.map((e, i) => {
                return (
                  <MenuItem
                    onClick={async () => {
                      const body = {
                        OLD: {
                          ROW_ID: currentStatus.ROW_ID,
                          END_DATETIME: new Date().getTime(),
                        },
                        NEW: {
                          ITEM_ID: item?.FROM_ITEM_ID,
                          EVENT_TYPE: readType,
                          PERIOD: "EVENT",
                          START_DATETIME: new Date().getTime(),
                          END_DATETIME: new Date("01.01.9000").getTime(),
                          ROW_ID: uuidv4().replace(/-/g, ""),
                          CHAR1: e.CODE,
                          LAST_UPDT_DATE: new Date().getTime(),
                        },
                      };
                      handleClose();
                      await ItemService.hierarchStatusUpdate(body);
                      let res = await ItemService.hierarchStatusGet({
                        ITEM_ID: item?.FROM_ITEM_ID,
                        EVENT_TYPE: readType,
                      });
                      setCurrentStatus(res.data);
                      dispatch({ type: "TOGGLE_STATUS" });
                    }}
                  >
                    {e?.CODE_TEXT}
                  </MenuItem>
                );
              })}
            </Menu>
          )}
        </MenuItem>
      </Menu>
    </MenuItem>
  );
};

export default MenuLastItemStatus;
