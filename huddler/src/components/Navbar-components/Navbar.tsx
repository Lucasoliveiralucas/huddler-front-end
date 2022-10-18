import React, { useState, useCallback, useEffect, } from 'react';
import Image from 'next/future/image';
import DefaultUserImage from '../../../public/defaultUserImage.png';
import Dropdown from './Dropdown';
import Link from 'next/link';
import huddler_logo from '../../../public/Huddler_green.png'
import { useAuth } from '../../contexts/AuthContext';

function Navbar() {
  const [showDropDown, setShowDropDown] = useState(false);
  const { currentUser } = useAuth()
  
 
  // const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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
    setShowDropDown(!showDropDown);
  };

  return (
    <div className="navbar h-20 shadow-md w-full bg-palette-light text-white flex items-center justify-between fixed top-0 px-12 z-10">
      <Link href={'/home'} rel="prefetch" as="image" >
        <a className="w-48">
          <Image src={huddler_logo} alt='logo' priority={true}  />
        </a>
      </Link>
      <div className="w-20 h-20 relative">

        <Image
          src={currentUser ? currentUser[0].image : DefaultUserImage}
          alt='user-image'
          fill
          className=' rounded-full p-1 cursor-pointer'
          onClick={() => handleClickOnImg()}
          placeholder='empty'
          sizes="(max-width: 768px) 100px,
                       (max-width: 1200px) 100px,
                       100px"
          priority={true}
        />
      
        {showDropDown && <Dropdown setShowDropDown={setShowDropDown} />}
      </div>
    </div>
  );
}

export default Navbar;
