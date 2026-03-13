import * as React from "react";
import Button from "@mui/material/Button";
import CheckList from "./checkList";
import { Typography } from "@mui/material";
import { MyDialog } from "../../../../../components";
import resourceList from "../../../../../services/api/resourceList";
import { useSelector } from "react-redux";
export default function SimpleDialogDemo(props) {
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
    <div>
      <MyDialog
        Button={
          <Button variant="outlined">
            <Typography sx={{ color: "primary.main" }}>
              {
                btnText?.filter((e) => e.ID === "BUTTON_TEXT_NEW")?.[0]
                  ?.SHORT_LABEL
              }
            </Typography>
          </Button>
        }
        DialogBody={CheckList}
        {...props}
        defaultWH={[500, 600]}
      />
    </div>
  );
}
