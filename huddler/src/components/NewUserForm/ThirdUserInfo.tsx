import React, { useRef, useState } from 'react';
import { User } from '../../types';
import Image, { StaticImageData } from 'next/future/image';
import DefaultUserImage from '../../../public/defaultUserImage.png';
import { useAuth } from '../../contexts/AuthContext';

type Props = {
  userData: User;
  setUserData: React.Dispatch<React.SetStateAction<User>>;
  handleSubmit: Function;
  setUserImg: React.Dispatch<
    React.SetStateAction<StaticImageData | string | File>
  >;
};

// Contains a form for the user details

function UserInfo({ userData, setUserData, setUserImg, handleSubmit }: Props) {
  const [imageSelected, setImageSelected] = useState<StaticImageData | string>(
    DefaultUserImage
  );

  const imageRef = useRef<HTMLInputElement | null>(null);

  const changeUserImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!e.target.files) return;
    const image = URL.createObjectURL(e.target.files[0]);
    setImageSelected(image);
    const img = e.target.files[0];
    setUserImg(img);
  };
  return (
    <div className='md:flex 3xl:gap-32'>
      <div className='flex flex-col py-8 md:w-1/2 md:px-10'>
        <form className='flex flex-col'>
          <h1 className='font-bold font-yantra text-palette-dark text-2xl pb-4 self-center'>
            USER DETAILS
          </h1>
          <label className='font-karla text-palette-black'>
            Choose a user name:
          </label>
          <input
            className='py-3'
            onChange={(e) =>
              setUserData({ ...userData, username: e.target.value })
            }
          ></input>
          <label className='font-karla text-palette-black'>First name:</label>
          <input
            className='py-3'
            onChange={(e) =>
              setUserData({ ...userData, first_name: e.target.value })
            }
          ></input>
          <label className='font-karla text-palette-black'>Last name:</label>
          <input
            className='py-3'
            onChange={(e) =>
              setUserData({ ...userData, last_name: e.target.value })
            }
          ></input>
          <label className='font-karla text-palette-black'>
            Tell people who you are and what are your interests:
          </label>
          <textarea
            className='pb-16'
            onChange={(e) =>
              setUserData({ ...userData, description: e.target.value })
            }
          ></textarea>
        </form>
      </div>
      <div className='flex flex-col items-center py-8 md:w-1/2 h-full'>
        <h1 className='font-bold text-xl font-yarna text-palette-dark'>
          DO YOU WANT TO UPLOAD A PROFILE PICTURE?
        </h1>

        <div className='flex flex-col justify-center items-center gap-5 mt-4 lg:mt-16'>
          <label className='font-karla text-palette-black'>
            Click on the image to change it
          </label>
          <input
            type='file'
            className='hidden'
            accept='.jpg, jpeg, .png, .gif'
            ref={imageRef}
            onChange={changeUserImage}
          />
          <Image
            className='rounded-full hover:cursor-pointer'
            alt='image-preview'
            src={imageSelected}
            width={180}
            height={180}
            onClick={() => imageRef.current!.click()}
          />
        </div>
      </div>
    </div>
  );
}

export default UserInfo;
