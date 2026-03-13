import React, { useCallback } from 'react'
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { Box, Drawer, useMediaQuery } from '@mui/material';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { BrowserView, MobileView } from 'react-device-detect';
import { makeStyles } from '@mui/styles';
import MenuList from './MenuList'


export const defaultDrawerWidth = 240;
const minDrawerWidth = 100;
const maxDrawerWidth = 1000;

const useStyles = makeStyles(theme => ({

    dragger: {

        cursor: "ew-resize",
        width: "1px",
        borderOutside: "1px solid #ddd",
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        zIndex: 100,
        backgroundColor: "#F1F1F1"
    }
}));

const Sidebar = ({ drawerOpen, drawerToggle, window }) => {
    const theme = useTheme();
    const matchUpMd = useMediaQuery(theme.breakpoints.up('md'));
    const [drawerWidth, setDrawerWidth] = React.useState(defaultDrawerWidth);
    const classes = useStyles()
    const handleMouseDown = e => {
        document.addEventListener("mouseup", handleMouseUp, true);
        document.addEventListener("mousemove", handleMouseMove, true);
    };

    const handleMouseUp = () => {
        document.removeEventListener("mouseup", handleMouseUp, true);
        document.removeEventListener("mousemove", handleMouseMove, true);
    };

    const handleMouseMove = useCallback(e => {
        const newWidth = e.clientX - document.body.offsetLeft;
        if (newWidth > minDrawerWidth && newWidth < maxDrawerWidth) {
            setDrawerWidth(newWidth);
        }
    }, []);

    const drawer = (
        <>
            <BrowserView>
                <PerfectScrollbar
                    component="div"
                    style={{
                        height: !matchUpMd ? 'calc(100vh - 56px)' : 'calc(100vh - 52px)',

                    }}
                >
                    {/* <NavList /> */}
                    <MenuList />
                </PerfectScrollbar>
            </BrowserView>
            <MobileView>
                <Box sx={{ px: 2 }}>

                </Box>
            </MobileView>
        </>
    );

    const container = window !== undefined ? () => window.document.body : undefined;

    return (
        <Box component="nav"
            sx={{ flexShrink: { md: 0 }, width: matchUpMd ? drawerWidth : 'auto' }}
            aria-label="mailbox folders">
            <Drawer
                container={container}
                variant={matchUpMd ? 'persistent' : 'temporary'}
                anchor="left"
                open={drawerOpen}
                onClose={drawerToggle}
        
                sx={{
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        background: theme.palette.background.default,
                        color: theme.palette.text.primary,
                        borderOutside: "1px solid #EAEAEA",
                        borderRadius: "5px",
                        margin: "5px",

                        [theme.breakpoints.up('md')]: {
                            top: '52px'
                        }
                    }
                }}
                ModalProps={{ keepMounted: true }}
                color="inherit"
            >
                <div onMouseDown={e => handleMouseDown(e)} className={classes.dragger} />
                {drawer}
            </Drawer>
        </Box>

    );
};

Sidebar.propTypes = {
    drawerOpen: PropTypes.bool,
    drawerToggle: PropTypes.func,
    window: PropTypes.object
};

export default Sidebar;

