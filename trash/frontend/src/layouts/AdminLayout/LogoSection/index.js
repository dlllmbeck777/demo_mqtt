import { Link } from 'react-router-dom';
import { ButtonBase } from '@mui/material';
import config from '../../../config';
import Logo from '../../../assets/Logo.png';


const LogoSection = () => (
    <ButtonBase disableRipple component={Link} to={config.defaultPath}>
        <img src={Logo} alt="logo" style={{ width: "50px" }} />
    </ButtonBase>
);

export default LogoSection;
