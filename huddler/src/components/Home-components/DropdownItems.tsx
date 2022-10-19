import React, { useEffect, useState } from "react";
import { getHuddlesInCategory } from "../../utils/APIServices/categoryServices";
import { Huddle, Category } from "../../types";

type DropdownProps = {
  categories: Category[];
  showDropdown: boolean;
  toggleDropdown: Function;
  categorySelection: Function;
  setFilterChoice: React.Dispatch<React.SetStateAction<Huddle[]>>;
};

const DropdownItems: React.FC<DropdownProps> = ({
  categories,
  categorySelection,
  setFilterChoice,
}: DropdownProps): JSX.Element => {
  const [showDropdown, setShowDropdwon] = useState<boolean>(false);

  const changeDisplayedCategory = async (category: Category) => {
    const data: Huddle[] = await getHuddlesInCategory(category.id);
    return data;
  };

  const onClickHandler = async (category: Category) => {
    categorySelection(category.name);
    const HuddlesByCategory = await changeDisplayedCategory(category);
    setFilterChoice(HuddlesByCategory);
  };

  useEffect(() => {
    setShowDropdwon(showDropdown);
  }, [showDropdown]);

  return (
    // <div className={`${showDropdown ? "dropdown" : "dropdown active"} flex flex-col md:flex-row z-20 relative`}>
    <div className="flex flex-col md:flex-row w-fit absolute px-[0.32rem] z-40 gap-1 mt-6 md:mt-0 bg-white">
      {categories.map((category: Category, index: number): JSX.Element => {
        return (
          <div className="bg-black h-full w-full py-2">
          <p 
            key={index}
            onClick={(): void => {
              onClickHandler(category);
            }}
          >
            {category.name}
            </p>
            </div>
        );
      })}
    </div>
  );
};

export default DropdownItems;
