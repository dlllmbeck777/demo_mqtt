import React from "react";

import { useDispatch, useSelector } from "react-redux";

import { ActionMenu } from "../../../../components";

import { selectTreeViewItem } from "../../../../services/actions/treeview/treeview";
import { setConfirmation } from "../../../../services/reducers/confirmation";
import { setIsActiveConfirmation } from "../../../../services/actions/confirmation/historyConfirmation";
import {
  deleteProject,
  saveProject,
  cleanProjectData,
  loadProject,
} from "../../../../services/actions/project/project";
import resourceList from "../../../../services/api/resourceList";
import { isCreated, isDeleted } from "../../../../services/utils/permissions";
const ProjectActionMenu = () => {
  const [popUpText, setPopUpText] = React.useState({});
  const CULTURE = useSelector((state) => state.lang.cultur);

  const isChanged = useSelector((state) => state.historyConfirmation.isActive);
  const selectedIndex = useSelector(
    (state) => state.treeview.selectedItem.selectedIndex
  );
  const name = useSelector((state) => state.treeview.selectedItem?.LAYER_NAME);
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
    dispatch(cleanProjectData());
    dispatch(selectTreeViewItem(-2, "new", 2));
  };
  const save = () => {
    if (isChanged) {
      dispatch(
        setConfirmation({
          title: popUpText?.filter((e) => e.ID === "TYPE.POPUP.SAVE")?.[0]
            ?.SHORT_LABEL,
          body: `${name ? name : "new"}`,
          agreefunction: async () => {
            dispatch(saveProject());
            dispatch(setIsActiveConfirmation(false));
          },
        })
      );
    }
  };

  const btnDelete = () => {
    dispatch(
      setConfirmation({
        title: popUpText?.filter((e) => e.ID === "TYPE.POPUP.SAVE")?.[0]
          ?.SHORT_LABEL,
        body: `${name ? name : "new"}`,
        agreefunction: () => {
          dispatch(deleteProject());
          dispatch(setIsActiveConfirmation(false));
        },
      })
    );
  };

  const saveGoPrev = () => {
    dispatch(selectTreeViewItem(selectedIndex - 1, "LAYER_NAME", 2));
  };

  const saveGoNext = () => {
    dispatch(selectTreeViewItem(selectedIndex + 1, "LAYER_NAME", 2));
  };
  const onRefreshClick = () => {
    dispatch(cleanProjectData());
    dispatch(loadProject());
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
      btnNewIsDisabled={!dispatch(isCreated(selectedType))}
      btnDeleteIsDisabled={!dispatch(isDeleted(selectedType))}
    />
  );
};

export default ProjectActionMenu;
