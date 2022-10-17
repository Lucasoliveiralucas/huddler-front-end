import { setDefaultResultOrder } from 'dns';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import { Amplify, Auth } from 'aws-amplify';
// import awsconfig from '../aws-exports';
// Amplify.configure(awsconfig);
// import awsExports from '../aws-exports';
// import { fetcher } from '../utils/helperFunctions';
// Amplify.configure(awsExports);

function Register({ signOut, user }: any) {
  const router = useRouter();

  console.log(user.attributes.email, user.username)
  useEffect(() => {
    postHandler()
    postsecondHandler()
  }, [])

  const postHandler = async () => {
    console.log(user.attributes.email, user.username)
    const newUser: any = {
      aws_id: user.username,
      email: user.attributes.email,
    };
    try {
      const res = await fetch('https://u4pwei0jaf.execute-api.eu-west-3.amazonaws.com/test/newuser', {
        method: 'POST',
        credentials: 'include',
        mode: 'no-cors',
        body: JSON.stringify(newUser),
        headers: {
          'Content-type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      });

      const data = await res.json()
      console.log('first', await data);
    } catch (err) {
      console.log("ERROR: ", err);
    }
  }
  const postsecondHandler = async () => {
    try {
      const restwo = await fetch(`https://u4pwei0jaf.execute-api.eu-west-3.amazonaws.com/test/getuser_byawsid?aws-id=${user.username}`);
      const datatwo = await restwo.json()
      console.log('second', await datatwo);
      // Router.replace("/newuser")
    } catch (err) {
      console.log("ERROR2", err)
    }
  }

  return (
    <main className='h-auto w-auto flex flex-col items-center border-solid border-2 rounded border-indigo-600 bg-white absolute my-24 px-24 py-12 ml-[50%]'>
      <>
        <h1>Hello</h1>
        <button onClick={signOut}>Sign out</button>
      </>
    </main>
  );
}
export default withAuthenticator(Register);
// export default Register;


