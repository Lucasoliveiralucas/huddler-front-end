import { useEffect, useState } from "react";
import { Category, User } from "../../types";
import {
  postUserCategory,
  deleteOneUserCategory,
  getUserCategories,
} from "../../utils/APIServices/userServices";
import CategoriesContainer from "../CategoriesContainer";

type Props = {
  userData: User;
};
const UpdateInterests = ({ userData }: Props) => {
  let [userCategories, setUserCategories] = useState<Category[]>();
  let [disabledButton, setDisabledButton] = useState(true);
  let [initial, setInitial] = useState<Category[]>()
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadUserCategories();
  }, []);

  const loadUserCategories = async () => {
    const categories = await getUserCategories(userData.aws_id);
    setUserCategories([...categories]);
    setInitial([...categories])
  };

  // const initialCategories = userCategories && [...userCategories];
  console.log('initial categories', initial)
  const onClickUpdateUserInterests = () => {
    const toDelete: Category[] = [];
    const toAdd: Category[] = [];

    // Detect and update if user added or deleted categories from the initial categories
    userCategories!.forEach((category) => {
      if (!initial!.some((cat) => cat.name === category.name)) {
        toAdd.push(category);
      }
    });
    initial!.forEach((category) => {
      if (!userCategories!.some((cat) => cat.name === category.name))
        toDelete.push(category);
    });

    console.log("to add", toAdd);

    toAdd.forEach((category) => {
      postUserCategory(userData.aws_id, category.id as number);
    });

    console.log("to delete", toDelete);
    toDelete.forEach((category) => {
      deleteOneUserCategory(userData.aws_id, category.id as number);
    });
    setSuccess("Success! You updated your interests");
    return;
  };

  return (
    <>
      <div className="flex flex-col mx-3 items-center mt-10 md:mt-32 lg:mt-0">
        <h1 className="text-2xl font-bold font-yantra">YOUR INTEREST</h1>
        <div className="w-full">
          {/* @ts-ignore */}
          <CategoriesContainer
            userCategories={userCategories}
            setUserCategories={setUserCategories}
            setDisabledButton={setDisabledButton}
          />
        </div>
        <div className="flex justify-center">
          {success ? (
            <>
              <div className="text-[#145725] bg-[#D5EDDB] p-5 rounded-md">
                {success}
              </div>
              <br />
            </>
          ) : (
            <button
              // className='border-none bg-palette-dark hover:bg-opacity-60 hover:cursor-pointer rounded-md shadow-md text-white text-2xl mt-2 py-2 px-5'
              className="leave-button flex text-2xl py-2 px-5 my-4"
              type="submit"
              disabled={disabledButton}
              onClick={onClickUpdateUserInterests}
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default UpdateInterests;
