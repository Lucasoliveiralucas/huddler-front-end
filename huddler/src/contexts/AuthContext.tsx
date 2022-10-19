import React, { useContext, useState, useEffect } from "react";
import { Auth, Hub } from "aws-amplify";
import { useRouter } from "next/router";
import { getUserById } from "../utils/APIServices/userServices";
import { User } from "../types";

//@ts-ignore
export const AuthContext = React.createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

type Props = {
  children: JSX.Element;
};

export const AuthProvider = ({ children }: Props) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cognitoUser, setCognitoUser] = useState<any>();
  const router = useRouter();

  useEffect(() => {
    Hub.listen("auth", (data) => {
      const { payload } = data;
      if (payload.event === "signOut") console.log("User Signed Out");
      if (payload.event === "signIn") loadUser();
    });
    return () => {
      //@ts-ignore
      Hub.remove("auth");
    };
  }, []);

  const loadUser = async () => {
    try {
      const cognitoUser = await Auth.currentUserInfo();
      const { username, attributes } = cognitoUser;
      // we only use cognito user when changing password and probably deleteing account
      setCognitoUser(cognitoUser);

      const userFromDb = await getUserById(username);

      const user = { ...userFromDb[0] };
      setTimeout(signEventDetector, 10, user, username, attributes.email);
    } catch (error) {
      console.error(
        "Error trying to signin or signup. Check contexts/AuthContext"
      );
    }
    setIsLoading(false);
  };

  const signEventDetector = (user: User, username: string, email: string) => {
    if (user.username !== undefined) {
      console.log("User already logged in");
      setIsAuthenticated(true);
      setCurrentUser(user);
      router.replace("/home");
      return;
    }
    // if first time
    console.log("First time user");
    setIsAuthenticated(true);
    setCurrentUser({ email: email, aws_id: username });
    router.replace("/newuser");
    return;
  };

  const logOut = async () => {
    await Auth.signOut();
    setIsAuthenticated(false);
    setCurrentUser(null);
    router.replace("/");
    return;
  };

  const changePassword = async (user: any, oldPsw: any, newPsw: any) => {
    console.log("Password is being changed");
    return await Auth.changePassword(user, oldPsw, newPsw);
  };

  const value = {
    currentUser,
    isAuthenticated,
    isLoading,
    cognitoUser,
    setCurrentUser,
    changePassword,
    logOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
