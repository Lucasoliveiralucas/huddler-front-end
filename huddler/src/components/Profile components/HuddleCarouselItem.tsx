import React, { useEffect, useState } from "react";
import Image from "next/future/image";
import { Huddle, User } from "../../types";
import { dateFormatter, fetcher } from "../../utils/helperFunctions";
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
  aws_id: string;
  user: User;
};

function HuddleCarouselItem({
  huddle,
  huddlesUserIsGoing,
  setUpdate,
  update,
  aws_id,
  user,
}: Props) {
  const [going, setGoing] = useState(false);
  //getting additional huddle data
  const [data, setData] = useState({
    attending: 0,
    categories: [{ name: "", id: 0 }],
  });
  useEffect(() => {
    let dateTime: any = "";
    try {
      dateTime = dateFormatter(huddle.day_time);
    } catch (err) {}
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
    isGoing
      ? await postUserGoingToHuddle(id, huddle.id)
      : await removeUserGoingToHuddle(id, huddle.id);

    setUpdate(!update);
  };
  return (
    <div className="flex flex-col">
      <div className="flex flex-row">
        <div className="basis-1/4 relative">
          <Link href={{ pathname: `/details/${huddle.id}`, query: huddle }}>
            <picture>
              <img
                src={huddle.image}
                alt={huddle.name}
                className="absolute h-full object-cover rounded-tl-md rounded-br-lg"
              />
            </picture>
          </Link>
        </div>

        <div className="basis-3/4 flex flex-col mt-4 ml-4">
          <div id="title" className="flex flex-row justify-between">
            <h1 className="font-extrabold text-palette-dark text-2xl">
              {huddle.name}
            </h1>

            <div className="">
              {going ? (
                <button
                  className="justify-center orange-button mr-6"
                  onClick={(e) => {
                    setGoing(!going);
                    setUpdate(!update);
                    removeUserGoingToHuddle(aws_id, huddle.id);
                  }}
                >
                  Leave
                </button>
              ) : (
                <button
                  className="justify-center orange-button mr-6"
                  onClick={(e) => {
                    setGoing(!going);
                    setUpdate(!update);
                    postUserGoingToHuddle(aws_id, huddle.id);
                  }}
                >
                  Join
                </button>
              )}
            </div>
          </div>

          <div id="details" className="flex flex-col">
            <p>{huddle.description}</p>
            <p className="text-sm italic pt-2">
              {huddle.address}
              {dateTime.monthDayYear} at {dateTime.time}
            </p>

            <div className="flex flex-row mt-2">
              <GrGroup />
              <p className="ml-2 -mt-1">{data.attending}</p>
            </div>
          </div>
        </div>
      </div>

      <div id="tags" className="grid grid-cols-5 gap-2 mx-4 mt-2">
        {data.categories.map((category, i) => {
          return (
            <p
              className="text-center font-bold py-0.5 rounded-2xl border-palette-dark border-[1px] bg-tansparent text-palette-dark"
              key={category.id + (i - i)}
            >
              {category.name}
            </p>
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
