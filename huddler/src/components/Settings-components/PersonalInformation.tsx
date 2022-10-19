import { User } from '../../types';
import { useState, useRef } from 'react';
import UserImage from './UpdateUserImage';
import { postUserInfo } from '../../utils/APIServices/userServices';
import { useRouter } from 'next/router';

type Props = {
  userData: User;
};

const PersonalInfo = ({ userData }: Props) => {
  const [error, setError] = useState('');
  const [disabledButton, setDisabledButton] = useState(true);

  const router = useRouter();
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  let userPersonalInfo = userData;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setError('');
      if (nameRef.current && nameRef.current!.value !== userData.username) {
        userPersonalInfo.username = nameRef.current.value;
      }

      if (
        emailRef.current &&
        emailRef.current!.value !== userPersonalInfo.email
      ) {
        userPersonalInfo.email = emailRef.current.value;
      }

      if (
        firstNameRef.current &&
        firstNameRef.current!.value !== userPersonalInfo.first_name
      ) {
        userPersonalInfo.first_name = firstNameRef.current.value;
      }

      if (
        lastNameRef.current &&
        lastNameRef.current!.value !== userPersonalInfo.last_name
      ) {
        userPersonalInfo.last_name = lastNameRef.current.value;
      }

      postUserInfo(userPersonalInfo, userData.aws_id as string);
      router.push('/profile');
    } catch {
      setError("We weren't able to update your profile. Please try again");
    }
  };

  return (
    <>
      {error && <div className='bg-red-600'>{error}</div>}
      <div className='flex items-center gap-10 h-screen'>
        <div className='flex flex-col'>
          <UserImage
            setDisabledButton={setDisabledButton}
            setError={setError}
            userPersonalInfo={userPersonalInfo}
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
            <button className='orange-button' type='submit' disabled={disabledButton}>
              Submit
            </button>
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
    </>
  );
};

export default PersonalInfo;

