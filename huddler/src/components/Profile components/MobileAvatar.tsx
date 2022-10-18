import React from 'react';
import DefaultUserImage from '../../../public/defaultUserImage.png';
import Image from 'next/future/image';
import { User } from '../../types';

type Props = {
  user: User;
};

function MobileAvatar({ user }: Props) {
  const image = typeof user.image == 'string' ? user.image : DefaultUserImage;

  return (
    <div className=' w-full flex flex-col py-6 justify-center items-center'>
      <div className='rounded-full h-64 w-64 md:w-72 md:h-72 relative flex'>
        <Image
          className='rounded-full'
          src={image}
          placeholder='empty'
          alt='avatar'
          sizes='(max-width: 768px) 288px,
                       (max-width: 1200px) 400px,
                       0px'
          priority={true}
          fill
        />
      </div>
      <h1 className='p-4 text-[2rem] font-bold'>
        Welcome back, {user.username}
      </h1>
    </div>
  );
}

export default MobileAvatar;
