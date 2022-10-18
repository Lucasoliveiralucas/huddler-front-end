import React, { useState, useCallback, useEffect, } from 'react';
import Image from 'next/future/image';
import DefaultUserImage from '../../../public/defaultUserImage.png';
import Dropdown from './Dropdown';
import Link from 'next/link';
import huddler_logo from '../../../public/Huddler_green.png'
import { useAuth } from '../../contexts/AuthContext';
import NewHuddleForm from '../CreateHuddle/NewHuddleForm';


function Navbar() {
  const [showDropDown, setShowDropDown] = useState(false);
  const {currentUser} = useAuth()
  const [lastScrollY, setLastScrollY] = useState(0);
  const [createBox, setCreateBox] = useState(false);
  const [center, setCenter] = useState({
    lat: 41.39,
    lng: 2.154,
  });
  const [locationName, setLocationName] = useState("");

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

  const controlNavbar = useCallback(() => {
    const navbar = document.querySelector(".navbar");
      if (window.scrollY > lastScrollY) {
        navbar?.classList.add('navbar--hidden');
        // setShow(false);
      } else {
        navbar?.classList.remove('navbar--hidden');
        // setShow(true);  
      }
      setLastScrollY(window.scrollY);
    }
  , [lastScrollY]);
  
  useEffect(() => {
      window.addEventListener('scroll', controlNavbar);
      return () => {
        window.removeEventListener('scroll', controlNavbar);
      };
  }, [controlNavbar]);

  const handleClickOnImg = () => {
    console.log('click' ,showDropDown)
    setShowDropDown(!showDropDown);
  };

  return (
    <div className="navbar h-20 shadow-md w-full bg-palette-light text-white flex items-center justify-between fixed top-0 px-12 z-10">
      <Link href={'/home'}>
        <Image className="w-48" src={huddler_logo} alt='logo' />
      </Link>
      <div className='flex items-center justify-end'>
        <button className="
        w-40 relative text-center font-bold
        py-2 rounded-3xl border-palette-dark border-[1px]
        bg-tansparent hover:bg-[#7c2d12] text-palette-dark
        hover:text-white"
        onClick={() => toggleCreate()}>New huddle</button>

        <div className="w-20 h-20 relative">
          {currentUser &&
            <Image
              src={currentUser ? currentUser[0].image : DefaultUserImage}
              alt='user-image'
              fill
              className=' rounded-full p-1 cursor-pointer p-3'
              onClick={() => handleClickOnImg()}
            />
          }
        {showDropDown && <Dropdown setShowDropDown={setShowDropDown} />}
        </div>
      </div>

      <div
        id="huddle-form"
        className="hidden flex-col items-center p-4 mt-4 bg-[rgb(248,241,229)] w-[20rem] shadow-md rounded-md border-solid border-[0.5px] border-palette-dark"
      >
        <NewHuddleForm
            center={center}
            setCenter={setCenter}
            data={{
                name: locationName,
                lat: "" + center.lat,
                lng: "" + center.lng,
            }}
        />
      </div>
    </div>
  );
}

export default Navbar;
