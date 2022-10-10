import Image from "next/image";
import React from "react";
import placeholder from "../../../public/placeholder.jpg"


const HuddleCard = ({ item, handleActive, active }: any) => {

  return (item !== active) ? (
    // Huddles class
    <div className="grid grid-cols-3 bg-yellow-200 border p-4 hover:scale-110" onClick={() => handleActive(item)}>
      <div>
        <Image src={item.images.stringValues[0]} height={200} width={200} />
      </div>
      <div className="col-span-2">
        <h1>{item.name}</h1>
        <p>{item.description}</p>
      </div>
    </div>
  ) :
    // Active huddle class
    <div className="flex flex-col bg-red-200 border p-4" onClick={() => handleActive(item)}>
    <div className="col-span-2">
      <h1>{item.name}</h1>
      <p>{item.description}</p>
    </div>
      <div className="inline-block h-full w-full">
        {item.images.stringValues.map((image:string) => (
          <Image src={image} height={200} width={200} />
        ))}
    </div>
  </div>;
}

export default HuddleCard;
