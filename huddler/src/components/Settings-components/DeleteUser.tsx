import { useState } from 'react';
import { useRouter } from 'next/router';
import {
  deleteAllUserCategories,
  deleteUser,
} from '../../utils/APIServices/userServices';
import { useAuth } from '../../contexts/AuthContext';
type Props = {
  userData: any;
};

const DeleteUser = ({ userData }: Props) => {
  const router = useRouter();
  const [error, setError] = useState('');
  //@ts-ignore
  const { deleteCognitoUser } = useAuth();
  const handleDelete = async () => {
    try {
      await deleteUser(userData.aws_id);
      await deleteAllUserCategories(userData.aws_id);
      await deleteCognitoUser();
      router.replace('/');
    } catch {
      setError("We weren't able to delete your account. Please try again");
    }
  };
  return (
    <div className='flex flex-col items-center mt-10 md:mt-32 lg:mt-0'>
      {error && (
        <>
          <div className='text-[#721D25] bg-[#F8D6DB] p-5 rounded-md'>
            {error}
          </div>
          <br />
        </>
      )}
      <div className='flex flex-col gap-10 items-center'>
        <h1 className='text-2xl font-medium font-yantra'>
          You are about to delete you account
        </h1>
        <div>
          <button
            className='border-none orange-button hover:bg-opacity-60 hover:cursor-pointer rounded-md shadow-md text-white text-xl mt-2 py-2 px-5'
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUser;

