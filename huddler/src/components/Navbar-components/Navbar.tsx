import React, { useState } from 'react';
import Image from 'next/future/image';
import placeholder from '../../../public/placeholder.jpg';
import Dropdown from './Dropdown';
import Link from 'next/link';
import huddler_logo from '../../../public/Huddler_green.png'

function Navbar() {
  const [showDropDown, setShowDropDown] = useState(false);

  const handleClickOnImg = () => {
    console.log('click' ,showDropDown)
    setShowDropDown(!showDropDown);
  };

  return (
    <div className="h-20 shadow-md w-full bg-palette-light text-white flex items-center justify-between fixed top-0 px-12 z-10">
      <Link href={'/home'}>
        {/* <div className="w-50"> */}
          <Image className="w-48" src={huddler_logo} alt='logo' />
        {/* </div> */}
        </Link>
      <div className="w-20 h-20 relative">
        <Image
          src={placeholder}
          alt='placeholder'
          fill
          className=' rounded-full p-1 cursor-pointer p-3'
          onClick={() => handleClickOnImg()}
        />
        {showDropDown && <Dropdown setShowDropDown={setShowDropDown} />}
      </div>
    </div>
  );
}

export default Navbar;
