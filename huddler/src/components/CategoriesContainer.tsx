import { useEffect, useState } from 'react';
import { Category } from '../types';
import { getAllCategories } from '../utils/APIServices/categoryServices';
import { getUserCategories } from '../utils/APIServices/userServices';
import { sortByName } from '../utils/helperFunctions';

const notSelectedClass =
  'h-[40px] text-xl py-2 px-2 text-center rounded text-white cursor-pointer active:translate-x-[1px] active:translate-y-[1px] bg-palette-orange hover:opacity-50';
const selectedClass = notSelectedClass + ' bg-orange-600';

type Props = {
  chosenCategories?: Category[];
  setChosenCategories?: React.Dispatch<React.SetStateAction<Category[]>>;
  userCategories?: Category[];
  setUserCategories?: React.Dispatch<
    React.SetStateAction<Category[] | undefined>
  >;
  setDisabledButton: React.Dispatch<React.SetStateAction<boolean>>;
};

const CategoriesContainer = ({
  chosenCategories,
  setChosenCategories,
  userCategories,
  setUserCategories,
  setDisabledButton,
}: Props) => {
  const [displayCategories, setDisplayCategories] = useState<Category[]>([]);

  // Depending if the user choose categories for the first time or wants to update categories
  const interests = chosenCategories || userCategories || [];

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const categories = await getAllCategories();
    setDisplayCategories(sortByName(categories));
    return categories;
  };

  const onClickAddOrDeleteCategory = (
    e: React.MouseEvent<HTMLElement>,
    category: Category
  ) => {
    setDisabledButton(false);
    if (e.currentTarget.dataset.selected === 'false') {
      e.currentTarget.className = selectedClass;
      interests.push(category);
      e.currentTarget.dataset.selected = 'true';
    } else {
      e.currentTarget.className = notSelectedClass;
      interests.splice(interests.indexOf(category), 1);
      e.currentTarget.dataset.selected = 'false';
    }

    if (chosenCategories) {
      //@ts-ignore (it thinks it's undefined because of the question mark in props. We may or may not pass it depending of where it comes )
      setChosenCategories(interests);
      console.log('these are CategoriesPicked', chosenCategories);
    } else if (userCategories) {
      //@ts-ignore
      setUserCategories(interests);
      console.log('these are userCategories', userCategories);
    }

    return;
  };

  return (
    (userCategories || chosenCategories) && (
      <div className='grid grid-cols-4 grid-flow-auto gap-4 py-4 w-full'>
        {displayCategories.map((category: Category, i) => (
          <h1
            className={
              chosenCategories
                ? notSelectedClass
                : userCategories!.some((cat) => cat.name === category.name)
                ? selectedClass
                : notSelectedClass
            }
            key={i}
            data-selected={
              chosenCategories
                ? 'false'
                : userCategories!.some((cat) => cat.name === category.name)
                ? 'true'
                : 'false'
            }
            onClick={(e) => {
              onClickAddOrDeleteCategory(e, category);
            }}
          >
            {category.name}
          </h1>
        ))}
      </div>
    )
  );
};

export default CategoriesContainer;

