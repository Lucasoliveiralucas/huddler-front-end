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
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
      const userLoggedIn = await Auth.currentAuthenticatedUser();
      if (!userLoggedIn) {
        router.replace('/');
        return;
      }

      setIsAuthenticated(true);
      setCognitoUser(userLoggedIn);
      setCognitoUser(userLoggedIn);
      const user = await getUserById(userLoggedIn.username);
      setCurrentUser(user);
      Hub.listen('auth', (data) => {
        const { payload } = data;
        console.log('A newauthentication user event has happened: ', data);
        if (payload.event === 'signOut') {
          console.log('User Signed Out');
          setCognitoUser(null);
          setCurrentUser(null);
          setIsAuthenticated(false);
        }
      });
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
  };

  const value = {
    currentUser,
    isAuthenticated,
    isLoading,
    logOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

