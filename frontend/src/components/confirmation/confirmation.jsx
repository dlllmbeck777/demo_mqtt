import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import { cleanConfirmationState } from "../../services/reducers/confirmation";
import resourceList from "../../services/api/resourceList";
export default function AlertDialog() {
  const dispatch = useDispatch();
  const CULTURE = useSelector((state) => state.lang.cultur);
  const confirmation = useSelector((state) => state.confirmation);
  const handleClose = () => {
    dispatch(cleanConfirmationState());
  };

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
      <Dialog
        open={confirmation.isOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{confirmation.title}</DialogTitle>
        <DialogContent>{confirmation.body}</DialogContent>
        <DialogActions>
          {confirmation.extraBtn ? (
            <Button
              onClick={() => {
                confirmation.extrafunction();
                handleClose();
              }}
            >
              {confirmation.extraBtnText}
            </Button>
          ) : (
            <></>
          )}
          <Button onClick={handleClose}>
            {
              btnText?.filter((e) => e.ID === "BUTTON_TEXT_CANCEL")?.[0]
                ?.SHORT_LABEL
            }
          </Button>
          <Button
            onClick={async () => {
              await confirmation.agreefunction();
              handleClose();
            }}
            autoFocus
          >
            {
              btnText?.filter((e) => e.ID === "BUTTON_TEXT_OK")?.[0]
                ?.SHORT_LABEL
            }
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
