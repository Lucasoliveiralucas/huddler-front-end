import React, { useEffect, useState } from 'react';
import MainForm from '../../src/components/NewUserForm/MainForm';
import { useRouter } from 'next/router';
import { useAuth } from '../../src/contexts/AuthContext';

function Index() {
  //@ts-ignore
  const { currentUser } = useAuth();
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = sessionStorage.getItem('user');
    if (!JSON.parse(checkAuth!)) {
      setIsAuth(false);
      router.replace('/');
    } else {
      setIsAuth(true);
    }
  }, []);
 
  return isAuth && currentUser ? (
    <div className='flex justify-center mt-24 w-full px-4'>
      <div className='px-2 border-solid border-[1px] border-palette-orange min-w-fit md:min-w-[700px] w-[50%] max-w-[1200px] rounded-[5px] shadow-md'>
        {/* @ts-ignore */}
        <MainForm currentUser={currentUser} />
      </div>
    </div>
  ) : null;
}

export default Index;
