import * as React from "react";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function BasicSelect() {
  const [culture, setCulture] = React.useState("");
  const [layer, setLayer] = React.useState("");

  return (
    <Grid container columnGap={1} sx={{ m: 1 }}>
      <Grid item>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Culture</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={culture}
            label="Culture"
            onChange={(event) => {
              setCulture(event.target.value);
            }}
          >
            <MenuItem value={1}>en-Us</MenuItem>
            <MenuItem value={2}>ru-RU</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Layer</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={layer}
            label="Layer"
            onChange={(event) => {
              setLayer(event.target.value);
            }}
          >
            <MenuItem value={1}>AWM</MenuItem>
            <MenuItem value={2}>Layer2</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
}
