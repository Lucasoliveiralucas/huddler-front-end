import React, { useEffect, useState } from "react";
import Huddles from "../../src/components/Home-components/Huddles";
import Map from "../../src/components/Home-components/Map";
import { getAllHuddles } from "../../src/utils/APIServices/huddleServices";
import {
  fetcher,
  getSession,
  recommendedForUser,
} from "../../src/utils/helperFunctions";
import { Huddle, User } from "../../src/types";
import HuddlesNew from "../../src/components/Home-components/HuddlesNew";
import useSWR from "swr";
import { AiOutlineArrowUp } from "react-icons/ai";
import MobileMap from "../../src/components/Home-components/MobileMap";
import { useAuth } from "../../src/contexts/AuthContext";
import { Auth, withSSRContext } from "aws-amplify";
import { getUserById } from "../../src/utils/APIServices/userServices";
import { GetServerSideProps } from "next/types";

type Props = {
  recommended: Huddle[];
  huddlesUserIsGoing: Huddle[];
  huddles: Huddle[];
  user: User;
};

function Home({ recommended, huddles, user }: Props) {
  let id = '';
  const [filterChoice, setFilterChoice] = useState<Huddle[]>(huddles); //by default recommended
  const [update, setUpdate] = useState(false); //for going to event or not
  const [mobileShowMap, setMobileShowMap] = useState(false);
  const [huddlesUserIsGoing, setHuddlesUserIsGoing] = useState<Huddle[]>();

  useEffect(() => {
    if (recommended.length) {
      setFilterChoice(recommended)
    }
  }, [])

  const setToAllHuddles = async () => {
    try {
      const data = await getAllHuddles();
      setFilterChoice(data);
    } catch (err) { }
    return;
  };
  // if user uses another filter let's call a function that does it.
  // if (userHuddleError) return <div>failed to load</div>;
  // if (!userCreatedHuddles || !recommended) return <div>loading...</div>;

  return (
    <div className="sm:block md:flex xl:gap-10 mt-20 relative h-full lg:px-0 2xl:px-10">
      <div className="flex flex-col w-screen h-full" id="0">
        <div className="flex py-3 px-10 text-orange-900 shadow-md justify-around md:justify-start" id="1">
          <button className="mr-4"
            onClick={() => setFilterChoice(recommended)}>
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
            <MobileMap huddles={filterChoice} />
          </div>
        )}

        <HuddlesNew
          huddles={filterChoice}
          update={update}
          huddlesUserIsGoing={huddlesUserIsGoing}
          id={user.aws_id}
        />
      

      <div className="hidden sticky lg:flex ">
        <Map huddles={filterChoice} update={update} id={user.aws_id} />
      </div>
      </div>
      
      </div>
    </div>

  );
}

export default Home;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const { Auth } = withSSRContext({req});

  try {
    const huddles: Huddle[] = await fetcher(
      "https://u4pwei0jaf.execute-api.eu-west-3.amazonaws.com/test/HuddlesFormatted"
    );
    const { username } = await Auth.currentUserInfo();
    const recommended: Huddle[] = await recommendedForUser(username);
    const user: User[] = await getUserById(username);
    return {
      props: {
        aws_id: username,
        username,
        user: user.pop(),    
        recommended,
        huddles,
      }
    }
  } catch (err) {
    res.writeHead(302, { Location: '/' })
    res.end()
    return {
      props: {}
    }
  }
}
