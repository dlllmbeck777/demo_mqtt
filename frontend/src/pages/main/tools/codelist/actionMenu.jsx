import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ActionMenu } from "../../../../components";

import {
  deleteCodeList,
  saveCodeList,
  addNewCodeListItemSchema,
  refreshDataGridCodelist,
} from "../../../../services/actions/codelist/datagrid";
import {
  setConfirmation,
  setExtraBtn,
} from "../../../../services/reducers/confirmation";
import { selectTreeViewItem } from "../../../../services/actions/treeview/treeview";
import { setIsActiveConfirmation } from "../../../../services/actions/confirmation/historyConfirmation";
import { isCreated, isDeleted } from "../../../../services/utils/permissions";
import { cleanAllValues } from "../../../../services/actions/datagrid/utils";
import resourceList from "../../../../services/api/resourceList";
import ConfirmDataGrid from "../../../../components/datagrid/confirmDG/datagrid";
const CodelistActionMenu = () => {
  const [popUpText, setPopUpText] = React.useState({});
  const CULTURE = useSelector((state) => state.lang.cultur);

  const changedRows = useSelector((state) => state.datagrid.updatedRows);
  const deletedRows = useSelector((state) => state.datagrid.deletedRows);
  const selectedIndex = useSelector(
    (state) => state.treeview.selectedItem.selectedIndex
  );
  const selectedType = useSelector((state) => state.drawerMenu.selectedItem.ID);
  const dispatch = useDispatch();

  React.useEffect(() => {
    async function asyncFunc() {
      let res = {};
      try {
        res = await resourceList.getResourcelist({
          CULTURE,
          PARENT: "POPUP",
        });
        setPopUpText(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    asyncFunc();
  }, [CULTURE]);

  const btnNew = () => {
    if (changedRows.length !== 0 || deletedRows.length !== 0) {
      dispatch(
        setConfirmation({
          title: popUpText?.filter((e) => e.ID === "TYPE.POPUP.SAVE")?.[0]
            ?.SHORT_LABEL,
          body: <ConfirmDataGrid />,
          agreefunction: async () => {
            dispatch(saveCodeList());
            dispatch(addNewCodeListItemSchema());
            dispatch(setIsActiveConfirmation(false));
          },
        })
      );
      dispatch(
        setExtraBtn({
          extraBtnText: "Don't save go",
          extrafunction: () => {
            dispatch(addNewCodeListItemSchema());
            dispatch(setIsActiveConfirmation(false));
          },
        })
      );
    } else {
      dispatch(addNewCodeListItemSchema());
    }
  };
  const save = () => {
    dispatch(
      setConfirmation({
        title: popUpText?.filter((e) => e.ID === "TYPE.POPUP.SAVE")?.[0]
          ?.SHORT_LABEL,
        body: <ConfirmDataGrid />,
        agreefunction: async () => {
          dispatch(saveCodeList());
          dispatch(setIsActiveConfirmation(false));
        },
      })
    );
  };

  const btnDelete = () => {
    dispatch(
      setConfirmation({
        title: popUpText?.filter((e) => e.ID === "TYPE.POPUP.DELETE")?.[0]
          ?.SHORT_LABEL,
        body: <ConfirmDataGrid />,
        agreefunction: () => {
          dispatch(deleteCodeList());
          dispatch(setIsActiveConfirmation(false));
        },
      })
    );
  };

  const saveGoPrev = () => {
    dispatch(selectTreeViewItem(selectedIndex - 1, "CODE", 2));
  };

  const saveGoNext = () => {
    dispatch(selectTreeViewItem(selectedIndex + 1, "CODE", 2));
  };
  const onRefreshClick = () => {
    dispatch(cleanAllValues());
    dispatch(refreshDataGridCodelist());
  };
  return (
    <ActionMenu
      dublicateIsActive={false}
      infoIsActive={false}
      btnNew={btnNew}
      save={save}
      btnDelete={btnDelete}
      saveGoPrev={saveGoPrev}
      saveGoNext={saveGoNext}
      btnNewIsDisabled={!dispatch(isCreated(selectedType))}
      btnDeleteIsDisabled={!dispatch(isDeleted(selectedType))}
      refresh={onRefreshClick}
    />
  );
};

export default CodelistActionMenu;
