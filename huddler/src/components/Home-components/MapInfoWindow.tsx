import { InfoWindowF } from "@react-google-maps/api";
import React, { useEffect, useState } from "react";
import { Huddle, User } from "../../types";
import Image from "next/future/image";
import {
  getUsersGoingToHuddle,
  postUserGoingToHuddle,
  removeUserGoingToHuddle,
} from "../../utils/APIServices/huddleServices";
import { dateFormatter } from "../../utils/helperFunctions";

type Props = {
  showHuddle: Huddle | undefined;
  user: User;
  setShowHuddle: React.Dispatch<React.SetStateAction<Huddle | undefined>>;
};

export const MapInfoWindow = ({ showHuddle, setShowHuddle, user }: Props) => {
  const [checkedIn, setCheckedIn] = useState(false);
  const [dateTime, setDateTime] = useState<any>();
  const [goingToHuddle, setGoingToHuddle] = useState<number>();
  const isUserGoing = async () => {
    if (showHuddle) {
      const users = await getUsersGoingToHuddle(showHuddle.id as number);
      setGoingToHuddle(users.length);
      //CHANGE TO CURRENT USER
      users.find((users: any) => users.aws_id === user.aws_id)
        ? setCheckedIn(true)
        : setCheckedIn(false);
    }
  };

  useEffect(() => {
    isUserGoing();
    if (showHuddle) setDateTime(dateFormatter(showHuddle.day_time));
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
          <div className="animation-fadein font-medium">
            <h1 className="font-extrabold text-palette-orange mb-1 text-lg">
              {showHuddle.name}
            </h1>
            {dateTime ? (
              <h1 className="mb-1">
                On {dateTime.monthDayYear} at {dateTime.time}
              </h1>
            ) : (
              <></>
            )}
            <Image
              alt="img"
              src={showHuddle.image}
              height={200}
              width={200}
              className="rounded-lg"
            />
            <h2 className="mt-1">attendants: {goingToHuddle}</h2>
            <h3 className="h-12 w-48 overflow-auto mt-3">
              {showHuddle.description}
            </h3>
            {checkedIn ? (
              <button
                className="float-right flex mt-3 italic font-medium bg-slate-300 p-1 rounded-md w-[4.5rem]"
                onClick={() => {
                  const val = goingToHuddle - 1;
                  setGoingToHuddle(val);
                  setCheckedIn(false);
                  removeUserGoingToHuddle(user.aws_id, showHuddle.id as number);
                }}
              >
                Check out
              </button>
            ) : (
              <button
                className="float-right flex mt-3 italic font-medium bg-orange-300 p-1 rounded-md w-[4.5rem]"
                onClick={() => {
                  const val = goingToHuddle + 1;

                  setGoingToHuddle(val);
                  setCheckedIn(true);
                  postUserGoingToHuddle(user.aws_id, showHuddle.id as number);
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
