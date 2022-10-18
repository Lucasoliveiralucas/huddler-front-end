import { useEffect, useState } from 'react';
import { Category, User } from '../../types';
import {
  postUserCategory,
  deleteOneUserCategory,
  getUserCategories,
} from '../../utils/APIServices/userServices';
import CategoriesContainer from '../CategoriesContainer';

type Props = {
  userData: User;
};
const UpdateInterests = ({ userData }: Props) => {
  let [userCategories, setUserCategories] = useState<Category[]>();

  useEffect(() => {
    loadUserCategories();
  }, []);

  const loadUserCategories = async () => {
    const categories = await getUserCategories(userData.aws_id);
    setUserCategories([...categories]);
  };

  const initialCategories = userCategories && [...userCategories];

  const onClickUpdateUserInterests = () => {
    const toDelete: Category[] = [];
    const toAdd: Category[] = [];

    // Detect and update if user added or deleted categories from the initial categories
    userCategories!.forEach((category) => {
      if (!initialCategories!.some((cat) => cat.name === category.name)) {
        toAdd.push(category);
      }
    });
    initialCategories!.forEach((category) => {
      if (!userCategories!.some((cat) => cat.name === category.name))
        toDelete.push(category);
    });

    console.log('to add', toAdd);

    toAdd.forEach((category) => {
      postUserCategory(userData.aws_id, category.id as number);
    });

    console.log('to delete', toDelete);
    toDelete.forEach((category) => {
      deleteOneUserCategory(userData.aws_id, category.id as number);
    });

    return;
  };

  return (
    <>
      <div className='flex flex-col items-center'>
        <h1 className='text-2xl font-bold'>Your interests</h1>
        <div className='w-full'>
          {/* @ts-ignore */}
          <CategoriesContainer
            userCategories={userCategories}
            setUserCategories={setUserCategories}
          />
          ;
        </div>
        <div className='flex justify-center'>
          <button
            className='border-none bg-palette-dark hover:bg-opacity-60 hover:cursor-pointer rounded-md shadow-md text-white text-2xl mt-2 py-2 px-5'
            type='submit'
            onClick={onClickUpdateUserInterests}
          >
            Submit
          </button>
        </div>
      </div>
    </>
  );
};

export default UpdateInterests;

