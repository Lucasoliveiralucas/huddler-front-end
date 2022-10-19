import { fetcher } from '../helperFunctions';

// GET Functions

export const getAllCategories = async () =>
  await fetcher(`${process.env.NEXT_PUBLIC_AWS_URL}get-all-categories`);

// Returns: Array of Huddle Objects

export const getUsersInCategory = async (category_id: number) =>
  await await fetcher(
    `${process.env.NEXT_PUBLIC_AWS_URL}getusers_bycategory?category-id=${category_id}`
  );
//Returns: Array of User Objects

export const getHuddlesInCategory = async (category_id?: number) => {
  return await fetcher(
    `${process.env.NEXT_PUBLIC_AWS_URL}gethuddles_bycategory?category-id=${category_id}`
  );
};

//Returns: Array of Huddle Objects




