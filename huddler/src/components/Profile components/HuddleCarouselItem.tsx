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
<<<<<<< HEAD
=======
import { useAuth } from "../../contexts/AuthContext";
import { GrGroup } from "react-icons/gr";


>>>>>>> landing_page_slider

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
  return (
<<<<<<< HEAD
    <div className="ml-3 mr-3 mt-3">
      <div className="flex mb-1">
        <h1 className="font-extrabold text-palette-orange text-2xl">
          {huddle.name}
        </h1>
        <div className="ml-auto mr-3 flex gap-4 py-2">
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
                setUpdate(!update);
                removeUserGoingToHuddle(id, huddle.id);
              }}
            >
              Leave
            </button>
          ) : (
            <button
              className="justify-center orange-button"
              onClick={(e) => {
                setGoing(!going);
                setUpdate(!update);
                postUserGoingToHuddle(id, huddle.id);
              }}
            >
              Join
            </button>
          )}
        </div>
      </div>

      <div className="flex">
        <div className="w-[24rem] mr-3">
          <div className="rounded-lg h-32 lg:h-36 relative">
            <Image
              fill
              src={huddle.image}
              alt={huddle.name}
              sizes="(max-width: 768px) 100px,
                       (max-width: 1200px) 250px,
                       300px"
              placeholder="empty"
              className="rounded-lg object-contain"
            />
          </div>
          <p>attending: {data.attending}</p>
          <div className="hidden md:grid grid-cols-2 gap-2">
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
          {/* mobile */}
          <div className="md:hidden grid grid-cols-2 gap-2">
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
        <div className="grid max-w-[300px] md:h-56 w-full space-x-0 ">
          <p>{huddle.description}</p>
          <p className="text-sm self-end">
            At {huddle.address}
            <br></br>
            {/* {dateTime.monthDayYear} at {dateTime.time} */}
          </p>
        </div>
      </div>
    </div>
=======
    <Link href={{ pathname: `/details/${huddle.id}`, query: huddle }}>
     
        <div className="flex flex-col"> 
              <div className="flex flex-row">
                  <div className="basis-1/4 relative">
                      <picture>
                          <img 
                              src={huddle.image} 
                              alt={huddle.name}
                              className="absolute h-full object-cover rounded-tl-md rounded-br-lg"
                          />
                      </picture>
                  </div>

                  <div className="basis-3/4 flex flex-col mt-4 ml-4" >
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
                                    removeUserGoingToHuddle(currentUser, huddle.id);
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
                                    postUserGoingToHuddle(currentUser, huddle.id);
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
                                  <GrGroup/>
                                  <p className="ml-2 -mt-1">{data.attending}</p>
                              </div>

                          </div>
                  </div>             
              </div>

              <div id="tags" className="grid grid-cols-5 gap-2 mx-4 mt-2">
                              {data.categories.map((category, i) => {
                                return (
                                    <p className="text-center font-bold py-0.5 rounded-2xl border-palette-dark border-[1px] bg-tansparent text-palette-dark" key={category.id + (i - i)}>
                                        {category.name}
                                    </p>);
                              })}
              </div>
              
        </div>    
      

    </Link>
>>>>>>> landing_page_slider
  );
}

export default HuddleCarouselItem;
