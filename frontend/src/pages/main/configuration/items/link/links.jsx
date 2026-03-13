import React from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

import { DatePicker } from "../../../../../components";

import {
  updateItemLink,
  deleteItemLink,
} from "../../../../../services/actions/item/itemLinkEditor";
import ItemLinkService from "../../../../../services/api/itemLink";
import { dateFormatter } from "../../../../../services/utils/dateFormatter";
const Links = ({ linkType, connection, refresh }) => {
  const dispatch = useDispatch();
  const [link, setLink] = React.useState([]);
  const selectedItemId = useSelector(
    (state) => state.treeview.selectedItem.ITEM_ID
  );

  async function myFunction(cancelToken) {
    const body = JSON.stringify({
      LINK_TYPE: linkType,
      [connection]: selectedItemId,
    });
    let res = await ItemLinkService.getItemLink(body, cancelToken);
    setLink(res.data);
  }
  React.useEffect(() => {
    setLink([]);

    let cancelToken;
    cancelToken = axios.CancelToken.source();
    myFunction(cancelToken);
    return () => {
      if (cancelToken) {
        cancelToken.cancel();
      }
    };
  }, [selectedItemId, refresh]);

  return link.map((a, key) => {
    const onChangeStartDateTime = (newDate) => {
      dispatch(
        updateItemLink({
          [a.LINK_ID]: {
            link_id: a.LINK_ID,
            end_datetime: a.END_DATETIME,
            start_datetime: dateFormatter(newDate),
          },
        })
      );
    };
    const onChangeEndDateTime = (newDate) => {
      dispatch(
        updateItemLink({
          [a.LINK_ID]: {
            link_id: a.LINK_ID,
            start_datetime: a.START_DATETIME,
            end_datetime: dateFormatter(newDate),
          },
        })
      );
    };
    return (
      <Grid item key={key}>
        <Grid
          container
          sx={{
            maxWidth: "278px",
            borderRadius: "5px",
            boxShadow: 2,
          }}
        >
          <Grid
            item
            xs={12}
            sx={{
              width: "278px",
              borderBottom: "1px solid white",
            }}
          >
            <IconButton
              onClick={async () => {
                let cancelToken;
                if (cancelToken) {
                  cancelToken.cancel();
                }
                const deleteFunc = async () => {
                  await deleteItemLink(a.LINK_ID);
                  cancelToken = axios.CancelToken.source();
                  myFunction(cancelToken);
                };
                dispatch({
                  type: "confirmation/setConfirmation",
                  payload: {
                    title: "Are you sure you want to delete?",
                    body: `${a.PROPERTY_STRING} it will be deleted`,
                    agreefunction: deleteFunc,
                  },
                });
              }}
            >
              <DeleteIcon sx={{ color: "text.primary" }} fontSize="small" />
            </IconButton>
          </Grid>
          <Grid item xs={6} sx={{ borderRight: "1px solid white", p: 1 }}>
            <Grid container sx={{ fontSize: "1.1rem" }}>
              <Grid item xs={12}>
                {
                  a[
                    connection !== "TO_ITEM_ID"
                      ? "TO_ITEM_TYPE"
                      : "FROM_ITEM_TYPE"
                  ]
                }
              </Grid>
              <Grid item xs={12} sx={{ fontSize: "1rem" }}>
                {a.PROPERTY_STRING}
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6} sx={{ p: 1 }}>
            <Grid container sx={{ fontSize: "1rem", color: "text.primary" }}>
              <Grid item xs={12}>
                Start:
                <DatePicker
                  value={a.START_DATETIME}
                  handleChange={onChangeStartDateTime}
                />
              </Grid>
              <Grid item xs={12}>
                End:
                <DatePicker
                  value={a.END_DATETIME}
                  handleChange={onChangeEndDateTime}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  });
};

export default React.memo(Links);
