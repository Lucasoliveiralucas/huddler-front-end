import React from "react";
import { User } from "../../../src/types";
import avatar from "../../../public/placeholder.jpg";

type Props = {
  numOfCreatedHuddles: number;
  huddlesUserIsGoing: number;
};

function UserInfo({ numOfCreatedHuddles, huddlesUserIsGoing }: Props) {

  return (
    <>
      <h1 className="hidden lg:block text-3xl ml-4 font-bold">My Huddles</h1>
      <br />
      <div className="flex gap-5 justify-center w-full">
        <h1 className="lg:hidden text-3xl ml-4 font-bold">My Huddles</h1>
        <div className="flex flex-col justify-center w-[150px] text-2xl border-solid border-[0.5px] border-palette-orange shadow-md rounded-lg ">
          <h1 className="self-center">Created</h1>
          <p className="font-bold self-center">{numOfCreatedHuddles}</p>
        </div>
        <div className="flex flex-col justify-center  w-[150px] text-2xl border-solid border-[0.5px] border-palette-orange   shadow-md rounded-lg ">
          <h1 className="self-center">Going</h1>
          <p className="font-bold self-center">{huddlesUserIsGoing}</p>
        </div>
      </div>
    </>
  );
}

export default UserInfo;
