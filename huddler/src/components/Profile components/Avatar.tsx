import React from 'react';
import noImage  from '../../../public/noImage.jpg';
import Image from 'next/future/image';
import { User } from '../../../src/types';

type Props = {
  user: User,
};

function Avatar({ user }: Props) {
  const image = (typeof user.image == 'string') ? user.image : noImage;
  return (
    <div className='w-full flex flex-col py-8 justify-center'>
      <h1 className='text-[2rem] self-center'>
        Welcome back, {user.username}
      </h1>
    <br/>
      <div className='rounded-full self-center shadow-md w-72 h-72 2xl:w-96 2xl:h-96 relative'>
        <Image
          className='rounded-full'
          src={image}
          placeholder='empty'
          alt='avatar'
          sizes="(max-width: 768px) 0px,
                       (max-width: 1200px) 300px,
                       400px"
          priority={true}
          fill
        />
      </div>
    </div>
  );
}

export default Avatar;
