import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, RadioGroup, Grid } from "@mui/material";
import RadioButons from "./radioButons";
import { handleChangeSettings } from "../../../../services/actions/profile/profile";
import CodelistService from "../../../../services/api/codeList";
import { Select } from "../../../../components";
const Language = () => {
  const dispatch = useDispatch();
  const language = useSelector((state) => state.profile.values?.language);
  const [langItems, setLangItems] = React.useState([]);
  React.useEffect(() => {
    const myFunc = async () => {
      try {
        let res = await CodelistService.getCultures();
        let list = [];
        Promise.all(
          res.data.Message.map((e) => {
            list.push(e.CODE_TEXT);
          })
        );
        setLangItems(list);
      } catch {}
    };
    myFunc();
    return;
  }, []);

  return (
    <>
      <Box className="profile-settings__body__appearance__header">Language</Box>
      <Box className="profile-settings__body__appearance__text">
        Select application language
      </Box>
      <Select
        values={langItems}
        defaultValue={language}
        fullWidth
        handleChangeFunc={(value) => {
          dispatch(handleChangeSettings("language", value));
        }}
        sx={{ width: "50%", mt: 1 }}
      />
    </>
  );
};

export default Language;
