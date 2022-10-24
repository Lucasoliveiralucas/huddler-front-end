import { Auth } from 'aws-amplify';
import dayjs from 'dayjs';
import { Category, Huddle } from '../types';
import { getHuddlesInCategory } from './APIServices/categoryServices';
import {
  getUserCategories,
  getUserCreatedHuddles,
  getUserGoingHuddles,
} from './APIServices/userServices';

// 1. Fetcher
// 2. Recommended Huddles
// 3. Dates handler
// 4. Sort by name, any array of objects that contains the field name

// 1. Fetcher
export const fetcher = async (...args: string[]) => {
  try {
    // @ts-ignore
    const data = await fetch(...args);
    return await data.json();
  } catch (e) {
    console.log('There has been an error fetching data: ', e);
    return e;
  }
};

// 2. Recommended Huddles

export const recommendedByInterests = async (
  aws_id: string,
  userGoingTo: Huddle[]
) => {
  let activeHuddles: Huddle[] = [];
  let uniqueHuddles: Huddle[] = [];
  let toRecommend: Huddle[] = [];
  let finalRecommendation: Huddle[] = [];

  // Get all the huddles in all categories the user is inteterested to
  const userCategories = await getUserCategories(aws_id);
  const promises = userCategories.map((category: Category) =>
    getHuddlesInCategory(category.id as number)
  );
  const huddlesInUserCategoriesNested = await Promise.all(promises);
  const huddlesInUserCategories = huddlesInUserCategoriesNested.flat();

  // Get all the huddles the user has created
  const userCreated = await getUserCreatedHuddles(aws_id);

  // If there are no huddles created or that the user is going we return as recommended all the huddles in the categories he is interested to
  if (!userCreated.length && !userGoingTo.length) {
    activeHuddles = getActiveHuddles(huddlesInUserCategories);
    uniqueHuddles = filterOutDuplicates(activeHuddles);
    toRecommend = sortHuddlesByDate(uniqueHuddles);
    console.log(
      'User has not created huddles and is not going to any. Return all huddles in categories'
    );
    return toRecommend;
  }

  // If he has created but not going to any, we return early those he did not created
  if (userCreated.length && !userGoingTo.length) {
    toRecommend = filterOutContaining(huddlesInUserCategories, userCreated);
    activeHuddles = getActiveHuddles(toRecommend);
    uniqueHuddles = filterOutDuplicates(activeHuddles);
    finalRecommendation = sortHuddlesByDate(uniqueHuddles);
    console.log(
      'User has created huddles, but is not going to any. Recommendations ',
      finalRecommendation
    );
    return finalRecommendation;
  }

  //If he has not created but going to some, we return early those he is not going to
  if (!userCreated.length && userGoingTo.length) {
    toRecommend = filterOutContaining(huddlesInUserCategories, userGoingTo);
    activeHuddles = getActiveHuddles(toRecommend);
    uniqueHuddles = filterOutDuplicates(activeHuddles);
    finalRecommendation = sortHuddlesByDate(uniqueHuddles);
    console.log(
      'User has not created huddles, but is going to some. Recommendations ',
      finalRecommendation
    );
    return finalRecommendation;
  }

  //If he is going to some, and also has created, we need to recommend only those he has not created and not going to.
  toRecommend = filterOutContaining(huddlesInUserCategories, userCreated);
  finalRecommendation = filterOutContaining(toRecommend, userGoingTo);
  activeHuddles = getActiveHuddles(finalRecommendation);
  uniqueHuddles = filterOutDuplicates(activeHuddles);
  const sortedRecommendation = sortHuddlesByDate(uniqueHuddles);
  console.log(
    'User has created huddles and is going to other people huddles. Recommendations',
    sortedRecommendation
  );
  return sortedRecommendation;
};

// 3. Dates handler
export const dateFormatter = (date: string) => {
  const toFormat = dayjs(date);
  const dateTime = {
    day: toFormat.format('DD'),
    month: toFormat.format('MMMM'),
    year: toFormat.format('YYYY'),
    time: toFormat.format('HH:mm'),
    monthDayYear: toFormat.format('MMMM DD, YYYY'),
  };
  return dateTime;
};

export const nowFormatted = () => {
  return dayjs(Date.now()).format('YYYY-MM-DDTHH:mm');
};

// 4. Sort by name
export const sortByName = (arrOfObj: Category[]) => {
  return arrOfObj.sort((a, b) => a.name.localeCompare(b.name));
};

export const getSession = async () => {
  const res = await Auth.currentAuthenticatedUser();
  return res.CognitoUser.username;
};

export const sortHuddlesByDate = (huddlesToSort: Huddle[]) => {
  return huddlesToSort.sort((a, b) => {
    return new Date(a.day_time).valueOf() - new Date(b.day_time).valueOf();
  });
};

export const getActiveHuddles = (huddlesToFilter: Huddle[]) => {
  return huddlesToFilter.filter(
    (huddle) => new Date(huddle.day_time).valueOf() > Date.now()
  );
};

export const filterOutDuplicates = (huddlesToFilter: Huddle[]) => {
  return huddlesToFilter.filter(
    (huddle, i, self) => i === self.findIndex((hud) => hud.id === huddle.id)
  );
};

export const userGoingNotCreated = async (
  userCreated: Huddle[],
  aws_id: string
) => {
  const huddlesUserIsGoing = await getUserGoingHuddles(aws_id);
  console.log('huddlesUserISGoing and created', huddlesUserIsGoing);
  console.log('huddles user created', userCreated);
  const activeHuddles = getActiveHuddles(huddlesUserIsGoing);
  const userGoingNotCreated: Huddle[] = filterOutContaining(
    activeHuddles,
    userCreated
  );
  const sortedHuddles = sortHuddlesByDate(userGoingNotCreated);
  return sortedHuddles;
};

const filterOutContaining = (arrToFilter: Huddle[], containsArr: Huddle[]) =>
  arrToFilter.filter(
    (category) => !containsArr.some((cat) => category.id === cat.id)
  );



