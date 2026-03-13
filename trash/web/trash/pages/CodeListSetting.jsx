import * as React from "react";
import { useDispatch } from "react-redux";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import SettingsSuggestSharpIcon from "@mui/icons-material/SettingsSuggestSharp";
import { deleteCodeList, updateCodeList } from "../services/actions/codelist";

export default function CodeListSetting(props) {
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
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
    setLoading(false);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const onChangeFactory = (e) => {
    setCodeList({ ...codeList, [e.target.name]: e.target.value });
  };
  return (
    <Box>
      <SettingsSuggestSharpIcon
        sx={{ cursor: "pointer" }}
        onClick={handleClickOpen}
      />
      {loading ? (
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Plase Wait</DialogTitle>
          <DialogContent sx={{ textAlign: "center" }}>
            <CircularProgress />
          </DialogContent>
        </Dialog>
      ) : (
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Settings</DialogTitle>
          <DialogContent>
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
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="error"
              onClick={async () => {
                setLoading(true);
                let temp = await dispatch(updateCodeList(props.id, codeList));
                if (temp) {
                  setOpen(false);
                }
              }}
            >
              Update
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={async () => {
                setLoading(true);
                let temp = await dispatch(deleteCodeList(props.id));
                if (temp) {
                  setOpen(false);
                }
              }}
            >
              Delete
            </Button>
            <Button onClick={handleClose}>Cancel</Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}
