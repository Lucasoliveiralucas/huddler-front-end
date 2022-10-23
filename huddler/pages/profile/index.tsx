import React, { useEffect, useRef, useState } from 'react';
import Avatar from '../../src/components/Profile components/Avatar';
import UserInfo from '../../src/components/Profile components/UserInfo';
import useSWR from 'swr';
import HuddleCarousel from '../../src/components/Profile components/HuddleCarousel';
import {
  fetcher,
  recommendedForUser,
  userGoingNotCreated,
} from '../../src/utils/helperFunctions';
import { Category, Huddle, User } from '../../src/types';
import MobileAvatar from '../../src/components/Profile components/MobileAvatar';
import {
  getUserById,
  getUserCreatedHuddles,
  getUserGoingHuddles,
} from '../../src/utils/APIServices/userServices';
import { getHuddlesInCategory } from '../../src/utils/APIServices/categoryServices';
import HuddleCarouselItem from '../../src/components/Profile components/HuddleCarouselItem';
import { withSSRContext } from 'aws-amplify';
import { NextApiResponse } from 'next/types';
import { NextApiRequest } from 'next/types';
import {
  sortHuddlesByDate,
  getActiveHuddles,
} from '../../src/utils/helperFunctions';
import { GrDuplicate } from 'react-icons/gr';
import Link from 'next/link';

type Props = {
  aws_id: string;
  user: User;
  goingTo: Huddle[];
  recommended: Huddle[];
  huddles: Huddle[];
};

function Profile({ aws_id, user, goingTo, recommended, huddles }: Props) {
  //This is for updating the huddles i'm going to row
  const [update, setUpdate] = useState(false);
  const [huddlesUserIsGoing, setHuddlesUserIsGoing] = useState<Huddle[]>();
  const [userCreatedHuddlesActive, setUserCreatedHuddlesActive] =
    useState<Huddle[]>();
  const [lastRow, setLastRow] = useState({
    name: 'Recommended',
    huddles: recommended,
  });
  //Get user id from auth for the tag hook
  const { data: tags, error: tagsError } = useSWR(
    `https://u4pwei0jaf.execute-api.eu-west-3.amazonaws.com/test/users_categories?user-id=${aws_id}`,
    fetcher
  );

  // const { data: userCreatedHuddles, error: userHuddleError } =
  //   useSWR(
  //     `https://u4pwei0jaf.execute-api.eu-west-3.amazonaws.com/test/huddles_user_created?user-id=${aws_id}`,
  //     fetcher
  //   ) || [];

  //   const userCreatedHuddlesActive = userCreatedHuddles?.length
  //     ? getActiveHuddles(userCreatedHuddles)
  //     : [];

  const getter = async () => {
    // console.log('goingTo', goingTo)

    try {
      const userCreatedHuddles = await getUserCreatedHuddles(aws_id);
      const userCreatedHuddlesActive = getActiveHuddles(userCreatedHuddles);
      setUserCreatedHuddlesActive(userCreatedHuddlesActive);
      const finalGoing = await userGoingNotCreated(
        userCreatedHuddlesActive,
        aws_id
      );
      setHuddlesUserIsGoing(finalGoing);
    } catch (err) {
      console.log('Error sorting or filtering huddles', err);
    }
  };

  useEffect(() => {
    getter();
  }, [update]);

  const changeDisplayedCategory = async (category: Category) => {
    const data = await getHuddlesInCategory(category.id);
    if (lastRow.name == category.name) {
      document.getElementById(category.name)?.classList.remove('bg-orange-600');
      document
        .getElementById(category.name)
        ?.classList.remove('text-palette-light');
      document.getElementById(category.name)?.classList.remove('border-none');
      setLastRow({
        name: 'Recommended',
        huddles: recommended,
      });
    } else {
      document.getElementById(category.name)?.classList.add('bg-orange-600');
      document
        .getElementById(category.name)
        ?.classList.add('text-palette-light');
      document.getElementById(category.name)?.classList.add('border-none');
      setLastRow({ name: category.name, huddles: data });
    }
  };

  if (tagsError) return <div>failed to load</div>;
  if (!tags) return <div>loading...</div>;

  return (
    <main className='flex flex-col mt-20 lg:mt-8 lg:grid lg:grid-cols-3 xl:grid-cols-4 h-full py-8 lg:bg-palette-light max-w-[99vw] gap-1'>
      <div className='hidden lg:flex flex-col relative h-full max-h-[90vh]'>
        <div
          className='flex flex-col h-full items-center
          '
        >
          <Avatar user={user} />
          <UserInfo
            numOfCreatedHuddles={
              userCreatedHuddlesActive ? userCreatedHuddlesActive.length : 0
            }
            huddlesUserIsGoing={
              huddlesUserIsGoing ? huddlesUserIsGoing.length : 0
            }
          />
          <div className='h-1/9 w-full flex flex-col justify-center mt-8 border px-3'>
            <h1 className="text-3xl font-karla text-palette-dark self-center mt-4 lg:mt-0">
              UPCOMING HUDDLE
            </h1>
            <div className='mt-2 border-palette-dark hover:border-palette-orange bg-white bg-opacity-50 border rounded-lg flex justify-center'>
              {huddlesUserIsGoing && (
                huddlesUserIsGoing.length && (
                  <div className='flex flex-col'>
                    <p>{huddlesUserIsGoing[0].name}</p>
                    <p>{huddlesUserIsGoing[0].day_time}</p>
                    <Link href={{ pathname: `/details/${huddlesUserIsGoing[0].id}`, query: huddlesUserIsGoing[0] }}>
                      <h1 className="font-bold text-palette-dark text-lg cursor-pointer hover:text-palette-orange hover:underline">
                        Event Page
                      </h1>
                    </Link>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className=' lg:hidden w-full h-auto flex-col'>
        <MobileAvatar user={user} />
        <UserInfo
          numOfCreatedHuddles={
            userCreatedHuddlesActive ? userCreatedHuddlesActive.length : 0
          }
          huddlesUserIsGoing={
            huddlesUserIsGoing ? huddlesUserIsGoing.length : 0
          }
        />
      </div>

      <div className='h-full w-full col-span-2 xl:col-span-3 overflow-auto ml-0'>
        <h1 className='pt-8 px-4 text-3xl font-yantra  text-palette-dark font-medium md:pl-10 lg:pl-0'>
          Interests:
        </h1>
        {Array.isArray(tags) && (
          <div className='flex flex-wrap gap-4 p-4 md:pl-10 lg:pl-0'>
            {tags.map((tag: Category, i: number) => (
              <h1
                id={tag.name}
                onClick={(e) => changeDisplayedCategory(tag)}
                className='p-4
  text-center
  font-bold
  py-0.5
  rounded-2xl
  border-palette-dark
  border-[1px]
  bg-tansparent
  text-palette-dark
  cursor-pointer
  active:translate-x-[1px]
  active:translate-y-[1px]
  hover:opacity-50'
                key={i}
              >
                {tag.name}
              </h1>
            ))}
          </div>
        )}

        {Array.isArray(userCreatedHuddlesActive) &&
          userCreatedHuddlesActive.length ? (
          <>
            <h1 className='pt-2 text-3xl font-bold font-yantra text-palette-dark'>
              Created huddles:
            </h1>
            <HuddleCarousel
              setUpdate={setUpdate}
              update={update}
              huddles={sortHuddlesByDate(userCreatedHuddlesActive)}
              huddlesUserIsGoing={huddlesUserIsGoing}
              id={aws_id}
            />
          </>
        ) : (
          <></>
        )}

        {Array.isArray(huddlesUserIsGoing) && huddlesUserIsGoing.length ? (
          <>
            <h1 className='pt-4 text-3xl font-yantra text-palette-dark font-medium'>
              Other Huddles that I&lsquo;m going to:
            </h1>
            <HuddleCarousel
              setUpdate={setUpdate}
              update={update}
              huddles={huddlesUserIsGoing}
              huddlesUserIsGoing={huddlesUserIsGoing}
              id={aws_id}
            />
          </>
        ) : (
          <></>
        )}

        {Array.isArray(lastRow.huddles) && lastRow.huddles.length ? (
          <>
            <h1 className='pt-4 text-3xl text-palette-dark font-medium'>
              {lastRow.name} huddles:
            </h1>
            <HuddleCarousel
              setUpdate={setUpdate}
              update={update}
              huddles={lastRow.huddles}
              huddlesUserIsGoing={huddlesUserIsGoing}
              id={aws_id}
            />
          </>
        ) : (
          <h1 className='pt-6 sm:py-6 p-4 text-3xl font-karla font-extralight'>
            {
              " We don't have huddles to recommend you yet. Try adding more interests to your profile."
            }
          </h1>
        )}
      </div>
    </main>
  );
}

export default Profile;

type Context = {
  req: NextApiRequest;
  res: NextApiResponse;
};

export const getServerSideProps = async ({ req, res }: Context) => {
  const { Auth } = withSSRContext({ req });

  try {
    const huddles: Huddle[] = await fetcher(
      'https://u4pwei0jaf.execute-api.eu-west-3.amazonaws.com/test/HuddlesFormatted'
    );
    const { username } = await Auth.currentUserInfo();
    const goingTo: Huddle[] = await getUserGoingHuddles(username);
    const recommended: Huddle[] = await recommendedForUser(username, goingTo);
    const user: User[] = await getUserById(username);
    if (!user.length) {
      res.writeHead(302, { Location: '/' });
      res.end();
      return {
        props: {},
      };
    }
    return {
      props: {
        aws_id: username,
        user: user.pop(),
        goingTo,
        recommended,
        huddles,
      },
    };
  } catch (err) {
    res.writeHead(302, { Location: '/' });
    res.end();
    return {
      props: {},
    };
  }
};

