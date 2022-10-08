import { setDefaultResultOrder } from 'dns';
import Link from 'next/link';
import {useRouter} from 'next/router'
import React, { useState, useRef } from 'react';
import { User } from '../types';

function Register() {
  const router = useRouter()

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmedPasswordRef = useRef<HTMLInputElement>(null);

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (passwordRef.current!.value !== confirmedPasswordRef.current!.value) {
      setError('Passwords do not match');
      return;
    }
    try {
      setError('');
      setLoading(true)
      const newUser: User = {
        name: nameRef.current!.value,
        email: emailRef.current!.value,
        password: passwordRef.current!.value,
        createdOn: Date.now(),
      }
      console.log(newUser);
      
      //Do sth with AWS authentication
      //Do sth with our DB

      // go to the home page
      // router.replace('/home')
    } catch {
      setError('Failed to create an account');
    }
    setLoading(false)
  };
  return (
    
    <main className='h-auto w-auto flex flex-col items-center border-solid border-2 rounded border-indigo-600 bg-white absolute my-24 px-24 py-12 ml-[50%]'>
      <h1>Share your Passions</h1>
      <br />
      {error && <div className='bg-red-600'>{error}</div>}
      <form
        className='flex flex-col'
        onSubmit={submitHandler}
      >
        <label htmlFor='name'>Name</label>
        <input
          className='border-solid border-2 border-black-600'
          ref={nameRef}
          type='text'
          id='name'
          autoComplete='on'
          required
        />
        <label htmlFor='email'>Email</label>
        <input
          className='border-solid border-2 border-black-600'
          ref={emailRef}
          type='email'
          id='email'
          autoComplete='on'
          required
        />
        <label htmlFor='password'>Password</label>
        <input
          className='border-solid border-2 border-black-600'
          ref={passwordRef}
          type='password'
          id='password'
          autoComplete='on'
          minLength={6}
          required
        />
        <label htmlFor='confirm-password'>Confirm Password</label>
        <input
          className='border-solid border-2 border-black-600'
          ref={confirmedPasswordRef}
          type='password'
          id='confirm-password'
          autoComplete='on'
          minLength={6}
          required
        />
        <div className='flex justify-center'>
          <button
            className='border-solid border-2 border-black-600 w-48'
            type='submit'
            disabled={loading}
          >
            Sign Up
          </button>
        </div>
      </form>
      <div className=''>------------------------</div>
      <div className=''>Sign Up with Google</div>
      <div>Already have an account?</div>
      <Link href='/Login'>Log in</Link>
    </main>
  );
}

export default Register;








