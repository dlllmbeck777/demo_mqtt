import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box } from "@mui/material";

import Cards from "../../../components/cardGenerator/cards";
import { LoadingComponent } from "../../../components";
import { setSelectedDrawerItem } from "../../../services/actions/drawerMenu/drawerMenu";
import { selectDrawerItem } from "../../../services/actions/drawerMenu/drawerMenu";
const Main = ({ way }) => {
  document.title = `Ligeia.ai | ${way}`;
  selectDrawerItem(way);
  console.log(way);
  const dispatch = useDispatch();
  const drawerData = useSelector((state) => state.drawerMenu.data);
  React.useEffect(() => {
    if (drawerData) {
      const drawerDataConfiguration = drawerData[way.toUpperCase()];
      dispatch(setSelectedDrawerItem(drawerDataConfiguration));
    }
  }, [drawerData]);
  if (drawerData) {
    const drawerDataConfiguration = drawerData[way.toUpperCase()];
    var cards = [];
    if (drawerDataConfiguration)
      Object.keys(drawerDataConfiguration.CHILD).map((e) => {
        var url = drawerDataConfiguration.CHILD[e].PATH.toLowerCase();
        url = url.replace(/ /g, "_");
        cards.push({
          cardTitle: drawerDataConfiguration.CHILD[e].SHORT_LABEL,
          cardURL: `/${way.toLowerCase()}/${url}`,
        });
      });

    return (
      <Box className="home-main">
        <Cards cards={cards} />
      </Box>
    );
  }
  return <LoadingComponent></LoadingComponent>;
};

export default Main;
