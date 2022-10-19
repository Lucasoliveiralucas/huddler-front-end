import Map from '../Home-components/Map';
import { useState } from 'react';
import { User } from '../../types';
import { postUpdatedUserInfo } from '../../utils/APIServices/userServices';
type Props = {
  userData: User;
  setUserData: React.Dispatch<React.SetStateAction<User>>;
};
const UpdateLocation = ({ userData, setUserData }: Props) => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [location, setLocation] = useState({
    name: '',
    lat: userData.default_latitude,
    lng: userData.default_longitude,
  });
  console.log('location', location);

  const changeLocation = async () => {
    try {
      console.log(userData);
      const updatedUser = {
        ...userData,
        default_latitude: location.lat,
        default_longitude: location.lng,
      };
      setUserData(updatedUser);
      updatedUser &&
        (await postUpdatedUserInfo(updatedUser, userData.aws_id as string));
      setSuccess('Success, you updated yout location');
    } catch {
      setError("We weren't able to update your location. Please try again");
    }
  };

  return (
    <>
      {error && <div className='bg-red-600'>{error}</div>}
      <div className='mr-5 flex flex-col items-center'>
        {success ? (
          <>
            <div className='text-[#145725] bg-[#D5EDDB] p-5 rounded-md'>
              {success}
            </div>
            <br />
          </>
        ) : (
          <button
            className='border-none bg-palette-dark hover:bg-opacity-60 hover:cursor-pointer rounded-md shadow-md text-white text-2xl mt-2 py-2 px-5'
            onClick={changeLocation}
          >
            Update Location
          </button>
        )}
      </div>

      <Map
        currentPage='settings'
        //@ts-ignore
        setLocation={setLocation}
        user={userData}
      />
    </>
  );
};

export default UpdateLocation;

