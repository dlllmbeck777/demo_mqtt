import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { ActionMenu } from "../../../../../components";
import { selectTreeViewItem } from "../../../../../services/actions/treeview/treeview";
import {
  deleteTag,
  saveButton,
  cleanAllTags,
  fillTagData,
} from "../../../../../services/actions/tags/tags";
import {
  isCreated,
  isUpdated,
  isDeleted,
  isNewUpdated,
} from "../../../../../services/utils/permissions";
import TagService from "../../../../../services/api/tags";
const TagsActionMenu = () => {
  const dispatch = useDispatch();
  const selectedIndex = useSelector(
    (state) => state.treeview.selectedItem.selectedIndex
  );
  const tagId = useSelector((state) => state.treeview.selectedItem.TAG_ID);
  const btnNew = () => {
    dispatch(selectTreeViewItem(-2, "new", 3));
  };
  const save = () => {
    dispatch(saveButton(TagService));
  };
  const btnDelete = () => {
    dispatch(deleteTag(TagService));
  };
  const saveGoPrev = () => {
    dispatch(selectTreeViewItem(selectedIndex - 1, "NAME", 3));
  };
  const saveGoNext = () => {
    dispatch(selectTreeViewItem(selectedIndex + 1, "NAME", 3));
  };
  const onRefreshClick = () => {
    dispatch({ type: "FILL_SAVE_VALUES_TAGS", payload: {} });
    dispatch(fillTagData(tagId, TagService));
  };
  return (
    <ActionMenu
      btnNew={btnNew}
      save={save}
      btnDelete={btnDelete}
      saveGoPrev={saveGoPrev}
      saveGoNext={saveGoNext}
      infoIsActive={false}
      dublicateIsActive={false}
      btnNewIsDisabled={!dispatch(isCreated("TAG_MANAGER"))}
      saveIsDisabled={!dispatch(isNewUpdated("TAG_MANAGER"))}
      btnDeleteIsDisabled={!dispatch(isDeleted("TAG_MANAGER"))}
      refresh={onRefreshClick}
    />
  );
};

export default TagsActionMenu;
