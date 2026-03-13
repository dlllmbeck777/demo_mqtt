import * as React from "react";
import { useDispatch } from "react-redux";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material";
import { addCodeList } from "../services/actions/codelist";

export default function AddCodeList() {
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const [codeList, setCodeList] = React.useState({
    LISTTYPE: "",
    CULTURE: "",
    CODE: "",
    CODETEXT: "",
    PARENT: "",
    LEGACYCODE: "",
    VAL1: "",
    VAL2: "",
    VAL3: "",
    VAL4: "",
    VAL5: "",
    VAL6: "",
    VAL7: "",
    VAL8: "",
    VAL9: "",
    VAL10: "",
    DATE1: "",
    DATE2: "",
    DATE3: "",
    DATE4: "",
    DATE5: "",
    CHAR1: "",
    CHAR2: "",
    CHAR3: "",
    CHAR4: "",
    CHAR5: "",
    LAYER_NAME: "",
    DESCRIPTION_ID: "",
    HIDDEN: "",
    LAST_UPDT_USER: "",
    LAST_UPDT_DATE: "",
    VERSION: "",
    DB_ID: "",
    ROW_ID: "",
    STATUS: "",
    REV_GRP_ID: "",
  });
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const onChangeFactory = (e) => {
    setCodeList({ ...codeList, [e.target.name]: e.target.value });
  };
  const onClickAddCodeList = (e) => {
    dispatch(addCodeList(codeList));
  };
  return (
    <Box sx={{ m: 2.5 }}>
      <Button variant="outlined" onClick={handleClickOpen}>
        Add a code list
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add a code list</DialogTitle>
        <DialogContent>
          <Grid container>
            <Grid item>
              {Object.keys(codeList).map((key, i) => (
                <React.Fragment key={i}>
                  <TextField
                    autoFocus
                    id={key}
                    name={key}
                    value={codeList[key]}
                    label={key}
                    fullWidth
                    variant="standard"
                    onChange={onChangeFactory}
                  />
                </React.Fragment>
              ))}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={onClickAddCodeList}>Add a code list</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
