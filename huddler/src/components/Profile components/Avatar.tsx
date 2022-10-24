import React from 'react';
import DefaultUserImage from '../../../public/defaultUserImage.png';
import Image from 'next/future/image';
import { User } from '../../../src/types';

type Props = {
  user: User;
};

function Avatar({ user }: Props) {
  const image = typeof user.image == 'string' ? user.image : DefaultUserImage;
  return (
    <div className='w-full flex flex-col py-8 justify-center'>
      <h1 className='text-[2rem] font-yantra font-bold text-palette-dark self-center'>
        Welcome back, {user.username}
      </h1>
      <div className='rounded-full self-center shadow-md w-72 h-72 relative'>
        <Image
          className='rounded-full'
          src={image}
          placeholder='empty'
          alt='avatar'
          sizes='(max-width: 768px) 0px,
                       (max-width: 1200px) 300px,
                       400px'
          priority={true}
          fill
        />
      </div>
    </div>
  );
}

export default Avatar;
