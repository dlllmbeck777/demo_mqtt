import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { TreeMenuItems } from "../../../../components";

import { filterMenu } from "../../../../services/actions/treeview/treeview";
import CodelistService from "../../../../services/api/codeList";
import { checkLastOpenItem } from "../../../../services/actions/codelist/datagrid";
import { useIsMount } from "../../../../hooks/useIsMount";

const Menu = () => {
  const isMount = useIsMount();
  const dispatch = useDispatch();
  const text = useSelector((state) => state.searchBar.text);
  const cultur = useSelector((state) => state.lang.cultur);
  React.useEffect(() => {
    if (!isMount) {
      const body = JSON.stringify({
        CODE_TEXT: text,
        CULTURE: cultur,
      });
      dispatch(filterMenu(text, CodelistService.elasticSearch, body));
    }
  }, [text]);

  return (
    <TreeMenuItems
      path={CodelistService.getAllTreeitem}
      textPath="CODE_TEXT"
      historyPathLevel={2}
      afterLoadTreeMenu={checkLastOpenItem}
    />
  );
};

export default React.memo(Menu);
