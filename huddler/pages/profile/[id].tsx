import React, { useEffect, useRef, useState } from "react";
import Avatar from "../../src/components/Profile components/Avatar";
import UserInfo from "../../src/components/Profile components/UserInfo";
import useSWR from "swr";
import HuddleCarousel from "../../src/components/Profile components/HuddleCarousel";
import { fetcher, recommendedForUser } from "../../src/utils/helperFunctions";
import { Category, Huddle, User } from "../../src/types";
import MobileAvatar from "../../src/components/Profile components/MobileAvatar";
import { getUserById, getUserGoingHuddles } from "../../src/utils/APIServices/userServices";
import { getHuddlesInCategory } from "../../src/utils/APIServices/categoryServices";
import HuddleCarouselItem from "../../src/components/Profile components/HuddleCarouselItem";
import { withSSRContext } from 'aws-amplify';
import { GetServerSideProps } from "next/types";

type Props = {
  aws_id: string;
  user: User;
  goingTo: Huddle[];
  recommended: Huddle[];
  huddles: Huddle[];
};

function Profile({
  aws_id,
  user,
  goingTo,
  recommended,
  huddles, }: Props) {

  //This is for updating the huddles i'm going to row
  const [update, setUpdate] = useState(false);
  const [huddlesUserIsGoing, setHuddlesUserIsGoing] = useState<Huddle[]>(goingTo);
  const [lastRow, setLastRow] = useState({
    name: "Recommended",
    huddles: recommended,
  });
  //Get user id from auth for the tag hook
  const { data: tags, error: tagsError } = useSWR(
    `https://u4pwei0jaf.execute-api.eu-west-3.amazonaws.com/test/users_categories?user-id=${aws_id}`,
    fetcher
  );
  const { data: userCreatedHuddles, error: userHuddleError } =
    useSWR(
      `https://u4pwei0jaf.execute-api.eu-west-3.amazonaws.com/test/huddles_user_created?user-id=${aws_id}`,
      fetcher
    ) || [];

  const getter = () => {
    if (goingTo.length) {
      try {
        const sorted: Huddle[] = goingTo.sort((a: Huddle, b: Huddle) => {
          return new Date(a.day_time).valueOf() - new Date(b.day_time).valueOf();
        });
        setHuddlesUserIsGoing(sorted);
      } catch (err) {
        console.log(err)
      }
    }
  };

  useEffect(() => {
    getter();
  }, [update]);

  const changeDisplayedCategory = async (category: Category) => {
    const data = await getHuddlesInCategory(category.id);
    if (lastRow.name == category.name) {
      document.getElementById(category.name)?.classList.remove("opacity-60");
      setLastRow({
        name: "Recommended",
        huddles: recommended,
      });
    } else {
      document.getElementById(category.name)?.classList.add("opacity-60");
      setLastRow({ name: category.name, huddles: data });
    }
  };


  if (tagsError) return <div>failed to load</div>;
  if (!tags)
    return <div>loading...</div>;

  return (
    <main className="flex flex-col mt-20 lg:grid lg:grid-cols-3 3xl:grid-cols-4 h-full py-8 lg:bg-palette-light max-w-[100vw]">
      <div className="hidden lg:block w-full">
        <div className="fixed min-w-[20%] h-full">
          <div
            className="flex flex-col h-full items-center
          border-x-[0.2px] shadow-md w-full"
          >
            <Avatar user={user} />
            <UserInfo numOfCreatedHuddles={userCreatedHuddles ? userCreatedHuddles.length : 0}
              huddlesUserIsGoing={huddlesUserIsGoing.length} />
            <div className="h-1/9 w-full flex flex-col justify-center mt-8 border gap-6">
              <h1 className="text-3xl self-center mt-10 font-bold">
                Upcoming Huddle
              </h1>
              <div className="self-center mt-3 w-[30rem] h-[18rem] flex-shrink-0 shadow-md border-palette-dark hover:border-palette-orange bg-white bg-opacity-50 border relative rounded-lg">
                {huddlesUserIsGoing.length && <HuddleCarouselItem
                  setUpdate={setUpdate}
                  update={update}
                  huddle={huddlesUserIsGoing[0]}
                  huddlesUserIsGoing={huddlesUserIsGoing}
                />}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="lg:hidden w-full pt-4 h-auto flex-col">
        <MobileAvatar user={user} />
        <UserInfo numOfCreatedHuddles={userCreatedHuddles ? userCreatedHuddles.length : 0}
          huddlesUserIsGoing={huddlesUserIsGoing.length} />
      </div>

      <div className="h-full w-full col-span-2 3xl:col-span-3 overflow-auto ml-0 lg:ml-48 2xl:ml-0">
        <h1 className="pt-8 px-4 text-3xl font-bold pl-10 lg:pl-0">Interests:</h1>
        {Array.isArray(tags) &&
          <div className="flex flex-wrap gap-4 p-4 pl-10 lg:pl-0">
            {tags.map((tag: Category, i: number) => (
              <h1
                id={tag.name}
                onClick={(e) => changeDisplayedCategory(tag)}
                className="text-xl bg-palette-dark py-2 px-4 rounded text-white hover:bg-opacity-60 cursor-pointer"
                key={i}
              >
                {tag.name}
              </h1>
            ))}
          </div>}

        <h1 className="pt-6 sm:py-6 p-4 text-3xl font-bold">
          Created huddles:
        </h1>
        <HuddleCarousel
          setUpdate={setUpdate}
          update={update}
          huddles={userCreatedHuddles}
          huddlesUserIsGoing={huddlesUserIsGoing}
        />

        <h1 className="pt-6 sm:py-6 p-4 text-3xl font-bold">
          Huddles I'm going to:
        </h1>
        <HuddleCarousel
          setUpdate={setUpdate}
          update={update}
          huddles={huddlesUserIsGoing}
          huddlesUserIsGoing={huddlesUserIsGoing}
        />

        <h1 className="pt-6 sm:py-6 p-4 text-3xl font-bold">
          {lastRow.name} huddles:
        </h1>
        <HuddleCarousel
          setUpdate={setUpdate}
          update={update}
          huddles={lastRow.huddles}
          huddlesUserIsGoing={huddlesUserIsGoing}
        />
      </div>
    </main>
  );
}

export default Profile;

export const getServerSideProps:GetServerSideProps = async ({ req , res }) => {
  const { Auth } = withSSRContext({ req });

  try {
    const huddles: Huddle[] = await fetcher("https://u4pwei0jaf.execute-api.eu-west-3.amazonaws.com/test/HuddlesFormatted");
    const { username } = await Auth.currentUserInfo();
    const recommended: Huddle[] = await recommendedForUser(username);
    const goingTo: Huddle[] = await getUserGoingHuddles(username);
    const user: User[] = await getUserById(username);
    return {
      props: {
        aws_id: username,
        user: user.pop(),
        goingTo,
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





