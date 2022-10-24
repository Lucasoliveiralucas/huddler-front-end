import { useEffect, useState } from 'react';
import { Category, User } from '../../types';
import CategoriesContainer from '../CategoriesContainer';

type Props = {
  chosenCategories: Category[];
  setChosenCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  setDisabledButton: React.Dispatch<React.SetStateAction<boolean>>;
};

function Interests({
  chosenCategories,
  setChosenCategories,
  setDisabledButton,
}: Props) {
  return (
    <>
      <div className='flex flex-col'>
        <div className='flex justify-center text-3xl font-bold'>
          <h1 className='font-yantra font-medium text-palette-dark'>
            WELCOME NEW HUDDLER!
          </h1>
        </div>

        <div className='flex flex-col py-8 md:px-8'>
          <h1 className='self-center text-2xl font-karla text-palette-black'>
            Choose your interests:
          </h1>
          {/* @ts-ignore */}
          <CategoriesContainer
            setDisabledButton={setDisabledButton}
            chosenCategories={chosenCategories}
            setChosenCategories={setChosenCategories}
          />
        </div>
      </div>
    </>
  );
}

export default Interests;
