import { User } from '../../types';
import { useState, useRef } from 'react';
import UserImage from './UpdateUserImage';
import { postUpdatedUserInfo } from '../../utils/APIServices/userServices';
import { useRouter } from 'next/router';
import {
  deleteOldImg,
  getUploadUrl,
  uploadImgToS3,
} from '../../utils/APIServices/imageServices';

type Props = {
  userData: User;
};

const PersonalInfo = ({ userData }: Props) => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [disabledButton, setDisabledButton] = useState(true);
  const [newImg, setNewImg] = useState({});
  const [addedImg, setAddedImg] = useState(false);
  const router = useRouter();
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  let userPersonalInfo = userData;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setError('');
      if (
        descriptionRef.current &&
        descriptionRef.current!.value !== '' &&
        descriptionRef.current!.value !== userPersonalInfo.description
      ) {
        userPersonalInfo.description = descriptionRef.current.value;
      }
      if (
        nameRef.current &&
        nameRef.current!.value !== '' &&
        nameRef.current!.value !== userData.username
      ) {
        userPersonalInfo.username = nameRef.current.value;
      }

      if (
        emailRef.current &&
        emailRef.current!.value !== '' &&
        emailRef.current!.value !== userPersonalInfo.email
      ) {
        userPersonalInfo.email = emailRef.current.value;
      }

      if (
        firstNameRef.current &&
        firstNameRef.current!.value !== '' &&
        firstNameRef.current!.value !== userPersonalInfo.first_name
      ) {
        userPersonalInfo.first_name = firstNameRef.current.value;
      }

      if (
        lastNameRef.current &&
        lastNameRef.current!.value !== '' &&
        lastNameRef.current!.value !== userPersonalInfo.last_name
      ) {
        userPersonalInfo.last_name = lastNameRef.current.value;
      }

      //Check if a new image has been added
      if (addedImg) {

        // Delete old Image
        console.log('imageurl BEFORE editing : '+ userPersonalInfo.image);
        const oldImageInfoPath: any = userPersonalInfo.image
        const oldImageInfo = /[^/]*$/.exec(oldImageInfoPath);
        const oldImage = oldImageInfo[0];
        deleteOldImg(oldImage);

        // Upload new image to S3
        const data = await getUploadUrl();
        const uploadUrl = data.uploadURL;
        const filename = data.filename;
        const fileURL =
          'https://uploadertesthuddler12345.s3.eu-west-1.amazonaws.com/' +
          filename;

        userPersonalInfo.image = fileURL;
        console.log('imageurl AFTER editing : '+ userPersonalInfo.image);
        await uploadImgToS3(uploadUrl, newImg);
      }

      await postUpdatedUserInfo(userPersonalInfo, userData.aws_id as string);
      sessionStorage.setItem('user', JSON.stringify(userPersonalInfo));
      setSuccess('Success! Your personal information was updated');
    } catch {
      setError("We weren't able to update your profile. Please try again");
    }
  };

  return (
    <div className='flex flex-col lg:mt-24'>
      {error && (
        <>
          <div className='text-[#721D25] bg-[#F8D6DB] p-5 rounded-md'>
            {error}
          </div>
          <br />
        </>
      )}

      <div className='flex flex-col lg:flex-row items-center gap-2 h-screen'>
        <div className='flex flex-col'>
          <UserImage
            setDisabledButton={setDisabledButton}
            setError={setError}
            userPersonalInfo={userPersonalInfo}
            setNewImg={setNewImg}
            setAddedImg={setAddedImg}
          />
        </div>
        <form onSubmit={handleSubmit}>
          <label htmlFor='name' className='lg:text-lg text-[#721D25]'>User name</label>
          <input
            ref={nameRef}
            className='block w-80 h-10 rounded-md mb-3'
            type='text'
            placeholder={`  ${userPersonalInfo.username}`}
            onChange={() => setDisabledButton(false)}
          />
          <label htmlFor='email' className='text-lg text-[#721D25]'>Email</label>
          <input
            ref={emailRef}
            id='email'
            className='block w-80 h-10 rounded-md mb-3'
            type='email'
            placeholder={`  ${userPersonalInfo.email || ''}`}
            onChange={() => setDisabledButton(false)}
          />
          <label htmlFor='first-name' className='lg:text-lg text-[#721D25]'>First name</label>
          <input
            ref={firstNameRef}
            id='first-name'
            className='block w-80 h-10 rounded-md mb-3'
            type='text'
            placeholder={`  ${userPersonalInfo.first_name || ''}`}
            onChange={() => setDisabledButton(false)}
          />
          <label htmlFor='last-name' className='lg:text-lg text-[#721D25]'>Last name</label>
          <input
            ref={lastNameRef}
            id='last-name'
            className='block w-80 h-10 rounded-md mb-3'
            type='text'
            placeholder={`  ${userPersonalInfo.last_name || ''}`}
            onChange={() => setDisabledButton(false)}
          />
          <label htmlFor='description' className='lg:text-lg text-[#721D25]'>Description</label>
          <textarea
            ref={descriptionRef}
            id='description'
            className='block w-80 h-24 rounded-md'
            placeholder={`  ${userPersonalInfo.description}`}
            onChange={() => setDisabledButton(false)}
          />
          <br />
          <div className='flex justify-center'>
            {success ? (
              <>
                <div className='text-[#145725] bg-[#D5EDDB] p-5 rounded-md'>
                  {success}
                </div>
                <br />
              </>
            ) : (
              <button
                className={` ${
                  disabledButton === true ? 'leave-button' : 'orange-button'
                }`}
                type='submit'
                disabled={disabledButton}
              >
                Submit
              </button>
            )}
            {/* <button
              className='border-none bg-palette-dark hover:bg-opacity-60 hover:cursor-pointer rounded-md shadow-md text-white text-2xl mt-2 py-2 px-5'
              type='submit'
              disabled={disabledButton}
            >
              Submit
            </button> */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonalInfo;

