import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Grid } from "@mui/material";

import {
  Breadcrumb,
  ItemSperatorLineXL,
  ComponentError,
} from "../../../../components";
import UsersEditor from "./usersEditor";

import { loadUsers } from "../../../../services/actions/users/users";
import { selectDrawerItem } from "../../../../services/actions/drawerMenu/drawerMenu";
import "../../../../assets/styles/page/administration/users/users.scss";
import "../../../../assets/styles/layouts/template.scss";
import MyActionMenu from "./actionMenu";
import {
  setBodyConfirmation,
  setSaveFunctonConfirmation,
  setTitleConfirmation,
} from "../../../../services/actions/confirmation/historyConfirmation";
import { saveUsers } from "../../../../services/actions/users/users";
import { cleanAllValues } from "../../../../services/actions/datagrid/utils";
import resourceList from "../../../../services/api/resourceList";
import ConfirmDataGrid from "../../../../components/datagrid/confirmDG/datagrid";

const Main = () => {
  document.title = "Ligeia.ai | Users";
  selectDrawerItem("Users");
  const dispatch = useDispatch();
  const CULTURE = useSelector((state) => state.lang.cultur);
  React.useEffect(() => {
    async function asyncFunc() {
      let res = {};
      try {
        res = await resourceList.getResourcelist({
          CULTURE,
          PARENT: "POPUP",
        });
      } catch (err) {
        console.log(err);
      }

      dispatch(setSaveFunctonConfirmation(saveUsers));
      dispatch(
        setTitleConfirmation(
          res?.data?.filter((e) => e.ID === "TYPE.POPUP.SAVE")?.[0]?.SHORT_LABEL
        )
      );
      dispatch(setBodyConfirmation(<ConfirmDataGrid />));
    }
    asyncFunc();
  }, [CULTURE]);

  React.useEffect(() => {
    dispatch(loadUsers());
    return () => {
      dispatch(cleanAllValues());
    };
  }, [CULTURE]);

  return (
    <Grid container className="template-container__body users-container">
      <Breadcrumb />
      <ItemSperatorLineXL />
      <Grid container className=" template-container__body__action-box ">
        <Grid item className="template-container__body__action-box__icons">
          <ComponentError errMsg="Error">
            <MyActionMenu />
          </ComponentError>
        </Grid>
      </Grid>

      <ItemSperatorLineXL />
      <Grid
        item
        xs={12}
        className="template-container__body__property-box user-update-pop-up-body"
      >
        <ComponentError errMsg="Error">
          <UsersEditor />
        </ComponentError>
      </Grid>
    </Grid>
  );
};

export default Main;
