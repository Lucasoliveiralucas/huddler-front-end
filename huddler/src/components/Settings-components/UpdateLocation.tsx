import Map from "../Home-components/Map";
import { useState, useRef } from "react";
import PlacesAutoCompleter from "../Home-components/PlacesAutocomplete";
import { User } from "../../types";

type Props = {
  currentUserLongitude: number;
  currentUserLatitude: number;
  userData: User;
};
const UpdateLocation = ({
  currentUserLongitude,
  currentUserLatitude,
  userData,
}: Props) => {
  const [error, setError] = useState("");
  const [location, setLocation] = useState({
    name: "",
    lat: currentUserLatitude,
    lng: currentUserLongitude,
  });
  console.log("locationnn", location);

  const changeLocation = async () => {
    try {
      //await here we post the new location to the DB
      //If success the h1 down below should show the new location
      console.log("secondLocation", location);
    } catch {
      setError("We weren't able to update your location. Please try again");
    }
  };

  return (
    <>
      {error && <div className="bg-red-600">{error}</div>}
      <h1>
        This is your current location:{/* In here we put the user location */}
      </h1>
      <button
        className="border-none bg-palette-dark hover:bg-opacity-60 hover:cursor-pointer rounded-md shadow-md text-white text-2xl mt-2 py-2 px-5"
        onClick={changeLocation}
      >
        Update Location
      </button>
      <Map currentPage="settings" setLocation={setLocation} user={userData} />
    </>
  );
};

export default UpdateLocation;
