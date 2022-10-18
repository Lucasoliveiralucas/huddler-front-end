import React, { useEffect } from 'react';
import MainForm from '../../src/components/NewUserForm/MainForm';
import { useRouter } from 'next/router';
import { useAuth } from '../../src/contexts/AuthContext';
import Link from 'next/link';

function Index() {
  //@ts-ignore
  const { currentUser, isAuthenticated, isLoading } = useAuth();
  // console.log('this is current user', currentUser);
  const router = useRouter();
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/');
      return
    }
  }, [isLoading, isAuthenticated]);

  return currentUser ? (
    <div className='flex justify-center '>
      <div className='border-solid border-[1px] border-palette-orange min-w-fit w-[50%] mt-10 px-3 rounded-[5px] shadow-md'>
        <MainForm currentUser={currentUser} />
      </div>
    </div>
  ) : null;
}

export default Index;
