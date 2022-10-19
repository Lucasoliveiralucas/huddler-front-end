import React, { useEffect, useState } from "react";
import Image from "next/future/image";
import { Huddle } from "../../types";
import { dateFormatter } from "../../utils/helperFunctions";
import {
  getHuddleCategories,
  getUsersGoingToHuddle,
  postUserGoingToHuddle,
  removeUserGoingToHuddle,
} from "../../utils/APIServices/huddleServices";
import { useAuth } from "../../contexts/AuthContext";
import { AiOutlineConsoleSql } from "react-icons/ai";
import { GrGroup } from "react-icons/gr";
import Link from "next/link";

type Props = {
  huddle: Huddle;
  huddlesUserIsGoing: Huddle[];
  id: string;
};

function NewHuddleCard({ huddle, huddlesUserIsGoing, id }: Props) {
  const dateTime = dateFormatter(huddle.day_time);
  // dateFormatter(huddle.day_time);
  const [going, setGoing] = useState(false);
  //getting addicional huddle data
  const [data, setData] = useState({
    attending: 0,
    categories: [{ name: "", id: 0 }],
  });

  useEffect(() => {
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

  return (
    // <div id="card-container">
    <div className="flex flex-col">
      <div className="flex flex-row">
        <div className="basis-1/4 relative ">
          <picture className="">
            <img
              src={huddle.image}
              alt={huddle.name}
              className="absolute h-full object-cover rounded-tl-md rounded-br-lg"
            />
          </picture>
        </div>

        <div className="basis-3/4 flex flex-col mt-4 ml-4">
          <div id="title" className="flex flex-row justify-between">
            {/* @ts-ignore */}
            <Link href={{ pathname: `/details/${huddle.id}`, query: huddle }}>
              <h1 className="font-extrabold text-palette-dark text-lg md:text-2xl cursor-pointer">
                {huddle.name}
              </h1>
            </Link>
            <div className="">
              {going ? (
                <button
                  className="justify-center leave-button mr-2 md:mr-6"
                  onClick={(e) => {
                    setGoing(!going);
                    removeUserGoingToHuddle(id, huddle.id);
                  }}
                >
                  Leave
                </button>
              ) : (
                <button
                  className="justify-center orange-button mr-2 md:mr-6"
                  onClick={(e) => {
                    setGoing(!going);
                    postUserGoingToHuddle(id, huddle.id);
                  }}
                >
                  Join
                </button>
              )}
            </div>
          </div>
          {/* @ts-ignore */}
          <Link href={{ pathname: `/details/${huddle.id}`, query: huddle }}>
            <div id="details" className="flex flex-col cursor-pointer">
              <p>{huddle.description}</p>
              <p className="text-sm italic pt-2">
                {huddle.address} {dateTime.monthDayYear} at {dateTime.time}
              </p>

              <div className="flex flex-row mt-2">
                <GrGroup />
                <p className="ml-2 -mt-1">{data.attending}</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
      <div id="tags" className="hidden md:grid grid-cols-5 gap-2 mx-4 mt-2">
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
    // </div>
  );
}

export default NewHuddleCard;
