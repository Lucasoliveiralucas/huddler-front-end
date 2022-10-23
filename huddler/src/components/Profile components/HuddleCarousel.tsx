import React from "react";
import { Huddle } from "../../types";
import HuddleCarouselItem from "./HuddleCarouselItem";

type Props = {
  huddles: Huddle[];
  huddlesUserIsGoing: Huddle[];
  setUpdate: React.Dispatch<React.SetStateAction<boolean>>;
  update: boolean;
  id: string;
};

function HuddleCarousel({
  huddles,
  huddlesUserIsGoing,
  setUpdate,
  update,
  id,
}: Props) {
  return Array.isArray(huddles) ? (
    <div
      className="pl-1 h-64 flex overflow-x-auto gap-4 lg:gap-2"
      id="carousel"
    >
      {huddles.map((huddle) => (
        <div
          className="min-w-[30rem] max-w-[30rem] animate-slide-in h-64 shadow-md border-palette-dark hover:border-palette-orange bg-white bg-opacity-50 border relative rounded-lg"
          key={huddle.id}
          id={huddle.description}
        >
          <HuddleCarouselItem
            setUpdate={setUpdate}
            update={update}
            huddle={huddle}
            huddlesUserIsGoing={huddlesUserIsGoing}
            id={id}
          />
        </div>
      ))}
    </div>
  ) : (
    <div className="pl-1 h-64 lg:h-72 flex"></div>
  );
}

export default HuddleCarousel;
