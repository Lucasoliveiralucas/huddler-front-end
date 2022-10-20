import React, { useState, useEffect } from 'react';

import PersonalInformation from '../../src/components/Settings-components/PersonalInformation';
import ChangePassword from '../../src/components/Settings-components/ChangePassword';
import UpdateLocation from '../../src/components/Settings-components/UpdateLocation';
import UpdateInterests from '../../src/components/Settings-components/UpdateInterests';
import DeleteUser from '../../src/components/Settings-components/DeleteUser';
import { User } from '../../src/types';
import OptionsMenu from '../../src/components/Settings-components/OptionsMenu';
import { useRouter } from 'next/router';
import { useAuth } from '../../src/contexts/AuthContext';

const SettingsPage = () => {
  const router = useRouter();

  //@ts-ignore
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState<User>(currentUser);
  const [option, setOption] = useState('information');
  const [isAuth, setIsAuth] = useState(false)

  useEffect(() => {
    const checkAuth = sessionStorage.getItem('user')
    if (!JSON.parse(checkAuth!)) {setIsAuth(false); router.replace('/');
  } else {setIsAuth(true)}}, []);

  useEffect(() => {
    if (currentUser) {
      setUserData(currentUser);
      // console.log('this is current user', currentUser);
    }
  }, [currentUser]);

  return isAuth && currentUser ? (
    <main id="1" className='flex flex-col mt-14 md:h-screen md:flex-row md:mt-0 justify-center items-center lg:items-center'>
      <div id="2" className='flex md:items-end md:mt-30'>
        <OptionsMenu setOption={setOption} />
      </div>
      <div id="3 right" className='md:ml-8 md:w-[60vw]'>
        {option === 'information' && userData && (
          <PersonalInformation userData={userData} />
          )}
        {option === 'password' && <ChangePassword />}
        {option === 'location' && (
          <UpdateLocation
          // currentUserLongitude={userData.default_longitude!}
            // currentUserLatitude={userData.default_latitude!}
            userData={userData}
            setUserData={setUserData}
            />
            )}
        {option === 'interests' && <UpdateInterests userData={userData} />}
        {option === 'delete' && <DeleteUser userData={userData} />}
      </div>
    </main>
  ) : null;
};

export default SettingsPage;

