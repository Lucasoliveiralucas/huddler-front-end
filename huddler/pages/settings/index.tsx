import React, { useState, useRef, useEffect } from 'react';

import PersonalInformation from '../../src/components/Settings-components/PersonalInformation';
import ChangePassword from '../../src/components/Settings-components/ChangePassword';
import UpdateLocation from '../../src/components/Settings-components/UpdateLocation';
import UpdateInterests from '../../src/components/Settings-components/UpdateInterests';
import DeleteUser from '../../src/components/Settings-components/DeleteUser';
import { User } from '../../src/types';
import OptionsMenu from '../../src/components/Settings-components/OptionsMenu';
import { useRouter } from 'next/router';
import { Auth } from 'aws-amplify';
import { getUserById } from '../../src/utils/APIServices/userServices';
import { useAuth } from '../../src/contexts/AuthContext';

// let aws_id = '';

// Auth.currentAuthenticatedUser()
//   .then((user) => {
//     console.log('User: ', user);
//     aws_id = user.username;
//     console.log('this is aws', aws_id);
//   })
//   .catch((err) => console.log(err));
// //mock user
// const user: User = {
//   name: 'Florian',
//   email: 'flo@flo.flo',
//   firstName: 'Florio',
// };

const SettingsPage = () => {
  const router = useRouter();

  //@ts-ignore
  const { currentUser, isAuthenticated, isLoading } = useAuth();
  // if (!aws_id) router.replace('/');

  const [userData, setUserData] = useState<any>(currentUser);
  const [option, setOption] = useState('information');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/');
      return;
    }
  }, [isLoading, isAuthenticated]);

  useEffect(() => {
    if (currentUser) {setUserData(currentUser[0]);
    console.log('this is current user', currentUser[0]);}
  }, [currentUser]);

  return (
    <main className='flex h-screen justify-center items-center'>
      <OptionsMenu setOption={setOption} />

      {option === 'information' && userData && (
        <PersonalInformation userData={userData} />
      )}
      {/* {option === 'password' && <ChangePassword />}
      {option === 'location' && (
        <UpdateLocation
          currentUserLongitude={userData.longitude!}
          currentUserLatitude={userData.latitude!}
        />
      )}
      {option === 'interests' && (
        <UpdateInterests currentUserInterests={userData.interests!} />
      )}
      {option === 'delete' && <DeleteUser currentUserId={userData.id!} />} */}
    </main>
  );
};

export default SettingsPage;

