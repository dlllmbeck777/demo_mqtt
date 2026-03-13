import React from "react";
import { useSelector } from "react-redux";
import { Grid, Button } from "@mui/material";
import resourceList from "../../services/api/resourceList";
const FooterHelper = ({ handleClose = () => {}, handleSave = () => {} }) => {
  const CULTURE = useSelector((state) => state.lang.cultur);
  const [btnText, setBtnText] = React.useState([]);
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
    <Grid
      container
      columnSpacing={0.5}
      className="dialog-container__paper__footer"
    >
      <Grid item>
        <Button
          color="inherit"
          onClick={() => {
            handleClose();
          }}
          variant="outlined"
        >
          {
            btnText?.filter((e) => e.ID === "BUTTON_TEXT_CANCEL")?.[0]
              ?.SHORT_LABEL
          }
        </Button>
      </Grid>
      <Grid item>
        <Button
          type="submit"
          color="inherit"
          onClick={() => {
            handleSave();
          }}
          variant="outlined"
        >
          {
            btnText?.filter((e) => e.ID === "BUTTON_TEXT_SAVE")?.[0]
              ?.SHORT_LABEL
          }
        </Button>
      </Grid>
    </Grid>
  );
};

export default FooterHelper;
