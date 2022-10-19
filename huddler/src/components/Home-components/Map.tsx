import { useEffect, useState } from "react";
import { GoogleMap, useJsApiLoader, MarkerF } from "@react-google-maps/api";
import PlacesAutocomplete from "./PlacesAutocomplete";
import { Huddle, User } from "../../types";
import NewHuddleForm from "../CreateHuddle/NewHuddleForm";
import { MapInfoWindow } from "./MapInfoWindow";
import { getUserById } from "../../utils/APIServices/userServices";
import { withSSRContext } from "aws-amplify";

import { NextApiResponse, NextApiRequest } from "next/types";

type Props = {
  huddles?: Huddle[];
  currentPage?: string;
  updateList?: Function;
  setLocation?: React.Dispatch<
    React.SetStateAction<{ name: string; lat: number; lng: number }>
  >;
  user: User;
};
export default function Map({
  huddles,
  currentPage,
  setLocation,
  updateList,
  user,
}: Props) {
  const [showHuddle, setShowHuddle] = useState<Huddle | undefined>(undefined);
  const [locationName, setLocationName] = useState("");
  const [selected, setSelected] = useState(false);
  const [createBox, setCreateBox] = useState(false);
  const [map, setMap] = useState({});
  const [mapSize, setMapSize] = useState({
    width: "40vw",
    height: "40vw",
  });
  const [containerSize, setContainerSize] = useState(mapSize);
  // later change center to user real life location
  const [center, setCenter] = useState({
    lat: 41.39,
    lng: 2.154,
  });

  const toggleCreate = () => {
    const form = document.getElementById("huddle-form");
    if (createBox) {
      form?.classList.remove("animate-fade-in");
      form?.classList.add("animate-fade-out");
      setTimeout(() => {
        form?.classList.remove("flex");
        form?.classList.add("hidden");
      }, 500);
      setCreateBox(false);
      return;
    }
    form?.classList.remove("hidden");
    form?.classList.add("flex");
    form?.classList.remove("animate-fade-out");
    form?.classList.add("animate-fade-in");
    setCreateBox(true);
  };
  useEffect(() => {
    if (center.lat === Number(user?.default_latitude)) setSelected(false);
    if (currentPage)
      //@ts-ignore
      setLocation({
        name: locationName,
        lat: center.lat,
        lng: center.lng,
      });
  }, [center]);
  useEffect(() => {
    const getter = async () => {
      user && user!.default_latitude !== 1
        ? setCenter({
            lat: Number(user!.default_latitude),
            lng: Number(user!.default_longitude),
          })
        : setCenter({ lat: 41.39, lng: 2.15 });
    };
    getter();
    if (currentPage === "newuser") {
      setMapSize({
        width: "",
        height: "",
      });
      setContainerSize({
        width: "45vw",
        height: "50vh",
      });
    }
  }, []);
  return (
    <div className="mt-0">
      <div className="absolute pl-3 z-10 mt-24">
        <div className="z-10 mt-3 w-60">
          <PlacesAutocomplete
            hook={setCenter}
            setSelected={setSelected}
            setLocationName={setLocationName}
          />
        </div>
        <div
          id="huddle-form"
          className="hidden flex-col items-center p-4 mt-4 bg-[rgb(248,241,229)] w-[20rem] shadow-md rounded-md border-solid border-[0.5px] border-palette-dark"
        >
          <NewHuddleForm
            center={center}
            setCenter={setCenter}
            id={user.aws_id}
            data={{
              name: locationName,
              lat: "" + center.lat,
              lng: "" + center.lng,
            }}
          />
        </div>
      </div>
      <div className="shadow-xl rounded-md ">
        <GoogleMap
          zoom={12}
          mapContainerStyle={containerSize}
          center={center}
          onLoad={(map) => setMap(map)}
          onUnmount={() => setMap({})}
        >
          {/* Child components, such as markers, info windows, etc. */}
          {selected && (
            <MarkerF
              position={center}
              animation={google.maps.Animation.BOUNCE}
              draggable={true}
              onDragEnd={(e) =>
                setCenter({
                  lat: e.latLng?.lat() || center.lat,
                  lng: e.latLng?.lng() || center.lng,
                })
              }
            />
          )}
          {huddles ? (
            huddles.map((huddle: Huddle) => {
              return (
                <MarkerF
                  key={huddle.id + ""}
                  position={{
                    lat: Number(huddle.latitude),
                    lng: Number(huddle.longitude),
                  }}
                  animation={google.maps.Animation.DROP}
                  onClick={() => {
                    setShowHuddle(huddle);
                  }}
                />
              );
            })
          ) : (
            <></>
          )}
          <MapInfoWindow
            showHuddle={showHuddle}
            setShowHuddle={setShowHuddle}
            updateList={updateList}
            id={user.aws_id}
          />
        </GoogleMap>
      </div>
    </div>
  );
}
