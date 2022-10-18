import Map from "../Home-components/Map";
import { useState } from "react";
import { User } from "../../types";
import {postUpdatedUserInfo} from '../../utils/APIServices/userServices'
type Props = {
  // currentUserLongitude: number;
  // currentUserLatitude: number;
  userData: User;
  setUserData: React.Dispatch<React.SetStateAction<User>>;
};
const UpdateLocation = ({
  // currentUserLongitude,
  // currentUserLatitude,
  userData,
  setUserData
}: Props) => {
  const [error, setError] = useState("");
  const [location, setLocation] = useState({
    name: "",
    lat: userData.default_latitude,
    lng: userData.default_longitude,
  });
  console.log("location", location);

  const changeLocation = async () => {
    try {
      //await here we post the new location to the DB
      //If success the h1 down below should show the new location
      console.log(userData);
      const updatedUser = { ...userData,
        default_latitude: location.lat,
        default_longitude: location.lng,
      };
      setUserData(updatedUser)
      updatedUser && await postUpdatedUserInfo(updatedUser, userData.aws_id as string);
      router.push('/profile');
    
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






