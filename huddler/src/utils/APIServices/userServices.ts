import useSWRImmutable from 'swr/immutable';
import { Huddle, User } from '../../types';
import { fetcher } from './fetcher';

// GET Functions

export const getAllUsers = () =>
  useSWRImmutable(
    'https://u4pwei0jaf.execute-api.eu-west-3.amazonaws.com/test/getusers',
    fetcher
  );

export const getUserById = (user_id: number) =>
  useSWRImmutable(
    `https://u4pwei0jaf.execute-api.eu-west-3.amazonaws.com/test/getuser_byid?user-id=${user_id}`,
    fetcher
  );

export const getUserCategories = (user_id: number) =>
  useSWRImmutable(
    `https://u4pwei0jaf.execute-api.eu-west-3.amazonaws.com/test/users_categories?user-id=${user_id}`,
    fetcher
  );

export const getUserCreatedHuddles = (user_id: number) =>
  useSWRImmutable(
    `https://u4pwei0jaf.execute-api.eu-west-3.amazonaws.com/test/huddles_user_created?user-id=${user_id}`,
    fetcher
  );

export const getUserGoingHuddles = (user_id: number) =>
  useSWRImmutable(
    `https://u4pwei0jaf.execute-api.eu-west-3.amazonaws.com/test/huddles_user_isgoing?user-id=${user_id}`,
    fetcher
  );






// POST Functions

// export const postUser = async (user: User) => {
//   try {
//     const userToPost = await fetch(,{
//       method: 'PUT',
//       headers: { 'Content-type': 'application/json; charset=UTF-8' },
//       body: JSON.stringify(user),
//         });
//       return userToPost.json()

//   } catch (e) {
//     console.log('Error posting a User in DB')
//   }


// }