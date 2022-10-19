import { User } from '../../types';
import { useState, useRef } from 'react';
import UserImage from './UpdateUserImage';
import { postUpdatedUserInfo } from '../../utils/APIServices/userServices';
import { useRouter } from 'next/router';
import { getUploadUrl, uploadImgToS3 } from '../../utils/APIServices/imageServices';

type Props = {
  userData: User;
};

const PersonalInfo = ({ userData }: Props) => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [disabledButton, setDisabledButton] = useState(true);
  const [newImg, setNewImg] = useState({});

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

      const data = await getUploadUrl();
      const uploadUrl = data.uploadURL;
      const filename = data.filename;
      const fileURL = 'https://uploadertesthuddler12345.s3.eu-west-1.amazonaws.com/' + filename;
      
      userPersonalInfo.image = fileURL;
      await uploadImgToS3(uploadUrl, newImg);


      postUpdatedUserInfo(userPersonalInfo, userData.aws_id as string);
      setSuccess('Success! Your personal information was updated');
    } catch {
      setError("We weren't able to update your profile. Please try again");
    }
  };

  return (
    <div className='flex flex-col'>
      {error && (
        <>
          <div className='text-[#721D25] bg-[#F8D6DB] p-5 rounded-md'>
            {error}
          </div>
          <br />
        </>
      )}

      <div className='flex items-center gap-10 h-screen'>
        <div className='flex flex-col'>
          <UserImage
            setDisabledButton={setDisabledButton}
            setError={setError}
            userPersonalInfo={userPersonalInfo}
            setNewImg={setNewImg}
          />
          <label htmlFor='description'>Description</label>
          <textarea
            ref={descriptionRef}
            id='description'
            className='block'
            placeholder={userPersonalInfo.description}
            onChange={() => setDisabledButton(false)}
          />
        </div>
        <form onSubmit={handleSubmit}>
          <label htmlFor='name'>User name</label>
          <input
            ref={nameRef}
            className='block'
            type='text'
            placeholder={userPersonalInfo.username}
            onChange={() => setDisabledButton(false)}
          />
          <label htmlFor='email'>Email</label>
          <input
            ref={emailRef}
            id='email'
            className='block'
            type='email'
            placeholder={userPersonalInfo.email || ''}
            onChange={() => setDisabledButton(false)}
          />
          <label htmlFor='first-name'>First name</label>
          <input
            ref={firstNameRef}
            id='first-name'
            className='block'
            type='text'
            placeholder={userPersonalInfo.first_name || ''}
            onChange={() => setDisabledButton(false)}
          />
          <label htmlFor='last-name'>Last name</label>
          <input
            ref={lastNameRef}
            id='last-name'
            className='block'
            type='text'
            placeholder={userPersonalInfo.last_name || ''}
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
                className='border-none bg-palette-dark hover:bg-opacity-60 hover:cursor-pointer rounded-md shadow-md text-white text-2xl mt-2 py-2 px-5'
                type='submit'
                disabled={disabledButton}
              >
                Submit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonalInfo;

