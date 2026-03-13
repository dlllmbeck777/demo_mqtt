import React from "react";
import { Box, Typography } from "@mui/material";
import UtilsServices from "../../services/api/page/utils/utils";
import { useSelector } from "react-redux";
const Start = () => {
  const [starterText, setStarterText] = React.useState("");
  const CULTURE = useSelector((state) => state.lang.cultur);
  async function getText() {
    let res = await UtilsServices.unAuthResourceItem({
      CULTURE,
      ID: "TYPE.START_PAGE.MAIN_TEXT",
    });
    setStarterText(res.data.SHORT_LABEL);
  }
  React.useEffect(() => {
    getText();
  }, [CULTURE]);
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <Typography
        sx={{
          textAlign: "center",
          fontSize: { xs: "32px", md: "48px", xl: "63px" },
          fontWeight: "800",
          color: "#ffffff",
        }}
      >
        {starterText}
      </Typography>
    </Box>
  );
};

export default Start;
