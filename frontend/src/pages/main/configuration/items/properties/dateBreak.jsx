import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Grid, Button } from "@mui/material";

import { DatePicker } from "../../../../../components";
import { add_error } from "../../../../../services/actions/error";
import { addNewColumn } from "../../../../../services/actions/item/itemDataGrid";
import { dateFormatter } from "../../../../../services/utils/dateFormatter";
import resourceList from "../../../../../services/api/resourceList";
const DateBreak = ({ props }) => {
  const dispatch = useDispatch();
  const [date, setDate] = React.useState(new Date().getTime());
  const usedDates = useSelector((state) => state.itemDataGrid.columns);
  const CULTURE = useSelector((state) => state.lang.cultur);
  const layer = useSelector((state) => state.auth.user.active_layer);
  const permissionType = useSelector(
    (state) => state.drawerMenu.selectedItem?.TYPE
  );
  const permission = useSelector(
    (state) => state.auth.user?.role?.PROPERTY_ID?.[permissionType]
  );

  const [btnText, setBtnText] = React.useState([]);
  async function asyncGetBtnText() {
    try {
      let res = await resourceList.getResourcelist({
        CULTURE,
        PARENT: "BUTTON_TEXT",
      });
      setBtnText(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  React.useEffect(() => {
    asyncGetBtnText();
  }, [CULTURE]);

  const checkDateBreaks = (date) => {
    var returnValue = true;
    Promise.all(
      Object.keys(usedDates).map(async (e) => {
        if (parseInt(date) === parseInt(e)) {
          returnValue = false;
          const body = JSON.stringify({
            CULTURE,
            ID: "TYPE.REACT.ITEM.TIME_RANGE_CHECK",
          });
          const res = await resourceList.getErrorMessage(layer, body);
          console.log(res);
          dispatch(add_error(res.data, 400));
        }
      })
    );
    return returnValue;
  };
  const onChange = (newValue) => {
    setDate(newValue);
  };
  return (
    <Grid
      container
      className="item-container__body__action-box__date-break__container"
    >
      <Grid item>
        <Grid
          container
          className="item-container__body__action-box__date-break__container__btn-box"
        >
          <Button
            className="item-container__body__action-box__date-break__container__btn-box__btn"
            disabled={props || !permission?.CREATE}
            onClick={() => {
              if (checkDateBreaks(date)) {
                dispatch(addNewColumn(date));
              }
            }}
          >
            {
              btnText?.filter((e) => e.ID === "BUTTON_TEXT_ADD_DATEBREAK")?.[0]
                ?.SHORT_LABEL
            }
          </Button>
          <Grid
            className="item-container__body__action-box__date-break__container__btn-box__date-picker"
            item
          >
            <DatePicker value={date} handleChange={onChange} disabled={props} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default React.memo(DateBreak);
