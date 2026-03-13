import React from "react";

import { useDispatch, useSelector } from "react-redux";

import { ActionMenu } from "../../../../components";

import { selectTreeViewItem } from "../../../../services/actions/treeview/treeview";
import { setConfirmation } from "../../../../services/reducers/confirmation";
import { setIsActiveConfirmation } from "../../../../services/actions/confirmation/historyConfirmation";
import { saveUom, loadDataGrid } from "../../../../services/actions/uom/uom";
import { cleanAllValues } from "../../../../services/actions/datagrid/utils";
import resourceList from "../../../../services/api/resourceList";
import ConfirmDataGrid from "../../../../components/datagrid/confirmDG/datagrid";
import { isCreated, isDeleted } from "../../../../services/utils/permissions";
const UomActionMenu = () => {
  const dispatch = useDispatch();

  const [popUpText, setPopUpText] = React.useState({});
  const CULTURE = useSelector((state) => state.lang.cultur);

  const selectedIndex = useSelector(
    (state) => state.treeview?.selectedItem?.selectedIndex
  );
  const isChanged = useSelector((state) => state.historyConfirmation.isActive);
  const name = useSelector(
    (state) => state.treeview.selectedItem?.QUANTITY_TYPE
  );
  const selectedType = useSelector((state) => state.drawerMenu.selectedItem.ID);

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

  const save = () => {
    if (isChanged) {
      dispatch(
        setConfirmation({
          title: popUpText?.filter((e) => e.ID === "TYPE.POPUP.SAVE")?.[0]
            ?.SHORT_LABEL,
          body: <ConfirmDataGrid />,
          agreefunction: async () => {
            dispatch(saveUom());
            dispatch(setIsActiveConfirmation(false));
          },
        })
      );
    }
  };

  const saveGoPrev = () => {
    dispatch(selectTreeViewItem(selectedIndex - 1, "QUANTITY_TYPE", 2));
  };

  const saveGoNext = () => {
    dispatch(selectTreeViewItem(selectedIndex + 1, "QUANTITY_TYPE", 2));
  };
  const onRefreshClick = () => {
    dispatch(cleanAllValues());
    dispatch(loadDataGrid(name));
  };

  return (
    <ActionMenu
      dublicateIsActive={false}
      infoIsActive={false}
      btnNewIsActive={false}
      btnDeleteIsActive={false}
      save={save}
      saveGoPrev={saveGoPrev}
      saveGoNext={saveGoNext}
      refresh={onRefreshClick}
    />
  );
};

export default UomActionMenu;
