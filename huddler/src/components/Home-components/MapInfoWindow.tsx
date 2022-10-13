import { InfoWindowF } from "@react-google-maps/api";
import React, { useEffect, useState } from "react";
import { Huddle } from "../../types";
import Image from "next/future/image";
import {
  getUsersGoingToHuddle,
  postUserGoingToHuddle,
  removeUserGoingToHuddle,
} from "../../utils/APIServices/huddleServices";

type Props = {
  showHuddle: Huddle | undefined;
  setShowHuddle: React.Dispatch<React.SetStateAction<Huddle | undefined>>;
};
export const MapInfoWindow = ({ showHuddle, setShowHuddle }: Props) => {
  const [checkedIn, setCheckedIn] = useState(false);
  const isUserGoing = async () => {
    if (showHuddle) {
      const users = await getUsersGoingToHuddle(showHuddle.id);
      //CHANGE TO CURRENT USER
      users.find((user: any) => (user = 67))
        ? setCheckedIn(true)
        : setCheckedIn(false);
    }
  };
  useEffect(() => {
    isUserGoing();
  }, [showHuddle]);
  return (
    <div>
      {showHuddle ? (
        <InfoWindowF
          position={{
            lat: Number(showHuddle.latitude),
            lng: Number(showHuddle.longitude),
          }}
          onCloseClick={() => setShowHuddle(undefined)}
        >
          <div className="animation-fadein">
            <h1 className="font-bold text-orange-600 mb-1">
              {showHuddle.name}
            </h1>
            <h1>{showHuddle.day_time}</h1>
            <Image
              alt="img"
              src={showHuddle.image}
              height={200}
              width={200}
              className="rounded-lg"
            />
            <h2 className="mt-1">attendants: 1234</h2>
            <h3 className="h-12 w-48 overflow-auto mt-3">
              {showHuddle.description}
            </h3>
            {checkedIn ? (
              <button
                className="float-right flex mt-3 italic font-medium bg-slate-300 p-1 rounded-md w-[4.5rem]"
                onClick={() => {
                  setCheckedIn(false);
                  removeUserGoingToHuddle(67, showHuddle.id);
                }}
              >
                Check out
              </button>
            ) : (
              <button
                className="float-right flex mt-3 italic font-medium bg-orange-300 p-1 rounded-md w-[4.5rem]"
                onClick={() => {
                  setCheckedIn(true);
                  postUserGoingToHuddle(67, showHuddle.id);
                }}
              >
                Check in
              </button>
            )}
          </div>
        </InfoWindowF>
      ) : (
        <></>
      )}
    </div>
  );
};
