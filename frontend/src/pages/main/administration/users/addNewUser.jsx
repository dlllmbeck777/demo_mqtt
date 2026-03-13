import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, TextField } from "@mui/material";

import { useFormik } from "formik";
import * as yup from "yup";

import { FooterHelper, DialogHeaderHelper } from "../../../../components";
import { addNewUser } from "../../../../services/actions/users/users";
import resourceList from "../../../../services/api/resourceList";
import UtilsServices from "../../../../services/api/page/utils/utils";
import "../../../../assets/styles/page/administration/profile/userInfoUpdate.scss";
import RoleSelect from "../../../../components/datagrid/typeCompiler/roleSelect/main";
const AddNewUser = ({ handleClose }) => {
  const dispatch = useDispatch();
  const CULTURE = useSelector((state) => state.lang.cultur);
  const [props, setProps] = React.useState([]);
  const [header, setHeaderText] = React.useState([]);
  const validationSchema = yup.object({
    email: yup
      .string(props?.["TYPE.PAGE.LOGIN.ERROR.EMAIL"]?.SHORT_LABEL)
      .email(props?.["TYPE.PAGE.LOGIN.ERROR.EMAIL.VALID"]?.SHORT_LABEL)
      .required(props?.["TYPE.PAGE.LOGIN.ERROR.EMAIL.REQUIRED"]?.SHORT_LABEL),
  });

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      role: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      dispatch(addNewUser(values));
      handleClose();
    },
  });

  React.useEffect(() => {
    async function myFunc() {
      try {
        let res = await UtilsServices.pageText("LOGIN_SCREEN", {
          CULTURE,
          PARENT: ["LOGIN_SCREEN.SIGN_IN"],
          ID: [],
        });
        setProps(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    myFunc();
  }, [CULTURE]);
  async function asyncGetHeaderText() {
    try {
      let res = await resourceList.getResourcelist({
        CULTURE,
        PARENT: "DATAGRID_USERS",
      });
      setHeaderText(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  React.useEffect(() => {
    asyncGetHeaderText();
  }, [CULTURE]);

  return (
    <Box className="profile-update-info">
      <Box>
        <DialogHeaderHelper
          text={
            header?.filter((e) => e.ID === "DATAGRID_USERS_ADD_NEW_STAFF")?.[0]
              ?.SHORT_LABEL
          }
        />
      </Box>
      <form onSubmit={formik.handleSubmit} autoComplete="off">
        <Box className="profile-update-info__body">
          <TextField
            fullWidth
            name="first_name"
            label={
              header?.filter((e) => e.ID === "DATAGRID_USERS_NAME")?.[0]
                ?.SHORT_LABEL
            }
            value={formik.values.first_name}
            onChange={formik.handleChange}
          />
          <TextField
            fullWidth
            name="last_name"
            placeholder={
              header?.filter((e) => e.ID === "DATAGRID_USERS_SURNAME")?.[0]
                ?.SHORT_LABEL
            }
            label={
              header?.filter((e) => e.ID === "DATAGRID_USERS_SURNAME")?.[0]
                ?.SHORT_LABEL
            }
            value={formik.values.last_name}
            onChange={formik.handleChange}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            name="email"
            placeholder={
              header?.filter((e) => e.ID === "DATAGRID_USERS_EMAIL")?.[0]
                ?.SHORT_LABEL
            }
            label={
              header?.filter((e) => e.ID === "DATAGRID_USERS_EMAIL")?.[0]
                ?.SHORT_LABEL
            }
            value={formik.values.email}
            onChange={formik.handleChange}
            sx={{ mt: 2 }}
          />
          {formik.errors.email && formik.touched.email ? (
            <Box
              sx={{
                color: "#B3261E",
                position: "absolute",
                typography: "subtitle2",
                paddingBottom: "10px",
                zIndex: 2,
              }}
            >
              {formik.errors.email}
            </Box>
          ) : null}
          <RoleSelect
            name="role"
            value={formik.values.role}
            handleChange={(e) => {
              formik.setFieldValue("role", e);
            }}
            sx={{ mt: 2, width: "100%" }}
          />
        </Box>

        <Box>
          <FooterHelper handleClose={handleClose} />
        </Box>
      </form>
    </Box>
  );
};

export default AddNewUser;
