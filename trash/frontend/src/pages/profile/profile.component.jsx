import {useState} from "react";
import {useSelector} from "react-redux";
import {useDispatch} from "react-redux";
import {
  
  Button,
 
  TextField,
  Grid,

} from "@mui/material";
import {updatePassword} from "../../redux/actions/profileActions";

function Profile({...others}) {
  const {user: currentUser} = useSelector((state) => state.authReducer);
  const initialPasswordState = {
    old_password: "",
    new_password1: "",
    new_password2: "",
  };
  const [password, setPassword] = useState(initialPasswordState);
  const dispatch = useDispatch();

  const handleInputChange = (event) => {
    const {name, value} = event.target;
    setPassword({...password, [name]: value});
  };

  const updateStatus = (status) => {
    const data = {
      old_password: password.old_password,
      new_password1: password.new_password1,
      new_password2: password.new_password2,
    };

    dispatch(updatePassword(data))
      .then((response) => {
        console.log(response);

        setPassword({...password});
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <form>
      <Grid container direction="row" alignItems="center">
        <Grid item>
          <TextField
            label="Old password"
            size="small"
            type="text"
            id="old_password"
            required
            value={currentUser.old_password}
            onChange={handleInputChange}
            name="old_password"
          />
        </Grid>
        <Grid item>
          <TextField
            label="New password 1"
            size="small"
            variant="outlined"
            type="text"
            id="new_password"
            required
            value={currentUser.new_password1}
            onChange={handleInputChange}
            name="new_password1"
          />
        </Grid>
        <Grid item>
          <TextField
            label="New password 2"
            size="small"
            variant="outlined"
            type="text"
            id="new_password2"
            required
            value={currentUser.new_password2}
            onChange={handleInputChange}
            name="new_password2"
          />
        </Grid>
        <Button onClick={updateStatus}>EDIT</Button>
      </Grid>
    </form>
  );
}

export default Profile;
