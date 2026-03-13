import React from "react";
import { useSelector } from "react-redux";

import ChangePassword from "../../../../layout/main/administration/profile/changePassword";
import PersonalInformation from "../../../../layout/main/administration/profile/personalInformation";
import Settings from "../../../../layout/main/administration/profile/settings";
const ProfileRouter = () => {
  const selectedPage = useSelector((state) => state.profile.selectedPage);
  return (
    <>
      {"Personal Information" === selectedPage && <PersonalInformation />}
      {"Change Password" === selectedPage && <ChangePassword />}
      {"Settings" === selectedPage && <Settings />}
    </>
  );
};

export default ProfileRouter;
