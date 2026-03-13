import React from "react";
import { setIsActiveLink } from "../../../../services/actions/item/itemLinkEditor";
import { useDispatch, useSelector } from "react-redux";
import TypeService from "../../../../services/api/type";
import { Grid } from "@mui/material";
import "../../../../assets/styles/page/tools/types/types.scss";
const LinkEditor = () => {
  const dispatch = useDispatch();
  const type = useSelector((state) => state.treeview?.selectedItem?.TYPE);
  const [body, setBody] = React.useState([]);
  React.useEffect(() => {
    dispatch(setIsActiveLink(true));
    return () => {
      dispatch(setIsActiveLink(false));
    };
  }, []);

  React.useEffect(() => {
    async function myFunc() {
      try {
        let res = await TypeService.getTransaction(type);
        setBody(res.data);
      } catch {
        setBody([]);
      }
    }
    myFunc();
  }, [type]);
  return (
    <Grid container rowGap={2} columnGap={2} className={"types-link-container"}>
      {body.map((e, i) => {
        return (
          <Grid
            item
            xs={6}
            key={i}
            className={"types-link-container__item-box"}
          >
            {e.TYPE}
          </Grid>
        );
      })}
    </Grid>
  );
};

export default LinkEditor;
