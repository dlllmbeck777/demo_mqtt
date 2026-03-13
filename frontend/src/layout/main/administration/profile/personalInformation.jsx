import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Select } from "../../../../components";
import { Box, TextField, Grid, Button, InputLabel } from "@mui/material";
import ComponentHeader from "./componentHeader";
import {
  handleChange,
  loadProfile,
  handleSubmit,
} from "../../../../services/actions/profile/profile";
import Helper from "./helper";
import CodelistService from "../../../../services/api/codeList";
import "../../../../assets/styles/page/administration/profile/personalInfo.scss";

const DateOfBirth = () => {
  const dispatch = useDispatch();
  const CULTURE = useSelector((state) => state.lang.cultur);
  const dayError = useSelector((state) => state.profile.errors?.birth_day);
  const monthError = useSelector((state) => state.profile.errors?.birth_month);
  const yearError = useSelector((state) => state.profile.errors?.birth_year);
  const dayValue = useSelector((state) => state.profile.values?.birth_day);
  const monthValue = useSelector((state) => state.profile.values?.birth_month);
  const yearValue = useSelector((state) => state.profile.values?.birth_year);
  const [months, setMonths] = React.useState({});
  const [days, setDays] = React.useState([]);
  const [years, setYears] = React.useState([]);
  React.useEffect(() => {
    async function myFunc() {
      const body = JSON.stringify({ CULTURE, CODE_LIST: "MONTHS" });
      let res = await CodelistService.getItemPropCode(body);
      let temp = {};
      Promise.all(
        res.data.map((e) => {
          temp = { ...temp, [e.CODE_TEXT]: parseInt(e.VAL1) };
        })
      );
      await setMonths(temp);

      const newData = new Date();
      const newYear = newData.getFullYear();

      const firstDate = new Date(newData);
      firstDate.setFullYear(newYear - 18);

      const lastDate = new Date(newData);
      lastDate.setFullYear(newYear - 100);

      const yillar = [];
      for (
        let year = firstDate.getFullYear();
        year >= lastDate.getFullYear();
        year--
      ) {
        yillar.push(year);
      }
      setYears(yillar);
    }
    myFunc();
  }, []);
  React.useEffect(() => {
    setDays(
      Array.from({ length: months?.[monthValue] }, (_, index) => index + 1)
    );
  }, [monthValue, months]);
  return (
    <Box sx={{ position: "relative" }}>
      <InputLabel
        id="Date of Birth"
        className="profile-personal-info__body__form-label"
      >
        Date of Birth
      </InputLabel>
      <Grid container columnSpacing={1}>
        <Grid item xs={4}>
          <Select
            values={Object.keys(months)}
            defaultValue={monthValue}
            fullWidth
            handleChangeFunc={(value) => {
              dispatch(handleChange("birth_month", value));
            }}
            sx={{}}
          ></Select>
          <Box
            sx={{
              color: "#B3261E",
              position: "absolute",
              paddingBottom: "10px",
            }}
          >
            {monthError}
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Select
            values={days}
            defaultValue={dayValue}
            fullWidth
            handleChangeFunc={(value) => {
              dispatch(handleChange("birth_day", value));
            }}
            sx={{}}
          ></Select>
          <Box
            sx={{
              color: "#B3261E",
              position: "absolute",
              paddingBottom: "10px",
            }}
          >
            {dayError}
          </Box>
        </Grid>

        <Grid item xs={4}>
          <Select
            values={years}
            defaultValue={yearValue}
            fullWidth
            handleChangeFunc={(value) => {
              dispatch(handleChange("birth_year", value));
            }}
            sx={{}}
          />
          <Box
            sx={{
              color: "#B3261E",
              position: "absolute",
              paddingBottom: "10px",
            }}
          >
            {yearError}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

const PhoneNumber = () => {
  const dispatch = useDispatch();
  const phone_keyError = useSelector(
    (state) => state.profile.errors?.phone_key
  );
  const phone_numberError = useSelector(
    (state) => state.profile.errors?.phone_number
  );
  const phone_keyValue = useSelector(
    (state) => state.profile.values?.phone_key
  );
  const phone_numberValue = useSelector(
    (state) => state.profile.values?.phone_number
  );
  return (
    <Box sx={{ position: "relative" }}>
      <InputLabel
        id="Date of Birth"
        className="profile-personal-info__body__form-label"
      >
        Phone Number
      </InputLabel>
      <Grid container columnSpacing={1}>
        <Grid item xs={4}>
          <TextField
            fullWidth
            placeholder={"Key"}
            value={phone_keyValue}
            onChange={(value) => {
              dispatch(handleChange("phone_key", value.target.value));
            }}
          />
          <Box
            sx={{
              color: "#B3261E",
              position: "absolute",
              paddingBottom: "10px",
            }}
          >
            {phone_keyError}
          </Box>
        </Grid>
        <Grid item xs={8}>
          <TextField
            fullWidth
            placeholder={"Phone Number"}
            value={phone_numberValue}
            onChange={(value) => {
              dispatch(handleChange("phone_number", value.target.value));
            }}
          />
          <Box
            sx={{
              color: "#B3261E",
              position: "absolute",
              paddingBottom: "10px",
            }}
          >
            {phone_numberError}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
const Country = () => {
  const dispatch = useDispatch();
  const CULTURE = useSelector((state) => state.lang.cultur);
  const error = useSelector((state) => state.profile.errors?.country);
  const value = useSelector((state) => state.profile.values?.country);
  const [values, setValues] = React.useState();
  React.useEffect(() => {
    async function myFunc() {
      const body = JSON.stringify({ CULTURE, CODE_LIST: "COUNTRY" });
      let res = await CodelistService.getItemPropCode(body);
      let temp = [];
      Promise.all(
        res.data.map((e) => {
          temp.push(e.CODE_TEXT);
        })
      );
      setValues(temp);
    }
    myFunc();
  }, []);

  return (
    <Box sx={{ position: "relative" }}>
      <InputLabel
        id="country"
        className="profile-personal-info__body__form-label"
      >
        Country
      </InputLabel>
      <Select
        values={values}
        defaultValue={value}
        fullWidth
        handleChangeFunc={(value) => {
          dispatch(handleChange("country", value));
        }}
        sx={{}}
      ></Select>
      <Box
        sx={{
          color: "#B3261E",
          position: "absolute",
          paddingBottom: "10px",
        }}
      >
        {error}
      </Box>
    </Box>
  );
};

const PersonalInformation = () => {
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(loadProfile());
  }, []);
  function submit(event) {
    try {
      dispatch(handleSubmit());
    } catch (err) {
      console.log(err);
    }
    event.preventDefault();
  }
  return (
    <Box className="profile-personal-info">
      <ComponentHeader header="Personal Imformation" />
      <form onSubmit={submit} autoComplete="off">
        <Box className="profile-personal-info__body">
          <Grid container columnSpacing={2.5} rowGap={2}>
            {["first_name", "last_name", "email"].map((e, i) => {
              return (
                <Grid item xs={6}>
                  <Helper value={e} key={i} />{" "}
                </Grid>
              );
            })}

            <Grid item xs={6}>
              <DateOfBirth />
            </Grid>
            <Grid item xs={6}>
              <PhoneNumber />
            </Grid>
            {["designation", "twitter", "facebook", "linkedin"].map((e, i) => {
              return (
                <Grid item xs={6}>
                  <Helper value={e} key={i} />{" "}
                </Grid>
              );
            })}
          </Grid>
        </Box>
        <ComponentHeader header="Address" />
        <Box className="profile-personal-info__body">
          <Grid container columnSpacing={2.5} rowGap={2}>
            <Grid item xs={12}>
              <Helper value={"address_01"} multiline minRows={3} />
            </Grid>

            <Grid item xs={6}>
              <Country />
            </Grid>
            <Grid item xs={6}>
              <Helper value={"state"} />
            </Grid>
          </Grid>
        </Box>
        <ComponentHeader header="Note" />
        <Box className="profile-personal-info__body">
          <Helper value={"note"} multiline minRows={3} />
        </Box>

        <Box
          className="profile-personal-info__body"
          sx={{ textAlign: "right" }}
        >
          <Button type="submit" variant="outlined">
            Save
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default PersonalInformation;
