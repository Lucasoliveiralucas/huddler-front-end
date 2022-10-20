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
    <div className="flex flex-col md:flex-row md:w-fit absolute after: px-36 md:px-2 z-40 md:gap-3 w-screen bg-palette-light md:bg-inherit md:ml-24 md:top-20 top-32 md:left-auto left-[0%] text-center">
      {categories.map((category: Category, index: number): JSX.Element => {
        return (
          <div
            className="h-full w-full py-3 md:text-sm text-2xl md:border-none border-b border-palette-dark my-1"
            key={category.id}
          >
            <p
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
