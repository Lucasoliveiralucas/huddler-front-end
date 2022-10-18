import React, { useState, useRef, useEffect } from "react";

import PersonalInformation from "../../src/components/Settings-components/PersonalInformation";
import ChangePassword from "../../src/components/Settings-components/ChangePassword";
import UpdateLocation from "../../src/components/Settings-components/UpdateLocation";
import UpdateInterests from "../../src/components/Settings-components/UpdateInterests";
import DeleteUser from "../../src/components/Settings-components/DeleteUser";
import { User } from "../../src/types";
import OptionsMenu from "../../src/components/Settings-components/OptionsMenu";
import { useRouter } from "next/router";
import { Auth } from "aws-amplify";
import { getUserById } from "../../src/utils/APIServices/userServices";
import { useAuth } from "../../src/contexts/AuthContext";

const SettingsPage = () => {
  const router = useRouter();

  //@ts-ignore
  const { currentUser, isAuthenticated, isLoading, logOut } = useAuth();
  // if (!aws_id) router.replace('/');
  // logOut()
  const [userData, setUserData] = useState<any>(currentUser);
  const [option, setOption] = useState("information");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/");
      return;
    }
  }, [isLoading, isAuthenticated]);

  useEffect(() => {
    if (currentUser) {
      setUserData(currentUser[0]);
      console.log("this is current user", currentUser[0]);
    }
  }, [currentUser]);

  return (
    <main className="flex h-screen justify-center items-center">
      <OptionsMenu setOption={setOption} />

      {option === "information" && userData && (
        <PersonalInformation userData={userData} />
      )}
      {option === "password" && <ChangePassword />}
      {option === "location" && (
        <UpdateLocation
          currentUserLongitude={userData.default_longitude!}
          currentUserLatitude={userData.default_latitude!}
          userData={userData}
        />
      )}
      {option === "interests" && <UpdateInterests userData={userData} />}
      {option === "delete" && <DeleteUser userData={userData} />}
    </main>
  );
};

export default SettingsPage;
