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

  const router = useRouter();

  useEffect(() => {
    Hub.listen('auth', (data) => {
      const { payload } = data;
      if (payload.event === 'signIn') {
        console.log('User Signed In');
        loadCurrentUser();
      }

      if (payload.event === 'signOut') {
        console.log('User Signed Out');
      }

      if (payload.event === 'signUp') {
        console.log('User Signed Up');
        firstTimeUser();
      }

    });
    return () => {Hub.remove('auth')}
  }, []);

  const loadCurrentUser = async () => {
    try {
      const userLoggedIn = await Auth.currentAuthenticatedUser();
      setIsAuthenticated(true);
      const user = await getUserById(userLoggedIn.username);
      setCurrentUser(user);
      router.replace('/home');
    } catch (error) {
      console.error('Error trying to signin. Check in AuthContext');
    }
    setIsLoading(false);
  };
  const firstTimeUser = async () => {
    try {
      const { username, attributes } = await Auth.currentUserInfo();
      setIsAuthenticated(true);
      setCurrentUser({ email: attributes.email, aws_id: username });
      router.replace('/newuser');
    } catch (error) {
      console.error('Error trying to signup. Check in AuthContext');
    }
    setIsLoading(false);
  };

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

