import * as React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";

export default function CheckboxList(props) {
  const {
    data,
    handleToggleFunc,
    dataTextPath = false,
    defaultData = [],
  } = props;
  const [checked, setChecked] = React.useState(defaultData);
  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    handleToggleFunc(newChecked);
    setChecked(newChecked);
  };

  return (
    <List className="check-list-container">
      {data.length === 0 ? (
        <Box className="check-list-container__no-data">No Data</Box>
      ) : (
        <></>
      )}
      {data.map((value) => {
        const labelId = `checkbox-list-label-${value}`;

        return (
          <ListItem
            key={dataTextPath ? value[dataTextPath] : value}
            disablePadding
          >
            <ListItemButton
              role={undefined}
              onClick={handleToggle(value)}
              dense
            >
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ "aria-labelledby": labelId }}
                />
              </ListItemIcon>
              <ListItemText
                id={labelId}
                primary={dataTextPath ? value[dataTextPath] : value}
              />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}
