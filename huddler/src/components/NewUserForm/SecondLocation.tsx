import React, { useEffect } from 'react';
import { User } from '../../types';
import Map from '../Home-components/Map';
import MobileMap from '../Home-components/MobileMap';

// Contains a form for the categories

type Props = {
  location: { name: string; lat: number; lng: number };
  setLocation: React.Dispatch<
    React.SetStateAction<{ name: string; lat: number; lng: number }>
  >;
  userData: User;
  setUserData: React.Dispatch<React.SetStateAction<User>>;
};

function Location({ location, setLocation, userData, setUserData }: Props) {
  useEffect(() => {
    setUserData({
      ...userData,
      default_latitude: location.lat,
      default_longitude: location.lng,
    });
  }, [location]);
  // some logic where the user chooses its location and updates with setLocation()
  return (
    <div className='flex flex-col'>
      <div className='flex text-2xl font-bold flex-col py-4 text-center'>
        <h1 className='font-yantra text-palette-dark'>
          {"WHAT'S YOUR LOCATION"}
        </h1>
      </div>
      <div className=' py-5 xl:hidden'>
        <MobileMap
          currentPage={'newuser'}
          user={userData}
          setLocation={setLocation}
        />
      </div>
      <div className='py-5 hidden xl:flex'>
        <Map
          currentPage={'newuser'}
          user={userData}
          setLocation={setLocation}
        />
      </div>
    </div>
  );
}

export default Location;
