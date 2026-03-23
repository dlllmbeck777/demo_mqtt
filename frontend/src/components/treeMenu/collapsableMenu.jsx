import * as React from "react";
import $ from "jquery";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import { TreeView, TreeItem } from "@mui/x-tree-view";
import Collapse from "@mui/material/Collapse";
import {
  setSelectedCollapseMenu,
  updateCollapseMenuCouch,
} from "../../services/actions/collapseMenu/collapseMenu";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CircleIcon from "@mui/icons-material/Circle";
import {
  loadTapsOverview,
  updateLayouts,
  setTapsLoaderTrue,
} from "../../services/actions/overview/taps";
import history from "../../routers/history";
import { filterMenu } from "../../services/actions/collapseMenu/collapseMenu";
import { useIsMount } from "../../hooks/useIsMount";
import ItemLinkService from "../../services/api/itemLink";
import "../../assets/styles/page/overview/collapseTreeMenu.scss";
import { updateTreeViewCouch } from "../../services/actions/treeview/treeview";
import { uuidv4 } from "../../services/utils/uuidGenerator";
import { applyFontWeight } from "../../services/actions/fontSize";
import { MenuItem, Menu } from "@mui/material";
import ItemService from "../../services/api/item";
import CodelistService from "../../services/api/codeList";
import { dateFormatter } from "../../services/utils/dateFormatter";
import TypeService from "../../services/api/type";

function MinusSquare(props) {
  return (
    <>
      <ExpandLessIcon />
      <CircleIcon className={"collapseMenuStatus"} sx={{ pr: 1 }} />
    </>
  );
}

function PlusSquare(props) {
  return (
    <>
      <ExpandMoreIcon />
      <CircleIcon className={"collapseMenuStatus"} sx={{ pr: 1 }} />
    </>
  );
}

function CloseSquare(props) {
  return (
    <>
      <CircleIcon className={"collapseMenuStatus"} />
    </>
  );
}

function TransitionComponent(props) {
  return (
    <div>
      <Collapse {...props} />
    </div>
  );
}

TransitionComponent.propTypes = {
  in: PropTypes.bool,
};

const StyledTreeItem = styled(({ status, ...props }) => {
  const isStatChange = useSelector((state) => state.tapsOverview.status);
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [subMenuAnchorEl, setSubMenuAnchorEl] = React.useState(null);
  const CULTURE = useSelector((state) => state.lang.cultur);
  const [statusState, setStatusState] = React.useState([]);
  const [currentStatus, setCurrentStatus] = React.useState({});
  const [readType, setReadType] = React.useState("");
  const openSub = Boolean(subMenuAnchorEl);
  const open = Boolean(anchorEl);
  const id = open ? `${uuidv4()}` : undefined;
  const idSub = openSub ? `${uuidv4()}` : undefined;
  const handleClick = (event) => {
    if (status) {
      event.preventDefault();
      setAnchorEl(event.currentTarget);
      setSubMenuAnchorEl(null);
    }
  };
  const handleClose = () => {
    setSubMenuAnchorEl(null);
    setAnchorEl(null);
  };

  React.useEffect(() => {
    if (status) {
      async function myFunc() {
        try {
          let itemRead = await TypeService.getItemRead(props.itemType);
          setReadType(itemRead?.data?.[0]?.TYPE);
          let res = await ItemService.hierarchStatusGet({
            ITEM_ID: props.itemId,
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
      status && myFunc();
    }
  }, [isStatChange]);
  return (
    <>
      <TreeItem
        {...props}
        TransitionComponent={TransitionComponent}
        id={`tree-item-${String(props.nodeId)}`}
        sx={{
          [`& > div > div > .collapseMenuStatus`]: {
            display: status ? "inline-block" : "none",
            color: statusState.filter(
              (e) => e.CODE === currentStatus?.CHAR1
            )?.[0]?.CHAR1,
          },
        }}
        onContextMenu={handleClick}
      />
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
                          ITEM_ID: props.itemId,
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
                      try {
                        await ItemService.hierarchStatusUpdate(body);
                        let res = await ItemService.hierarchStatusGet({
                          ITEM_ID: props.itemId,
                          EVENT_TYPE: readType,
                        });
                        setCurrentStatus(res.data);
                        dispatch({ type: "TOGGLE_STATUS" });
                      } catch (err) {
                        console.log(err);
                      }
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
    </>
  );
})(({ theme }) => ({
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  color: theme.palette.primary.main,

  [`& .MuiTreeItem-group`]: {
    marginLeft: 15,
    paddingLeft: 18,
  },
  ".MuiTreeItem-label": {
    fontSize: "1rem !important",
    lineHeight: "1.57 !important",
    letterSpacing: "0.00714em !important",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    padding: "4px",
  },

  ".mySelected": {
    backgroundColor: "rgba(33, 33, 33, 0.5) !important",
  },
  ".mySelectedNo": {
    backgroundColor: "inherit !important",
  },
}));
const MyStyledTreeItem = React.memo(({ myItems, path, location }) => {
  const dispatch = useDispatch();
  const onHandleClick = async (way, e) => {
    dispatch(setTapsLoaderTrue());
    dispatch(updateLayouts());
    dispatch(
      await setSelectedCollapseMenu({
        ...e,
        path: `${way}/${e.FROM_ITEM_NAME.replaceAll("/", "U+002F")}`,
      })
    );
    dispatch(await loadTapsOverview());
    history.push(`/${way}/${e.FROM_ITEM_NAME.replaceAll("/", "U+002F")}`);
  };
  return myItems.map((e, i) => {
    const pathname = decodeURI(location.slice(1));
    if (e.CHILD)
      return (
        <StyledTreeItem
          key={String(e.LINK_ID)}
          nodeId={String(e.LINK_ID)}
          label={e.FROM_ITEM_NAME}
          onClick={async () => {
            onHandleClick(path, e);
          }}
          status={e.ACTIVE}
          ContentProps={{
            className:
              `${path}/${e.FROM_ITEM_NAME.replaceAll("/", "U+002F")}` ===
              pathname
                ? "collapse-menu-selected"
                : "mySelectedNo",
          }}
        >
          <MyStyledTreeItem
            myItems={e.CHILD}
            path={`${path}/${e.FROM_ITEM_NAME.replaceAll("/", "U+002F")}`}
            location={location}
          ></MyStyledTreeItem>
        </StyledTreeItem>
      );
    return (
      <StyledTreeItem
        key={String(e.LINK_ID)}
        nodeId={String(e.LINK_ID)}
        label={e.FROM_ITEM_NAME}
        itemId={e.FROM_ITEM_ID}
        itemType={e.FROM_ITEM_TYPE}
        status={e.ACTIVE}
        ContentProps={{
          className:
            `${path}/${e.FROM_ITEM_NAME.replaceAll("/", "U+002F")}` === pathname
              ? "collapse-menu-selected"
              : "mySelectedNo",
        }}
        onClick={async () => {
          onHandleClick(path, e);
        }}
      ></StyledTreeItem>
    );
  });
});
function CustomizedTreeView({ onOpen, setWidthTrue }) {
  const ref = React.createRef();
  const isMount = useIsMount();
  const dispatch = useDispatch();
  const items = useSelector((state) => state.collapseMenu.filerMenu);
  const expandedItems = useSelector((state) =>
    (state.treeview.width.values.overviewHierarchy || []).map((item) =>
      String(item)
    )
  );
  const text = useSelector((state) => state.searchBar.text);
  const location = useLocation();
  const timerOnOpen = () => {
    var tempDiv = $("<div>")
      .css({
        width: "min-content",
        position: "absolute",
        left: "-9999px",
      })
      .appendTo($("body"));

    tempDiv.html($(".treemenu-container__box__element-box").html());
    var width = tempDiv.width();
    tempDiv.remove();
    if ($(".treemenu-container__box").width() < width) {
      $(".treemenu-container__box").animate({ width: width + 10 }, 400);
      dispatch(updateTreeViewCouch("overview", width + 10));
    }
  };
  const onNodeToggle = (event, nodeIds) => {
    const nextExpanded = (nodeIds || []).map((item) => String(item));
    if (nextExpanded.length > expandedItems.length) {
      setTimeout(timerOnOpen, 400);
    }
    dispatch(updateCollapseMenuCouch(nextExpanded));
  };
  React.useEffect(() => {
    applyFontWeight();
  }, [items]);
  React.useEffect(() => {
    if (!isMount) {
      const body = JSON.stringify({
        FROM_ITEM_NAME: text,
      });
      dispatch(filterMenu(text, ItemLinkService.elasticSearch, body));
    }
  }, [text]);
  React.useEffect(() => {
    dispatch(updateLayouts());
  }, []);
  return (
    <div class="treemenu-container__box__element-box__list">
      <TreeView
        aria-label="customized"
        expanded={expandedItems}
        defaultCollapseIcon={<MinusSquare />}
        defaultExpandIcon={<PlusSquare />}
        defaultEndIcon={<CloseSquare />}
        onNodeToggle={onNodeToggle}
        ref={ref}
      >
        <MyStyledTreeItem
          myItems={items}
          path={"overview"}
          location={location.pathname}
        ></MyStyledTreeItem>
      </TreeView>
    </div>
  );
}

export default React.memo(CustomizedTreeView);
