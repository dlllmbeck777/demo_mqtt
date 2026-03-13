import { useState, useRef, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import {
    Avatar,
    Box,
    ButtonBase,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';




const NotificationSection = () => {
    const theme = useTheme();
    const [open, setOpen] = useState(false);

    const anchorRef = useRef(null);
    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };
    const prevOpen = useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }
        prevOpen.current = open;
    }, [open]);

    return (
        <>
            <Box
                sx={{
                    ml: 2,
                    mr: 3,
                    [theme.breakpoints.down('md')]: {
                        mr: 2
                    }
                }}
            >
                <ButtonBase sx={{ borderRadius: '12px' }}>
                    <Avatar
                        variant="rounded"
                        sx={{
                            ...theme.typography.commonAvatar,
                            ...theme.typography.mediumAvatar,
                            transition: 'all .2s ease-in-out',
                            background: "#F8F8F8",
                            color: "#303030",
                            '&[aria-controls="menu-list-grow"],&:hover': {
                                background: "F8F8F8",
                                color: "#458BF3"
                            }
                        }}
                        ref={anchorRef}
                        aria-controls={open ? 'menu-list-grow' : undefined}
                        aria-haspopup="true"
                        onClick={handleToggle}
                        color="inherit"
                    >
                        <NotificationsIcon stroke={1.5} size="1.3rem" />
                    </Avatar>
                </ButtonBase>
            </Box>

        </>
    );
};

export default NotificationSection;
