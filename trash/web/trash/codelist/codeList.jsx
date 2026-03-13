import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  Box,
  Grid,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";

import { FixedSizeList } from "react-window";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

import {
  Breadcrumb,
  ItemSperatorLineXL,
  ComponentError,
  PropLinkTabs,
  ComponentErrorBody,
  LoadingComponent,
} from "../../../../frontend/src/components";
import DrawerMenu from "../../../../frontend/src/layout/main/asset/treeViewMenu";

import AutoSizer from "react-virtualized-auto-sizer";
import { getParentCodeList } from "../../../../frontend/src/services/api/djangoApi/codeList";
import {
  setCodeListChild,
  setIndex,
  setLastItemIndex,
  setCodeListItems,
  setRowId,
  cleanCodeListItems,
} from "../../../../frontend/src/services/reducers/codeListChildReducer";
import { setRefreshDataGrid } from "../../../../frontend/src/services/reducers/childCodeList";
import MyActionMenu from "../../../../frontend/src/pages/main/configuration/initialize/codelistActionMenu";
import DataGridPro from "./dataGridPro";
import history from "../../../../frontend/src/routers/history";

import {
  deleteCodeList,
  putCodeList,
} from "../../../../frontend/src/services/api/djangoApi/codeList";
import {
  setConfirmation,
  setExtraBtn,
} from "../../../../frontend/src/services/reducers/confirmation";
import { setRefreshTreeMenu } from "../../../../frontend/src/services/reducers/codeListChildReducer";

import {
  setConfirmDataGridItems,
  cleanConfirmDataGridItems,
} from "../../../../frontend/src/services/reducers/confirmCodeList";
import ConfirmDataGrid from "../../../../frontend/src/pages/main/configuration/initialize/confirmDataGrid";
import { add_error } from "../../../../frontend/src/services/actions/error";
function RenderRow(props) {
  const dispatch = useDispatch();
  const { data, index, style } = props;
  const selectedIndex = useSelector((state) => state.codeListChild.index);

  const codeListChild = useSelector((state) => state.codeListChild);
  const childCodeList = useSelector((state) => state.childCodeList);
  const culture = useSelector((state) => state.lang.cultur);
  const userEmail = useSelector((state) => state.auth.user.email);
  return (
    <ListItem
      style={style}
      key={index}
      component="div"
      disablePadding
      sx={{
        ".MuiButtonBase-root": {
          py: 0.5,
        },
      }}
    >
      <ListItemButton
        selected={selectedIndex === index}
        onClick={(event) => {
          const createPutBody = async (e) => {
            await putCodeList(
              e.CODE,
              e.CODE_TEXT,
              e.CULTURE,
              e.LIST_TYPE,
              e.ROW_ID,
              e.PARENT,
              e.LEGACY_CODE,
              e.VAL1,
              e.VAL2,
              e.VAL3,
              e.DATE1,
              e.DATE2,
              e.CHAR1,
              e.CHAR2,
              e.HIDDEN,
              e.LAYER_NAME,
              userEmail,
              codeListChild.rowId
            );
          };
          const checkMandatoryField = () => {
            let returnVal = true;
            Object.keys(childCodeList.newItems).map(async (e) => {
              Object.keys(childCodeList.dataGridItems).map(async (a) => {
                if (e === a) {
                  if (
                    childCodeList.dataGridItems[e].CODE_TEXT === "" ||
                    childCodeList.dataGridItems[e].CODE === "" ||
                    childCodeList.dataGridItems[e].HIDDEN === "" ||
                    childCodeList.dataGridItems[e].LAYER_NAME === ""
                  ) {
                    returnVal = false;
                  }
                }
              });
            });
            Object.keys(childCodeList.dataGridItems).map(async (e) => {
              Object.keys(childCodeList.changedItems).map(async (a) => {
                if (childCodeList.changedItems[a] === e) {
                  if (
                    childCodeList.dataGridItems[e].CODE_TEXT === "" ||
                    childCodeList.dataGridItems[e].CODE === "" ||
                    childCodeList.dataGridItems[e].HIDDEN === "" ||
                    childCodeList.dataGridItems[e].LAYER_NAME === ""
                  ) {
                    returnVal = false;
                  }
                }
              });
            });
            return returnVal;
          };
          const saveConfirmed = async () => {
            if (checkMandatoryField()) {
              // await Promise.all(
              //   Object.keys(childCodeList.newItems).map(async (e) => {
              //     await createPutBody(childCodeList.newItems[e]);
              //   })
              // );
              await Promise.all(
                Object.keys(childCodeList.dataGridItems).map(async (e) => {
                  Object.keys(childCodeList.changedItems).map(async (a) => {
                    if (childCodeList.changedItems[a] === e) {
                      await createPutBody(childCodeList.dataGridItems[e]);
                    }
                  });
                })
              );
              Object.keys(childCodeList.deletedItems).map(async (a) => {
                deleteCodeList(a, codeListChild.rowId);
              });
              dispatch(setRefreshTreeMenu());
              //dispatch(setCodeListItems(parentCodeList.ROW_ID));
              dispatch(
                setIndex({
                  index: index,
                })
              );
              dispatch(
                setCodeListChild({
                  currentChild: data[index].CODE,
                })
              );
              dispatch(setRefreshDataGrid());
            } else {
              dispatch(
                add_error(
                  "Mandatory Fiels: Code, Code Text, Layer Name , Hidden"
                )
              );
            }
          };
          const changeDetector = () => {
            var changes = 0;
            dispatch(cleanConfirmDataGridItems());
            Object.keys(childCodeList.newItems).map(async (e) => {
              dispatch(
                setConfirmDataGridItems({
                  key: e,
                  value: {
                    ...childCodeList.newItems[e],
                    requestMethod: "create",
                  },
                })
              );
              changes++;
            });
            Object.keys(childCodeList.changedItems).map(async (a) => {
              dispatch(
                setConfirmDataGridItems({
                  key: childCodeList.changedItems[a],
                  value: {
                    ...childCodeList.dataGridItems[
                    childCodeList.changedItems[a]
                    ],
                    requestMethod: "change",
                  },
                })
              );
              changes++;
            });
            Object.keys(childCodeList.deletedItems).map(async (a) => {
              dispatch(
                setConfirmDataGridItems({
                  key: a,
                  value: {
                    ...childCodeList.deletedItems[a],
                    requestMethod: "delete",
                  },
                })
              );
              changes++;
            });
            if (changes > 0) {
              return true;
            }
            return false;
          };

          const save = async () => {
            if (changeDetector()) {
              dispatch(
                setConfirmation({
                  title: "Are you sure you want to save this code list?",
                  body: <ConfirmDataGrid />,
                  agreefunction: saveConfirmed,
                })
              );
              dispatch(
                setExtraBtn({
                  extraBtnText: "Don't save, next",
                  extrafunction: () => {
                    dispatch(
                      setIndex({
                        index: index,
                      })
                    );
                    dispatch(
                      setCodeListChild({
                        currentChild: data[index].CODE,
                      })
                    );
                    dispatch(setRefreshDataGrid());
                  },
                })
              );
            } else {
              dispatch(
                setIndex({
                  index: index,
                })
              );
              dispatch(
                setCodeListChild({
                  currentChild: data[index].CODE,
                })
              );
              dispatch(setRefreshDataGrid());
            }
          };
          save();
        }}
      >
        <ListItemText
          primary={`${data[index].CODE_TEXT}`}
          sx={{
            span: {
              fontSize: "14px",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            },
          }}
        />
      </ListItemButton>
    </ListItem>
  );
}

const TreeMenuItem = () => {
  const dispatch = useDispatch();
  const codeListChild = useSelector((state) => state.codeListChild);
  const refreshTreeMenu = useSelector(
    (state) => state.codeListChild.refreshTreeMenu
  );
  const culture = useSelector((state) => state.lang.cultur);
  const isFullScreen = useSelector((state) => state.fullScreen.isFullScreen);
  const [treeItem, setTreeItem] = React.useState(false);
  React.useEffect(() => {
    const getData = async () => {
      let data = await getParentCodeList(culture);
      setTreeItem(data);
      dispatch(cleanCodeListItems());
      var c = data.data.sort((a, b) => (a.CODE_TEXT > b.CODE_TEXT ? 1 : -1));
      c.map((e) => {
        dispatch(setCodeListItems(e));
      });
      dispatch(setIndex({ index: codeListChild.index }));
      dispatch(setLastItemIndex(data.data.length));
      dispatch(setRefreshDataGrid());
      console.log("sadasd");
    };
    getData();
  }, [refreshTreeMenu]);
  React.useEffect(() => {
    history.push(`code_lists`);
  }, []);
  if (treeItem) {
    return (
      <Box
        sx={{
          height: isFullScreen
            ? "calc(100vh - 85px )"
            : "calc(100vh - 85px - 60px - 4px)",
          minHeight: "416px",
        }}
      >
        <AutoSizer>
          {({ height, width }) => (
            <FixedSizeList
              height={height}
              width={width}
              itemSize={35}
              itemCount={treeItem.data.length}
              itemData={treeItem.data.sort((a, b) =>
                a.CODE_TEXT > b.CODE_TEXT ? 1 : -1
              )}
              overscanCount={5}
            >
              {RenderRow}
            </FixedSizeList>
          )}
        </AutoSizer>
      </Box>
    );
  } else {
    return <LoadingComponent />;
  }
};

const TreeMenuItems = () => {
  return (
    <ComponentError
      errMsg={
        <ComponentErrorBody
          text="Something went wrong"
          icon={<ErrorOutlineIcon />}
        />
      }
    >
      <TreeMenuItem />
    </ComponentError>
  );
};
const CodeList = () => {
  const isFullScreen = useSelector((state) => state.fullScreen.isFullScreen);

  return (
    <Grid
      container
      sx={{
        minHeight: isFullScreen ? "100vh" : "100%",
        height: "500px",
        flexWrap: "nowrap",
      }}
    >
      <Grid item sx={{ minHeight: "500px", boxShadow: 3, mr: 0.5 }}>
        <DrawerMenu Element={<TreeMenuItems />} />
      </Grid>

      <Grid
        item
        xs={12}
        sx={{
          boxShadow: 3,
          borderRadius: "3px",
          width: "100px",
        }}
      >
        <Grid container>
          <Grid
            item
            xs={12}
            sx={{
              position: "relative",
              height: "42px",
              display: "flex",
              alignItems: "center",
              backgroundColor: "status.main",
              color: "text.primary",
              borderTopLeftRadius: "3px",
              borderTopRightRadius: "3px",
            }}
          >
            <Box sx={{ ml: 2.5 }}>
              <Breadcrumb />
            </Box>
          </Grid>
          <ItemSperatorLineXL />
          <Box sx={{ ml: 2 }}>
            <MyActionMenu />
          </Box>
          <ItemSperatorLineXL />
          <Grid item xs={12} sx={{ mt: 1 }}>
            <ComponentError errMsg="Error">
              <PropLinkTabs MyProperties={<DataGridPro />} isLinkOpen={false} />
            </ComponentError>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CodeList;
