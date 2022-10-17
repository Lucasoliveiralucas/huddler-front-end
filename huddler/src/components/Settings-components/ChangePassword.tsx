import { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';

const ChangePassword = () => {
  const router = useRouter();
  const passwordRef = useRef<HTMLInputElement>(null);
  const oldPasswordRef = useRef<HTMLInputElement>(null);
  const confirmedPasswordRef = useRef<HTMLInputElement>(null);
  const [disabledButton, setDisabledButton] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { cognitoUser,changePassword }= useAuth();
  const checkEmails = () => {
    if (passwordRef.current!.value === confirmedPasswordRef.current!.value) {
      setDisabledButton(false);
    }
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      
      await changePassword(cognitoUser,oldPasswordRef.current!.value, passwordRef.current!.value)

      setSuccess('Success! Your password was changed');
      console.log('this is success', success);
      passwordRef.current!.value = '';
      confirmedPasswordRef.current!.value = '';
    } catch {
      setError("We weren't able to update your passwordRef. Please try again");
    }
  };

  return (
    <>
      {error && <div className='bg-red-600'>{error}</div>}
      {success && <div className='bg-green-600'>{success}</div>}
      <form onSubmit={handleSubmit}>
        <label htmlFor='old-password'>Old password</label>
        <input
          className='block'
          type='password'
          id='old-password'
          min={6}
          autoComplete='on'
          ref={oldPasswordRef}
        />
        <br />
        <label htmlFor='password'>New password</label>
        <input
          className='block'
          type='password'
          id='password'
          min={6}
          autoComplete='on'
          ref={passwordRef}
        />
        <br />
        <label htmlFor='confirm-password'>Confirm Password</label>
        <input
          className='block'
          type='password'
          id='confirm-password'
          min={6}
          ref={confirmedPasswordRef}
          autoComplete='on'
          onChange={checkEmails}
        />
        <button
          className='border-none bg-palette-dark hover:bg-opacity-60 hover:cursor-pointer rounded-md shadow-md text-white text-2xl mt-2 py-2 px-5'
          type='submit'
          disabled={disabledButton}
        >
          Submit
        </button>
      </form>
    </>
  );
};

export default ChangePassword;




