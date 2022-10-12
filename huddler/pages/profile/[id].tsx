import React, { useState } from 'react';
import { User } from '../../src/types';
import { useRouter } from 'next/router';
import { triggerAsyncId } from 'async_hooks';
import Huddles from '../../src/components/Home-components/Huddles';
import Avatar from '../../src/components/Profile components/Avatar';
import Image from 'next/future/image';
import avatar from '../../public/placeholder.jpg';
import UserInfo from '../../src/components/Profile components/UserInfo';
import useSWR from 'swr';
import { fetcher } from '../../src/utils/APIServices/fetcher';
import { getAllHuddles } from '../../src/utils/APIServices/huddleServices';
import HuddleCarousel from '../../src/components/Profile components/HuddleCarousel';

function Profile() {

  //Get user id from auth for the tag hook
  const { data: tags, error: tagsError } = useSWR(`https://u4pwei0jaf.execute-api.eu-west-3.amazonaws.com/test/users_categories?user-id=${67}`, fetcher);
  const { data: userCreatedHuddles, error: userHuddleError } = useSWR(`https://u4pwei0jaf.execute-api.eu-west-3.amazonaws.com/test/huddles_user_created?user-id=${67}`, fetcher)
  const { data: huddles, error: huddleError } = getAllHuddles();

  if (huddleError || tagsError || userHuddleError ) return <div>failed to load</div>;
  if (!huddles || !tags || !userCreatedHuddles) return <div>loading...</div>;

  const user: User = {
    name: 'Florio',
    avatar: avatar,
    email: '',
    createdOn: 0,
  };

  
  // const recommendedForUser = async () => {
  //   let recommendation = [];
  //   // const data = await fetcher(`https://u4pwei0jaf.execute-api.eu-west-3.amazonaws.com/test/users_categories?user-id=${67}`)
  //     await tags.forEach(async element => {
  //     let temp =  await fetcher(`https://u4pwei0jaf.execute-api.eu-west-3.amazonaws.com/test/gethuddles_bycategory?category-id=${element.id}`);            
  //     await recommendation.push(temp);
  //     console.log(temp)
  //   });   
  // }
  // recommendedForUser();
  // console.log(userCreatedHuddles);
  // console.log(tags)

  return (
    <main className='grid grid-cols-4 h-full py-8'>
      <div className='flex flex-col h-screen items-center border-x-[0.2px] border-gray-400'>

        <Avatar />
        <UserInfo />

        <div className='h-full w-full flex justify-center mt-8 border'>
          <button
            className='border-[0.2px] border-gray-400 bg-blue-400 rounded-[5px] h-16 p-4'
            onClick={() => router.push('/create')}
          >
            Create a Huddle
          </button>
        </div>

      </div>

      <div className='h-full w-full bg-yellow-200 col-span-3'>

        <h1 className='py-8 p-4 text-3xl'>Interests:</h1>
        <div className='flex flex-wrap bg-white gap-4 p-4 border'>
          {tags.map((tag,i) => (
            <h1 className='text-xl bg-blue-600 py-2 px-4 rounded text-white hover:scale-150 hover:mx-4 cursor-pointer' key={i}>{tag.name}</h1>
          ))}
        </div>

        <h1 className='py-8'>Created huddles:</h1>
        <div className='bg-slate-200 h-1/4 flex overflow-x-scroll gap-2'>
          {userCreatedHuddles.map((hud) => (
            <div className='bg-red-500 gap-4 grid grid-cols-2 flex-grow-1 flex-shrink-0 border-black border relative' key={hud.id}>

              <HuddleCarousel hud={hud} />
              
            </div>
          ))}         
        </div>

        <h1 className='py-8'>My huddles:</h1>
        <div className='bg-slate-200 h-1/4 flex overflow-x-scroll gap-2'>
          {huddles.map((hud) => (
            <div className='bg-red-200 gap-4 grid grid-cols-2 flex-grow-1 flex-shrink-0 border-black border relative' key={hud.id}>

              <HuddleCarousel hud={hud} />

            </div>
          ))}
        </div>


      </div>
    </main>
  );
}

export default Profile;

