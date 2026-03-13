import React, {useState, useEffect} from "react";
import {Grid, Typography} from "@mui/material";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {Button} from "@mui/material";
import Divider from "@mui/material/Divider";
import DatePicker from "@mui/lab/DatePicker";
import {InputLabel} from "@mui/material";
import TimePicker from "@mui/lab/TimePicker";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import {makeStyles} from "@mui/styles";
import {useParams} from "react-router-dom";
import {useDispatch} from "react-redux";
import {
  updateCompany,
  deleteCompany,
} from "../../../../../redux/actions/companiesActions";
import CompaniesDataService from "../../../../../services/companies.service";
import styles from "./companyEditStyle";

const useStyles = makeStyles(styles);

function CompanyEdit(props) {
  const classes = useStyles();
  let {id} = useParams();
  const initialCompanyState = {
    id: null,
    name: "",
    short_name: "",
    accounting_id: "",
    serial_id: "",
    registry_id: "",
    contact_name: "",
    address: "",
    email: "",
    phone: "",
  };
  const [company, setCompany] = useState(initialCompanyState);
  const [value, setValue] = useState(new Date());
  const dispatch = useDispatch();

  const getCompany = (id) => {
    CompaniesDataService.get(id)
      .then((response) => {
        setCompany(response.data);
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    getCompany(id);
  }, [id]);

  const handleInputChange = (event) => {
    const {name, value} = event.target;
    setCompany({...company, [name]: value});
  };

  const updateStatus = (status) => {
    const data = {
      id: company.id,
      name: company.name,
      short_name: company.short_name,
      accounting_id: company.accounting_id,
      serial_id: company.serial_id,
      registry_id: company.registry_id,
      contact_name: company.contact_name,
      address: company.address,
      email: company.email,
      phone: company.phone,
    };

    dispatch(updateCompany(company.id, data))
      .then((response) => {
        console.log(response);

        setCompany({...company});
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const removeCompany = () => {
    dispatch(deleteCompany(company.id))
      .then(() => {
        props.history.push("/companies");
      })
      .catch((e) => {
        console.log(e);
      });
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <form className={classes.form}>
        <Grid className={classes.container}>
          <Grid container direction="row" alignItems="center">
            <Grid item className={classes.dateTime}>
              <Typography className={classes.subtitle} variant="h6">
                Datetime:
              </Typography>
              <div className={classes.dateInputs}>
                <div className={classes.dateInput}>
                  <DatePicker
                    disableFuture
                    openTo="year"
                    views={["year", "month", "day"]}
                    value={value}
                    onChange={(newValue) => {
                      setValue(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        className={classes.textFields}
                        size="small"
                        variant="outlined"
                        {...params}
                      />
                    )}
                  />
                </div>
                <div className={classes.timeInput}>
                  <TimePicker
                    ampm={false}
                    openTo="hours"
                    views={["hours", "minutes", "seconds"]}
                    inputFormat="HH:mm:ss"
                    mask="__:__:__"
                    value={value}
                    onChange={(newValue) => {
                      setValue(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        className={classes.textFields}
                        size="small"
                        variant="outlined"
                        {...params}
                      />
                    )}
                  />
                </div>
              </div>
            </Grid>
            <Grid item className={classes.endDateTime}>
              <Typography className={classes.subtitle} variant="h6">
                End Datetime:
              </Typography>
              <div className={classes.dateInputs}>
                <div className={classes.dateInput}>
                  <DatePicker
                    disableFuture
                    openTo="year"
                    views={["year", "month", "day"]}
                    value={value}
                    onChange={(newValue) => {
                      setValue(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        className={classes.textFields}
                        size="small"
                        variant="outlined"
                        {...params}
                      />
                    )}
                  />
                </div>
                <div className={classes.timeInput}>
                  <TimePicker
                    ampm={false}
                    openTo="hours"
                    views={["hours", "minutes", "seconds"]}
                    inputFormat="HH:mm:ss"
                    mask="__:__:__"
                    value={value}
                    onChange={(newValue) => {
                      setValue(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        className={classes.textFields}
                        size="small"
                        variant="outlined"
                        {...params}
                      />
                    )}
                  />
                </div>
              </div>
            </Grid>
          </Grid>
          <Divider className={classes.divider} />
          <Grid container direction="row" alignItems="center">
            <Grid item className={classes.name}>
              <TextField
                className={classes.textFields}
                label="Name"
                size="small"
                type="text"
                id="name"
                required
                value={company.name}
                onChange={handleInputChange}
                name="name"
              />
            </Grid>
            <Grid item className={classes.shortName}>
              <TextField
                className={classes.textFields}
                label="Short name"
                size="small"
                variant="outlined"
                type="text"
                id="short_name"
                required
                value={company.short_name}
                onChange={handleInputChange}
                name="short_name"
              />
            </Grid>
          </Grid>
          <Divider className={classes.divider} />
          <Grid container direction="row" alignItems="center">
            <Grid item className={classes.accounting}>
              <TextField
                className={classes.textFields}
                label="Accounting ID"
                size="small"
                type="text"
                id="accounting_id"
                value={company.accounting_id}
                onChange={handleInputChange}
                name="accounting_id"
                variant="outlined"
              />
            </Grid>
            <Divider className={classes.divider} />
            <Grid item className={classes.serial}>
              <TextField
                label="Serial ID:"
                className={classes.textFields}
                size="small"
                variant="outlined"
                id="serial_id"
                value={company.serial_id}
                onChange={handleInputChange}
                name="serial_id"
              />
            </Grid>
            <Divider className={classes.divider} />
            <Grid item className={classes.registry}>
              <TextField
                label="Registry ID:"
                className={classes.textFields}
                size="small"
                variant="outlined"
                id="registry_id"
                value={company.registry_id}
                onChange={handleInputChange}
                name="registry_id"
              />
            </Grid>
          </Grid>
          <Divider className={classes.divider} />
          <Grid container direction="row" alignItems="center">
            <Grid item className={classes.parentCompany}></Grid>
          </Grid>
          <Divider className={classes.divider} />
          <Grid container direction="row" alignItems="center">
            <Grid item className={classes.country}>
              <FormControl size="small" className={classes.controlForms}>
                <InputLabel>Country</InputLabel>
                <Select id="country"></Select>
              </FormControl>
            </Grid>
            <Divider className={classes.divider} />
            <Grid item className={classes.region}>
              <FormControl size="small" className={classes.controlForms}>
                <InputLabel>Region</InputLabel>
                <Select id="region"></Select>
              </FormControl>
            </Grid>
            <Grid item className={classes.subRegion}>
              <FormControl size="small" className={classes.controlForms}>
                <InputLabel>Subregion</InputLabel>
                <Select id="sub-region"></Select>
              </FormControl>
            </Grid>
            <Divider className={classes.divider} />
            <Grid item className={classes.city}>
              <FormControl size="small" className={classes.controlForms}>
                <InputLabel>City</InputLabel>
                <Select id="city"></Select>
              </FormControl>
            </Grid>
          </Grid>
          <Divider className={classes.divider} />
          <Grid container direction="row" alignItems="center">
            <Grid item className={classes.contactName}>
              <TextField
                className={classes.textFields}
                label="Contact name:"
                size="small"
                variant="outlined"
                type="text"
                id="contact_name"
                value={company.contact_name}
                onChange={handleInputChange}
                name="contact_name"
              />
            </Grid>
            <Grid item className={classes.address}>
              <TextField
                className={classes.textFields}
                label="Address:"
                size="small"
                variant="outlined"
                id="address"
                value={company.address}
                onChange={handleInputChange}
                name="address"
              />
            </Grid>
            <Grid item className={classes.email}>
              <TextField
                className={classes.textFields}
                label="Email:"
                size="small"
                variant="outlined"
                id="email"
                value={company.email}
                onChange={handleInputChange}
                name="email"
              />
            </Grid>
            <Grid item className={classes.phone}>
              <TextField
                className={classes.textFields}
                label="Phone:"
                size="small"
                variant="outlined"
                id="phone"
                value={company.phone}
                onChange={handleInputChange}
                name="phone"
              />
            </Grid>
          </Grid>
          <Divider className={classes.divider} />
          <Grid container>
            <Grid item className={classes.radioButtonsSecond}>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox size="small" />}
                  label={
                    <Typography className={classes.subtitle} variant="h6">
                      Operator
                    </Typography>
                  }
                />
                <FormControlLabel
                  control={<Checkbox size="small" />}
                  label={
                    <Typography className={classes.subtitle} variant="h6">
                      Owner
                    </Typography>
                  }
                />
                <FormControlLabel
                  control={<Checkbox size="small" />}
                  label={
                    <Typography className={classes.subtitle} variant="h6">
                      Purchaser
                    </Typography>
                  }
                />
                <FormControlLabel
                  control={<Checkbox size="small" />}
                  label={
                    <Typography className={classes.subtitle} variant="h6">
                      Transporter
                    </Typography>
                  }
                />
                <FormControlLabel
                  control={<Checkbox size="small" />}
                  label={
                    <Typography className={classes.subtitle} variant="h6">
                      Service Provider
                    </Typography>
                  }
                />
                <FormControlLabel
                  control={<Checkbox size="small" />}
                  label={
                    <Typography className={classes.subtitle} variant="h6">
                      Active
                    </Typography>
                  }
                />
                <FormControlLabel
                  control={<Checkbox size="small" />}
                  label={
                    <Typography className={classes.subtitle} variant="h6">
                      Operated
                    </Typography>
                  }
                />
              </FormGroup>
            </Grid>
          </Grid>
          <Divider className={classes.divider} />
          <Grid>
            <Grid item className={classes.actionsField}>
              <Button onClick={removeCompany}>DELETE</Button>
              <Button onClick={updateStatus}>EDIT</Button>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </LocalizationProvider>
  );
}

export default CompanyEdit;
