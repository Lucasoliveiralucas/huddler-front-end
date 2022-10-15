import HuddleCard from "./HuddleCard";
import { useState } from "react";
import { Huddle } from "../../types";
import HuddleCarouselItem from "../Profile components/HuddleCarouselItem";

import { fetcher } from "../../utils/helperFunctions";
import useSWR from "swr";
import HuddlesNewItem from "./HuddlesNewItem";
import NewHuddleCard from "./NewHuddleCard";

type Props = {
    huddles: Huddle[];
    update: boolean;
    setUpdate: React.Dispatch<React.SetStateAction<boolean>>;
    huddlesUserIsGoing: Huddle[];
};

function Huddles({ huddles, update, setUpdate }: Props) {
    const [active, setActive] = useState<Huddle | {}>();

    const { data: huddlesUserIsGoing, error: userGoingError } = useSWR(
        `https://u4pwei0jaf.execute-api.eu-west-3.amazonaws.com/test/huddles_user_isgoing?user-id=${67}`,
        fetcher
    );

    const handleActive = (huddle: Huddle) => {
        if (active === huddle) {
            setActive({});
        } else {
            setActive(huddle);
        }
    };
    console.log(huddles)

    return (
        <div className="flex flex-col justify-start px-2 h-full" id="carousel" >
            <div className="gap-4 grid 2xl:grid-cols-2">
            {huddles.map((huddle) => (
                <div
                    className="h-64 md:h-72 lg:h-80 p-2 flex-grow-1 flex-shrink-0 shadow-md border-palette-dark hover:border-palette-orange bg-white bg-opacity-50 border relative rounded-lg"
                    key={huddle.id}
                >
                    {/* <HuddleCarouselItem */}
                    <NewHuddleCard
                        setUpdate={setUpdate}
                        update={update}
                        huddle={huddle}
                        huddlesUserIsGoing={huddlesUserIsGoing}
                    />
                </div>
            ))}
            </div>
        </div>
    );
}

export default Huddles;