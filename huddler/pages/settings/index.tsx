import React, { useState, useEffect } from 'react';

import PersonalInformation from '../../src/components/Settings-components/PersonalInformation';
import ChangePassword from '../../src/components/Settings-components/ChangePassword';
import UpdateLocation from '../../src/components/Settings-components/UpdateLocation';
import UpdateInterests from '../../src/components/Settings-components/UpdateInterests';
import UpdateUserImage from '../../src/components/Settings-components/UpdateUserImage';
import DeleteUser from '../../src/components/Settings-components/DeleteUser';
import { User } from '../../src/types';
import OptionsMenu from '../../src/components/Settings-components/OptionsMenu';
import { useRouter } from 'next/router';
import { useAuth } from '../../src/contexts/AuthContext';

const SettingsPage = () => {
  const router = useRouter();

  //@ts-ignore
  const { currentUser, isAuthenticated, isLoading, logOut } = useAuth();
  const [userData, setUserData] = useState<User>(currentUser);
  const [option, setOption] = useState('information');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/');
      return;
    }
  }, [isLoading, isAuthenticated]);

  useEffect(() => {
    if (currentUser) {
      setUserData(currentUser);
      console.log('this is current user', currentUser);
    }
  }, [currentUser]);

  console.log(currentUser);

  return (
    <main className='flex h-screen justify-center items-center'>
      <OptionsMenu setOption={setOption} />
  
      {option === 'information' && userData && (
        <PersonalInformation userData={userData} />
      )}
      {option === 'password' && <ChangePassword />}
      {option === 'location' && (
        <UpdateLocation
          currentUserLongitude={userData.default_longitude!}
          currentUserLatitude={userData.default_latitude!}
          userData={userData}
        />
      )}
      {option === 'interests' && <UpdateInterests userData={userData} />}
      {option === 'image' && <UpdateUserImage userData={userData} />}
      {option === 'delete' && <DeleteUser userData={userData} />}
    </main>
  );
};

export default SettingsPage;

