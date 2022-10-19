import React, { useEffect, useState } from "react";
import Map from "../../src/components/Home-components/Map";
import { getAllHuddles } from "../../src/utils/APIServices/huddleServices";
import { fetcher, recommendedForUser } from "../../src/utils/helperFunctions";
import { Huddle, User } from "../../src/types";
import HuddlesNew from "../../src/components/Home-components/HuddlesNew";
import { AiOutlineArrowUp } from "react-icons/ai";
import MobileMap from "../../src/components/Home-components/MobileMap";
import { withSSRContext } from "aws-amplify";
import { NextApiResponse, NextApiRequest } from 'next';
import {
  getUserById,
  getUserGoingHuddles,
} from "../../src/utils/APIServices/userServices";
import { GetServerSideProps } from "next";

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
<<<<<<< HEAD
    <div className="sm:block md:flex xl:gap-10 mt-20 relative h-full lg:px-0 2xl:px-10">
      <div className="flex flex-col w-screen" id="0">
        <div className="flex w-screen py-3 px-10 text-orange-900 shadow-md justify-around md:justify-start" id="1">
          <button className="mr-4"
            onClick={() => setFilterChoice(recommended)}>
=======
    <div className="sm:block md:flex xl:gap-10 mt-6 relative h-full md:px-24 lg:px-1 2xl:px-5">
      <div className="max-h-[87vh] overflow-y-auto w-full" id="carousel">
        <div className="flex p-5 mb-2 shadow-md justify-around md:justify-start">
          <button className="mr-4" onClick={() => setFilterChoice(recommended)}>
>>>>>>> workingBranch
            Recommended
          </button>
          <button onClick={() => setToAllHuddles()}>All Huddles</button>
          <button
            onClick={() => setMobileShowMap(!mobileShowMap)}
            className="lg:hidden"
          >
            {mobileShowMap ? (
              <AiOutlineArrowUp />
            ) : (
              <AiOutlineArrowUp className=" rotate-180" />
            )}{" "}
          </button>
        </div>

      <div className="flex max-h-[87vh] py-6 px-10" id="carousel 2">
        {/* <Huddles huddles={filterChoice} /> */}
        {mobileShowMap && (
          <div className="absolute lg:hidden block h-full w-full z-30">
            <MobileMap huddles={filterChoice} user={user} updateList={updateList} />
          </div>
        )}

        <HuddlesNew
          huddles={filterChoice}
          updateList={updateList}
          huddlesUserIsGoing={huddlesUserIsGoing}
          id={user.aws_id}
        />
      

<<<<<<< HEAD
      <div className="hidden sticky lg:flex ">
        <Map huddles={filterChoice} update={update} id={user.aws_id} />
=======
      <div className="mt-16 hidden lg:flex ">
        <Map huddles={filterChoice} user={user} updateList={updateList} />
>>>>>>> workingBranch
      </div>
      </div>
      
      </div>
    </div>

  );
}

export default Home;

type Context = {
  req: NextApiRequest;
  res: NextApiResponse;
}

export const getServerSideProps = async ({ req, res }:Context) => {
  const { Auth } = withSSRContext({ req });

  try {
    const huddles: Huddle[] = await fetcher(
      "https://u4pwei0jaf.execute-api.eu-west-3.amazonaws.com/test/HuddlesFormatted"
    );
    const { username } = await Auth.currentUserInfo();
    const recommended: Huddle[] = await recommendedForUser(username);
    const user: User[] = await getUserById(username);
    const goingTo: Huddle[] = await getUserGoingHuddles(username);
    if (!user.length) {
      res.writeHead(302, { Location: "/" });
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
    res.writeHead(302, { Location: "/" });
    res.end();
    return {
      props: {},
    };
  }
};
