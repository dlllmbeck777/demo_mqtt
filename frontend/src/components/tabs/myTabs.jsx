import * as React from "react";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import ClearIcon from "@mui/icons-material/Clear";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Popover } from "@mui/material";
import Menu from "@mui/material/Menu";
import { useDispatch, useSelector } from "react-redux";
import TabItems from "../../layout/main/overview/tabItems";
import TabMenu from "./tabMenu";
import {
  selectTab,
  addNewTabItem,
  updateTabHeader,
  deleteTapHeader,
  dublicateDashboard,
  chageTabsSort,
  handleCopyOneTab,
  handleCopyAll,
  handlePaste,
} from "../../services/actions/overview/taps";
import { MyTextField } from "..";
import { setConfirmation } from "../../services/reducers/confirmation";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import { useIsMount } from "../../hooks/useIsMount";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import TabPanel from "./myTabPanel";
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `action-tab-${index}`,
    "aria-controls": `action-tabpanel-${index}`,
  };
}
let values = "";

const MyTap = React.forwardRef(
  ({ x, i, handleChange, active, changeElementBlocking, ...rest }, ref) => {
    const [changeText, setChangeText] = React.useState(false);
    const [loadingHeaderName, setLoadingHeaderName] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;
    const handleClick = (event) => {
      event.stopPropagation();
      event.preventDefault();
      setAnchorEl(event.currentTarget);
    };
    const dublicateDashboards = () => {
      dispatch(dublicateDashboard(x));
      handleClose();
    };

    const handleCopy = () => {
      dispatch(handleCopyOneTab(x));
      handleClose();
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    const handleCopyAllDash = () => {
      dispatch(handleCopyAll());
      handleClose();
    };
    const handlePasteDash = () => {
      dispatch(handlePaste());
      handleClose();
    };
    const dispatch = useDispatch();
    const onChange = (e) => {
      values = e;
    };
    const handleUserClick = async (e) => {
      setChangeText(false);
      setLoadingHeaderName(true);
      try {
        let res = await dispatch(updateTabHeader(x, values));
        setLoadingHeaderName(false);
      } catch {
        setLoadingHeaderName(false);
      }
    };
    const deleteTap = () => {
      dispatch(
        setConfirmation({
          title: "Are you sure you want to delete ?",
          body: <>{x} </>,
          agreefunction: () => {
            dispatch(deleteTapHeader(x));
            handleClose();
          },
        })
      );
    };
    React.useEffect(() => {
      if (changeText) {
        values = x;
        changeElementBlocking(false);
        window.addEventListener("click", handleUserClick);
      }
      return () => {
        changeElementBlocking(true);
        window.removeEventListener("click", handleUserClick);
      };
    }, [changeText]);
    if (!changeText)
      return (
        <>
          <Box
            className={`overview-container__tab-box__tab-header__tabs__item ${
              active === i
                ? "overview-container__tab-box__tab-header__tabs__item__active"
                : ""
            }`}
          >
            {loadingHeaderName ? (
              <div class="loader-container" style={{ padding: "auto" }}>
                <div class="lds-ellipsis">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
            ) : (
              <Tab
                ref={ref}
                label={`${x}`}
                {...a11yProps(i)}
                {...rest}
                className={`overview-container__tab-box__tab-header__tabs__item__text ${
                  active === i
                    ? "overview-container__tab-box__tab-header__tabs__item__active__text"
                    : ""
                }`}
                sx={{
                  width: "max-content",
                  maxWidth: "150px",
                  textTransform: "capitalize",
                  fontSize: "1rem",
                }}
                onDoubleClick={() => {
                  setChangeText(true);
                }}
                onContextMenu={handleClick}
              />
            )}
          </Box>
          <Menu
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
            }}
          >
            <TabMenu
              setChangeText={setChangeText}
              handleClose={handleClose}
              deleteTap={deleteTap}
              dublicateDashboard={dublicateDashboards}
              handleCopy={handleCopy}
              handleCopyAll={handleCopyAllDash}
              handlePaste={handlePasteDash}
              dashName={x}
            />
          </Menu>
        </>
      );
    return (
      <Box sx={{ display: "flex", alignItems: "center", maxWidth: "150px" }}>
        <MyTextField
          defaultValue={x}
          handleChangeFunc={onChange}
          autoFocus
          {...rest}
        />
      </Box>
    );
  }
);
function MyTabs() {
  const dispatch = useDispatch();
  const titles = useSelector((state) => state.tapsOverview);
  const [elementBlocking, setElementBlocking] = React.useState(true);

  const changeElementBlocking = (props) => {
    setElementBlocking(props);
  };
  const handleChange = (event, newValue) => {
    dispatch(selectTab(newValue));
  };

  const onDragEnd = (result) => {
    dispatch(chageTabsSort(result.source.index, result.destination.index));
  };
  return (
    <>
      <DragDropContext onDragEnd={onDragEnd} style={{ width: "100%" }}>
        <div style={{ display: "flex", overflow: "auto", width: "100%" }}>
          <Droppable
            droppableId="1"
            direction="horizontal"
            style={{ width: "100%" }}
          >
            {(droppableProvided) => (
              <div
                ref={droppableProvided.innerRef}
                {...droppableProvided.droppableProps}
                style={{ width: "100%" }}
              >
                <AppBar className="overview-container__tab-box__tab-header">
                  <Tabs
                    value={titles.selectedIndex}
                    onChange={handleChange}
                    aria-label="action tabs example"
                    variant="scrollable"
                    indicatorColor="none"
                    scrollButtons="auto"
                    //textColor="inherit"
                    className="overview-container__tab-box__tab-header__tabs"
                  >
                    {titles.titles.map((x, i) => {
                      return (
                        <Draggable
                          draggableId={`${i}`}
                          index={i}
                          disableInteractiveElementBlocking={elementBlocking}
                        >
                          {(draggableProvided) => (
                            <div
                              ref={draggableProvided.innerRef}
                              {...draggableProvided.draggableProps}
                            >
                              {React.cloneElement(
                                <MyTap
                                  key={`${x}`}
                                  x={x}
                                  i={i}
                                  changeElementBlocking={changeElementBlocking}
                                  active={titles.selectedIndex}
                                  onClick={() => {
                                    dispatch(selectTab(i));
                                  }}
                                ></MyTap>,
                                {
                                  ...draggableProvided.dragHandleProps,
                                  style: { cursor: "inherit" },
                                }
                              )}
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    <Grid item>
                      <IconButton
                        variant="outlined"
                        sx={{
                          maxHeight: "30px",
                          width: "30px",
                          mt: "2px",
                          //border: "1px solid #ffffff",
                        }}
                        key="a"
                        onClick={async () => {
                          await dispatch(addNewTabItem());
                        }}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Grid>
                  </Tabs>
                </AppBar>
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
      <Box className="overview-container__tab-box__tab-body">
        <SwipeableViews index={titles.selectedIndex} style={{ height: "100%" }}>
          {titles.titles.map((title, i) => {
            return (
              <TabPanel
                value={titles.selectedIndex}
                index={i}
                key={title}
                widgetname={title}
              ></TabPanel>
            );
          })}
        </SwipeableViews>
      </Box>
    </>
  );
}
export default React.memo(MyTabs);
