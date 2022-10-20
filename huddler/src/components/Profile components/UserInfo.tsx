import React from "react";

type Props = {
  numOfCreatedHuddles: number;
  huddlesUserIsGoing: number;
};

function UserInfo({ numOfCreatedHuddles, huddlesUserIsGoing }: Props) {

  return (
    <>
      <h1 className="hidden lg:block text-3xl font-yantra text-palette-dark ml-4">MY HUDDLES</h1>
      <br />
      <div className="flex gap-5 justify-center w-full">
        <h1 className="lg:hidden text-3xl font-bold text-palette-dark font-yantra">MY HUDDLES</h1>
        <div className="flex flex-col justify-center w-[150px] text-2xl border-solid border-[0.5px] border-palette-orange shadow-md rounded-lg ">
          <h1 className="self-center  text-palette-black font-karla">Created</h1>
          <p className="text-palette-black font-karla self-center">{numOfCreatedHuddles}</p>
        </div>
        <div className="flex flex-col justify-center  w-[150px] text-2xl border-solid border-[0.5px] border-palette-orange   shadow-md rounded-lg ">
          <h1 className="self-center  text-palette-black font-karla">Going</h1>
          <p className="font-yantra  text-palette-black font-karla self-center">{huddlesUserIsGoing}</p>
        </div>
      </div>
    </>
  );
}

export default UserInfo;
