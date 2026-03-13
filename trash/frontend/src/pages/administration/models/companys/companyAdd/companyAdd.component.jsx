// import {useState} from "react";
// import {useDispatch} from "react-redux";
// import {Grid, Typography} from "@mui/material";
// import LocalizationProvider from "@mui/lab/LocalizationProvider";
// import AdapterDateFns from "@mui/lab/AdapterDateFns";
// import {Button} from "@mui/material";
// import Divider from "@mui/material/Divider";
// import DatePicker from "@mui/lab/DatePicker";
// import {InputLabel} from "@mui/material";
// import TimePicker from "@mui/lab/TimePicker";
// import FormControl from "@mui/material/FormControl";
// import Select from "@mui/material/Select";
// import TextField from "@mui/material/TextField";
// import FormGroup from "@mui/material/FormGroup";
// import FormControlLabel from "@mui/material/FormControlLabel";
// import Checkbox from "@mui/material/Checkbox";
// import {makeStyles} from "@mui/styles";
// import {createCompany} from "../../../../../redux/actions/companiesActions";
// import styles from "./companyAddStyle";

// const useStyles = makeStyles(styles);

// function CompanyAdd() {
//   const initialCompanyState = {
//     id: null,
//     name: "",
//     short_name: "",
//     active: false,
//     operated: false,
//     accounting_id: null,
//     serial_id: null,
//     registry_id: null,
//     country: null,
//     region: null,
//     subregion: null,
//     city: null,
//     contact_name: null,
//     address: null,
//     email: null,
//     phone: null,
//     operator: false,
//     owner: false,
//     purchaser: false,
//     transporter: false,
//     service: false,
//   };
//   const [company, setCompany] = useState(initialCompanyState);
//   const [submitted, setSubmitted] = useState(false);

//   const dispatch = useDispatch();

//   const handleInputChange = (event) => {
//     const {name, value} = event.target;
//     setCompany({...company, [name]: value});
//   };

//   const saveCompany = () => {
//     const {
//       name,
//       short_name,
//       active,
//       operated,
//       accounting_id,
//       serial_id,
//       registry_id,
//       country,
//       region,
//       subregion,
//       city,
//       contact_name,
//       address,
//       email,
//       phone,
//       operator,
//       owner,
//       purchaser,
//       transporter,
//       service,
//     } = company;

//     dispatch(
//       createCompany(
//         name,
//         short_name,
//         active,
//         operated,
//         accounting_id,
//         serial_id,
//         registry_id,
//         country,
//         region,
//         subregion,
//         city,
//         contact_name,
//         address,
//         email,
//         phone,
//         operator,
//         owner,
//         purchaser,
//         transporter,
//         service
//       )
//     )
//       .then((data) => {
//         setCompany({
//           id: data.id,
//           name: data.name,
//           short_name: data.short_name,
//           active: data.active,
//           operated: data.operated,
//           accounting_id: data.accounting_id,
//           serial_id: data.serial_id,
//           registry_id: data.registry_id,
//           country: data.country,
//           region: data.region,
//           subregion: data.subregion,
//           city: data.city,
//           contact_name: data.contact_name,
//           address: data.address,
//           email: data.email,
//           phone: data.phone,
//           operator: data.operator,
//           owner: data.owner,
//           purchaser: data.purchaser,
//           transporter: data.transporter,
//           service: data.serice,
//         });
//         setSubmitted(true);

//         console.log(data);
//       })
//       .catch((e) => {
//         console.log(e);
//       });
//   };

//   const newCompany = () => {
//     setCompany(initialCompanyState);
//     setSubmitted(false);
//   };

//   const [value, setValue] = useState(new Date());
//   const [country, setCountry] = useState("");
//   const [region, setRegion] = useState("");
//   const [subRegion, setSubRegion] = useState("");
//   const [city, setCity] = useState("");

//   const handleChangeCountry = (event) => {
//     setCountry(event.target.value);
//   };

//   const handleChangeRegion = (event) => {
//     setRegion(event.target.value);
//   };

//   const handleChangeSubRegion = (event) => {
//     setSubRegion(event.target.value);
//   };

//   const handleChangeCity = (event) => {
//     setCity(event.target.value);
//   };

//   const classes = useStyles();
//   return (
//     <LocalizationProvider dateAdapter={AdapterDateFns}>
//       <form className={classes.form}>
//         <Grid className={classes.container}>
//           <Grid container direction="row" alignItems="center">
//             <Grid item className={classes.dateTime}>
//               <Typography className={classes.subtitle} variant="h6">
//                 Datetime:
//               </Typography>
//               <div className={classes.dateInputs}>
//                 <div className={classes.dateInput}>
//                   <DatePicker
//                     disableFuture
//                     openTo="year"
//                     views={["year", "month", "day"]}
//                     value={value}
//                     onChange={(newValue) => {
//                       setValue(newValue);
//                     }}
//                     renderInput={(params) => (
//                       <TextField
//                         className={classes.textFields}
//                         size="small"
//                         variant="outlined"
//                         {...params}
//                       />
//                     )}
//                   />
//                 </div>
//                 <div className={classes.timeInput}>
//                   <TimePicker
//                     ampm={false}
//                     openTo="hours"
//                     views={["hours", "minutes", "seconds"]}
//                     inputFormat="HH:mm:ss"
//                     mask="__:__:__"
//                     value={value}
//                     onChange={(newValue) => {
//                       setValue(newValue);
//                     }}
//                     renderInput={(params) => (
//                       <TextField
//                         className={classes.textFields}
//                         size="small"
//                         variant="outlined"
//                         {...params}
//                       />
//                     )}
//                   />
//                 </div>
//               </div>
//             </Grid>
//             <Grid item className={classes.endDateTime}>
//               <Typography className={classes.subtitle} variant="h6">
//                 End Datetime:
//               </Typography>
//               <div className={classes.dateInputs}>
//                 <div className={classes.dateInput}>
//                   <DatePicker
//                     disableFuture
//                     openTo="year"
//                     views={["year", "month", "day"]}
//                     value={value}
//                     onChange={(newValue) => {
//                       setValue(newValue);
//                     }}
//                     renderInput={(params) => (
//                       <TextField
//                         className={classes.textFields}
//                         size="small"
//                         variant="outlined"
//                         {...params}
//                       />
//                     )}
//                   />
//                 </div>
//                 <div className={classes.timeInput}>
//                   <TimePicker
//                     ampm={false}
//                     openTo="hours"
//                     views={["hours", "minutes", "seconds"]}
//                     inputFormat="HH:mm:ss"
//                     mask="__:__:__"
//                     value={value}
//                     onChange={(newValue) => {
//                       setValue(newValue);
//                     }}
//                     renderInput={(params) => (
//                       <TextField
//                         className={classes.textFields}
//                         size="small"
//                         variant="outlined"
//                         {...params}
//                       />
//                     )}
//                   />
//                 </div>
//               </div>
//             </Grid>
//           </Grid>
//           <Divider className={classes.divider} />
//           <Grid container direction="row" alignItems="center">
//             <Grid item className={classes.name}>
//               <TextField
//                 className={classes.textFields}
//                 label="Name"
//                 size="small"
//                 type="text"
//                 id="name"
//                 required
//                 value={company.name}
//                 onChange={handleInputChange}
//                 name="name"
//               />
//             </Grid>
//             <Grid item className={classes.shortName}>
//               <TextField
//                 className={classes.textFields}
//                 label="Short name"
//                 size="small"
//                 variant="outlined"
//                 type="text"
//                 id="short_name"
//                 required
//                 value={company.short_name}
//                 onChange={handleInputChange}
//                 name="short_name"
//               />
//             </Grid>
//           </Grid>
//           <Divider className={classes.divider} />
//           <Grid container direction="row" alignItems="center">
//             <Grid item className={classes.accounting}>
//               <TextField
//                 className={classes.textFields}
//                 label="Accounting ID"
//                 size="small"
//                 type="text"
//                 id="accounting_id"
//                 value={company.accounting_id}
//                 onChange={handleInputChange}
//                 name="accounting_id"
//                 variant="outlined"
//               />
//             </Grid>
//             <Divider className={classes.divider} />
//             <Grid item className={classes.serial}>
//               <TextField
//                 label="Serial ID:"
//                 className={classes.textFields}
//                 size="small"
//                 variant="outlined"
//                 type="text"
//                 id="serial_id"
//                 value={company.serial_id}
//                 onChange={handleInputChange}
//                 name="serial_id"
//               />
//             </Grid>
//             <Divider className={classes.divider} />
//             <Grid item className={classes.registry}>
//               <TextField
//                 label="Registry ID:"
//                 className={classes.textFields}
//                 size="small"
//                 variant="outlined"
//                 type="text"
//                 id="registry_id"
//                 value={company.registry_id}
//                 onChange={handleInputChange}
//                 name="registry_id"
//               />
//             </Grid>
//           </Grid>
//           <Divider className={classes.divider} />
//           <Grid container direction="row" alignItems="center">
//             <Grid item className={classes.parentCompany}></Grid>
//           </Grid>
//           <Divider className={classes.divider} />
//           <Grid container direction="row" alignItems="center">
//             <Grid item className={classes.country}>
//               <FormControl size="small" className={classes.controlForms}>
//                 <InputLabel>Country</InputLabel>
//                 <Select
//                   id="country"
//                   value={country}
//                   label="Country"
//                   onChange={handleChangeCountry}
//                 ></Select>
//               </FormControl>
//             </Grid>
//             <Divider className={classes.divider} />
//             <Grid item className={classes.region}>
//               <FormControl size="small" className={classes.controlForms}>
//                 <InputLabel>Region</InputLabel>
//                 <Select
//                   id="region"
//                   value={region}
//                   label="Region"
//                   onChange={handleChangeRegion}
//                 ></Select>
//               </FormControl>
//             </Grid>
//             <Grid item className={classes.subRegion}>
//               <FormControl size="small" className={classes.controlForms}>
//                 <InputLabel>Subregion</InputLabel>
//                 <Select
//                   id="sub-region"
//                   value={subRegion}
//                   label="Sub-Region"
//                   onChange={handleChangeSubRegion}
//                 ></Select>
//               </FormControl>
//             </Grid>
//             <Divider className={classes.divider} />
//             <Grid item className={classes.city}>
//               <FormControl size="small" className={classes.controlForms}>
//                 <InputLabel>City</InputLabel>
//                 <Select
//                   id="city"
//                   value={city}
//                   label="City"
//                   onChange={handleChangeCity}
//                 ></Select>
//               </FormControl>
//             </Grid>
//           </Grid>
//           <Divider className={classes.divider} />
//           <Grid container direction="row" alignItems="center">
//             <Grid item className={classes.contactName}>
//               <TextField
//                 className={classes.textFields}
//                 label="Contact name:"
//                 size="small"
//                 variant="outlined"
//                 type="text"
//                 id="contact_name"
//                 value={company.contact_name}
//                 onChange={handleInputChange}
//                 name="contact_name"
//               />
//             </Grid>
//             <Grid item className={classes.address}>
//               <TextField
//                 className={classes.textFields}
//                 label="Address:"
//                 size="small"
//                 variant="outlined"
//                 type="text"
//                 id="address"
//                 value={company.address}
//                 onChange={handleInputChange}
//                 name="address"
//               />
//             </Grid>
//             <Grid item className={classes.email}>
//               <TextField
//                 className={classes.textFields}
//                 label="Email:"
//                 size="small"
//                 variant="outlined"
//                 type="text"
//                 id="email"
//                 value={company.email}
//                 onChange={handleInputChange}
//                 name="email"
//               />
//             </Grid>
//             <Grid item className={classes.phone}>
//               <TextField
//                 className={classes.textFields}
//                 label="Phone:"
//                 size="small"
//                 variant="outlined"
//                 type="text"
//                 id="phone"
//                 value={company.phone}
//                 onChange={handleInputChange}
//                 name="phone"
//               />
//             </Grid>
//           </Grid>
//           <Divider className={classes.divider} />
//           <Grid container>
//             <Grid item className={classes.radioButtonsSecond}>
//               <FormGroup>
//                 <FormControlLabel
//                   control={<Checkbox size="small" />}
//                   label={
//                     <Typography className={classes.subtitle} variant="h6">
//                       Operator
//                     </Typography>
//                   }
//                 />
//                 <FormControlLabel
//                   control={<Checkbox size="small" />}
//                   label={
//                     <Typography className={classes.subtitle} variant="h6">
//                       Owner
//                     </Typography>
//                   }
//                 />
//                 <FormControlLabel
//                   control={<Checkbox size="small" />}
//                   label={
//                     <Typography className={classes.subtitle} variant="h6">
//                       Purchaser
//                     </Typography>
//                   }
//                 />
//                 <FormControlLabel
//                   control={<Checkbox size="small" />}
//                   label={
//                     <Typography className={classes.subtitle} variant="h6">
//                       Transporter
//                     </Typography>
//                   }
//                 />
//                 <FormControlLabel
//                   control={<Checkbox size="small" />}
//                   label={
//                     <Typography className={classes.subtitle} variant="h6">
//                       Service Provider
//                     </Typography>
//                   }
//                 />
//                 <FormControlLabel
//                   control={<Checkbox size="small" />}
//                   label={
//                     <Typography className={classes.subtitle} variant="h6">
//                       Active
//                     </Typography>
//                   }
//                 />
//                 <FormControlLabel
//                   control={<Checkbox size="small" />}
//                   label={
//                     <Typography className={classes.subtitle} variant="h6">
//                       Operated
//                     </Typography>
//                   }
//                 />
//               </FormGroup>
//             </Grid>
//           </Grid>
//           <Divider className={classes.divider} />
//           <Grid>
//             <Grid item className={classes.actionsField}>
//               <Button onClick={saveCompany}>SAVE</Button>
//             </Grid>
//           </Grid>
//         </Grid>
//       </form>
//     </LocalizationProvider>
//   );
// }

// export default CompanyAdd;
import {makeStyles} from "@mui/styles";
import styles from "./companyAddStyle";
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from "@mui/material";


const useStyles = makeStyles(styles);

function CompanyAdd() {
  const classes = useStyles();

  return (
    <Grid container className={classes.container}>
      <Card className={classes.card}>
        <CardHeader
          className={classes.cardHeader}
          title={<Typography variant="subtitle1">Details</Typography>}
        />
        <CardContent className={classes.cardContent}>
          <Typography>Add company</Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}

export default CompanyAdd;
