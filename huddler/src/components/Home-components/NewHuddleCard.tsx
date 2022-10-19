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
import Link from "next/link";

type Props = {
  huddle: Huddle;
  huddlesUserIsGoing: Huddle[];
  updateList: any;
  id: string;
};

function NewHuddleCard({ huddle, huddlesUserIsGoing, updateList, id }: Props) {
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
        <div className="ml-auto flex gap-4 mr-3">
          <Link
            href={{
              pathname: `/details/${huddle.id}`,
              query: huddle.id?.toString(),
            }}
          >
            <a className=" underline">Event Details</a>
          </Link>
          {going ? (
            <button
              className="justify-center leave-button"
              onClick={(e) => {
                setGoing(!going);
                removeUserGoingToHuddle(id, huddle.id);
                updateList();
              }}
            >
              Leave
            </button>
          ) : (
            <button
              className="justify-center orange-button"
              onClick={(e) => {
                setGoing(!going);
                postUserGoingToHuddle(id, huddle.id);
                updateList();
              }}
            >
              Join
            </button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 h-full">
        <div className="flex flex-col">
          <div className="h-full md:w-[24rem] flex flex-col">
            <div className="flex rounded-lg h-32 lg:h-40 w-2/3 3xl:w-3/4 lg:max-w-[50%] 3xl:max-w-[66%] relative">
              <Image
                fill
                src={huddle.image}
                alt={huddle.name}
                sizes="(max-width: 768px) 100px,
                       (max-width: 1200px) 150px,
                       (max-width: 1800px) 230px,
                       300px"
                placeholder="empty"
                className="rounded-lg object-left"
              />
            </div>
            <p className="hidden md:block">attending: {data.attending}</p>

            <div className="hidden md:grid grid-cols-2 gap-2 w-1/2">
              {data.categories.map((category, i) => {
                return (
                  i <= 3 && (
                    <p className="category-icon" key={category.id + (i - i)}>
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
                    <p className="category-icon" key={category.id + (i - i)}>
                      {category.name}
                    </p>
                  )
                );
              })}
            </div>
          </div>
          {/* Mobile */}
          <div className="grid md:hidden grid-cols-2 gap-1 py-1">
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
        <div className="grid max-w-[300px] md:h-56 py-2 w-full pl-4 ">
          <p>{huddle.description}</p>
          <p className="text-sm self-end">
            At {huddle.address}
            <br></br>
            {dateTime.monthDayYear} at {dateTime.time}
          </p>
        </div>
      </div>
    </div>
  );
}

export default NewHuddleCard;
