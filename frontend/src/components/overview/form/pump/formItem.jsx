import React from "react";
import { Grid } from "@mui/material";
import TextFieldCompiler from "../../../textfield/textfieldSplitter/textFieldCompiler";
const FormItem = ({ row, handleChange, value }) => {
  return (
    <Grid item xs={6} key={row.SHORT_LABEL}>
      <Grid container rowGap={0.5}>
        <Grid item xs={12}>
          {row.SHORT_LABEL}
        </Grid>
        <Grid item xs={12}>
          <TextFieldCompiler
            row={row}
            handleChange={handleChange}
            value={value}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default React.memo(FormItem);
