import React, { useEffect, useState } from 'react';
import Image from 'next/future/image';
import { Huddle } from '../../types';
import { dateFormatter } from '../../utils/helperFunctions';
import {
  getHuddleCategories,
  getUsersGoingToHuddle,
  postUserGoingToHuddle,
  removeUserGoingToHuddle,
} from '../../utils/APIServices/huddleServices';
import Link from 'next/link';

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
  let dateTime: any = '';
  const [going, setGoing] = useState(false);
  //getting additional huddle data
  const [data, setData] = useState({
    attending: 0,
    categories: [{ name: '', id: 0 }],
  });
  useEffect(() => {
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
    <div className='ml-3 mr-3 mt-3'>
      <div className='flex mb-1'>
        <h1 className='font-extrabold text-palette-orange text-2xl'>
          {huddle.name}
        </h1>
        <div className='ml-auto mr-3 flex gap-4 py-2'>
          <Link
            href={{
              pathname: `/details/${huddle.id}`,
              query: huddle.toString(),
            }}
          >
            <a className=' underline'>Event Details</a>
          </Link>
          {going ? (
            <button
              className='justify-center w-14 bg-palette-orange bg-opacity-40 text-lg border-solid border-[0.5px] border-palette-orange shadow-md rounded-lg hover:bg-opacity-60'
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
              className='justify-center w-14 bg-palette-orange bg-opacity-40 text-lg border-solid border-[0.5px] border-palette-orange shadow-md rounded-lg hover:bg-opacity-60'
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
              sizes='(max-width: 768px) 100px,
                       (max-width: 1200px) 250px,
                       300px'
              placeholder='empty'
              className='rounded-lg object-contain'
            />
          </div>
          <p>attending: {data.attending}</p>
          <div className='hidden md:grid grid-cols-2 gap-2'>
            {data.categories.map((category, i) => {
              return (
                i <= 3 && (
                  <p
                    className='text-center py-0.5 bg-palette-dark rounded-md text-white'
                    key={category.id + (i - i)}
                  >
                    {category.name}
                  </p>
                )
              );
            })}
          </div>
          {/* mobile */}
          <div className='md:hidden grid grid-cols-2 gap-2'>
            {data.categories.map((category, i) => {
              return (
                i <= 1 && (
                  <p
                    className='text-center py-0.5 bg-palette-dark rounded-md text-white'
                    key={category.id + (i - i)}
                  >
                    {category.name}
                  </p>
                )
              );
            })}
          </div>
        </div>
        <div className='grid max-w-[300px] md:h-56 w-full space-x-0 '>
          <p>{huddle.description}</p>
          <p className='text-sm self-end'>
            At {huddle.address}
            <br></br>
            {/* {dateTime.monthDayYear} at {dateTime.time} */}
          </p>
        </div>
      </div>
    </div>
  );
}

export default HuddleCarouselItem;
