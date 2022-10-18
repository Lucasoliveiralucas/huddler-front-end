//MainForm

import React, { useEffect, useRef, useState } from 'react';
import Router from 'next/router';
import Interests from './FirstInterests';
import Location from './SecondLocation';
import UserInfo from './ThirdUserInfo';
import { Category, User } from '../../types';
import { postUserInfo, postUserCategory, getUserById } from '../../utils/APIServices/userServices';
import { getUploadUrl, uploadImgToS3} from '../../utils/APIServices/imageServices'

import { useAuth } from '../../contexts/AuthContext';
import { getImageUrl } from '../../utils/helperFunctions';



function MainForm() {
  const [page, setPage] = useState(1);
  const [userImg, setUserImg] = useState({});

  const { setCurrentUser, currentUser } = useAuth()
  const [location, setLocation] = useState({ name: '', lat: 0, lng: 0 });
  const [categoriesPicked, setCategoriesPicked] = useState<Category[]>([]);
  const [userData, setUserData] = useState<any>(currentUser);
  console.log('this is userData', userData)

  const nextPage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (page < 3) {
      setPage(page + 1);
    } else {
      handleSubmit();
    }
  };

  const prevPage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleSubmit = async () => {
    // const data = await getUploadUrl();
    // const uploadUrl = data.uploadURL
    // const filename = data.filename
    // const fileURL = 'https://uploadertesthuddler12345.s3.eu-west-1.amazonaws.com/'+filename

    const {imgUrl, uploadUrl} = getImageUrl()
    console.log('this is the image url ', imgUrl);
    console.log('this is the upload url ', uploadUrl);
    setUserData({ ...userData, image: imgUrl});
    await uploadImgToS3(uploadUrl, userImg); 

    const formData = {...userData, image: imgUrl};
    console.log('This is userData', userData)
  
   
    // posting new user info to db
    await postUserInfo(formData, userData.aws_id);
    
    // posting the categories to new huddle
    categoriesPicked.forEach((category) => {
      postUserCategory(userData.aws_id, category.id as number);
    });
    Router.replace('./home');
  };

  return (
    <div className='flex items-center flex-col py-3'>
      <h1 className='my-0'>{page}/3</h1>
      <div className='h-[60vh] w-full flex justify-center'>
        {page === 1 && (
          <Interests
            categoriesPicked={categoriesPicked}
            setCategoriesPicked={setCategoriesPicked}
          />
        )}
        {page === 2 && (
          <Location
            location={location}
            setLocation={setLocation}
            setUserData={setUserData}
            userData={userData}
          />
        )}
        {page === 3 && (
          <UserInfo
            userData={userData!}
            setUserData={setUserData!}
            setUserImg={setUserImg}
            handleSubmit={handleSubmit}
          />
        )}
      </div>
      <div className='flex gap-10'>
        {page > 1 && (
          <button
            onClick={(e) => prevPage(e)}
            className='px-6 py-2 bg-palette-dark text-white'
          >
            Previous
          </button>
        )}
        {page > 2 ? (
          <button
            onClick={(e) => {
              nextPage(e);
              handleSubmit();
            }}
            className='px-6 py-2 bg-palette-dark text-white'
          >
            Submit
          </button>
        ) : (
          <button
            onClick={(e) => nextPage(e)}
            className='px-6 py-2 bg-palette-dark text-white'
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}

export default MainForm;
function postuserCategories(arg0: number, arg1: number) {
  throw new Error('Function not implemented.');
}


