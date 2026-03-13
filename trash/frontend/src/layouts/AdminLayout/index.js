import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { styled, useTheme } from "@mui/material/styles";
import { AppBar, Box, CssBaseline, Toolbar, useMediaQuery } from "@mui/material";
import Header from "./header/index";
import Sidebar from "./sidebar/index";
import { defaultDrawerWidth } from "./sidebar/index";
import { SET_MENU } from "../../redux/actions/actions";

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  ...theme.typography.mainContent,
  ...(!open && {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    marginLeft: "5px",
    marginTop: (88 - 38),
    marginRight: "5px",
    padding: '5px',
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    [theme.breakpoints.up('md')]: {
      marginTop: (88 - 38),
      marginLeft: -(defaultDrawerWidth - 0),
      marginRight: "5px",
      padding: '5px',
      width: `calc(100% - ${defaultDrawerWidth}px)`,
    },
    [theme.breakpoints.down('md')]: {
      marginTop: (88 - 38),
      marginLeft: '5px',
      marginRight: "5px",
      padding: '5px',
      width: `calc(100% - ${defaultDrawerWidth}px)`,
    },
    [theme.breakpoints.down('sm')]: {
      marginTop: (88 - 38),
      marginLeft: '5px',
      marginRight: "5px",
      padding: '5px',
      width: `calc(100% - ${defaultDrawerWidth}px)`,
    }
  }),
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginTop: (88 - 38),
    marginLeft: "5px",
    marginRight: "5px",
    padding: '5px',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    width: `calc(100% - ${defaultDrawerWidth}px)`,
    [theme.breakpoints.down('md')]: {
      marginTop: (88 - 38),
      marginLeft: '5px',
      marginRight: "5px",
    },
    [theme.breakpoints.down('sm')]: {
      marginTop: (88 - 38),
      marginLeft: '5px',
      marginRight: "5px",
    }
  })
}));

const AdminLayout = () => {
  const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down('lg'));
  const leftDrawerOpened = useSelector((state) => state.customization.opened);
  const dispatch = useDispatch();
  const handleLeftDrawerToggle = () => {
    dispatch({ type: SET_MENU, opened: !leftDrawerOpened });
  };

  useEffect(() => {
    dispatch({ type: SET_MENU, opened: !matchDownMd });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchDownMd]);

  return (
    <Box sx={{ display: 'flex', }}>
      <CssBaseline />
      <AppBar
        enableColorOnDark
        position="fixed"
        color="inherit"
        style={{ height: "52px", boxShadow: " 0px 0.1px 3px 0px rgba(0, 0, 0, 0.1)" }}
        sx={{
          bgcolor: "#FFFFFF",
          transition: leftDrawerOpened ? theme.transitions.create('width') : 'none'
        }}
      >
        <Toolbar  >
          <Header handleLeftDrawerToggle={handleLeftDrawerToggle} />
        </Toolbar>
      </AppBar>
      <Sidebar drawerOpen={leftDrawerOpened} drawerToggle={handleLeftDrawerToggle} />
      <Main theme={theme} open={leftDrawerOpened}   >
        <Outlet />
      </Main>
    </Box >
  );
};
export default AdminLayout