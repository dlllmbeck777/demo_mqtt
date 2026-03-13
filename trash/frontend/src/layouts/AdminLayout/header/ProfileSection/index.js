
import { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from '@mui/material/styles';
import { Navigate } from "react-router-dom";
import { Button,} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import { logout } from "../../../../redux/actions/authActions";
import { clearMessage } from "../../../../redux/actions/messageActions";
import { history } from "../../../../services/history";
import { Link } from "react-router-dom";


const ProfileSection = () => {
    const { user: currentUser } = useSelector((state) => state.authReducer);
    const dispatch = useDispatch();

    useEffect(() => {
        history.listen((location) => {
            dispatch(clearMessage()); // clear message when changing location
        });
    }, [dispatch]);

    const logOut = useCallback(() => {
        dispatch(logout());
    }, [dispatch]);

    const theme = useTheme()
    const anchorRef = useRef(null);

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    if (!currentUser) {
        return <Navigate to="/" />;
    }

    return (
        <>
            <Typography variant="h5">{currentUser.user.first_name} {currentUser.user.last_name}</Typography>
            <Button onClick={handleClick}>
                <Avatar
                    sx={{
                        ...theme.typography.mediumAvatar,

                        cursor: 'pointer'
                    }}
                    ref={anchorRef}
                    aria-haspopup="true"
                    color="inherit"
                />
            </Button>
            {/* <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}

            >
                <Button onClick={logOut}><Typography sx={{ p: 2 }}>Logout</Typography></Button>
                <Button >  <Link to={'/profile/' + currentUser.user.id}><Typography sx={{ p: 2 }}>Profile</Typography></Link></Button>

            </Popover> */}

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem>
                    <Avatar /> Profile
                </MenuItem>

                <Divider />
                <Link to={'/profile/' + currentUser.user.id}>
                    <MenuItem >
                        <ListItemIcon >
                            <Settings fontSize="small" />
                        </ListItemIcon>
                        <Link style={{ textDecoration: "none", color: "#404040" }} to={'/profile/' + currentUser.user.id}><Typography sx={{ textUnderline: "none" }} >Settings</Typography></Link>
                    </MenuItem>
                </Link>

                <MenuItem onClick={logOut}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>
        </>
    );
};

export default ProfileSection;
