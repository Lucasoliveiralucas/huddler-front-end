import React, { useEffect, useState } from "react";
import Image from "next/future/image";
import { Huddle, User } from "../../types";
import { dateFormatter, fetcher, truncate } from "../../utils/helperFunctions";
import {
  getHuddleCategories,
  getUsersGoingToHuddle,
  postUserGoingToHuddle,
  removeUserGoingToHuddle,
} from "../../utils/APIServices/huddleServices";
import Link from "next/link";
import { useAuth } from "../../contexts/AuthContext";
import { GrGroup } from "react-icons/gr";
import { getUserById } from "../../utils/APIServices/userServices";
import { withSSRContext } from "aws-amplify";
import { NextApiRequest, NextApiResponse } from "next";

type Props = {
  huddle: Huddle;
  huddlesUserIsGoing: Huddle[];
  setUpdate: React.Dispatch<React.SetStateAction<boolean>>;
  update: boolean;
  id: string;
};

function HuddleCarouselItem({
  huddle,
  huddlesUserIsGoing,
  setUpdate,
  update,
  id,
}: Props) {
  const [going, setGoing] = useState(false);
  //getting additional huddle data
  const [data, setData] = useState({
    attending: 0,
    categories: [{ name: "", id: 0 }],
  });
  const [dateTime, setDateTime] = useState<any>();
  useEffect(() => {
    try {
      const date = dateFormatter(huddle.day_time);
      setDateTime(date);
    } catch (err) { }
    if (huddlesUserIsGoing) {
      huddlesUserIsGoing.find((h) => h.id === huddle.id)
        ? setGoing(true)
        : setGoing(false);
    }
    const getter = async () => {
      const attending = await getUsersGoingToHuddle(huddle.id);
      const categories = await getHuddleCategories(huddle.id);

      setData({ attending: attending.length, categories });
    };
    getter();
  }, []);
  const toggleGoingToHuddle = async (isGoing: boolean) => {
    const item = document.getElementById(huddle.description);
    console.log(item);

    if (isGoing) await postUserGoingToHuddle(id, huddle.id);
    else {
      item?.classList.remove("animate-slide-in");
      item?.classList.add("animate-slide-out");
      await removeUserGoingToHuddle(id, huddle.id);
    }

    setUpdate(!update);
  };
  return (
    <div className="flex flex-col h-full ">
      <div className="flex flex-row h-full">
        <div className="basis-1/4 relative lg:h-[180px]">
          <picture>
            <img
              src={huddle.image}
              alt={huddle.name}
              className="absolute h-[200px] md:h-full object-cover rounded-tl-md rounded-br-lg"
            />
          </picture>
        </div>

        <div className="basis-3/4 flex flex-col mt-2 ml-2">
          <div id="title" className="flex flex-row justify-between">
            {/* @ts-ignore */}
            <Link href={{ pathname: `/details/${huddle.id}`, query: huddle }}>
              <h1 className="font-bold text-palette-dark text-lg cursor-pointer hover:text-palette-orange hover:underline">
                {truncate(huddle.name)}
              </h1>
            </Link>
            <div className="">
              {going ? (
                <button
                  className="justify-center leave-button mr-1 lg:mr-2"
                  onClick={(e) => {
                    setGoing(!going);
                    toggleGoingToHuddle(false);
                  }}
                >
                  Leave
                </button>
              ) : (
                <button
                  className="justify-center orange-button mr-1 lg:mr-2"
                  onClick={(e) => {
                    setGoing(!going);
                    toggleGoingToHuddle(true);
                  }}
                >
                  Join
                </button>
              )}
            </div>
          </div>
          {/* @ts-ignore */}
          <Link href={{ pathname: `/details/${huddle.id}`, query: huddle }}>
            <div id="details" className="flex flex-col cursor-pointer text-sm">
              <p>{huddle.description}</p>
              {dateTime ? (
                <p className="text-sm italic pt-2">
                  {huddle.address} {dateTime.monthDayYear} at {dateTime.time}
                </p>
              ) : (
                <p> {huddle.address}</p>
              )}

              <div className="flex flex-row mt-2">
                <GrGroup />
                <p className="ml-2 -mt-1">{data.attending}</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      <div id="tags" className="grid grid-cols-4 gap-2 mx-2 pb-1">
        {data.categories.map((category, i) => {
          return (
            <>
              {
                i < 4 && <p
                  className="text-center font-bold py-0.5 rounded-2xl border-palette-dark border-[1px] bg-tansparent text-palette-dark"
                  key={category.id}
                >
                  {category.name}
                </p>
              }</>
          );
        })}
      </div>
    </div>
  );
}

export default HuddleCarouselItem;

type Context = {
  req: NextApiRequest;
  res: NextApiResponse;
};

export const getServerSideProps = async ({ req, res }: Context) => {
  const { Auth } = withSSRContext({ req });

  try {
    const { username } = await Auth.currentUserInfo();

    const user: User[] = await getUserById(username);
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
        user: user.pop(),
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
