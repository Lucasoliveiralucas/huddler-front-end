import { useEffect, useState } from 'react';
import { Category } from '../../types';
import {
  postUserCategory,
  deleteOneUserCategory,
  getUserCategories,
} from '../../utils/APIServices/userServices';
import CategoriesContainer from '../CategoriesContainer';

type Props = {
  userData: any
}
const UpdateInterests = ({userData}: Props) => {
  // get current user interests either as a prop of the current user object if we have global access to the authenticated user, or by calling here to the API to retrieve the categories of the user.
  // for now and to test, we use a hardcoded example
  // const initialCategories = [
  //   { id: 36, name: 'Cycling                  ' },
  //   { id: 35, name: 'Music                    ' },
  //   { id: 67, name: 'Swimming                 ' },
  //   { id: 34, name: 'Outdoors                 ' },
  //   { id: 70, name: 'Literature               ' },
  // ];
  let [userCategories, setUserCategories] = useState<any>();

  useEffect(() => {
    loadUserCategories();
  }, []);

  
  const loadUserCategories = async () => {
    console.log('iddddd', userData.aws_id)
    const categories = await getUserCategories(userData.aws_id);
    console.log('user categories', categories)
    setUserCategories([...categories]);
  };

  const initialCategories = userCategories && [...userCategories]
 
  const handleSubmit = () => {
    //update user categories

    const toDelete = [];
    const toAdd = [];
    userCategories.forEach((category) => {
      if (!initialCategories.some((cat) => cat.name === category.name)) {
        toAdd.push(category);
      }
    });
    initialCategories.forEach((category) => {
      if (!userCategories.some((cat) => cat.name === category.name))
        toDelete.push(category);
    });
    console.log('initial categoires', initialCategories);
    console.log('to add', toAdd);
    console.log('to delete', toDelete);

    toAdd.forEach((category) => {
      postUserCategory(userData.aws_id, category.id);
    });

    toDelete.forEach((category) => {
      // deleteCategory
      deleteOneUserCategory(userData.aws_id, category.id);
    });

    return;
  };

  return (
    <>
      <div className='flex flex-col items-center'>
        <h1 className='text-2xl font-bold'>Your interests</h1>
        <div className='w-full'>
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
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </>
  );
};

export default UpdateInterests;



