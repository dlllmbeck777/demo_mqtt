import React from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  deleteCodeList,
  putCodeList,
} from "../../../../services/api/djangoApi/codeList";
import {
  setConfirmation,
  setExtraBtn,
} from "../../../../services/reducers/confirmation";
import {
  setIndex,
  setRefreshTreeMenu,
  setRowId,
} from "../../../../services/reducers/codeListChildReducer";
import { ActionMenu } from "../../../../components";
import {
  cleanDataGridItems,
  setNewItem,
  setRefreshDataGrid,
} from "../../../../services/reducers/childCodeList";
import {
  setConfirmDataGridItems,
  cleanConfirmDataGridItems,
} from "../../../../services/reducers/confirmCodeList";
import ConfirmDataGrid from "./confirmDataGrid";
import { add_error } from "../../../../services/actions/error";
import { ConstructionTwoTone } from "@mui/icons-material";
const CodelistActionMenu = () => {
  const dispatch = useDispatch();
  const codeListChild = useSelector((state) => state.codeListChild);
  const childCodeList = useSelector((state) => state.childCodeList);
  const culture = useSelector((state) => state.lang.cultur);
  const userEmail = useSelector((state) => state.auth.user.email);
  function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
    );
  }
  const btnNew = () => {
    var uuid = uuidv4();
    dispatch(cleanDataGridItems());
    dispatch(setRowId({ rowId: uuid.replace(/-/g, "") }));
    dispatch(
      setNewItem({
        uuid: uuid.replace(/-/g, ""),
        value: {
          HIERARCHY: [`${uuid.replace(/-/g, "")}`],
          ROW_ID: uuid.replace(/-/g, ""),
          LIST_TYPE: "CODE_LIST",
          CULTURE: culture,
          CODE: "",
          CODE_TEXT: "",
          PARENT: "",
          LEGACY_CODE: "",
          VAL1: "",
          VAL2: "",
          VAL3: "",
          DATE1: "",
          DATE2: "",
          CHAR1: "",
          CHAR2: "",
          HIDDEN: "",
          LAYER_NAME: "",
          LAST_UPDT_USER: userEmail,
        },
      })
    );

    dispatch(setIndex({ index: -2 }));
  };
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
  var saveDirection = 0;
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
          console.log(childCodeList.changedItems[a]);
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
    // await Promise.all(
    //   Object.keys(childCodeList.newItems).map(async (e) => {
    //     await createPutBody(childCodeList.newItems[e]);
    //   })
    // );
    if (checkMandatoryField()) {
      var parentCode = childCodeList.dataGridItems[codeListChild.rowId].CODE;
      await Promise.all(
        Object.keys(childCodeList.dataGridItems).map(async (e) => {
          Object.keys(childCodeList.changedItems).map(async (a) => {
            if (childCodeList.changedItems[a] === e) {
              if (childCodeList.dataGridItems[e].LIST_TYPE === "CODE_LIST") {
                await createPutBody(childCodeList.dataGridItems[e]);
              } else {
                await createPutBody({
                  ...childCodeList.dataGridItems[e],
                  LIST_TYPE: parentCode,
                });
              }
            }
          });
        })
      );
      Object.keys(childCodeList.deletedItems).map(async (a) => {
        deleteCodeList(a, codeListChild.rowId);
      });
      dispatch(setRefreshTreeMenu());
      dispatch(
        setIndex({
          index: codeListChild.index + saveDirection,
        })
      );
      dispatch(setRefreshDataGrid());
      saveDirection = 0;
    } else {
      dispatch(
        add_error("Mandatory Fiels: Code, Code Text, Layer Name , Hidden")
      );
    }
    //dispatch(setCodeListItems(parentCodeList.ROW_ID));
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
            ...childCodeList.dataGridItems[childCodeList.changedItems[a]],
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
      if (saveDirection !== 0) {
        dispatch(
          setExtraBtn({
            extraBtnText: "Don't save, next",
            extrafunction: () => {
              dispatch(setRefreshTreeMenu());
              dispatch(
                setIndex({
                  index: codeListChild.index + saveDirection,
                })
              );
              dispatch(setRefreshDataGrid());
            },
          })
        );
      }
    }
  };
  const saveGoPrev = async () => {
    if (changeDetector()) {
      saveDirection = -1;
      await save();
    } else {
      dispatch(
        setIndex({
          index: codeListChild.index - 1,
        })
      );
      dispatch(setRefreshDataGrid());
    }
  };
  const saveGoNext = async () => {
    if (changeDetector()) {
      saveDirection = 1;
      await save();
    } else {
      dispatch(
        setIndex({
          index: codeListChild.index + 1,
        })
      );
      dispatch(setRefreshDataGrid());
    }
  };
  const deleteParentAgreeFunc = async () => {
    if (codeListChild.index === -2) {
      dispatch(
        setIndex({
          index: 0,
        })
      );
    } else {
      await deleteCodeList(codeListChild.rowId, codeListChild.rowId);
    }
    dispatch(setRefreshTreeMenu());
  };
  const deleteParent = async () => {
    dispatch(
      setConfirmation({
        title: "Are you sure you want to delete this code list?",
        body: "here will come the code list",
        agreefunction: deleteParentAgreeFunc,
      })
    );
  };

  return (
    <ActionMenu
      btnNew={btnNew}
      save={save}
      saveGoPrev={saveGoPrev}
      saveGoNext={saveGoNext}
      btnDelete={deleteParent}
      dublicateIsActive={false}
      infoIsActive={false}
    />
  );
};

export default CodelistActionMenu;
