import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { TreeMenuItems } from "../../../../../components";

import TagCalcService from "../../../../../services/api/tagsCalc";
import { useIsMount } from "../../../../../hooks/useIsMount";
import { filterMenu } from "../../../../../services/actions/treeview/treeview";
import { checkLastOpenItem } from "../../../../../services/actions/tags/tags";
const Menu = () => {
  const dispatch = useDispatch();
  const isMount = useIsMount();
  const text = useSelector((state) => state.searchBar.text);

  React.useEffect(() => {
    if (!isMount) {
      dispatch(filterMenu(text, TagCalcService.elasticSearch, {}));
    }
  }, [text]);
  return (
    <TreeMenuItems
      path={TagCalcService.getAll}
      textPath="NAME"
      historyPathLevel={3}
      afterLoadTreeMenu={checkLastOpenItem}
    />
  );
};

export default React.memo(Menu);
