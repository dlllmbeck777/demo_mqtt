import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ActionMenu } from "../../../../components";

import {
  deleteResourceList,
  saveResourceList,
  refreshDataGridResourcelist,
  addRowResourceNew,
} from "../../../../services/actions/resource/datagridResource";
import {
  setConfirmation,
  setExtraBtn,
} from "../../../../services/reducers/confirmation";
import { isCreated, isDeleted } from "../../../../services/utils/permissions";
import { selectTreeViewItem } from "../../../../services/actions/treeview/treeview";
import { setIsActiveConfirmation } from "../../../../services/actions/confirmation/historyConfirmation";
import resourceList from "../../../../services/api/resourceList";
import ConfirmDataGrid from "../../../../components/datagrid/confirmDG/datagrid";

const ResourceListActionMenu = () => {
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

  const btnNew = () => {
    if (changedRows.length !== 0 || deletedRows.length !== 0) {
      dispatch(
        setConfirmation({
          title: popUpText?.filter((e) => e.ID === "TYPE.POPUP.SAVE")?.[0]
            ?.SHORT_LABEL,
          body: <ConfirmDataGrid />,
          agreefunction: async () => {
            dispatch(saveResourceList());
            dispatch(addRowResourceNew());
            dispatch(setIsActiveConfirmation(false));
          },
        })
      );
      dispatch(
        setExtraBtn({
          extraBtnText: "Don't save go",
          extrafunction: () => {
            dispatch(addRowResourceNew());
            dispatch(setIsActiveConfirmation(false));
          },
        })
      );
    } else {
      dispatch(addRowResourceNew());
    }
  };
  const save = () => {
    dispatch(
      setConfirmation({
        title: popUpText?.filter((e) => e.ID === "TYPE.POPUP.SAVE")?.[0]
          ?.SHORT_LABEL,
        body: <ConfirmDataGrid />,
        agreefunction: async () => {
          dispatch(saveResourceList());
          dispatch(setIsActiveConfirmation(false));
        },
      })
    );
  };

  const btnDelete = () => {
    dispatch(
      setConfirmation({
        title: popUpText?.filter((e) => e.ID === "TYPE.POPUP.SAVE")?.[0]
          ?.SHORT_LABEL,
        body: <ConfirmDataGrid />,
        agreefunction: () => {
          dispatch(deleteResourceList());
          dispatch(setIsActiveConfirmation(false));
        },
      })
    );
  };

  const saveGoPrev = () => {
    dispatch(selectTreeViewItem(selectedIndex - 1, "PARENT"));
  };

  const saveGoNext = () => {
    dispatch(selectTreeViewItem(selectedIndex + 1, "PARENT"));
  };

  const handleRefresh = () => {
    dispatch(refreshDataGridResourcelist());
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
      refresh={handleRefresh}
      btnNewIsDisabled={!dispatch(isCreated(selectedType))}
      btnDeleteIsDisabled={!dispatch(isDeleted(selectedType))}
    />
  );
};

export default ResourceListActionMenu;
