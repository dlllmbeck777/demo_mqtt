import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ActionMenu } from "../../../../../components";

import { setConfirmation } from "../../../../../services/reducers/confirmation";

import { selectTreeViewItem } from "../../../../../services/actions/treeview/treeview";
import { setIsActiveConfirmation } from "../../../../../services/actions/confirmation/historyConfirmation";
import {
  loadNewRolesSchema,
  deleteRole,
  saveRole,
  loadRolesProps,
} from "../../../../../services/actions/roles/properties";
import { cleanRoles } from "../../../../../services/actions/roles/roles";
import {
  isCreated,
  isDeleted,
} from "../../../../../services/utils/permissions";
import resourceList from "../../../../../services/api/resourceList";
const PropertiesActionMenu = () => {
  const [popUpText, setPopUpText] = React.useState({});
  const CULTURE = useSelector((state) => state.lang.cultur);
  const dispatch = useDispatch();
  const selectedIndex = useSelector(
    (state) => state.treeview.selectedItem.selectedIndex
  );
  const name = useSelector((state) => state.treeview.selectedItem.ROLES_NAME);

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
    dispatch(loadNewRolesSchema());
    dispatch(selectTreeViewItem(-2, "new", 2));
  };
  const save = () => {
    dispatch(saveRole());
  };

  const btnDelete = () => {
    dispatch(
      setConfirmation({
        title: popUpText?.filter((e) => e.ID === "TYPE.POPUP.SAVE")?.[0]
          ?.SHORT_LABEL,
        body: `${name ? name : "new"}`,
        agreefunction: () => {
          dispatch(deleteRole());
          dispatch(setIsActiveConfirmation(false));
        },
      })
    );
  };

  const saveGoPrev = () => {
    dispatch(selectTreeViewItem(selectedIndex - 1, "ROLES_NAME", 2));
  };

  const saveGoNext = () => {
    dispatch(selectTreeViewItem(selectedIndex + 1, "ROLES_NAME", 2));
  };

  const onRefreshClick = () => {
    dispatch(cleanRoles());
    dispatch(loadRolesProps());
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
      refresh={onRefreshClick}
      btnNewIsDisabled={!dispatch(isCreated("ROLES"))}
      saveIsDisabled={selectedIndex === -3}
      btnDeleteIsDisabled={
        selectedIndex === -2 ||
        selectedIndex === -3 ||
        !dispatch(isDeleted("ROLES"))
      }
      saveGoNextIsDisabled={selectedIndex === -2 || selectedIndex === -3}
      saveGoPrevIsDisabled={selectedIndex === -2 || selectedIndex === -3}
    />
  );
};

export default PropertiesActionMenu;
