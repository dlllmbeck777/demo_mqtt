import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Box, Grid, Typography } from "@mui/material";
import resourceList from "../../services/api/resourceList";
import history from "../../routers/history";

const CardItems = ({ card }) => {
  const CULTURE = useSelector((state) => state.lang.cultur);
  const [btnText, setBtnText] = useState([]);
  async function asyncGetBtnText() {
    try {
      let res = await resourceList.getResourcelist({
        CULTURE,
        PARENT: "BUTTON_TEXT",
      });
      setBtnText(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  React.useEffect(() => {
    asyncGetBtnText();
  }, [CULTURE]);
  return (
    <Box
      gridColumn={{ xs: "span 12", md: "span 4" }}
      className="card-container__card-box"
      onClick={() => {
        history.push(`${card.cardURL}`);
      }}
    >
      <Grid container rowGap={2} className="card-container__card-box__body">
        <Grid item xs={12}>
          <Typography className="card-container__card-box__body__title">
            {card?.cardTitle}
          </Typography>
        </Grid>
        <Box className="card-container__card-box__body__btn-next">
          {
            btnText?.filter((e) => e.ID === "BUTTON_TEXT_NEXT")?.[0]
              ?.SHORT_LABEL
          }
        </Box>
      </Grid>
    </Box>
  );
};

export default CardItems;
