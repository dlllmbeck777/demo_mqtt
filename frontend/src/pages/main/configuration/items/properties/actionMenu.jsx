import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ActionMenu } from "../../../../../components";

import { setConfirmation } from "../../../../../services/reducers/confirmation";

import { selectTreeViewItem } from "../../../../../services/actions/treeview/treeview";
import { setIsActiveConfirmation } from "../../../../../services/actions/confirmation/historyConfirmation";
import {
  saveItem,
  deleteItem,
  cleanColumns,
  loadItemRowsDataGrid,
} from "../../../../../services/actions/item/itemDataGrid";

import {
  isCreated,
  isDeleted,
  isUpdated,
} from "../../../../../services/utils/permissions";
import resourceList from "../../../../../services/api/resourceList";
const PropertiesActionMenu = () => {
  const [popUpText, setPopUpText] = React.useState({});

  const isChanged = useSelector((state) => state.historyConfirmation.isActive);
  const CULTURE = useSelector((state) => state.lang.cultur);

  const selectedIndex = useSelector(
    (state) => state.treeview.selectedItem.selectedIndex
  );
  const name = useSelector(
    (state) => state.treeview.selectedItem?.PROPERTY_STRING
  );
  const permission = useSelector(
    (state) => state.drawerMenu.selectedItem?.TYPE
  );
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
  }, []);

  const btnNew = () => {
    dispatch(selectTreeViewItem(-2, "new", 3));
  };
  const save = () => {
    if (isChanged) {
      dispatch(
        setConfirmation({
          title: popUpText?.filter((e) => e.ID === "TYPE.POPUP.SAVE")?.[0]
            ?.SHORT_LABEL,
          body: `${name ? name : "new"}`,
          agreefunction: async () => {
            dispatch(saveItem());
            dispatch(setIsActiveConfirmation(false));
          },
        })
      );
    }
  };

  const btnDelete = () => {
    dispatch(
      setConfirmation({
        title: popUpText?.filter((e) => e.ID === "TYPE.POPUP.DELETE")?.[0]
          ?.SHORT_LABEL,
        body: `${name ? name : "new"}`,
        agreefunction: () => {
          dispatch(deleteItem());
          dispatch(setIsActiveConfirmation(false));
        },
      })
    );
  };

  const saveGoPrev = () => {
    dispatch(selectTreeViewItem(selectedIndex - 1, "PROPERTY_STRING", 3));
  };

  const saveGoNext = () => {
    dispatch(selectTreeViewItem(selectedIndex + 1, "PROPERTY_STRING", 3));
  };

  const onRefreshClick = () => {
    dispatch(cleanColumns());
    dispatch(loadItemRowsDataGrid());
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
      btnNewIsDisabled={!dispatch(isCreated(permission))}
      saveIsDisabled={
        !(
          dispatch(isCreated(permission)) ||
          dispatch(isUpdated(permission)) ||
          dispatch(isDeleted(permission))
        )
      }
      btnDeleteIsDisabled={!dispatch(isDeleted(permission))}
      refresh={onRefreshClick}
    />
  );
};

export default PropertiesActionMenu;
