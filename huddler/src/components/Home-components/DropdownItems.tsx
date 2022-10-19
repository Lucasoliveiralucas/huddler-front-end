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
    <div className={`${showDropdown ? "dropdown" : "dropdown active"} flex`}>
      {categories.map((category: Category, index: number): JSX.Element => {
        return (
          <p
            key={index}
            className="px-1"
            onClick={(): void => {
              onClickHandler(category);
            }}
          >
            {category.name}
          </p>
        );
      })}
    </div>
  );
};

export default DropdownItems;
