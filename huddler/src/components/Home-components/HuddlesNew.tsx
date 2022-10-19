import { useState } from "react";
import { Huddle } from "../../types";
import NewHuddleCard from "./NewHuddleCard";
import NewHuddleCard2 from "./NewHuddleCard2";

type Props = {
  huddles: Huddle[];
  updateList: any;
  // setUpdate: React.Dispatch<React.SetStateAction<boolean>>;
  huddlesUserIsGoing: Huddle[];
  id: string;
};

function Huddles({ huddles, updateList, id, huddlesUserIsGoing }: Props) {
  console.log("2", id);

  const [active, setActive] = useState<Huddle | {}>();

  const handleActive = (huddle: Huddle) => {
    if (active === huddle) {
      setActive({});
    } else {
      setActive(huddle);
    }
  };

  return (
    <div
      className="flex flex-col justify-start pr-10 h-full overflow-auto"
      id="carousel"
    >
      <div className="flex flex-col">
        {huddles.map((huddle) => (
          <div
            className="h-48 md:h-48 lg:h-56 shadow-md border-palette-dark hover:border-palette-orange bg-white bg-opacity-50 border m-4 relative rounded-lg"
            key={huddle.id}
          >
            {/* <HuddleCarouselItem */}
            <NewHuddleCard2
              huddle={huddle}
              huddlesUserIsGoing={huddlesUserIsGoing}
              id={id}
              updateList={updateList}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Huddles;
