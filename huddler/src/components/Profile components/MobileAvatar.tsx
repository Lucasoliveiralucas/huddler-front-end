import React from 'react'
import noImage from '../../../public/noImage.jpg';
import Image from 'next/future/image';
import { User } from '../../types';

type Props = {
    user: User,
};


function MobileAvatar({ user }: Props) {
    const image = (typeof user.image == 'string') ? user.image : noImage;

    return (

        <div className=' w-full flex flex-col py-6 justify-center items-center'>
            <div className='rounded-full h-72 w-72 md:w-96 md:h-96 relative hidden md:flex'>
                <Image
                    className='rounded-full'
                    src={image}
                    placeholder='empty'
                    alt='avatar'
                    sizes='auto'
                    priority={true}
                    fill
                />
            </div>
            <h1 className='p-4 text-[2rem] font-bold'>
                Welcome back, {user.username}
            </h1>
        </div>
    )
}

export default MobileAvatar