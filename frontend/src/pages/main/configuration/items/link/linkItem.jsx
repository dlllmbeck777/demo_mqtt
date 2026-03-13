import React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";

import Dialog from "./dialog";
import Links from "./links";
import { useDispatch, useSelector } from "react-redux";
import { refreshLinks } from "../../../../../services/actions/item/itemLinkEditor";
const LinkItem = ({ e, i, type, connection }) => {
  const dispatch = useDispatch();
  const refresh = useSelector((state) => state.itemLinkEditor.refresh);
  const refreshHandle = () => {
    dispatch(refreshLinks());
  };
  return (
    <Box key={i}>
      <Divider sx={{ backgroundColor: "primary.main" }} />
      <Box sx={{ p: 1 }}>
        <Box sx={{ mb: 1, fontSize: "14px", fontWeight: "bold" }}>
          {e.SHORT_LABEL}
        </Box>
        <Box>
          {e.TYPE === "TAG_ITEM" ? (
            <></>
          ) : (
            <Dialog data={e} type={type} refreshHandle={refreshHandle} />
          )}
        </Box>
      </Box>
      <Grid container spacing={1} sx={{ p: 1, pt: 0 }}>
        <Links linkType={e.TYPE} connection={connection} refresh={refresh} />
      </Grid>
    </Box>
  );
};

export default LinkItem;
