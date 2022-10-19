import HuddleCard from "./HuddleCard";
import { useState } from "react";
import { Huddle } from "../../types";
import HuddleCarouselItem from "../Profile components/HuddleCarouselItem";

import { fetcher } from "../../utils/helperFunctions";
import useSWR from "swr";
import HuddlesNewItem from "./HuddlesNewItem";
import NewHuddleCard from "./NewHuddleCard";
import NewHuddleCard2 from "./NewHuddleCard2"


type Props = {
    huddles: Huddle[];
    update: boolean;
    setUpdate: React.Dispatch<React.SetStateAction<boolean>>;
    huddlesUserIsGoing: Huddle[];
    id: string;
};

function Huddles({ huddles, update, setUpdate, id }: Props) {
    console.log('2',id)
    
    const [active, setActive] = useState<Huddle | {}>();
    const { data: huddlesUserIsGoing, error: userGoingError } = useSWR(
        `https://u4pwei0jaf.execute-api.eu-west-3.amazonaws.com/test/huddles_user_isgoing?user-id=${id}`,
        fetcher
    );

    const handleActive = (huddle: Huddle) => {
        if (active === huddle) {
            setActive({});
        } else {
            setActive(huddle);
        }
    };

    return (
        <div className="flex flex-col justify-start pr-10 h-full overflow-auto" id="carousel" >
            <div className="flex flex-col">
            {huddles.map((huddle) => (
                <div
                    className="h-48 md:h-48 lg:h-56 flex-grow-1 flex-shrink-1 shadow-md border-palette-dark hover:border-palette-orange bg-white bg-opacity-50 border m-4 relative rounded-lg"
                    key={huddle.id}
                >
                    {/* <HuddleCarouselItem */}
                    <NewHuddleCard2
                        huddle={huddle}
                        huddlesUserIsGoing={huddlesUserIsGoing}
                        id={id}
                    />
                </div>
            ))}
            </div>
        </div>
    );
}

export default Huddles;
