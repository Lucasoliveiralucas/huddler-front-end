import React, { useEffect, useState } from "react";
import DropdownItems from "./DropdownItems";
import { getAllCategories } from "../../utils/APIServices/categoryServices";
import { sortByName } from "../../utils/helperFunctions";
import { Category, Huddle } from "../../types";

type Props = {
  setFilterChoice: React.Dispatch<React.SetStateAction<Huddle[]>>;
  revert: boolean;
};

const DropdownMenu = ({ setFilterChoice, revert }: Props) => {
  const [categories, setCategories] = useState<any>([]);
  const [showDropdown, setShowDropdwon] = useState<boolean>(false);
  const [selectCategory, setSelectCategory] = useState<string>("");

  // const loadCategories = async () => {
  //   const allcategories = await getAllCategories();
  //   await sortByName(allcategories).map(obj => obj.name)
  //   setCategories(allcategories);
  // };

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
    setSelectCategory("");
  }, [revert]);
  const toggleDropdown = () => {
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
    <div className="dropdown-div overflow-x-auto scrollbar-hidden">
      <button
        className={`${showDropdown ? "active" : "noActive"}`}
        onClick={(): void => toggleDropdown()}
        onBlur={(e: React.FocusEvent<HTMLButtonElement>): void =>
          dismissHandler(e)
        }
      >
        {showDropdown ? (
          <DropdownItems
            setFilterChoice={setFilterChoice}
            categories={categories}
            showDropdown={false}
            toggleDropdown={(): void => toggleDropdown()}
            categorySelection={categorySelection}
          />
        ) : (
          <div>{selectCategory ? selectCategory : "Categories"}</div>
        )}
      </button>
    </div>
  );
};

export default DropdownMenu;
