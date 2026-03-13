import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import {
  setCleanConfirmation,
  setIsOpenConfirmation,
} from "../../services/actions/confirmation/historyConfirmation";

export default function AlertDialog() {
  const dispatch = useDispatch();
  const confirmation = useSelector((state) => state.historyConfirmation);
  const handleClose = () => {
    dispatch(setCleanConfirmation());
  };
  const handleCancel = () => {
    dispatch(setIsOpenConfirmation(false));
  };

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
          <Button
            onClick={() => {
              confirmation.gofunction();
              handleClose();
            }}
          >
            Don't save go
          </Button>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button
            onClick={async () => {
              if (await dispatch(confirmation.okfunction())) {
                confirmation.gofunction();
              }
              handleClose();
            }}
            autoFocus
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
