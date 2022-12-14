import { Huddle } from "../../types";
import NewHuddleCard from "./NewHuddleCard";

type Props = {
  huddles: Huddle[];
  updateList: any;
  // setUpdate: React.Dispatch<React.SetStateAction<boolean>>;
  huddlesUserIsGoing: Huddle[];
  id: string;
};

function Huddles({ huddles, updateList, id, huddlesUserIsGoing }: Props) {
  return (
    <div className="flex flex-col justify-start h-full" id="carousel">
      <div className="gap-3 grid 2xl:grid-cols-2">
        {huddles.map((huddle) => (
          <div
            className="h-72 lg:h-80 p-2 flex-grow-1 3xl:pl-8 flex-shrink-0 shadow-md border-palette-dark hover:border-palette-orange bg-white bg-opacity-50 border relative rounded-lg"
            key={huddle.id}
          >
            {/* <HuddleCarouselItem */}
            <NewHuddleCard
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
