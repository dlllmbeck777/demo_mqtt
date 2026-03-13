import React from "react";
import { Box } from "@mui/material";

import Cards from "../../components/cardGenerator/cards";
import { selectDrawerItem } from "../../services/actions/drawerMenu/drawerMenu";
import { useSelector } from "react-redux";
const Main = () => {
  document.title = "Ligeia.ai | Home";
  selectDrawerItem("Home");
  const cards = useSelector((state) => state?.drawerMenu?.data);
  return (
    <Box className="home-main">
      {cards && (
        <Cards
          cards={Object?.keys(cards)?.map((e) => {
            if (cards[e]?.ID !== "HOME")
              return {
                cardTitle: cards[e]?.SHORT_LABEL,
                cardURL: cards[e]?.ID,
              };
          })}
        />
      )}
    </Box>
  );
};

export default Main;
