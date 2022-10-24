import React, { useEffect, useState } from 'react';
import DropdownItems from './DropdownItems';
import { getAllCategories } from '../../utils/APIServices/categoryServices';
import { sortByName } from '../../utils/helperFunctions';
import { Category, Huddle } from '../../types';

type Props = {
  setFilterChoice: React.Dispatch<React.SetStateAction<Huddle[]>>;
  revert: boolean;
};

const DropdownMenu = ({ setFilterChoice, revert }: Props) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showDropdown, setShowDropdwon] = useState<boolean>(false);
  const [selectCategory, setSelectCategory] = useState<string>('');

  useEffect(() => {
    let allCategories = [];
    const loadCategories = async () => {
      const categoriesObject = await getAllCategories();
      allCategories = sortByName(categoriesObject);
      setCategories(allCategories);
    };
    loadCategories();
  }, []);

  useEffect(() => {
    setSelectCategory('');
  }, [revert]);
  const toggleDropdown = () => {
    const element = document.getElementsByClassName;
    setShowDropdwon(!showDropdown);
  };

  const dismissHandler = (event: React.FocusEvent<HTMLButtonElement>): void => {
    if (event.currentTarget === event.target) {
      setShowDropdwon(false);
    }
  };

  const categorySelection = (category: string): void => {
    setSelectCategory(category);
  };

  return (
    <>
      <div className='dropdown-div overflow-x-auto scrollbar-hide flex flex-wrap items-center lg:hidden'>
        {/*MOBILE */}
        <button
          className={`${showDropdown ? 'active' : 'noActive'}`}
          onClick={(): void => toggleDropdown()}
          onBlur={(e: React.FocusEvent<HTMLButtonElement>): void =>
            dismissHandler(e)
          }
        >
          {' '}
          {selectCategory ? selectCategory : 'Categories'}
          {showDropdown && (
            <DropdownItems
              setFilterChoice={setFilterChoice}
              categories={categories}
              showDropdown={false}
              toggleDropdown={(): void => toggleDropdown()}
              categorySelection={categorySelection}
            />
          )}{' '}
        </button>
      </div>
      <div className='dropdown-div lg:flex flex-wrap items-center hidden'>
        {/*DESKTOP */}
        <button
          className={`${showDropdown ? 'active' : 'noActive'} p-0`}
          onClick={(): void => toggleDropdown()}
          onBlur={(e: React.FocusEvent<HTMLButtonElement>): void =>
            dismissHandler(e)
          }
        >
          {' '}
          {selectCategory ? selectCategory : 'Categories'}
          {showDropdown && (
            <DropdownItems
              setFilterChoice={setFilterChoice}
              categories={categories}
              showDropdown={false}
              toggleDropdown={(): void => toggleDropdown()}
              categorySelection={categorySelection}
            />
          )}{' '}
        </button>
      </div>
    </>
  );
};

export default DropdownMenu;

