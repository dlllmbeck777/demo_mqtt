import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { changeValeus } from "../../../../services/actions/overview/overviewDialog";
import ProfileService from "../../../../services/api/profile";
const MyListItem = ({ item }) => {
  const dispatch = useDispatch();
  const type = useSelector((state) => state.overviewDialog?.values);
  const check = useSelector(
    (state) => state.overviewDialog?.highchartProps?.[`Show ${item}`]
  );
  const handleChangeFunc = (key, val) => {
    dispatch(changeValeus(key, val));
  };
  async function myFunc() {
    let res = await ProfileService.loadProfileSettings();
    const fontSize = parseInt(res.data[0].font_size);
    handleChangeFunc(`Name Font Size(em)`, fontSize);
    handleChangeFunc(`Tag Name Font Size`, fontSize);
    handleChangeFunc(`Value Font Size`, fontSize);
    handleChangeFunc(`UoM Font Size`, fontSize);
    handleChangeFunc(`Time Stamp Font Size`, fontSize);
    handleChangeFunc(`Asset Font Size`, fontSize);
    handleChangeFunc(`Graph Axis Value Font Size (em)`, fontSize);
    handleChangeFunc(`Graph Axis Title Font Size (em)`, fontSize);
    handleChangeFunc(`Graph Legend Font Size (em)`, fontSize);
  }

  const labelId = `checkbox-list-label-${item}`;
  return (
    <ListItem key={item} disablePadding>
      <ListItemButton
        role={undefined}
        onClick={() => {
          if (item === "Default Font Size") {
            if (!check) myFunc();
          }

          handleChangeFunc(`Show ${item}`, !check);
        }}
        dense
      >
        <ListItemIcon>
          <Checkbox
            edge="start"
            checked={item === "Name" ? !check : check}
            tabIndex={-1}
            disableRipple
            inputProps={{ "aria-labelledby": labelId }}
          />
        </ListItemIcon>
        <ListItemText id={labelId} primary={type?.[`Show ${item}`]} />
      </ListItemButton>
    </ListItem>
  );
};

const MyList = ({ array = [] }) => {
  return (
    <List sx={{ paddingBottom: 0 }}>
      {array.map((value) => {
        return value && <MyListItem item={value} />;
      })}
    </List>
  );
};

export default MyList;
