import React from "react";

import { Box } from "@mui/material";
import TreeView from "@mui/lab/TreeView";
import TreeItem from "@mui/lab/TreeItem";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { withStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";

import { setBreadcrumb } from "../../services/reducers/breadcrumbReducer";

const DataTreeView = ({ treeItems }) => {
  const [expanded, setExpanded] = React.useState([]);
  const [selected, setSelected] = React.useState([]);
  console.log(treeItems);
  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
  };

  const handleExpandClick = (e) => {
    e.stopPropagation();
    setExpanded((oldExpanded) => {
      console.log(oldExpanded);
      return ["1", "2", "15", "18"];
    });
  };
  const handleCollapselick = (e) => {
    e.stopPropagation();
    console.log();
    setExpanded((oldExpanded) => {
      console.log(oldExpanded);
      return [];
    });
  };

  const CreateTreeItem = ({ treeItems }) => {
    const dispatch = useDispatch();
    return (
      <TreeItem
        key={treeItems.id}
        nodeId={treeItems.id}
        label={treeItems.title}
        icon={treeItems.icon}
        sx={{
          ".MuiTreeItem-content": {
            py: 0.5,
            m: 0,
            ".MuiTreeItem-label": {
              fontSize: "14px",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            },
          },
        }}
        onClick={() => {
          dispatch(setBreadcrumb(treeItems.url));
        }}
      >
        {Object.keys(treeItems).includes("items")
          ? Object.keys(treeItems.items).map((e, key) => (
              <CreateTreeItem key={key} treeItems={treeItems.items[e]} />
            ))
          : null}
      </TreeItem>
    );
  };
  return (
    <TreeView
      aria-label="controlled"
      defaultCollapseIcon={<ExpandMoreIcon onClick={handleCollapselick} />}
      defaultExpandIcon={<ChevronRightIcon onClick={handleExpandClick} />}
      expanded={expanded}
      selected={selected}
      onNodeToggle={handleToggle}
    >
      <CreateTreeItem treeItems={treeItems[0]} />
    </TreeView>
  );
};

function App({ menu }) {
  return (
    <Box className="App" sx={{ pl: 2 }}>
      <DataTreeView treeItems={menu} />
    </Box>
  );
}

export default App;
