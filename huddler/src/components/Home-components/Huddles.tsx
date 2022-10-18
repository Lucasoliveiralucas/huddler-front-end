//@ts-ignore
import HuddleCard from "./HuddleCard";
import { useState } from "react";
import { Huddle } from "../../types";

type Props = {
  huddles: Huddle[];
};

function Huddles({ huddles }: Props) {
  const [active, setActive] = useState<Huddle | {}>();

  const handleActive = (huddle: Huddle) => {
    if (active === huddle) {
      setActive({});
    } else {
      setActive(huddle);
    }
  };

  return (
    <div className="">
      {huddles.map((huddle: any) => (
        <HuddleCard
          item={huddle}
          key={huddle.id}
          active={active as Huddle}
          handleActive={handleActive}
        />
      ))}
    </div>
  );
}

export default Huddles;
