import * as React from "react";

import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import Paper from "@mui/material/Paper";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import "../../assets/styles/components/dialog/dialog.scss";
function PaperComponent(props) {
  const nodeRef = React.useRef(null);
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
      nodeRef={nodeRef}
    >
      <Paper {...props} ref={nodeRef} />
    </Draggable>
  );
}

function AlertDialog({ Button, DialogBody, defaultWH = [500, 300], ...rest }) {
  const [open, setOpen] = React.useState(false);
  const nodeRef = React.useRef(null);
  const [width, setWidth] = React.useState(defaultWH[0]);
  const [height, setHeight] = React.useState(defaultWH[1]);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleResize = (event, { size }) => {
    setWidth(size.width);
    setHeight(size.height);
  };
  return (
    <Box className="dialog-container">
      <Box onClick={handleClickOpen}>{Button}</Box>

      <Dialog
        open={open}
        ref={nodeRef}
        onClose={handleClose}
        maxWidth="false"
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        PaperProps={{
          className: "dialog-container__paper",
        }}
      >
        <ResizableBox
          width={width}
          height={height}
          resizeHandles={["n", "e", "s", "w", "ne", "sw", "se", "nw"]}
          minConstraints={[50, 50]}
          maxConstraints={[window.innerWidth - 200, window.innerHeight - 200]}
          onResize={handleResize}
        >
          <DialogBody
            handleClose={handleClose}
            height={height}
            width={width}
            {...rest}
          />
        </ResizableBox>
      </Dialog>
    </Box>
  );
}

export default React.memo(AlertDialog);
