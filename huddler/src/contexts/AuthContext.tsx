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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [firstTime, setFirstTime] = useState(false)
  const router = useRouter();

  useEffect(() => {
    console.log('Hub initialized')
    Hub.listen('auth', (data) => {
      const { payload } = data;
      if (payload.event === 'signOut') {
        console.log('User Signed Out');
      }

      if (payload.event === 'signIn') {
       loadUser()
      }

    });
    return () => {Hub.remove('auth')}
  }, []);

  const signDetector = (
    user,
    username,
    email,
    setIsAuthenticated,
    setCurrentUser,
    router
  ) => {
    if (user.username !== undefined) {
      console.log('User already logged in');
      setIsAuthenticated(true);
      setCurrentUser(user);
      router.replace('/home');
      return;
    }
    console.log('First time user');
    // if first time
    setIsAuthenticated(true);
    setCurrentUser({ email: email, aws_id: username });
    router.replace('/newuser');
    return;
  };

  const loadUser = async () => {
    try {
      const { username, attributes } = await Auth.currentUserInfo();
      const user = await getUserById(username);
      console.log('this is user', user)
      // check if user already exists
      const usr = {...user[0]}
      console.log('this is usr', usr)
      setTimeout(signDetector, 1000, usr, username, attributes.email, setIsAuthenticated, setCurrentUser, router)
    } catch (error) {
      console.error('Error trying to signup. Check in AuthContext');
    }
    setIsLoading(false);
  };

  // const signDetector = (user, username, email) => {
  //   if (user.username) {
  //     setIsAuthenticated(true);
  //     setCurrentUser(user);
  //     router.replace('/home');
  //     return;
  //   }
  //   // if first time
  //   setIsAuthenticated(true);
  //   setCurrentUser({ email: email, aws_id: username });
  //   router.replace('/newuser');
  //   return;
  // }

  const logOut = async () => {
    await Auth.signOut();
    setIsAuthenticated(false);
    setCurrentUser(null);
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
    setCurrentUser,
    changePassword,
    logOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};






