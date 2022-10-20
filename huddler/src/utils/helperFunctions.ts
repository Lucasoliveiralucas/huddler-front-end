import { Auth } from 'aws-amplify';
import dayjs from 'dayjs';
import { Category, Huddle } from '../types';
import { getHuddlesInCategory } from './APIServices/categoryServices';
import {
  getUserCategories,
  getUserCreatedHuddles,
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

//For now this functions returns all the huddles that are in user categories. Eventually we should do some kind of sorting or also recommend by location. Now we don't have enough huddles in each categories to test it.

export const recommendedForUser = async (
  aws_id: string,
  userGoingTo: Huddle[]
) => {
  // console.log('huddles going to', userGoingTo)

  // 1. We receive as prop the categories the user is going
  // 2. Get all the huddles in all categories the user is inteterested to
  // 3. Get all the huddles the user has created
  // 4. If there are no huddles created or that the user is going we return as recommended all the huddles in the categories he is interested to
  // 5. If he has created but not goint to any, we return early those he did not created
  // 6. If he has not created but going to some, we return early those he is not going to
  // 7. If he is going to some, and also has created, we need to recommend only those he has not created and not going to.

  // 2. Get all the huddles in all categories the user is inteterested to
  const userCategories = await getUserCategories(aws_id);
  const promises = userCategories.map((category: Category) =>
    getHuddlesInCategory(category.id as number)
  );
  const huddlesInCategories = await Promise.all(promises);
  const huddlesInCategoriesArr = huddlesInCategories.reduce(
    (previousValue, currentValue) => [...previousValue, ...currentValue],
    []
  );
  // console.log('huddles in categories', huddlesInCategoriesArr);

  // 3. Get all the huddles the user has created
  const userCreated = await getUserCreatedHuddles(aws_id);
  // console.log('user created huddles', userCreated);

  // 4. If there are no huddles created or that the user is going we return as recommended all the huddles in the categories he is interested to
  if (!userCreated.length && !userGoingTo.length) {
    console.log(
      'User has not created huddles and is not going to any. Return all huddles in categories'
    );
    return sortHuddlesByDate(getActiveHuddles(huddlesInCategoriesArr));
  }

  const recommend: Huddle[] = [];
  const finalRecommendation: Huddle[] = [];
  let activeRecommend = [];
  // 5. If he has created but not goint to any, we return early those he did not created
  if (userCreated.length && !userGoingTo.length) {
    huddlesInCategoriesArr.forEach((huddle: Huddle) => {
      if (!userCreated!.some((hud: Huddle) => hud.id === huddle.id)) {
        recommend.push(huddle);
      }
    });
    activeRecommend = sortHuddlesByDate(getActiveHuddles(recommend));
    console.log(
      'User has created huddles, but is not going to any. Recommendations ',
      activeRecommend
    );
    return activeRecommend;
  }

  // 6. If he has not created but going to some, we return early those he is not going to
  if (!userCreated.length && userGoingTo.length) {
    huddlesInCategoriesArr.forEach((huddle: Huddle) => {
      if (!userGoingTo!.some((hud: Huddle) => hud.id === huddle.id)) {
        recommend.push(huddle);
      }
    });
    activeRecommend = sortHuddlesByDate(getActiveHuddles(recommend));
    console.log(
      'User has not created huddles, but is going to some. Recommendations ',
      activeRecommend
    );
    return activeRecommend;
  }

  // 7. If he is going to some, and also has created, we need to recommend only those he has not created and not going to.

  //7.1
  huddlesInCategoriesArr.forEach((huddle: Huddle) => {
    if (!userCreated!.some((hud: Huddle) => hud.id === huddle.id)) {
      recommend.push(huddle);
    }
  });

  //7.2
  recommend.forEach((huddle: Huddle) => {
    if (!userGoingTo!.some((hud: Huddle) => hud.id === huddle.id)) {
      finalRecommendation.push(huddle);
    }
  });
  activeRecommend = sortHuddlesByDate(getActiveHuddles(finalRecommendation));

  console.log(
    'User has created huddles and is going to other people huddles. Recommendations',
    activeRecommend
  );
  return activeRecommend;
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
    //@ts-ignore
    (huddle) => new Date(huddle.day_time) > Date.now()
  );
};



