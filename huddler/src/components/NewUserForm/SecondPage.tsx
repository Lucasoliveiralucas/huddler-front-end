import React from 'react';
import { User } from '../../types';

type Props = {
  userData: User;
  setUserData: React.Dispatch<React.SetStateAction<User | null>>;
};

// Contains a form for the user details

function SecondPage({ userData, setUserData }: Props) {
  return (
    <div className='flex flex-col py-8 w-3/5'>
      <form className='grid gap-8 text-lg'>
        <label className='font-bold pb-4'>User details:</label>
        <label>First Name</label>
        <input
          className='py-3'
          value={userData.firstName}
          onChange={(e) =>
            setUserData({ ...userData, firstName: e.target.value })
          }
        ></input>
        <label>Last Name</label>
        <input
          className='py-3'
          value={userData.lastName}
          onChange={(e) =>
            setUserData({ ...userData, lastName: e.target.value })
          }
        ></input>
        <label>Write a small description:</label>
        <textarea
          className='pb-16'
          value={userData.description}
          onChange={(e) =>
            setUserData({ ...userData, description: e.target.value })
          }
        ></textarea>
      </form>
    </div>
  );
}

export default SecondPage;