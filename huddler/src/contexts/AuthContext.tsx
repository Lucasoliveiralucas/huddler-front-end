import React, { useContext, useState, useEffect, createContext } from 'react';
import { Auth, Hub } from 'aws-amplify';
import { useRouter } from 'next/router';
import { getUserById } from '../utils/APIServices/userServices';

export const AuthContext = React.createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [cognitoUser, setCognitoUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    // Hub.listen('auth', (data) => {
    //   const { payload } = data;
    //   console.log(
    //     'A newauthentication user event has happened: ',
    //     payload.event
    //   );
    //   if (payload.event === 'signIn') {
    //     console.log('User Signed In');
    //     // console.log('userName', currentUser.username);
    //     loadCurrentUser();
    //   }
    //   if (payload.event === 'signOut') {
    //     console.log('User Signed Out');
    //     setCognitoUser(null);
    //     setCurrentUser(null);
    //     setIsAuthenticated(false);
    //   }

    //   if (payload.event === 'signUp') {
    //     console.log('User Signed In');
    //     console.log('userName', currentUser.username);
    //     if (!currentUser.username) {
    //       router.replace('/newuser');
    //     } else router.replace('/home');
    //   }
    // });
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
      const userLoggedIn = await Auth.currentAuthenticatedUser();
      setIsAuthenticated(true);
      setCognitoUser(userLoggedIn);
      const user = await getUserById(userLoggedIn.username);
      setCurrentUser(user);
      router.replace('/home');
    } catch (error) {
      console.error(
        'Error in cognito trying to signup or signin. Check in AuthContext'
      );
    }
    setIsLoading(false);
  };

  const logOut = async () => {
    await Auth.signOut();
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCognitoUser(null);
    router.replace('/');
    return;
  };
  const changePassword = async (user: any, oldPsw: any, newPsw: any) => {
    console.log('Password is being changed');
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

