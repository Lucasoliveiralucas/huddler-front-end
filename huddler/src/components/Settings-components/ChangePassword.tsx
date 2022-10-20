import { useRef, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const ChangePassword = () => {
  const passwordRef = useRef<HTMLInputElement>(null);
  const oldPasswordRef = useRef<HTMLInputElement>(null);
  const confirmedPasswordRef = useRef<HTMLInputElement>(null);
  const [disabledButton, setDisabledButton] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  //@ts-ignore Do not know what type a custom hook has
  const { cognitoUser, changePassword } = useAuth();
  const checkEmails = () => {
    if (passwordRef.current!.value === confirmedPasswordRef.current!.value) {
      setDisabledButton(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await changePassword(
        cognitoUser,
        oldPasswordRef.current!.value,
        passwordRef.current!.value
      );
      setSuccess('Success! Your password was changed');
      passwordRef.current!.value = '';
      confirmedPasswordRef.current!.value = '';
    } catch {
      setError("We weren't able to update your passwordRef. Please try again");
    }
  };

  return (
    <div className='flex flex-col items-center mt-10 md:mt-26'>
      {error && (
        <>
          <div className='text-[#721D25] bg-[#F8D6DB] p-5 rounded-md'>
            {error}
          </div>
          <br />
        </>
      )}
      {success && (
        <>
          <div className='text-[#145725] bg-[#D5EDDB] p-5 rounded-md'>
            {success}
          </div>
          <br />
        </>
      )}
      <form onSubmit={handleSubmit}>
        <label htmlFor='old-password' className='font-medium text-palette-dark'>OLD PASSWORD</label>
        <input
          className='block w-80 h-10 rounded-md mb-3'
          type='password'
          id='old-password'
          min={6}
          autoComplete='on'
          ref={oldPasswordRef}
        />
        <br />
        <label htmlFor='password' className='font-medium text-palette-dark'>NEW PASSWORD</label>
        <input
          className='block w-80 h-10 rounded-md mb-3'
          type='password'
          id='password'
          min={6}
          autoComplete='on'
          ref={passwordRef}
        />
        <br />
        <label htmlFor='confirm-password' className='font-medium text-palette-dark'>CONFIRM PASSWORD</label>
        <input
          className='block w-80 h-10 rounded-md mb-3'
          type='password'
          id='confirm-password'
          min={6}
          ref={confirmedPasswordRef}
          autoComplete='on'
          onChange={checkEmails}
        />
        <button
          // className='border-none bg-palette-dark hover:bg-opacity-60 hover:cursor-pointer rounded-md shadow-md text-white text-2xl mt-2 py-2 px-5'
          className='leave-button mt-8'
          type='submit'
          disabled={disabledButton}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;

