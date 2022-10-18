import { useEffect, useState } from 'react';
import { Category, User } from '../../types';
import CategoriesContainer from '../CategoriesContainer';

type Props = {
  chosenCategories: Category[];
  setChosenCategories: React.Dispatch<React.SetStateAction<Category[]>>;
};

function Interests({ chosenCategories, setChosenCategories }: Props) {
  console.log(chosenCategories);
  return (
    <>
      <div className='flex flex-col'>
        <div className='flex justify-center text-3xl font-bold'>
          <h1>Welcome new Huddler!</h1>
        </div>

        <div className='flex flex-col py-8'>
          <h1 className='self-center text-2xl'>Choose your interests:</h1>
          {/* @ts-ignore */}
          <CategoriesContainer
            chosenCategories={chosenCategories}
            setChosenCategories={setChosenCategories}
          />
        </div>
      </div>
    </>
  );
}

export default Interests;
