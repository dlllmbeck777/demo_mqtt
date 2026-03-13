import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Grid, MenuItem, Menu } from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import UserMenuItem from "./userMenuItem";
import Overview from "../../services/api/overview";
import SaveIcon from "@mui/icons-material/Save";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import GroupIcon from "@mui/icons-material/Group";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CopyAllIcon from "@mui/icons-material/CopyAll";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import { add_error } from "../../services/actions/error";
import { deleteAllTabs } from "../../services/actions/overview/taps";
const TabMenu = ({
  setChangeText,
  handleClose,
  deleteTap,
  dublicateDashboard,
  dashName,
  handleCopy,
  handleCopyAll,
  handlePaste,
}) => {
  const dispatch = useDispatch();
  const [users, setUsers] = React.useState([]);
  const dashId = useSelector(
    (state) => state.tapsOverview.widgets[dashName].ROW_ID
  );
  const body = useSelector(
    (state) => state.tapsOverview.widgets[dashName].layouts
  );
  const copy = useSelector((state) => state.tapsOverview.copy);
  const [subMenuAnchorEl, setSubMenuAnchorEl] = React.useState(null);
  const open = Boolean(subMenuAnchorEl);

  const handleSubMenuClose = () => {
    setSubMenuAnchorEl(null);
    handleClose();
  };
  const handleSave = async () => {
    try {
      let res = await Overview.layoutUpdate(body);
      dispatch(
        add_error(res.data?.status_message?.SHORT_LABEL, res.data?.status_code)
      );
    } catch (err) {
      dispatch(
        add_error(
          err?.response?.data?.status_message?.SHORT_LABEL,
          err?.response?.data?.status_code
        )
      );
      console.log(err);
    }
    handleClose();
  };
  const handleDeleteAllTabs = () => {
    dispatch(deleteAllTabs());
    handleClose();
  };
  React.useEffect(() => {
    async function myFunc() {
      let res = await Overview.dashBoardUserGet({
        ROW_ID: dashId,
      });
      setUsers(res.data);
    }

    myFunc();
  }, []);

  return (
    <>
      <MenuItem onClick={handleSave}>
        <Grid container columnSpacing={1} alignItems={"center"}>
          <Grid item>
            <SaveIcon />
          </Grid>
          <Grid item>Save</Grid>
        </Grid>
      </MenuItem>
      <MenuItem onClick={deleteTap}>
        <Grid container columnSpacing={1} alignItems={"center"}>
          <Grid item>
            <DeleteForeverIcon />
          </Grid>
          <Grid item>Delete</Grid>
        </Grid>
      </MenuItem>
      <MenuItem onClick={handleDeleteAllTabs}>
        <Grid container columnSpacing={1} alignItems={"center"}>
          <Grid item>
            <ClearAllIcon />
          </Grid>
          <Grid item>Delete All</Grid>
        </Grid>
      </MenuItem>
      <MenuItem onClick={handleCopy}>
        <Grid container columnSpacing={1} alignItems={"center"}>
          <Grid item>
            <ContentCopyIcon />
          </Grid>
          <Grid item>Copy</Grid>
        </Grid>
      </MenuItem>
      <MenuItem onClick={handleCopyAll}>
        <Grid container columnSpacing={1} alignItems={"center"}>
          <Grid item>
            <CopyAllIcon />
          </Grid>
          <Grid item>Copy All</Grid>
        </Grid>
      </MenuItem>
      {copy && (
        <MenuItem onClick={handlePaste}>
          <Grid container columnSpacing={1} alignItems={"center"}>
            <Grid item>
              <ContentPasteIcon />
            </Grid>
            <Grid item>Paste</Grid>
          </Grid>
        </MenuItem>
      )}
      <MenuItem onClick={dublicateDashboard}>
        <Grid container columnSpacing={1} alignItems={"center"}>
          <Grid item>
            <LibraryAddIcon />
          </Grid>
          <Grid item>Dublicate</Grid>
        </Grid>
      </MenuItem>

      <MenuItem
        onClick={(event) => {
          event.preventDefault();
          setSubMenuAnchorEl(event.currentTarget);
        }}
      >
        <Grid
          container
          columnSpacing={1}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Grid item>
            <GroupIcon />
          </Grid>
          <Grid item>Users</Grid>
          <Grid item>
            <KeyboardArrowRightIcon fontSize="small" />
          </Grid>
        </Grid>
        <Menu
          open={open}
          anchorEl={subMenuAnchorEl}
          onClose={handleSubMenuClose}
          anchorOrigin={{
            horizontal: "right",
          }}
        >
          {users.map((e, i) => {
            return (
              <UserMenuItem user={e} row_id={dashId} index={i}></UserMenuItem>
            );
          })}
        </Menu>
      </MenuItem>
    </>
  );
};

export default TabMenu;
