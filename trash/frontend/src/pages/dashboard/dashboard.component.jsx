import {makeStyles} from "@mui/styles";
import styles from "./dashboardStyle";

const useStyles = makeStyles(styles);

export default function Dashboard() {
  const classes = useStyles();
  return <div className={classes.wrapper}>Asdsad</div>;
}
