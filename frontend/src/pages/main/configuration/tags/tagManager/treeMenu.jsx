import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { TreeMenuItems } from "../../../../../components";

import TagService from "../../../../../services/api/tags";
import { useIsMount } from "../../../../../hooks/useIsMount";
import { filterMenu } from "../../../../../services/actions/treeview/treeview";
import { checkLastOpenItem } from "../../../../../services/actions/tags/tags";
const Menu = () => {
  const dispatch = useDispatch();
  const isMount = useIsMount();
  const text = useSelector((state) => state.searchBar.text);

  React.useEffect(() => {
    if (!isMount) {
      dispatch(filterMenu(text, TagService.elasticSearch, {}));
    }
  }, [text]);
  return (
    <TreeMenuItems
      path={TagService.getAll}
      textPath="NAME"
      historyPathLevel={3}
      afterLoadTreeMenu={checkLastOpenItem}
    />
  );
};

export default React.memo(Menu);
