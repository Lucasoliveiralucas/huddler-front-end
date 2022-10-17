import React, { useState, useRef, useEffect, EventHandler } from 'react';
import { CgProfile } from 'react-icons/cg';
import { FiSettings } from 'react-icons/fi';
import { HiOutlineLogout } from 'react-icons/hi';
import { AiOutlineCompass } from 'react-icons/ai';
import { useAuth } from '../../contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useOnclickOutside from 'react-cool-onclickoutside';

const serviceDropdown = [
  { name: 'Explore', path: '/home', icon: <AiOutlineCompass /> },
  { name: 'Profile', path: '/profile', icon: <CgProfile /> },
  { name: 'Settings', path: '/settings', icon: <FiSettings /> },
  { name: 'Log Out', path: '/', icon: <HiOutlineLogout /> },
];

const defaultClass =
  'border-b px-5  flex gap-10 hover:bg-palette-orange hover:cursor-pointer py-2 text-2xl items-center';
const topClass = defaultClass + ' rounded-t-[10px]';
const bottomClass = defaultClass + ' rounded-b-[10px]';

type Props = {
  setShowDropDown: React.Dispatch<React.SetStateAction<boolean>>;
};

const Dropdown = ({ setShowDropDown }: Props) => {
  //@ts-ignore
  const { currentUser, logOut } = useAuth();
  const [dropDown, setDropDown] = useState<HTMLElement | null>(null);
  console.log('logouuut', currentUser);
  const router = useRouter();
  let dropDownRef = useRef<HTMLElement>();

  const ref = useOnclickOutside(() => {
   setShowDropDown(false)
  });
  const handleLogoutClick = () => {
    console.log('hit hereeee');
    // if (currentUser) return logOut();
    // router.replace('/');
    return;
  };

  // useEffect(() => {
  //   //@ts-ignore
  //   dropDownRef.current = document.getElementById('dropdown')
  //   console.log('droppy' , dropDown)
  //   setDropDown(dropDown)
  //   document.addEventListener('click', handleClickOutsideDropdown, true);
  // }, []);

  // function handleClickOutsideDropdown(this: HTMLElement) {
  //   // console.log('thiiiiiis', this)
  //   // console.log('Reeeeef', dropDownRef.current);
  //   // console.log('DropDooooown',dropDown)
  //   if (dropDownRef.current?.contains(this)) return;
  //   if (!dropDownRef.current!.contains(this)) setShowDropDown(false);
  // }

  return (
    <div>
      <div
      ref={ref}
        className='mt-24 w-full rounded-[5px] shadow-md'
        // id='dropdown'
        // onMouseLeave={() => setShowDropDown(false)}
      >
        <ul className=' w-64 absolute bg-palette-dark -right-[50%] rounded-[10px] mr-[5px] mt-[5px] pt-0'>
          {serviceDropdown.map((menuItem, i) => {
            return (
              <div key={i}>
                {i === serviceDropdown.length - 1 ? (
                  <div
                    className={
                      i === 0 ? topClass : i === 3 ? bottomClass : defaultClass
                    }
                    onClick={() => {
                      console.log('hereee');
                      logOut();
                    }}
                  >
                    <p className='text-3xl'>{menuItem.icon}</p>
                    <p>{menuItem.name}</p>
                  </div>
                ) : (
                  <>
                    <Link href={menuItem.path}>
                      <a
                        className={
                          i === 0
                            ? topClass
                            : i === 3
                            ? bottomClass
                            : defaultClass
                        }
                        // onClick={i === serviceDropdown.length - 1 && handleLogoutClick}
                      >
                        <p className='text-3xl'>{menuItem.icon}</p>
                        <p>{menuItem.name}</p>
                      </a>
                    </Link>
                  </>
                )}
              </div>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Dropdown;



