import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { unstable_HistoryRouter as HistoryRouter, Outlet } from "react-router-dom";

import { Box } from "@mui/material"

import history from "./history";

import PrivateRoute from "./privateRouter";
import PublicRoute from "./publicRouter";

import { Confirmation, MyNavigator, Loadable, HistoryConfirmation, ErrorMessage } from "../components";
import { applyTheme } from "../services/actions/theme";
import { applyFontSize } from "../services/actions/fontSize";
import { useDispatch } from "react-redux";
import DjangoHealtService from "../services/api/djangohealt";
import { add_error } from "../services/actions/error";

const Diagnostics = Loadable(React.lazy(() => import("../pages/main/administration/diagnostics/main")));
const Users = Loadable(React.lazy(() => import("../pages/main/administration/users/main")));
const Profile = Loadable(React.lazy(() => import("../pages/main/administration/profile/main")));
const CodeList = Loadable(React.lazy(() => import("../pages/main/tools/codelist/main")))
const ResourceList = Loadable(React.lazy(() => import("../pages/main/tools/resources/main")))
const Configuration = Loadable(React.lazy(() => import("../pages/main/configuration/main")))
const ForgotPassword = Loadable(React.lazy(() => import("../pages/authorization/forgotPassword/forgotPassword")));
const ForgotPasswordConfirm = Loadable(React.lazy(() => import("../pages/authorization/forgotPassword/forgotPasswordConfirm")));
const Login = Loadable(React.lazy(() => import("../pages/authorization/login/login")));
const Main = Loadable(React.lazy(() => import("../pages/main/main")));
const NotFoundPage = Loadable(React.lazy(() => import("../pages/error/notFound")));
const Items = Loadable(React.lazy(() => import("../pages/main/configuration/items/item")));
const Loader = Loadable(React.lazy(() => import("../pages/main/tools/loader/main")));
const Overview = Loadable(React.lazy(() => import("../pages/main/overview/overview")));
const Project = Loadable(React.lazy(() => import("../pages/main/tools/project/main")));
const Register = Loadable(React.lazy(() => import("../pages/authorization/register/register")));
const RegisterPageTwo = Loadable(React.lazy(() => import("../pages/authorization/register/registerPageTwo")));
const Reporting = Loadable(React.lazy(() => import("../pages/main/reporting/reporting")));
const ReportingDesigner = Loadable(React.lazy(() => import("../pages/main/reporting/reportDesigner")));
const Roles = Loadable(React.lazy(() => import("../pages/main/administration/roles/main")));
const Start = Loadable(React.lazy(() => import("../pages/start/start")));
const SendFeedback = Loadable(React.lazy(() => import("../pages/extra/feedback/main")));
const Tags = Loadable(React.lazy(() => import("../pages/main/configuration/tags/tagManager/tags")));
const TagCalculated = Loadable(React.lazy(() => import("../pages/main/configuration/tags/tagCalculated/main")));
const Types = Loadable(React.lazy(() => import("../pages/main/tools/types/main")));
const UomEditor = Loadable(React.lazy(() => import("../pages/main/tools/uom/main")));
const ServerError = Loadable(React.lazy(() => import("../pages/error/internalServerError")));
const AppRouter1 = () => {
  return (
    <React.Fragment>
      <Suspense fallback={<Outlet />}>
        <Routes>
          <Route exact path="/" element={<PrivateRoute />}>
            <Route exact path="/" element={<Main />} />


            <Route exact path="/overview/*" element={<Overview />} />


            <Route exact path="/reporting" element={< Configuration way="Reporting" />} />
            <Route path="/reporting/viewer" element={<Reporting />} />
            <Route path="/reporting/designer" element={<ReportingDesigner />} />


            <Route path="/administration" element={<Configuration way="Administration" />} />
            <Route path="/administration/diagnostics" element={<Diagnostics />} />
            <Route path="/administration/users" element={<Users />} />
            <Route path="/administration/profile" element={<Profile />} />
            <Route path="/administration/roles" element={<Roles isHome={true} />} />
            <Route path="/administration/roles/:roles" element={<Roles isHome={false} />} />


            <Route exact path="/tools" element={<Configuration way="Tools" />} />
            <Route exact path="/tools/types" element={<Types isHome={true} />} />
            <Route exact path="/tools/types/:tags" element={<Types isHome={false} />} />
            <Route exact path="/tools/uom_editor" element={<UomEditor isHome={true} />} />
            <Route exact path="/tools/uom_editor/:uom" element={<UomEditor isHome={false} />} />
            <Route exact path="/tools/project" element={<Project isHome={true} />} />
            <Route exact path="/tools/project/:project" element={<Project isHome={false} />} />
            <Route exact path="/tools/code_list" element={<CodeList isHome={true} />} />
            <Route exact path="/tools/code_list/:codelist" element={<CodeList isHome={false} />} />
            <Route exact path="/tools/resources" element={<ResourceList isHome={true} />} />
            <Route exact path="/tools/resources/:resourceList" element={<ResourceList isHome={false} />} />
            <Route exact path="/tools/loader" element={<Loader />} />


            <Route exact path="/configuration" element={<Configuration way="Configuration" />} />
            <Route exact path="/configuration/:myKey" element={<MyNavigator way="Configuration" />} />
            <Route exact path="/configuration/:myKey/:type/:item" element={<Items isHome={false} />} />
            <Route exact path="/configuration/:myKey/:type/:item/*" element={<Items isHome={false} />} />
            <Route path="/configuration/:myKey/:type" element={<Items isHome={true} />} />

            <Route exact path="/configuration/tags/tag_manager" element={<Tags isHome={true} />} />
            <Route exact path="/configuration/tags/tag_calculated" element={<TagCalculated isHome={true} />} />
            <Route exact path="/configuration/tags/tag_calculated/:tags" element={<TagCalculated isHome={false} />} />
            <Route exact path="/configuration/tags/tag_calculated/:tags/*" element={<TagCalculated isHome={false} />} />
            <Route exact path="/configuration/tags/tag_manager/:tags" element={<Tags isHome={false} />} />
            <Route exact path="/configuration/tags/tag_manager/:tags/*" element={<Tags isHome={false} />} />,

            <Route exact path="/feedback" element={<SendFeedback />} />
            <Route exact path="/internal/server/error" element={<ServerError />} />
            <Route path="*" element={<NotFoundPage width="100%" />} />
          </Route>

          <Route exact path="/" element={<PublicRoute />}>
            <Route exact path="/home" element={<Start />} />
            <Route path="/signin" element={<Login />} />
            <Route path="/signin/forgotpassword" element={<ForgotPassword />} />
            <Route path="/signin/forgotpasswordconfirm/:token" element={<ForgotPasswordConfirm />} />
            <Route path="/signup" element={<Register />} />
            <Route path="/signup/signup" element={<RegisterPageTwo />} />
            <Route exact path="/feedback" element={<SendFeedback />} />
            <Route exact path="/internal/server/error" element={<ServerError />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </React.Fragment>
  );
};

const AppRouter = () => {
  const dispatch = useDispatch()
  const [connection, setConnection] = React.useState(true)
  React.useEffect(() => {
    dispatch(applyTheme())
    applyFontSize()
    window.addEventListener("online", () => {
      setConnection(true)
      dispatch(add_error("Connection On", 200))
    });
    window.addEventListener("offline", () => {
      setConnection(false)
      dispatch(add_error("No Internet Connection", 400))
    });
  }, []);

  React.useEffect(() => {
    let timeoutId;

    async function myFunction() {
      try {
        if (connection) {
          await DjangoHealtService.get()
        }
      } catch {
        dispatch(add_error("", 500))
      }
      timeoutId = setTimeout(myFunction, 10000);
    }
    myFunction();
    return () => {
      clearTimeout(timeoutId);
    };
  }, [connection])
  history.listen((location, action) => {
    console.log("---------------------");
    console.log(location);
    console.log(action);
    console.log("---------------------");
  });
  return (
    <HistoryRouter history={history}>
      <Box id="main-box" >
        <ErrorMessage Element={AppRouter1} />
        <Confirmation />
        <HistoryConfirmation />
      </Box>
    </HistoryRouter>
  );
};

export default React.memo(AppRouter);
