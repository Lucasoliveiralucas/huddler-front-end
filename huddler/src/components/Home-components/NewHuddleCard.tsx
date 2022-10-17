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

type Props = {
  huddle: Huddle;
  huddlesUserIsGoing: Huddle[];
};

function NewHuddleCard({
  huddle,
  huddlesUserIsGoing,
}: Props) {
  const { currentUser } = useAuth();
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
    <div className="ml-3 mr-3 mt-3">
      <div className="flex mb-1">
        <h1 className="font-extrabold text-palette-orange text-2xl">
          {huddle.name}
        </h1>
        <div className="ml-auto mr-3">
          {going ? (
            <button
              className="justify-center w-14 bg-palette-orange bg-opacity-40 text-lg border-solid border-[0.5px] border-palette-orange shadow-md rounded-lg hover:bg-opacity-60"
              onClick={(e) => {
                setGoing(!going);
                removeUserGoingToHuddle(currentUser, huddle.id);
              }}
            >
              Leave
            </button>
          ) : (
            <button
              className="justify-center w-14 bg-palette-orange bg-opacity-40 text-lg border-solid border-[0.5px] border-palette-orange shadow-md rounded-lg hover:bg-opacity-60"
              onClick={(e) => {
                setGoing(!going);
                postUserGoingToHuddle(currentUser, huddle.id);
              }}
            >
              Join
            </button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 md:flex h-full">
        <div className="flex">
          <div className="h-3/4 md:w-[24rem] mr-3">
            <div className="rounded-lg h-32 lg:h-40 md:w-3/4 relative">
              <Image
                fill
                src={huddle.image}              
                alt={huddle.name}
                sizes="100vw"
                placeholder="empty"
                className="rounded-lg object-contain"
              />
            </div>

            <p>attending: {data.attending}</p>

            <div className="hidden md:grid grid-cols-2 gap-2">
              {data.categories.map((category, i) => {
                return (
                  i <= 3 && (
                    <p
                      className="text-center py-0.5 bg-palette-dark rounded-md text-white"
                      key={category.id + (i - i)}
                    >
                      {category.name}
                    </p>
                  )
                );
              })}
            </div>
            {/* Mobile */}
            <div className="grid md:hidden grid-cols-2 gap-2 py-1">
              {data.categories.map((category, i) => {
                return (
                  i <= 1 && (
                    <p
                      className="text-center py-0.5 bg-palette-dark rounded-md text-white"
                      key={category.id + (i - i)}
                    >
                      {category.name}
                    </p>
                  )
                );
              })}
            </div>
          </div>
          {/* Description */}
          <div className="grid max-w-[300px] md:h-56 py-2 w-full space-x-0 ">
            <p>{huddle.description}</p>
            <p className="text-sm self-end">
              At {huddle.address}
              <br></br>
              {dateTime.monthDayYear} at {dateTime.time}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewHuddleCard;
