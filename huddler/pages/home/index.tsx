import React, { useEffect, useState } from 'react';
import Map from '../../src/components/Home-components/Map';
import { getAllHuddles } from '../../src/utils/APIServices/huddleServices';
import {
  fetcher,
  recommendedByInterests,
} from '../../src/utils/helperFunctions';
import { Huddle, User } from '../../src/types';
import HuddlesNew from '../../src/components/Home-components/HuddlesNew';
import { AiOutlineArrowUp } from 'react-icons/ai';
import MobileMap from '../../src/components/Home-components/MobileMap';
import { withSSRContext } from 'aws-amplify';
import { NextApiResponse, NextApiRequest } from 'next';
import {
  getUserById,
  getUserGoingHuddles,
} from '../../src/utils/APIServices/userServices';
import DropdownMenu from '../../src/components/Home-components/DropdownMenu';

type Props = {
  recommended: Huddle[];
  huddlesUserIsGoing: Huddle[];
  huddles: Huddle[];
  goingTo: Huddle[];
  user: User;
};

function Home({ recommended, huddles, user, goingTo }: Props) {
  const [filterChoice, setFilterChoice] = useState<Huddle[]>(huddles); //by default recommended
  const [mobileShowMap, setMobileShowMap] = useState(false);
  const [revertCatBtn, setRevertCatBtn] = useState(false);
  const [huddlesUserIsGoing, setHuddlesUserIsGoing] =
    useState<Huddle[]>(goingTo);

  useEffect(() => {
    setHuddlesUserIsGoing(goingTo);
    if (recommended.length) {
      setFilterChoice(recommended);
    }
    console.log(huddlesUserIsGoing);
  }, []);

  const updateList = async () => {
    const response = await getUserGoingHuddles(user.aws_id);
    setHuddlesUserIsGoing(await response);
    console.log(huddlesUserIsGoing);
  };

  const setToAllHuddles = async () => {
    try {
      const data = await getAllHuddles();
      setFilterChoice(data);
    } catch (err) {}
    return;
  };

  return (
    <>
      <div className='sm:block md:flex xl:gap-10 mt-20 h-full lg:px-0 2xl:px-10'>
        <div
          className='flex flex-col w-full'
          id='0'
        >
          <div
            className='flex h-[50px] lg:px-10 text-orange-900 shadow-md justify-start gap-4 w-full px-2'
            id='1'
          >
            <button
              className='mr-4 font-karla text-palette-dark'
              onClick={() => {
                setRevertCatBtn(!revertCatBtn);
                setFilterChoice(recommended);
              }}
            >
              Recommended
            </button>
            <button
              className='mr-4 font-karla text-palette-dark'
              onClick={() => {
                setRevertCatBtn(!revertCatBtn);
                setToAllHuddles();
              }}
            >
              All Huddles
            </button>
            <button
              onClick={() => setMobileShowMap(!mobileShowMap)}
              className='lg:hidden'
            >
              {mobileShowMap ? (
                <div className='flex items-center justify-center '>
                  <p>Map</p>
                  <AiOutlineArrowUp />
                </div>
              ) : (
                <div className='flex'>
                  <p>Map</p>
                  <AiOutlineArrowUp className=' rotate-180' />
                </div>
              )}{' '}
            </button>

            <DropdownMenu
              setFilterChoice={setFilterChoice}
              revert={revertCatBtn}
            />
          </div>

          <div
            className='flex md:max-h-[87vh] md:py-6 md:px-10'
            id='carousel 2'
          >
            {/* <Huddles huddles={filterChoice} /> */}
            {mobileShowMap && (
              <div className='absolute lg:hidden block h-full w-full z-30'>
                <MobileMap
                  huddles={filterChoice}
                  user={user}
                  updateList={updateList}
                />
              </div>
            )}

            <HuddlesNew
              huddles={filterChoice}
              updateList={updateList}
              huddlesUserIsGoing={huddlesUserIsGoing}
              id={user.aws_id}
            />

            <div className='hidden sticky lg:flex '>
              <Map
                huddles={filterChoice}
                user={user}
                updateList={updateList}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;

type Context = {
  req: NextApiRequest;
  res: NextApiResponse;
};

export const getServerSideProps = async ({ req, res }: Context) => {
  const { Auth } = withSSRContext({ req });

  try {
    const huddles: Huddle[] = await getAllHuddles();
    const { username } = await Auth.currentUserInfo();
    const user: User[] = await getUserById(username);
    const goingTo: Huddle[] = await getUserGoingHuddles(username);
    const recommended: Huddle[] = await recommendedByInterests(
      username,
      goingTo
    );
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
        username,
        user: user.pop(),
        recommended,
        goingTo,
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

